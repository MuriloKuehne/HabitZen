"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/habit.types";
import { subDays } from "date-fns";

export async function getUserStats(): Promise<Profile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getUserStats] No authenticated user");
    }
    throw new Error("User not authenticated");
  }

  // Try to get existing profile
  let { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If profile doesn't exist, create it with defaults
  if (error || !data) {
    if (process.env.NODE_ENV === "development") {
      console.log("[getUserStats] Profile not found, creating new profile for user:", user.id);
      if (error) {
        console.log("[getUserStats] Error details:", error.message, error.code, error.details);
      }
    }

    const defaultProfile = {
      user_id: user.id,
      total_xp: 0,
      current_level: 1,
      current_streak: 0,
      longest_streak: 0,
    };

    // Try to insert the profile
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert(defaultProfile)
      .select()
      .single();

    // If insert fails (might be due to RLS or duplicate), try to fetch again
    // (in case trigger created it or there was a race condition)
    if (insertError || !newProfile) {
      if (process.env.NODE_ENV === "development") {
        console.log("[getUserStats] Insert failed, trying to fetch profile again:", insertError);
      }

      // Try to fetch the profile again (might have been created by trigger)
      const { data: retryData, error: retryError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (retryData) {
        return retryData;
      }

      // If still no profile and error suggests RLS issue, return default
      if (process.env.NODE_ENV === "development") {
        console.error("[getUserStats] Failed to create/fetch profile. Insert error:", insertError, "Retry error:", retryError);
        console.log("[getUserStats] Returning default profile. Make sure migration 002_add_profile_insert_policy.sql is applied.");
      }

      // Return default profile as fallback
      return {
        user_id: user.id,
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return newProfile;
  }

  return data;
}

export async function getXPHistory(days: number = 30) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getXPHistory] No authenticated user");
    }
    return [];
  }

  const startDate = subDays(new Date(), days);

  // Get user's habit IDs
  const { data: userHabits, error: habitsError } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", user.id);

  if (habitsError) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getXPHistory] Error fetching habits:", habitsError);
    }
    return [];
  }

  if (!userHabits || userHabits.length === 0) {
    return [];
  }

  const habitIds = userHabits.map((h) => h.id);

  const { data: completions, error } = await supabase
    .from("habit_completions")
    .select("completed_at, xp_earned")
    .in("habit_id", habitIds)
    .gte("completed_at", startDate.toISOString())
    .order("completed_at", { ascending: true });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getXPHistory] Error fetching completions:", error);
    }
    return [];
  }

  if (!completions) {
    return [];
  }

  // Group by date and sum XP
  const xpByDate = new Map<string, number>();

  completions.forEach((completion: any) => {
    const date = new Date(completion.completed_at).toISOString().split("T")[0];
    const current = xpByDate.get(date) || 0;
    xpByDate.set(date, current + completion.xp_earned);
  });

  // Calculate cumulative XP
  let cumulativeXP = 0;
  const result: { date: string; xp: number; cumulativeXP: number }[] = [];

  const sortedDates = Array.from(xpByDate.keys()).sort();

  sortedDates.forEach((date) => {
    cumulativeXP += xpByDate.get(date) || 0;
    result.push({
      date,
      xp: xpByDate.get(date) || 0,
      cumulativeXP,
    });
  });

  return result;
}

export async function getCompletionStats(startDate: Date, endDate: Date) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getCompletionStats] No authenticated user");
    }
    return [];
  }

  // Get user's habit IDs
  const { data: userHabits, error: habitsError } = await supabase
    .from("habits")
    .select("id, name, type")
    .eq("user_id", user.id);

  if (habitsError) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getCompletionStats] Error fetching habits:", habitsError);
    }
    return [];
  }

  if (!userHabits || userHabits.length === 0) {
    return [];
  }

  const habitIds = userHabits.map((h) => h.id);

  const { data: completions, error } = await supabase
    .from("habit_completions")
    .select("completed_at, habit_id")
    .in("habit_id", habitIds)
    .gte("completed_at", startDate.toISOString())
    .lte("completed_at", endDate.toISOString())
    .order("completed_at", { ascending: true });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getCompletionStats] Error fetching completions:", error);
    }
    return [];
  }

  if (!completions) {
    return [];
  }

  // Group by date
  const statsByDate = new Map<
    string,
    { date: string; count: number; habits: string[] }
  >();

  completions.forEach((completion: any) => {
    const date = new Date(completion.completed_at).toISOString().split("T")[0];
    const existing = statsByDate.get(date) || {
      date,
      count: 0,
      habits: [],
    };

    existing.count += 1;
    if (!existing.habits.includes(completion.habit_id)) {
      existing.habits.push(completion.habit_id);
    }

    statsByDate.set(date, existing);
  });

  return Array.from(statsByDate.values());
}


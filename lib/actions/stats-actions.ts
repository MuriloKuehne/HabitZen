"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/habit.types";
import { subDays } from "date-fns";

export async function getUserStats(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getXPHistory(days: number = 30) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const startDate = subDays(new Date(), days);

  // Get user's habit IDs
  const { data: userHabits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", user.id);

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

  if (error || !completions) {
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
    return [];
  }

  // Get user's habit IDs
  const { data: userHabits } = await supabase
    .from("habits")
    .select("id, name, type")
    .eq("user_id", user.id);

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

  if (error || !completions) {
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


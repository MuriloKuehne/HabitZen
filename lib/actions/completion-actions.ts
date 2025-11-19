"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getStartOfDay, getEndOfDay } from "@/lib/utils/date-helpers";
import type { HabitCompletion } from "@/types/habit.types";

export async function completeHabit(habitId: string, date?: Date) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  // Verify habit belongs to user and get habit type
  const { data: habit } = await supabase
    .from("habits")
    .select("id, type")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .single();

  if (!habit) {
    return {
      error: "Habit not found",
    };
  }

  const targetDate = date || new Date();
  const dayStart = getStartOfDay(targetDate);
  const dayEnd = getEndOfDay(targetDate);

  // Only check for duplicate completions for daily habits
  // Weekly habits can be completed multiple times per day
  if (habit.type === "daily") {
    const { data: existing } = await supabase
      .from("habit_completions")
      .select("id")
      .eq("habit_id", habitId)
      .gte("completed_at", dayStart.toISOString())
      .lte("completed_at", dayEnd.toISOString())
      .single();

    if (existing) {
      return {
        error: "Habit already completed today",
      };
    }
  }

  const { error } = await supabase.from("habit_completions").insert({
    habit_id: habitId,
    completed_at: targetDate.toISOString(),
    xp_earned: 0, // Will be set by trigger
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function uncompleteHabit(habitId: string, date?: Date) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  // Verify habit belongs to user
  const { data: habit } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .single();

  if (!habit) {
    return {
      error: "Habit not found",
    };
  }

  const targetDate = date || new Date();
  const dayStart = getStartOfDay(targetDate);
  const dayEnd = getEndOfDay(targetDate);

  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .gte("completed_at", dayStart.toISOString())
    .lte("completed_at", dayEnd.toISOString());

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getCompletions(
  habitId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<HabitCompletion[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // First, get all habit IDs for this user
  const { data: userHabits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", user.id);

  if (!userHabits || userHabits.length === 0) {
    return [];
  }

  const habitIds = habitId
    ? [habitId]
    : userHabits.map((h) => h.id);

  // Verify all habit IDs belong to user
  const validHabitIds = habitIds.filter((id) =>
    userHabits.some((h) => h.id === id)
  );

  if (validHabitIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("habit_completions")
    .select("*")
    .in("habit_id", validHabitIds);

  if (startDate) {
    query = query.gte("completed_at", startDate.toISOString());
  }

  if (endDate) {
    query = query.lte("completed_at", endDate.toISOString());
  }

  const { data, error } = await query.order("completed_at", {
    ascending: false,
  });

  if (error || !data) {
    return [];
  }

  return data as HabitCompletion[];
}


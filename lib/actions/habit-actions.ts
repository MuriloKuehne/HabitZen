"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { habitSchema } from "@/lib/utils/validations";
import type { Habit, HabitWithCompletions } from "@/types/habit.types";
import { getStartOfDay, getEndOfDay, getWeekStart, getWeekEnd } from "@/lib/utils/date-helpers";

export async function getHabits(): Promise<HabitWithCompletions[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: habits, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !habits) {
    return [];
  }

  // Get today's completions
  const todayStart = getStartOfDay(new Date());
  const todayEnd = getEndOfDay(new Date());

  const { data: completions } = await supabase
    .from("habit_completions")
    .select("*")
    .in(
      "habit_id",
      habits.map((h) => h.id)
    )
    .gte("completed_at", todayStart.toISOString())
    .lte("completed_at", todayEnd.toISOString());

  const completionMap = new Map(
    completions?.map((c) => [c.habit_id, c]) || []
  );

  // Get weekly completions for weekly habits
  const weeklyHabits = habits.filter((h) => h.type === "weekly");
  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());

  let weeklyCompletions: { habit_id: string; count: number }[] = [];
  if (weeklyHabits.length > 0) {
    const { data: weekCompletions } = await supabase
      .from("habit_completions")
      .select("habit_id")
      .in(
        "habit_id",
        weeklyHabits.map((h) => h.id)
      )
      .gte("completed_at", weekStart.toISOString())
      .lte("completed_at", weekEnd.toISOString());

    const weeklyCountMap = new Map<string, number>();
    weekCompletions?.forEach((c) => {
      weeklyCountMap.set(c.habit_id, (weeklyCountMap.get(c.habit_id) || 0) + 1);
    });

    weeklyCompletions = Array.from(weeklyCountMap.entries()).map(([habit_id, count]) => ({
      habit_id,
      count,
    }));
  }

  const weeklyProgressMap = new Map(
    weeklyCompletions.map((wc) => [
      wc.habit_id,
      {
        current: wc.count,
        target: habits.find((h) => h.id === wc.habit_id)?.weekly_frequency || 1,
        isCompleted: false,
      },
    ])
  );

  // Update weekly progress map with all weekly habits (including those with 0 completions)
  weeklyHabits.forEach((habit) => {
    if (!weeklyProgressMap.has(habit.id)) {
      weeklyProgressMap.set(habit.id, {
        current: 0,
        target: habit.weekly_frequency || 1,
        isCompleted: false,
      });
    }
    const progress = weeklyProgressMap.get(habit.id)!;
    progress.isCompleted = progress.current >= progress.target;
  });

  return habits.map((habit) => {
    const baseHabit = {
      ...habit,
      isCompletedToday: completionMap.has(habit.id),
    };

    if (habit.type === "weekly") {
      const progress = weeklyProgressMap.get(habit.id);
      return {
        ...baseHabit,
        weeklyProgress: progress || {
          current: 0,
          target: habit.weekly_frequency || 1,
          isCompleted: false,
        },
      };
    }

    return baseHabit;
  });
}

export async function getHabit(id: string): Promise<Habit | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function createHabit(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[createHabit] User not authenticated");
    return {
      error: "Not authenticated",
    };
  }

  const weeklyFrequencyValue = formData.get("weekly_frequency");
  const habitType = formData.get("type") as "daily" | "weekly";
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: habitType,
    color: formData.get("color") as string,
    weekly_frequency: habitType === "weekly" && weeklyFrequencyValue && weeklyFrequencyValue !== "" 
      ? parseInt(weeklyFrequencyValue as string, 10) 
      : undefined,
  };

  console.log("[createHabit] Raw form data:", rawFormData);

  const validatedFields = habitSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error("[createHabit] Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      error: "Invalid data",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, type, color, weekly_frequency } = validatedFields.data;
  const xp_value = type === "daily" ? 10 : 50;

  const habitData = {
    user_id: user.id,
    name,
    description: description || null,
    type,
    color,
    xp_value,
    weekly_frequency: type === "weekly" ? (weekly_frequency ?? 1) : null,
  };

  console.log("[createHabit] Inserting habit:", { ...habitData, user_id: "[REDACTED]" });

  const { error, data } = await supabase.from("habits").insert(habitData).select();

  if (error) {
    console.error("[createHabit] Database error:", error);
    
    // Provide more helpful error messages
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      return {
        error: "Habits table not found. Please apply the database migration. See the file supabase/migrations/001_initial_schema.sql",
      };
    }
    
    if (error.code === "PGRST204" || error.message.includes("Could not find") || error.message.includes("column") && error.message.includes("schema cache")) {
      return {
        error: "Database schema is out of date. Please apply the migration '002_add_weekly_frequency.sql' in the Supabase SQL Editor. The weekly_frequency column is missing from the habits table.",
      };
    }
    
    if (error.code === "42501" || error.message.includes("permission denied")) {
      return {
        error: "Permission denied. Please check RLS (Row Level Security) policies in Supabase.",
      };
    }
    
    return {
      error: error.message,
    };
  }

  console.log("[createHabit] Habit created successfully:", data?.[0]?.id);

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  
  return { success: true };
}

export async function updateHabit(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const weeklyFrequencyValue = formData.get("weekly_frequency");
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as "daily" | "weekly",
    color: formData.get("color") as string,
    weekly_frequency: weeklyFrequencyValue ? parseInt(weeklyFrequencyValue as string, 10) : undefined,
  };

  const validatedFields = habitSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: "Invalid data",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, type, color, weekly_frequency } = validatedFields.data;
  const xp_value = type === "daily" ? 10 : 50;

  const updateData: {
    name: string;
    description: string | null;
    type: "daily" | "weekly";
    color: string;
    xp_value: number;
    weekly_frequency: number | null;
    updated_at: string;
  } = {
    name,
    description: description || null,
    type,
    color,
    xp_value,
    weekly_frequency: type === "weekly" ? (weekly_frequency ?? 1) : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("habits")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateHabit] Database error:", error);
    
    if (error.code === "PGRST204" || error.message.includes("Could not find") || error.message.includes("column") && error.message.includes("schema cache")) {
      return {
        error: "Database schema is out of date. Please apply the migration '002_add_weekly_frequency.sql' in the Supabase SQL Editor. The weekly_frequency column is missing from the habits table.",
      };
    }
    
    return {
      error: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  
  return { success: true };
}

export async function deleteHabit(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
}


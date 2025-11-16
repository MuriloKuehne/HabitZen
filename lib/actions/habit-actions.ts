"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { habitSchema } from "@/lib/utils/validations";
import type { Habit, HabitWithCompletions } from "@/types/habit.types";
import { getStartOfDay, getEndOfDay } from "@/lib/utils/date-helpers";

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

  return habits.map((habit) => ({
    ...habit,
    isCompletedToday: completionMap.has(habit.id),
  }));
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
    return {
      error: "Não autenticado",
    };
  }

  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as "daily" | "weekly",
    color: formData.get("color") as string,
  };

  const validatedFields = habitSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, type, color } = validatedFields.data;
  const xp_value = type === "daily" ? 10 : 50;

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    description: description || null,
    type,
    color,
    xp_value,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

export async function updateHabit(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Não autenticado",
    };
  }

  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as "daily" | "weekly",
    color: formData.get("color") as string,
  };

  const validatedFields = habitSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, type, color } = validatedFields.data;
  const xp_value = type === "daily" ? 10 : 50;

  const { error } = await supabase
    .from("habits")
    .update({
      name,
      description: description || null,
      type,
      color,
      xp_value,
      updated_at: new Date().toISOString(),
    })
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

export async function deleteHabit(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Não autenticado",
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


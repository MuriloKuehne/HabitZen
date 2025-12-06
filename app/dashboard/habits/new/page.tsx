import { createHabit } from "@/lib/actions/habit-actions";
import { HabitForm } from "@/components/habits/HabitForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Habit",
  description: "Create a new habit to track and build your routine",
};

export const dynamic = "force-dynamic";

export default function NewHabitPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createHabit(formData);
    if (!result?.error) {
      redirect("/dashboard");
    }
    return result;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 max-w-2xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 animate-in fade-in duration-500">New Habit</h1>
      <HabitForm onSubmit={handleSubmit} />
    </div>
  );
}


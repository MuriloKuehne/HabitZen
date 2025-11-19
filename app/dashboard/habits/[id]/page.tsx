import { getHabit } from "@/lib/actions/habit-actions";
import { HabitForm } from "@/components/habits/HabitForm";
import { updateHabit, deleteHabit } from "@/lib/actions/habit-actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Habit",
  description: "Edit your habit details and settings",
};

interface EditHabitPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const { id } = await params;
  const habit = await getHabit(id);

  if (!habit) {
    redirect("/dashboard");
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await updateHabit(id, formData);
    if (!result?.error) {
      redirect("/dashboard");
    }
  }

  async function handleDelete() {
    "use server";
    await deleteHabit(id);
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-2xl">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Habit</h1>
        <form action={handleDelete}>
          <Button 
            type="submit" 
            variant="destructive"
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </form>
      </div>
      <HabitForm
        defaultValues={{
          name: habit.name,
          description: habit.description || "",
          type: habit.type,
          color: habit.color,
          weekly_frequency: habit.weekly_frequency || undefined,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}


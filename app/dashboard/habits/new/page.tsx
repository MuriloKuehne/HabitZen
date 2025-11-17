import { createHabit } from "@/lib/actions/habit-actions";
import { HabitForm } from "@/components/habits/HabitForm";
import { redirect } from "next/navigation";

export default function NewHabitPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createHabit(formData);
    if (!result?.error) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Novo Hábito</h1>
      <HabitForm onSubmit={handleSubmit} />
    </div>
  );
}


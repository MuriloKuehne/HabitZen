import { getHabit } from "@/lib/actions/habit-actions";
import { HabitForm } from "@/components/habits/HabitForm";
import { updateHabit, deleteHabit } from "@/lib/actions/habit-actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar Hábito</h1>
        <form action={handleDelete}>
          <Button type="submit" variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </form>
      </div>
      <HabitForm
        defaultValues={{
          name: habit.name,
          description: habit.description || "",
          type: habit.type,
          color: habit.color,
        }}
        onSubmit={handleSubmit}
        submitLabel="Salvar Alterações"
      />
    </div>
  );
}


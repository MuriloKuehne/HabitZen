import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getHabits } from "@/lib/actions/habit-actions";
import { HabitCard } from "@/components/habits/HabitCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { XPDisplay } from "@/components/gamification/XPDisplay";
import { HabitCalendar } from "@/components/habits/HabitCalendar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const habits = await getHabits();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user.email}
          </p>
        </div>

        <div className="mb-8">
          <XPDisplay />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Seus Hábitos</h2>
              {habits && habits.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem hábitos criados.
                  </p>
                  <Link href="/dashboard/habits/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Hábito
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div>
            <HabitCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}


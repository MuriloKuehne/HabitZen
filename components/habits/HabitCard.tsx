"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { completeHabit, uncompleteHabit } from "@/lib/actions/completion-actions";
import { deleteHabit } from "@/lib/actions/habit-actions";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import type { HabitWithCompletions } from "@/types/habit.types";
import { useRouter } from "next/navigation";

interface HabitCardProps {
  habit: HabitWithCompletions;
}

export function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(habit.isCompletedToday || false);

  const handleToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    startTransition(async () => {
      if (newCompleted) {
        await completeHabit(habit.id);
      } else {
        await uncompleteHabit(habit.id);
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar este hábito?")) {
      startTransition(async () => {
        await deleteHabit(habit.id);
        router.refresh();
      });
    }
  };

  return (
    <Card
      className="relative"
      style={{
        borderLeft: `4px solid ${habit.color}`,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{habit.name}</CardTitle>
          <div className="flex gap-2">
            <Link href={`/habits/${habit.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {habit.description && (
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            {habit.type === "daily" ? "Diário" : "Semanal"}
          </span>
          <span>+{habit.xp_value} XP</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isCompleted}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
          <label
            htmlFor={`habit-${habit.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {isCompleted ? "Completo hoje" : "Marcar como completo"}
          </label>
        </div>
      </CardContent>
    </Card>
  );
}


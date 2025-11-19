"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleWeeklyComplete = () => {
    startTransition(async () => {
      await completeHabit(habit.id);
      router.refresh();
    });
  };

  const isWeeklyCompleted = habit.type === "weekly" && habit.weeklyProgress?.isCompleted;
  const weeklyProgressText = habit.type === "weekly" && habit.weeklyProgress
    ? isWeeklyCompleted
      ? "Completed"
      : `Complete (${habit.weeklyProgress.current}/${habit.weeklyProgress.target})`
    : null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      startTransition(async () => {
        await deleteHabit(habit.id);
        router.refresh();
      });
    }
  };

  return (
    <Card
      className="relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
      style={{
        borderLeft: `4px solid ${habit.color}`,
      }}
    >
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg flex-1">{habit.name}</CardTitle>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Link href={`/dashboard/habits/${habit.id}`}>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 hover:scale-110"
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {habit.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{habit.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 flex-wrap">
          <span
            className="rounded-full px-2 py-0.5 sm:py-1 text-xs"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            {habit.type === "daily" ? "Daily" : `Weekly (${habit.weekly_frequency || 1}x)`}
          </span>
          <span>+{habit.xp_value} XP</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {habit.type === "weekly" ? (
          <div className="space-y-2">
            <Button
              onClick={handleWeeklyComplete}
              disabled={isPending}
              variant={isWeeklyCompleted ? "secondary" : "default"}
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {weeklyProgressText || "Complete"}
            </Button>
            {habit.weeklyProgress && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((habit.weeklyProgress.current / habit.weeklyProgress.target) * 100, 100)}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isCompleted ? "secondary" : "default"}
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isCompleted ? "Completed" : "Complete"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


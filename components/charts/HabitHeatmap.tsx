"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay, differenceInDays } from "date-fns";
import type { HabitCompletion } from "@/types/habit.types";
import { useEffect, useState } from "react";

interface HabitHeatmapProps {
  habitId?: string;
}

export function HabitHeatmap({ habitId }: HabitHeatmapProps) {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const loadCompletions = async () => {
      const yearStart = startOfYear(new Date());
      const yearEnd = endOfYear(new Date());
      
      const params = new URLSearchParams({
        startDate: yearStart.toISOString(),
        endDate: yearEnd.toISOString(),
      });
      
      if (habitId) {
        params.append("habitId", habitId);
      }

      const response = await fetch(`/api/completions?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCompletions(data);
      }
    };
    loadCompletions();
  }, [habitId]);

  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());
  const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const getIntensity = (date: Date): 0 | 1 | 2 | 3 | 4 => {
    const isCompleted = completions.some((completion) =>
      isSameDay(new Date(completion.completed_at), date)
    );
    return isCompleted ? 4 : 0;
  };

  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  daysInYear.forEach((day, index) => {
    if (index % 7 === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-1 min-w-fit">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => {
                  const intensity = getIntensity(day);
                  const bgColor =
                    intensity === 4
                      ? "bg-indigo-600"
                      : intensity === 3
                      ? "bg-indigo-400"
                      : intensity === 2
                      ? "bg-indigo-300"
                      : intensity === 1
                      ? "bg-indigo-200"
                      : "bg-muted";

                  return (
                    <div
                      key={day.toISOString()}
                      className={`w-3 h-3 rounded ${bgColor}`}
                      title={format(day, "dd/MM/yyyy")}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-muted" />
            <div className="w-3 h-3 rounded bg-indigo-200" />
            <div className="w-3 h-3 rounded bg-indigo-400" />
            <div className="w-3 h-3 rounded bg-indigo-600" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HabitCompletion } from "@/types/habit.types";

interface HabitCalendarProps {
  habitId?: string;
}

export function HabitCalendar({ habitId }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const loadCompletions = async () => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const params = new URLSearchParams({
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
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
  }, [currentMonth, habitId]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay();
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => null);

  const isCompleted = (date: Date) => {
    return completions.some((completion) =>
      isSameDay(new Date(completion.completed_at), date)
    );
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </CardTitle>
          <div className="flex gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={previousMonth}
              className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth}
              className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-muted-foreground p-1 sm:p-2"
            >
              {day}
            </div>
          ))}
          {daysBeforeMonth.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {daysInMonth.map((day) => {
            const completed = isCompleted(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`aspect-square flex items-center justify-center rounded-md text-xs sm:text-sm transition-all duration-200 hover:scale-110 ${
                  completed
                    ? "bg-indigo-500 text-white font-semibold"
                    : "bg-muted hover:bg-muted/80"
                } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
}: StreakCounterProps) {
  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 animate-pulse" />
          Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-2">
          <div className="animate-in slide-in-from-left duration-500">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
              {currentStreak}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Consecutive days</p>
          </div>
          {longestStreak > currentStreak && (
            <div className="pt-2 border-t animate-in fade-in duration-500 delay-200">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Record: <span className="font-semibold">{longestStreak} days</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


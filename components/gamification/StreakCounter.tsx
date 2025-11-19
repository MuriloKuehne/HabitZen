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
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
          Sequência
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-2">
          <div className="animate-in slide-in-from-left duration-500">
            <p className="text-2xl sm:text-3xl font-bold text-orange-500">
              {currentStreak}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Dias consecutivos</p>
          </div>
          {longestStreak > currentStreak && (
            <div className="pt-2 border-t animate-in fade-in duration-500 delay-200">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Recorde: <span className="font-semibold">{longestStreak} dias</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


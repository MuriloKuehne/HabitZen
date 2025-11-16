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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Sequência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-3xl font-bold text-orange-500">
              {currentStreak}
            </p>
            <p className="text-sm text-muted-foreground">Dias consecutivos</p>
          </div>
          {longestStreak > currentStreak && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Recorde: <span className="font-semibold">{longestStreak} dias</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


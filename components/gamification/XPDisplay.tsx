import { getUserStats } from "@/lib/actions/stats-actions";
import { getLevelFromXP, getProgressToNextLevel } from "@/lib/utils/xp-calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelProgressBar } from "./LevelProgressBar";
import { Trophy, Zap } from "lucide-react";

export async function XPDisplay() {
  let stats;
  
  try {
    stats = await getUserStats();
  } catch (error) {
    // If getUserStats fails, return null to hide the component
    return null;
  }

  if (!stats) {
    return null;
  }

  const level = getLevelFromXP(stats.total_xp);
  const progress = getProgressToNextLevel(stats.total_xp, level);

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Trophy className="h-5 w-5 text-yellow-500 animate-pulse" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="animate-in slide-in-from-left duration-500">
            <p className="text-xl sm:text-2xl font-bold">Level {level}</p>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {stats.total_xp} total XP
            </p>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 animate-in slide-in-from-right duration-500">
            <Zap className="h-5 w-5" />
            <span className="text-base sm:text-lg font-semibold">{stats.current_streak}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">days</span>
          </div>
        </div>
        <LevelProgressBar progress={progress} />
      </CardContent>
    </Card>
  );
}


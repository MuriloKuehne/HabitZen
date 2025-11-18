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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Progresso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">Nível {level}</p>
            <p className="text-sm text-muted-foreground">
              {stats.total_xp} XP total
            </p>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Zap className="h-5 w-5" />
            <span className="text-lg font-semibold">{stats.current_streak}</span>
            <span className="text-sm text-muted-foreground">dias</span>
          </div>
        </div>
        <LevelProgressBar progress={progress} />
      </CardContent>
    </Card>
  );
}


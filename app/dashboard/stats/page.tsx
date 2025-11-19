import { getUserStats, getXPHistory, getCompletionStats } from "@/lib/actions/stats-actions";
import { XPChart } from "@/components/charts/XPChart";
import { CompletionChart } from "@/components/charts/CompletionChart";
import { HabitHeatmap } from "@/components/charts/HabitHeatmap";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { subMonths } from "date-fns";

export default async function StatsPage() {
  let stats;
  let xpHistory: { date: string; xp: number; cumulativeXP: number }[] = [];
  let completionStats: { date: string; count: number; habits: string[] }[] = [];

  try {
    stats = await getUserStats();
    xpHistory = await getXPHistory(30);
    completionStats = await getCompletionStats(
      subMonths(new Date(), 1),
      new Date()
    );
  } catch (error) {
    // If getUserStats fails, create default stats
    stats = {
      user_id: "",
      total_xp: 0,
      current_level: 1,
      current_streak: 0,
      longest_streak: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // Ensure stats is always defined
  if (!stats) {
    stats = {
      user_id: "",
      total_xp: 0,
      current_level: 1,
      current_streak: 0,
      longest_streak: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 animate-in fade-in duration-500">Estatísticas</h1>

      <div className="grid gap-6 sm:grid-cols-2 mb-6 sm:mb-8">
        <div className="animate-in fade-in duration-500 delay-100">
          <StreakCounter
            currentStreak={stats.current_streak}
            longestStreak={stats.longest_streak}
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="animate-in fade-in duration-500 delay-200">
          <XPChart data={xpHistory} />
        </div>
        <div className="animate-in fade-in duration-500 delay-300">
          <CompletionChart data={completionStats} />
        </div>
        <div className="animate-in fade-in duration-500 delay-400">
          <HabitHeatmap />
        </div>
      </div>
    </div>
  );
}


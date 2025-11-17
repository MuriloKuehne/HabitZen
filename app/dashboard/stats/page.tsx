import { getUserStats, getXPHistory, getCompletionStats } from "@/lib/actions/stats-actions";
import { XPChart } from "@/components/charts/XPChart";
import { CompletionChart } from "@/components/charts/CompletionChart";
import { HabitHeatmap } from "@/components/charts/HabitHeatmap";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { subDays, subMonths } from "date-fns";

export default async function StatsPage() {
  const stats = await getUserStats();
  const xpHistory = await getXPHistory(30);
  const completionStats = await getCompletionStats(
    subMonths(new Date(), 1),
    new Date()
  );

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Estatísticas</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <StreakCounter
          currentStreak={stats.current_streak}
          longestStreak={stats.longest_streak}
        />
      </div>

      <div className="mt-6 space-y-6">
        <XPChart data={xpHistory} />
        <CompletionChart data={completionStats} />
        <HabitHeatmap />
      </div>
    </div>
  );
}


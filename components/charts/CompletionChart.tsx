"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CompletionChartProps {
  data: { date: string; count: number; habits: string[] }[];
}

export function CompletionChart({ data }: CompletionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Habits Completed per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No data available yet. Complete habits to see your statistics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MM/dd"),
    completions: item.count,
  }));

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">Habits Completed per Day</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] md:h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completions" fill="#3b82f6" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


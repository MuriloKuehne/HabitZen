"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompletionChartProps {
  data: { date: string; count: number; habits: string[] }[];
}

export function CompletionChart({ data }: CompletionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hábitos Completados por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>Nenhum dado disponível ainda. Complete hábitos para ver suas estatísticas!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: ptBR }),
    completions: item.count,
  }));

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Hábitos Completados por Dia</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completions" fill="#3b82f6" name="Completos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


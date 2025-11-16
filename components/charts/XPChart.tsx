"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface XPChartProps {
  data: { date: string; xp: number; cumulativeXP: number }[];
}

export function XPChart({ data }: XPChartProps) {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: ptBR }),
    xp: item.xp,
    cumulativeXP: item.cumulativeXP,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de XP</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cumulativeXP"
              stroke="#3b82f6"
              strokeWidth={2}
              name="XP Acumulado"
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="XP do Dia"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


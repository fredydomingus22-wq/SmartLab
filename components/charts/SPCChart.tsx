
// components/charts/SPCChart.tsx
"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SpcPoint {
  name: string;
  value: number;
}

export function SPCChart() {
  const [data, setData] = useState<SpcPoint[]>([]);
  const [limits, setLimits] = useState({ ucl: 0, cl: 0, lcl: 0 });

  useEffect(() => {
    fetch('/api/data-intelligence/spc')
      .then(res => res.json())
      .then(apiData => {
        const chartData = apiData.xBar.points.map((p: number, i: number) => ({ name: `Sample ${i + 1}`, value: p }));
        setData(chartData);
        setLimits({ ucl: apiData.xBar.ucl, cl: apiData.xBar.cl, lcl: apiData.xBar.lcl });
      });
  }, []);

  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Carta de Controlo (CEP)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[limits.lcl - 5, limits.ucl + 5]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Bar dataKey="value" name="Valor" fill="#34d399" />
            <ReferenceLine y={limits.ucl} label="LSC" stroke="#f87171" />
            <ReferenceLine y={limits.cl} label="LC" stroke="#60a5fa" />
            <ReferenceLine y={limits.lcl} label="LIC" stroke="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

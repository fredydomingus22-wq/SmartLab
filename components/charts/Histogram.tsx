
// components/charts/Histogram.tsx
"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HistogramBin {
  range: string;
  count: number;
}

export function Histogram() {
  const [data, setData] = useState<HistogramBin[]>([]);

  useEffect(() => {
    fetch('/api/data-intelligence/spc')
      .then(res => res.json())
      .then(apiData => {
        setData(apiData.histogram);
      });
  }, []);

  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Histograma de Frequência</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Bar dataKey="count" name="Frequência" fill="#818cf8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

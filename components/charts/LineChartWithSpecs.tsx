
// components/charts/LineChartWithSpecs.tsx
"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Analysis } from "@/types/data-intelligence";

export function LineChartWithSpecs() {
  const [data, setData] = useState<Analysis[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data. Here we use a static mock.
    const mockData: Analysis[] = [
      { analysis_id: "A001", sample_id: "S001", parameter_id: "P001", method_id: "M001", result_value: 10.2, unit: "pH", limit_min: 10, limit_max: 10.5, analyst: "user1", analysis_date: "2025-11-19T08:00:00Z", validation_status: 'approved' },
      { analysis_id: "A002", sample_id: "S002", parameter_id: "P001", method_id: "M001", result_value: 10.1, unit: "pH", limit_min: 10, limit_max: 10.5, analyst: "user2", analysis_date: "2025-11-19T09:00:00Z", validation_status: 'approved' },
      { analysis_id: "A003", sample_id: "S003", parameter_id: "P001", method_id: "M001", result_value: 10.6, unit: "pH", limit_min: 10, limit_max: 10.5, analyst: "user1", analysis_date: "2025-11-19T10:00:00Z", validation_status: 'failed' },
      { analysis_id: "A004", sample_id: "S004", parameter_id: "P001", method_id: "M001", result_value: 10.3, unit: "pH", limit_min: 10, limit_max: 10.5, analyst: "user3", analysis_date: "2025-11-19T11:00:00Z", validation_status: 'approved' },
    ];
    setData(mockData);
  }, []);

  const spec_min = data[0]?.limit_min;
  const spec_max = data[0]?.limit_max;
  const target = spec_min && spec_max ? (spec_min + spec_max) / 2 : undefined;

  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Tendência de Resultados (pH)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="analysis_date"
              stroke="#9ca3af"
              tickFormatter={(date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis stroke="#9ca3af" domain={['dataMin - 0.2', 'dataMax + 0.2']} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Legend wrapperStyle={{ color: "#d1d5db" }} />
            <Line type="monotone" dataKey="result_value" name="Resultado" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} />
            {spec_max && <ReferenceLine y={spec_max} label={{ value: "LSE", fill: "#f87171" }} stroke="#f87171" strokeDasharray="3 3" />}
            {target && <ReferenceLine y={target} label={{ value: "Alvo", fill: "#60a5fa" }} stroke="#60a5fa" strokeDasharray="3 3" />}
            {spec_min && <ReferenceLine y={spec_min} label={{ value: "LIE", fill: "#f87171" }} stroke="#f87171" strokeDasharray="3 3" />}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

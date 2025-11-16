"use client";

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export interface TrendChartSeries {
  name: string;
  dataKey: string;
  color?: string;
}

export interface TrendChartProps {
  data: Record<string, any>[];
  xKey: string;
  series: TrendChartSeries[];
  yLabel?: string;
}

export function TrendChart({ data, xKey, series, yLabel }: TrendChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" tick={{ fill: "rgba(255,255,255,0.6)" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: "rgba(255,255,255,0.6)" }}
            label={
              yLabel
                ? { value: yLabel, angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.6)" }
                : undefined
            }
          />
          <Tooltip contentStyle={{ backgroundColor: "rgba(3,7,18,0.95)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)" }} />
          {series.map((serie) => (
            <Line
              key={serie.dataKey}
              type="monotone"
              dataKey={serie.dataKey}
              name={serie.name}
              stroke={serie.color ?? "#FF934F"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

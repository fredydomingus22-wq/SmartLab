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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" } : undefined}
          />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: 8 }} />
          <Legend />
          {series.map((serie) => (
            <Line
              key={serie.dataKey}
              type="monotone"
              dataKey={serie.dataKey}
              name={serie.name}
              stroke={serie.color ?? "hsl(var(--primary))"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

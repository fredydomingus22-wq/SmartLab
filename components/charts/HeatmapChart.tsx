
// components/charts/HeatmapChart.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HeatmapChart() {
  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Heatmap Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-slate-500">
          [Heatmap Chart Placeholder]
        </div>
      </CardContent>
    </Card>
  );
}

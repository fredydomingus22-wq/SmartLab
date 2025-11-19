
// components/charts/SPCChart.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SPCChart() {
  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>SPC Chart (X-bar / ImR)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-slate-500">
          [SPC Chart Placeholder]
        </div>
      </CardContent>
    </Card>
  );
}

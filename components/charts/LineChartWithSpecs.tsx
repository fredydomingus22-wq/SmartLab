
// components/charts/LineChartWithSpecs.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LineChartWithSpecs() {
  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Line Chart with Specs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-slate-500">
          [Line Chart Placeholder with LSL/USL lines]
        </div>
      </CardContent>
    </Card>
  );
}


// components/charts/Histogram.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Histogram() {
  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle>Histogram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-slate-500">
          [Histogram Placeholder]
        </div>
      </CardContent>
    </Card>
  );
}

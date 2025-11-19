
// app/data-intelligence/sample-pipeline/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/analytics/StatusBadge";

export default function SamplePipelinePage() {
  // Mock data for now
  const pipeline = [
    { name: "Pending", count: 12, status: "pending" },
    { name: "In Analysis", count: 8, status: "in_analysis" },
    { name: "Review", count: 4, status: "validated" },
    { name: "Approved", count: 32, status: "approved" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Sample Pipeline</h1>
        <p className="text-slate-400">Visibilidade do fluxo de amostras no laboratório.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {pipeline.map((stage) => (
          <Card key={stage.name} className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{stage.name}</span>
                <StatusBadge status={stage.status as any} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stage.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* TODO: Add turnaround time and bottleneck charts */}
    </div>
  );
}

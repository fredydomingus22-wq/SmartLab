
// app/data-intelligence/parameter-performance/page.tsx
"use client";

import { SPCChart } from "@/components/charts/SPCChart";
import { Histogram } from "@/components/charts/Histogram";
import { LineChartWithSpecs } from "@/components/charts/LineChartWithSpecs";

export default function ParameterPerformancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Parameter Performance</h1>
        <p className="text-slate-400">Análise detalhada por parâmetro de qualidade.</p>
      </div>

      {/* TODO: Add parameter dropdown */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SPCChart />
        <Histogram />
        <LineChartWithSpecs />
        {/* TODO: Add variability and analyst ranking components */}
      </div>
    </div>
  );
}

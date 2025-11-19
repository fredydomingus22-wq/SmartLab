
// app/data-intelligence/product-line-analysis/page.tsx
"use client";

import { HeatmapChart } from "@/components/charts/HeatmapChart";
import { ParetoChart } from "@/components/charts/ParetoChart";
import { LineChartWithSpecs } from "@/components/charts/LineChartWithSpecs";

export default function ProductLineAnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Product & Line Analysis</h1>
        <p className="text-slate-400">Análise de performance por linha de produção e produto.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <HeatmapChart />
        <ParetoChart />
        <LineChartWithSpecs />
      </div>
    </div>
  );
}

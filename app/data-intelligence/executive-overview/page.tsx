
// app/data-intelligence/executive-overview/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { KPIStatCard } from "@/components/analytics/KPIStatCard";
import { LineChartWithSpecs } from "@/components/charts/LineChartWithSpecs";

type KpiData = {
  name: string;
  value: string;
  change?: string;
};

export default function ExecutiveOverviewPage() {
  const [kpis, setKpis] = useState<KpiData[]>([]);

  useEffect(() => {
    fetch('/api/data-intelligence/kpi')
      .then(res => res.json())
      .then(data => setKpis(data));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Executive Overview</h1>
        <p className="text-slate-400">Análise de KPIs de Qualidade em tempo real.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white">Visão Geral dos KPIs</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map(kpi => (
            <KPIStatCard key={kpi.name} {...kpi} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LineChartWithSpecs />
      </div>
    </div>
  );
}

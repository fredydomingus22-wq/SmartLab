
// app/data-intelligence/executive-overview/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KPIStatCard } from "@/components/analytics/KPIStatCard";
import { LineChartWithSpecs } from "@/components/charts/LineChartWithSpecs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type KpiData = {
  name: string;
  value: string;
  change?: string;
  href: string;
};

const kpiLinks: { [key: string]: string } = {
  "Total Análises 24h": "/data-intelligence/sample-pipeline",
  "% Conformidade (RFT)": "/data-intelligence/parameter-performance",
  "Lotes Liberados vs Bloqueados": "/production-lots",
  "Desvios Críticos": "/nc",
  "Custo da Não-Qualidade": "/data-intelligence/executive-overview", // Stays on the same page
  "Equipamentos Calibrados vs Vencidos": "/data-intelligence/equipment-status",
};

export default function ExecutiveOverviewPage() {
  const [kpis, setKpis] = useState<KpiData[]>([]);

  useEffect(() => {
    fetch('/api/data-intelligence/kpi')
      .then(res => res.json())
      .then(data => {
        const linkedData = data.map((kpi: any) => ({
          ...kpi,
          href: kpiLinks[kpi.name] || "/data-intelligence/executive-overview",
        }));
        setKpis(linkedData);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Executive Overview</h1>
        <p className="text-slate-400">Análise de KPIs de Qualidade em tempo real.</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Visão Geral dos KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map(kpi => (
              <Link href={kpi.href} key={kpi.name} className="transition-transform hover:scale-105">
                <KPIStatCard {...kpi} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <LineChartWithSpecs />
      </div>
    </div>
  );
}

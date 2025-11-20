
// app/data-intelligence/equipment-status/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/analytics/StatusBadge";
import { LineChartWithSpecs } from "@/components/charts/LineChartWithSpecs";

export default function EquipmentStatusPage() {
    // Mock data for now
  const equipment = [
      { id: "EQ001", name: "pH Meter", status: "ok", due: "32 dias" },
      { id: "EQ002", name: "Refractometer", status: "ok", due: "12 dias" },
      { id: "EQ003", name: "Balança Analítica", status: "overdue", due: "-2 dias" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Equipment Status</h1>
        <p className="text-slate-400">Gestão e alertas de calibração de equipamentos.</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-2">Equipamento</th>
                <th className="p-2">Status</th>
                <th className="p-2">Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(eq => (
                <tr key={eq.id} className="border-b border-slate-800">
                  <td className="p-2">{eq.name}</td>
                  <td className="p-2"><StatusBadge status={eq.status as any} /></td>
                  <td className="p-2">{eq.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <LineChartWithSpecs />
    </div>
  );
}

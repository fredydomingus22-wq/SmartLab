import { notFound } from "next/navigation";
import { SimpleTable } from "@/components/tables/simple-table";
import { TrendChart } from "@/components/charts/trend-chart";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

const MOCK_TRACEABILITY = {
  id: "LOT-2024-001",
  product: "Orange Sparkling 330ml",
  status: "released",
  shift: "Noite A",
  line: "PET 2",
  rawMaterials: [
    { lot: "RM-001", material: "Sugar", supplier: "Sweet Harvest", status: "released" },
    { lot: "RM-014", material: "Orange Concentrate", supplier: "Citrus Prime", status: "released" },
  ],
  intermediateLots: [{ lot: "INT-2024-05", tank: "Tank 3", status: "released" }],
  finishedLots: [{ lot: "FP-2024-013", status: "released", expiry: "2025-05-01" }],
  labTests: [{ test: "Finished Product QA", status: "in_spec", analyst: "A. Costa" }],
  nonConformities: [],
  pccChecks: [{ point: "Pasteurization Temperature", status: "in_control", lastCheck: "2024-05-12" }],
};

const lotTrends = [
  { timestamp: "08:00", brix: 12.1, co2: 5.8 },
  { timestamp: "10:00", brix: 12.0, co2: 5.9 },
  { timestamp: "12:00", brix: 11.8, co2: 5.7 },
  { timestamp: "14:00", brix: 12.2, co2: 6.0 },
];

interface TraceabilityPageProps {
  params: { production_lot_id: string };
}

export default function TraceabilityPage({ params }: TraceabilityPageProps) {
  const data = params.production_lot_id === MOCK_TRACEABILITY.id ? MOCK_TRACEABILITY : null;
  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8 text-white">
      <GlassPanel className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Rastreabilidade</p>
          <h1 className="text-3xl font-semibold">{data.id}</h1>
          <p className="text-sm text-white/70">{data.product}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="rounded-full border border-white/20 px-4 py-1.5">{data.status}</span>
            <span className="rounded-full border border-white/20 px-4 py-1.5">{data.shift}</span>
            <span className="rounded-full border border-white/20 px-4 py-1.5">Linha {data.line}</span>
          </div>
        </div>
        <div className="space-y-3">
          <Button className="w-full">Exportar dossiê</Button>
          <Button variant="secondary" className="w-full">
            Criar NC ligada
          </Button>
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Matéria-prima</p>
              <p className="text-xl font-semibold">Lotes ligados</p>
            </div>
          </div>
          <div className="mt-4">
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Material", accessor: "material" },
                { header: "Supplier", accessor: "supplier" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.rawMaterials}
            />
          </div>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Processo</p>
          <p className="text-xl font-semibold">Intermédios</p>
          <div className="mt-4">
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Tank", accessor: "tank" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.intermediateLots}
            />
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Produto final</p>
          <p className="text-xl font-semibold">Lotes associados</p>
          <div className="mt-4">
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Status", accessor: "status" },
                { header: "Expiry", accessor: "expiry" },
              ]}
              data={data.finishedLots}
            />
          </div>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">PCC / Food Safety</p>
          <p className="text-xl font-semibold">Checkpoints</p>
          <div className="mt-4">
            <SimpleTable
              columns={[
                { header: "Point", accessor: "point" },
                { header: "Status", accessor: "status" },
                { header: "Last Check", accessor: "lastCheck" },
              ]}
              data={data.pccChecks}
            />
          </div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Tendência do lote</p>
            <p className="text-2xl font-semibold">Inline QA</p>
          </div>
          <div className="text-sm text-white/70">
            Última análise verificada por {data.labTests[0]?.analyst}
          </div>
        </div>
        <div className="mt-4">
          <TrendChart
            data={lotTrends}
            xKey="timestamp"
            series={[
              { name: "Brix", dataKey: "brix", color: "#f97316" },
              { name: "CO₂", dataKey: "co2", color: "#38bdf8" },
            ]}
          />
        </div>
      </GlassPanel>
    </div>
  );
}

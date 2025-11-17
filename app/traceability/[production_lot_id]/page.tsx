import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";
import { TrendChart } from "@/components/charts/trend-chart";

const MOCK_TRACEABILITY = {
  id: "LOT-2024-001",
  rawMaterials: [
    { lot: "RM-001", material: "Sugar", supplier: "Sweet Harvest", status: "released" },
    { lot: "RM-014", material: "Orange Concentrate", supplier: "Citrus Prime", status: "released" },
  ],
  intermediateLots: [
    { lot: "INT-2024-05", tank: "Tank 3", status: "released" },
  ],
  finishedLots: [
    { lot: "FP-2024-013", status: "released", expiry: "2025-05-01" },
  ],
  labTests: [
    { test: "Finished Product QA", status: "in_spec", analyst: "A. Costa", completedAt: "2024-05-12 14:30" },
    { test: "CO₂ Micro Verification", status: "pending", analyst: "L. Nunes", completedAt: null },
  ],
  nonConformities: [
    { code: "NC-2024-0007", trigger: "CO₂ drift", severity: "major", status: "in_progress" },
  ],
  pccChecks: [
    { point: "Pasteurization Temperature", status: "in_control", lastCheck: "2024-05-12" },
  ],
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
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Traceability for {data.id}</h1>
        <p className="text-muted-foreground">Raw materials through finished goods and quality events.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Raw Materials</CardTitle>
            <CardDescription>Lots linked to this production lot</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Material", accessor: "material" },
                { header: "Supplier", accessor: "supplier" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.rawMaterials}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Intermediate Lots</CardTitle>
            <CardDescription>In-process batches</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Tank", accessor: "tank" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.intermediateLots}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Finished Lots</CardTitle>
            <CardDescription>Released or blocked finished goods</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Lot", accessor: "lot" },
                { header: "Status", accessor: "status" },
                { header: "Expiry", accessor: "expiry" },
              ]}
              data={data.finishedLots}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Critical Control Points</CardTitle>
            <CardDescription>PCC status related to the lot</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Point", accessor: "point" },
                { header: "Status", accessor: "status" },
                { header: "Last Check", accessor: "lastCheck" },
              ]}
              data={data.pccChecks}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lab Tests & Quality Gates</CardTitle>
            <CardDescription>Latest analytical verifications tied to this lot</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Test", accessor: "test" },
                { header: "Analyst", accessor: "analyst" },
                { header: "Status", accessor: "status" },
                {
                  header: "Completed",
                  accessor: (item) => item.completedAt ?? "Pending",
                },
              ]}
              data={data.labTests}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Linked Non-Conformities</CardTitle>
            <CardDescription>Escalations connected to this production window</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={[
                { header: "Code", accessor: "code" },
                { header: "Trigger", accessor: "trigger" },
                { header: "Severity", accessor: "severity" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.nonConformities}
              emptyMessage="No non-conformities linked."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finished Product Trends</CardTitle>
          <CardDescription>Inline monitoring per production window</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            data={lotTrends}
            xKey="timestamp"
            series={[
              { name: "Brix", dataKey: "brix", color: "#f97316" },
              { name: "CO₂", dataKey: "co2", color: "#0ea5e9" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

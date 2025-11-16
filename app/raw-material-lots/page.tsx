import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockRawMaterialLots = [
  { id: "RML-001", rawMaterial: "Sugar", supplier: "Sweet Harvest", quarantineStatus: "approved" },
  { id: "RML-002", rawMaterial: "Orange Concentrate", supplier: "Citrus Prime", quarantineStatus: "waiting_analysis" },
];

export default function RawMaterialLotsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raw Material Lots</h1>
          <p className="text-muted-foreground">Inbound inspection and quarantine status.</p>
        </div>
        <Button asChild>
          <Link href="/raw-material-lots/create">Receive Material Lot</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inbound Lots</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Lot", accessor: "id" },
              { header: "Material", accessor: "rawMaterial" },
              { header: "Supplier", accessor: "supplier" },
              { header: "Quarantine", accessor: "quarantineStatus" },
            ]}
            data={mockRawMaterialLots}
          />
        </CardContent>
      </Card>
    </div>
  );
}

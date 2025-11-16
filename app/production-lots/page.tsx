import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockProductionLots = [
  { id: "LOT-2024-001", product: "Orange Soda", line: "Line 1", status: "in_progress" },
  { id: "LOT-2024-002", product: "Grape Soda", line: "Line 2", status: "planned" },
];

export default function ProductionLotsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Lots</h1>
          <p className="text-muted-foreground">Track parent batches and release status.</p>
        </div>
        <Button asChild>
          <Link href="/production-lots/create">New Production Lot</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Lots</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Lot", accessor: "id" },
              { header: "Product", accessor: "product" },
              { header: "Line", accessor: "line" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockProductionLots}
          />
        </CardContent>
      </Card>
    </div>
  );
}

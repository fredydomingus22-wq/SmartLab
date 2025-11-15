import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockIntermediateLots = [
  { id: "INT-2024-05", product: "Orange Base", tank: "Tank 3", status: "in_process" },
];

export default function IntermediateLotsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intermediate Lots</h1>
          <p className="text-muted-foreground">Blend and syrup tanks currently running.</p>
        </div>
        <Button asChild>
          <Link href="/intermediate-lots/create">New Intermediate Lot</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>In-Process Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Lot", accessor: "id" },
              { header: "Product", accessor: "product" },
              { header: "Tank", accessor: "tank" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockIntermediateLots}
          />
        </CardContent>
      </Card>
    </div>
  );
}

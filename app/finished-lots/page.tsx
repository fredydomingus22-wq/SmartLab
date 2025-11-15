import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockFinishedLots = [
  { id: "FP-2024-013", product: "Orange Soda", status: "released", expiry: "2025-05-01" },
];

export default function FinishedLotsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finished Product Lots</h1>
          <p className="text-muted-foreground">Release and recall-ready visibility.</p>
        </div>
        <Button asChild>
          <Link href="/finished-lots/create">New Finished Lot</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Release Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Lot", accessor: "id" },
              { header: "Product", accessor: "product" },
              { header: "Status", accessor: "status" },
              { header: "Expiry", accessor: "expiry" },
            ]}
            data={mockFinishedLots}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockLots = [
  { id: "LOT-2024-001", product: "Orange Soda", status: "released" },
];

export default function TraceabilityIndexPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Traceability Explorer</h1>
        <p className="text-muted-foreground">Search parent lots to view end-to-end lineage.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Production Lots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockLots.map((lot) => (
            <div key={lot.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">{lot.id}</p>
                <p className="text-sm text-muted-foreground">{lot.product} · {lot.status}</p>
              </div>
              <Button asChild>
                <Link href={`/traceability/${lot.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

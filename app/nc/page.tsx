import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockNCs = [
  { id: "NC-2024-0001", source: "lab_result", severity: "major", status: "in_progress" },
  { id: "NC-2024-0002", source: "pcc", severity: "critical", status: "open" },
];

export default function NonConformitiesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Non-Conformities</h1>
          <p className="text-muted-foreground">Manage deviations and 8D progress.</p>
        </div>
        <Button asChild>
          <Link href="/nc/create">New NC</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Open NCs</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Source", accessor: "source" },
              { header: "Severity", accessor: "severity" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockNCs}
          />
        </CardContent>
      </Card>
    </div>
  );
}

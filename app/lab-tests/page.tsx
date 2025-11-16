import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockLabTests = [
  { id: "LAB-001", sampleType: "finished", lot: "FP-2024-013", status: "in_spec" },
  { id: "LAB-002", sampleType: "raw_material", lot: "RML-002", status: "pending" },
];

export default function LabTestsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lab Tests</h1>
          <p className="text-muted-foreground">Monitor analytical workload and statuses.</p>
        </div>
        <Button asChild>
          <Link href="/lab-tests/create">New Lab Test</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Test", accessor: "id" },
              { header: "Sample Type", accessor: "sampleType" },
              { header: "Lot", accessor: "lot" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockLabTests}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockAudits = [
  { id: "AUD-2024-01", type: "internal", standard: "ISO 9001", status: "scheduled" },
  { id: "AUD-2024-02", type: "customer", standard: "Pepsi", status: "in_progress" },
];

export default function AuditsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audits</h1>
          <p className="text-muted-foreground">Plan and follow-up on audit programs.</p>
        </div>
        <Button asChild>
          <Link href="/audits/create">Schedule Audit</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Register</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Type", accessor: "type" },
              { header: "Standard", accessor: "standard" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockAudits}
          />
        </CardContent>
      </Card>
    </div>
  );
}

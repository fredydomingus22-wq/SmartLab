import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const MOCK_NC = {
  id: "NC-2024-0001",
  severity: "major",
  status: "in_progress",
  correctiveActions: [
    { action: "Hold lot FP-2024-013", owner: "QA", due: "2024-05-20" },
  ],
};

interface NonConformityPageProps {
  params: { id: string };
}

export default function NonConformityPage({ params }: NonConformityPageProps) {
  const data = params.id === MOCK_NC.id ? MOCK_NC : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Non-conformity not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{data.id}</h1>
          <p className="text-muted-foreground">Severity {data.severity} · Status {data.status}</p>
        </div>
        <Button asChild>
          <Link href={`/nc/8d/${data.id}`}>Open 8D</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Corrective Actions</CardTitle>
          <CardDescription>Containment and remediation steps</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Action", accessor: "action" },
              { header: "Owner", accessor: "owner" },
              { header: "Due", accessor: "due" },
            ]}
            data={data.correctiveActions}
          />
        </CardContent>
      </Card>
    </div>
  );
}

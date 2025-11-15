import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const MOCK_AUDIT = {
  id: "AUD-2024-01",
  type: "internal",
  standard: "ISO 9001",
  status: "scheduled",
  findings: [
    { id: "F-01", finding_type: "observation", description: "Update sanitation form", area: "Filling" },
  ],
};

interface AuditPageProps {
  params: { id: string };
}

export default function AuditPage({ params }: AuditPageProps) {
  const data = params.id === MOCK_AUDIT.id ? MOCK_AUDIT : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Audit not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit {data.id}</CardTitle>
          <CardDescription>
            {data.type} · {data.standard} · Status {data.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Finding", accessor: "id" },
              { header: "Type", accessor: "finding_type" },
              { header: "Description", accessor: "description" },
              { header: "Area", accessor: "area" },
            ]}
            data={data.findings}
          />
        </CardContent>
      </Card>
    </div>
  );
}

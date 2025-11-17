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
          <h1 className="text-3xl font-bold">Auditorias</h1>
          <p className="text-muted-foreground">Planeie e acompanhe os programas de auditoria.</p>
        </div>
        <Button asChild>
          <Link href="/audits/create">Agendar Auditoria</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registo de Auditorias</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Código", accessor: "id" },
              { header: "Tipo", accessor: "type" },
              { header: "Norma", accessor: "standard" },
              { header: "Estado", accessor: "status" },
            ]}
            data={mockAudits}
          />
        </CardContent>
      </Card>
    </div>
  );
}

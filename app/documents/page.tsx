import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockDocuments = [
  { id: "DOC-PR-001", title: "Pasteurization Procedure", type: "procedure", status: "effective" },
  { id: "DOC-WI-010", title: "Brix Sampling WI", type: "work_instruction", status: "draft" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Control revisions and approvals.</p>
        </div>
        <Button asChild>
          <Link href="/documents/create">Upload Document</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Register</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Title", accessor: "title" },
              { header: "Type", accessor: "type" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockDocuments}
          />
        </CardContent>
      </Card>
    </div>
  );
}

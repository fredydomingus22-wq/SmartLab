import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockPrp = [
  { id: "PRP-01", title: "Cleaning Verification", frequency: "daily", responsible: "qa_supervisor", status: "active" },
];

export default function PrpPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">PRP Programs</h1>
        <p className="text-muted-foreground">Foundational prerequisite programs and checks.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Program List</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Title", accessor: "title" },
              { header: "Frequency", accessor: "frequency" },
              { header: "Responsible", accessor: "responsible" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockPrp}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockPcc = [
  { id: "PCC-01", name: "Filling Temperature", criticalMin: "85", criticalMax: "90", status: "in_control" },
];

export default function PccPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">PCC Oversight</h1>
        <p className="text-muted-foreground">Critical control point limits and deviations.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>PCC Points</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Name", accessor: "name" },
              { header: "Min", accessor: "criticalMin" },
              { header: "Max", accessor: "criticalMax" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockPcc}
          />
        </CardContent>
      </Card>
    </div>
  );
}

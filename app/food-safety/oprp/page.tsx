import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockOprp = [
  { id: "OPRP-01", name: "Syrup Mix Temp", frequency: "hourly", status: "in_control", responsible: "lab_tech" },
];

export default function OprpPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">OPRP Monitoring</h1>
        <p className="text-muted-foreground">Operational PRP checks tied to lines and products.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>OPRP Points</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Name", accessor: "name" },
              { header: "Frequency", accessor: "frequency" },
              { header: "Responsible", accessor: "responsible" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockOprp}
          />
        </CardContent>
      </Card>
    </div>
  );
}

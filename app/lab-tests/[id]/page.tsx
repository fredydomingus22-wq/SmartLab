import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const MOCK_TEST = {
  id: "LAB-001",
  sampleType: "finished",
  lot: "FP-2024-013",
  status: "in_spec",
  results: [
    { parameter: "Brix", measured: "12.0", min: "11.8", max: "12.2", status: "in_spec" },
    { parameter: "pH", measured: "3.18", min: "3.0", max: "3.4", status: "in_spec" },
  ],
};

interface LabTestPageProps {
  params: { id: string };
}

export default function LabTestPage({ params }: LabTestPageProps) {
  const data = params.id === MOCK_TEST.id ? MOCK_TEST : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Lab test not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lab Test {data.id}</CardTitle>
          <CardDescription>
            {data.sampleType} sample · Lot {data.lot} · Status {data.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Parameter", accessor: "parameter" },
              { header: "Measured", accessor: "measured" },
              { header: "Min", accessor: "min" },
              { header: "Max", accessor: "max" },
              { header: "Status", accessor: "status" },
            ]}
            data={data.results}
          />
        </CardContent>
      </Card>
    </div>
  );
}

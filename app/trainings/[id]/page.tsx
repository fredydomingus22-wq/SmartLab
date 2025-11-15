import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const MOCK_TRAINING = {
  id: "TR-001",
  title: "HACCP Refresher",
  status: "active",
  sessions: [
    { id: "S-01", date: "2024-03-10", trainer: "QA Supervisor" },
  ],
  assignments: [
    { id: "A-01", user: "Lab Tech 1", status: "completed" },
  ],
};

interface TrainingPageProps {
  params: { id: string };
}

export default function TrainingPage({ params }: TrainingPageProps) {
  const data = params.id === MOCK_TRAINING.id ? MOCK_TRAINING : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Training not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>Status {data.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Sessions</h3>
            <SimpleTable
              columns={[
                { header: "Session", accessor: "id" },
                { header: "Date", accessor: "date" },
                { header: "Trainer", accessor: "trainer" },
              ]}
              data={data.sessions}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Assignments</h3>
            <SimpleTable
              columns={[
                { header: "Assignment", accessor: "id" },
                { header: "User", accessor: "user" },
                { header: "Status", accessor: "status" },
              ]}
              data={data.assignments}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

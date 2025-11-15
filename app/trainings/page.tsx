import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockTrainings = [
  { id: "TR-001", title: "HACCP Refresher", category: "HACCP", status: "active" },
  { id: "TR-002", title: "Micro Sampling", category: "GMP", status: "active" },
];

export default function TrainingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trainings</h1>
          <p className="text-muted-foreground">Maintain competency and assignments.</p>
        </div>
        <Button asChild>
          <Link href="/trainings/create">Create Training</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Training Library</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Code", accessor: "id" },
              { header: "Title", accessor: "title" },
              { header: "Category", accessor: "category" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockTrainings}
          />
        </CardContent>
      </Card>
    </div>
  );
}

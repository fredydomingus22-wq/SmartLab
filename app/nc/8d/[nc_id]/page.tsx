import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_8D = {
  ncId: "NC-2024-0001",
  status: "in_progress",
  d1_team_members: ["QA Supervisor", "Plant Manager"],
  d3_containment_actions: ["Hold shipment", "Alert distribution"],
};

interface EightDPageProps {
  params: { nc_id: string };
}

export default function EightDReportPage({ params }: EightDPageProps) {
  const data = params.nc_id === MOCK_8D.ncId ? MOCK_8D : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">8D report not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>8D for {data.ncId}</CardTitle>
          <CardDescription>Status {data.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">D1 – Team</h3>
            <p className="text-sm text-muted-foreground">{data.d1_team_members.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-semibold">D3 – Containment</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {data.d3_containment_actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

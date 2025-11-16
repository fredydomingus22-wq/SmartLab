import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_DOCUMENT = {
  id: "DOC-PR-001",
  title: "Pasteurization Procedure",
  versions: [
    { version: "1.0", status: "approved", approved_at: "2024-02-10" },
    { version: "0.9", status: "draft", approved_at: null },
  ],
};

interface DocumentPageProps {
  params: { id: string };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const data = params.id === MOCK_DOCUMENT.id ? MOCK_DOCUMENT : null;
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>Document code {data.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.versions.map((version) => (
            <div key={version.version} className="rounded-lg border p-4">
              <h3 className="font-semibold">Version {version.version}</h3>
              <p className="text-sm text-muted-foreground">Status: {version.status}</p>
              <p className="text-sm text-muted-foreground">
                {version.approved_at ? `Approved ${version.approved_at}` : "Pending approval"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

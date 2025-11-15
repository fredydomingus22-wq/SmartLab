import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockRawMaterials = [
  { id: "rm1", name: "Sugar", code: "RM-001", category: "Sweetener", status: "active" },
  { id: "rm2", name: "Orange Concentrate", code: "RM-014", category: "Juice", status: "active" },
];

export default function RawMaterialsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raw Materials</h1>
          <p className="text-muted-foreground">Control ingredients entering the facility.</p>
        </div>
        <Button asChild>
          <Link href="/raw-materials/create">New Raw Material</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Code", accessor: "code" },
              { header: "Category", accessor: "category" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockRawMaterials}
          />
        </CardContent>
      </Card>
    </div>
  );
}

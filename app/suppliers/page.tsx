import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/tables/simple-table";

const mockSuppliers = [
  { id: "sup1", name: "Sweet Harvest", certification: "ISO 22000", riskLevel: "medium", status: "approved" },
  { id: "sup2", name: "Citrus Prime", certification: "FSSC 22000", riskLevel: "low", status: "approved" },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Qualification and monitoring of partners.</p>
        </div>
        <Button asChild>
          <Link href="/suppliers/create">New Supplier</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Approved Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Certification", accessor: "certification" },
              { header: "Risk", accessor: "riskLevel" },
              { header: "Status", accessor: "status" },
            ]}
            data={mockSuppliers}
          />
        </CardContent>
      </Card>
    </div>
  );
}

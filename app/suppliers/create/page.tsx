import Link from "next/link";
import { SupplierForm } from "@/components/forms/supplier-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateSupplierPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Supplier</h1>
          <p className="text-muted-foreground">Maintain approved suppliers and risk ratings.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/suppliers">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Supplier Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm />
        </CardContent>
      </Card>
    </div>
  );
}

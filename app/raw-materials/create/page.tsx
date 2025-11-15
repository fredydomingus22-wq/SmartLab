import Link from "next/link";
import { RawMaterialForm } from "@/components/forms/raw-material-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateRawMaterialPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Register Raw Material</h1>
          <p className="text-muted-foreground">Capture sourcing details and documentation.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/raw-materials">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Raw Material Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RawMaterialForm />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateLabTestPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Lab Test</h1>
          <p className="text-muted-foreground">Assign samples and parameters for analysis.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/lab-tests">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sampleType">Sample Type</Label>
              <Select id="sampleType" defaultValue="finished">
                <option value="raw_material">Raw Material</option>
                <option value="intermediate">Intermediate</option>
                <option value="finished">Finished Product</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lot">Related Lot</Label>
              <Input id="lot" placeholder="e.g. LOT-2024-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="analyst">Analyst</Label>
              <Input id="analyst" placeholder="Assign analyst" />
            </div>
            <Button type="submit" className="justify-self-start">
              Create Test
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

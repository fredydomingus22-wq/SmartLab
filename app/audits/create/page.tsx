import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateAuditPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Audit</h1>
          <p className="text-muted-foreground">Define scope and assign auditor.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/audits">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Audit Type</Label>
              <Select id="type" defaultValue="internal">
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="customer">Customer</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="standard">Standard</Label>
              <Input id="standard" placeholder="e.g. FSSC 22000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auditor">Auditor</Label>
              <Input id="auditor" placeholder="Responsible auditor" />
            </div>
            <Button type="submit" className="justify-self-start">
              Schedule
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

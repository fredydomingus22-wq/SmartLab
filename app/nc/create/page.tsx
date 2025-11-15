import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateNonConformityPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Open Non-Conformity</h1>
          <p className="text-muted-foreground">Trigger investigations and immediate actions.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/nc">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>NC Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Select id="source" defaultValue="lab_result">
                <option value="lab_result">Lab Result</option>
                <option value="pcc">PCC</option>
                <option value="process">Process</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="severity">Severity</Label>
              <Select id="severity" defaultValue="major">
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Describe the deviation" />
            </div>
            <Button type="submit" className="justify-self-start">
              Create NC
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

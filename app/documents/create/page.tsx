import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateDocumentPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <p className="text-muted-foreground">Control new procedures and revisions.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/documents">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. DOC-PR-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Document title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select id="type" defaultValue="procedure">
                <option value="procedure">Procedure</option>
                <option value="work_instruction">Work Instruction</option>
                <option value="form_template">Form Template</option>
                <option value="policy">Policy</option>
              </Select>
            </div>
            <Button type="submit" className="justify-self-start">
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

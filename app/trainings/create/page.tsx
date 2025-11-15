import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateTrainingPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Training</h1>
          <p className="text-muted-foreground">Define scope and validity.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/trainings">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Training Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Training title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select id="category" defaultValue="HACCP">
                <option value="HACCP">HACCP</option>
                <option value="GMP">GMP</option>
                <option value="Safety">Safety</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validity">Validity (days)</Label>
              <Input id="validity" type="number" />
            </div>
            <Button type="submit" className="justify-self-start">
              Save Training
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

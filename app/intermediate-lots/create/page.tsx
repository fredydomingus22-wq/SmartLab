import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateIntermediateLotPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Intermediate Lot</h1>
          <p className="text-muted-foreground">Register blend tank for traceability.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/intermediate-lots">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lot Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="productionLot">Parent Lot</Label>
              <Input id="productionLot" placeholder="LOT-2024-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tank">Tank</Label>
              <Select id="tank" defaultValue="tank-3">
                <option value="tank-1">Tank 1</option>
                <option value="tank-2">Tank 2</option>
                <option value="tank-3">Tank 3</option>
              </Select>
            </div>
            <Button type="submit" className="justify-self-start">
              Save Intermediate Lot
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

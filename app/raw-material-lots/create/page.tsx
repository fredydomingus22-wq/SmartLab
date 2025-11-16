import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateRawMaterialLotPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receive Raw Material Lot</h1>
          <p className="text-muted-foreground">Capture inbound inspection and quarantine data.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/raw-material-lots">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lot Reception</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rawMaterial">Raw Material</Label>
              <Select id="rawMaterial" defaultValue="">
                <option value="">Select material</option>
                <option value="sugar">Sugar</option>
                <option value="orange">Orange Concentrate</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select id="supplier" defaultValue="">
                <option value="">Select supplier</option>
                <option value="sweet">Sweet Harvest</option>
                <option value="citrus">Citrus Prime</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lotNumber">Lot Number</Label>
              <Input id="lotNumber" placeholder="e.g. 24-0456" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="temperature">Temperature at Receipt (°C)</Label>
              <Input id="temperature" type="number" step="0.1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" step="0.01" />
            </div>
            <Button type="submit" className="justify-self-start">
              Save Receipt
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

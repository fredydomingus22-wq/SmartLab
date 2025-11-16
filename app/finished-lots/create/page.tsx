import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { DynamicAnalysisForm } from "@/components/forms/dynamic-analysis-form";

export default async function CreateFinishedLotPage() {
  let products: { id: string; name: string; stage?: string | null }[] = [];
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, stage")
      .eq("active", true)
      .order("name");
    products = (data ?? []).filter((product) => product.stage === "final");
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Finished Lot</h1>
          <p className="text-muted-foreground">Link intermediate lots and record release analyses.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/finished-lots">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Finished Lot Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lot">Lot Number</Label>
              <Input id="lot" placeholder="FP-2024-013" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" defaultValue="released">
                <option value="released">Released</option>
                <option value="blocked">Blocked</option>
                <option value="recalled">Recalled</option>
              </Select>
            </div>
            <Button type="button" className="justify-self-start" disabled>
              Persist Lot (wire to Supabase)
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Analysis Capture</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicAnalysisForm mode="finished" products={products} />
        </CardContent>
      </Card>
    </div>
  );
}

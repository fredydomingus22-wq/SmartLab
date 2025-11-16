import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimpleTable } from "@/components/tables/simple-table";
import { createSupabaseServerClient } from "@/lib/supabase";

interface ParameterRow {
  id: string;
  name: string;
  unit: string;
  input_type: string;
}

export default async function ParametersPage() {
  let parameters: ParameterRow[] = [];
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("parameters")
      .select("id, name, unit, input_type")
      .order("name");

    if (error) {
      console.error(error.message);
    } else if (data) {
      parameters = data;
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Parameters</h1>
          <p className="text-muted-foreground">
            Configure the metrics the lab team needs to capture.
          </p>
        </div>
        <Button asChild>
          <Link href="/parameters/create">New Parameter</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            data={parameters}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Unit", accessor: "unit" },
              { header: "Input Type", accessor: "input_type" },
            ]}
            emptyMessage="No parameters yet. Create one to begin."
          />
        </CardContent>
      </Card>
    </div>
  );
}

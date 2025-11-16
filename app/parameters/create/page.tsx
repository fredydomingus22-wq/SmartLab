"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ParameterForm, type ParameterFormValues } from "@/components/forms/parameter-form";

export default function CreateParameterPage() {
  const router = useRouter();

  async function handleSubmit(values: ParameterFormValues) {
    await fetch("/api/parameters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    router.push("/parameters");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Parameter</h1>
          <p className="text-muted-foreground">Map lab inputs like Brix, pH or CO₂.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/parameters">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Parameter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ParameterForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}

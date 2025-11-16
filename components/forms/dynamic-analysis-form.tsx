"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface ProductOption {
  id: string;
  name: string;
  stage?: string | null;
}

interface ProductParameterLink {
  id: string;
  parameter_id: string;
  min_value: number | null;
  target_value: number | null;
  max_value: number | null;
  required: boolean;
  parameters?: {
    id: string;
    name: string;
    unit: string;
    input_type: string;
  } | null;
}

interface DynamicAnalysisFormProps {
  mode: "intermediate" | "finished";
  products: ProductOption[];
}

type ParameterValues = Record<string, string | boolean>;

type SubmissionState = "idle" | "saving" | "saved" | "error";

export function DynamicAnalysisForm({ mode, products }: DynamicAnalysisFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [lotNumber, setLotNumber] = useState("");
  const [parameters, setParameters] = useState<ProductParameterLink[]>([]);
  const [values, setValues] = useState<ParameterValues>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  useEffect(() => {
    async function loadParameters(productId: string) {
      if (!productId) {
        setParameters([]);
        setValues({});
        return;
      }
      const response = await fetch(`/api/product-parameters?productId=${productId}`);
      const body = await response.json();
      setParameters(body.data ?? []);
      setValues({});
    }
    loadParameters(selectedProduct);
  }, [selectedProduct]);

  const statusPerParameter = useMemo(() => {
    return parameters.reduce<Record<string, "in" | "out" | "pending">>((acc, link) => {
      const raw = values[link.parameter_id];
      if (raw === undefined || raw === "" || raw === null) {
        acc[link.parameter_id] = "pending";
        return acc;
      }

      const parsedValue = typeof raw === "boolean" ? raw : Number(raw);
      if (typeof raw === "boolean" || Number.isNaN(parsedValue)) {
        acc[link.parameter_id] = "in";
        return acc;
      }

      if (link.min_value !== null && parsedValue < Number(link.min_value)) {
        acc[link.parameter_id] = "out";
        return acc;
      }

      if (link.max_value !== null && parsedValue > Number(link.max_value)) {
        acc[link.parameter_id] = "out";
        return acc;
      }

      acc[link.parameter_id] = "in";
      return acc;
    }, {});
  }, [parameters, values]);

  const overallStatus = useMemo(() => {
    return Object.values(statusPerParameter).some((status) => status === "out")
      ? "out_of_spec"
      : "in_spec";
  }, [statusPerParameter]);

  function updateValue(parameterId: string, value: string | boolean) {
    setValues((previous) => ({ ...previous, [parameterId]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProduct || parameters.length === 0) {
      return;
    }
    setSubmissionState("saving");
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
      return;
    }
    const { data: labTest, error } = await supabase
      .from("lab_tests")
      .insert({
        sample_type: mode,
        product_id: selectedProduct,
        overall_status: overallStatus,
        test_date: new Date().toISOString(),
        comments: lotNumber ? `Lot ${lotNumber}` : "Recorded via SmartLab dynamic form",
      })
      .select("id")
      .single();

    if (error || !labTest) {
      console.error(error?.message);
      setSubmissionState("error");
      return;
    }

    const resultsPayload = parameters.map((link) => {
      const raw = values[link.parameter_id];
      const numericValue = typeof raw === "boolean" ? Number(raw) : Number(raw ?? 0);
      return {
        lab_test_id: labTest.id,
        parameter_id: link.parameter_id,
        measured_value: typeof raw === "boolean" ? Number(raw) : numericValue,
        unit: link.parameters?.unit ?? "",
        spec_min: link.min_value,
        spec_target: link.target_value,
        spec_max: link.max_value,
        status: statusPerParameter[link.parameter_id] === "out" ? "out_of_spec" : "in_spec",
      };
    });

    const { error: resultsError } = await supabase
      .from("lab_test_results")
      .insert(resultsPayload);

    if (resultsError) {
      console.error(resultsError.message);
      setSubmissionState("error");
      return;
    }

    setSubmissionState("saved");
  }

  const buttonLabel = (() => {
    if (submissionState === "saving") return "Saving...";
    if (submissionState === "saved") return "Saved";
    if (submissionState === "error") return "Retry";
    return "Save Analysis";
  })();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="product">Product</Label>
          <Select
            id="product"
            value={selectedProduct}
            onChange={(event) => setSelectedProduct(event.target.value)}
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lot">Lot / Batch Reference</Label>
          <Input
            id="lot"
            value={lotNumber}
            placeholder={mode === "finished" ? "FP-2024-013" : "INT-2024-05"}
            onChange={(event) => setLotNumber(event.target.value)}
          />
        </div>
      </div>
      {parameters.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Select a product to load its required parameters.
        </p>
      ) : (
        <div className="space-y-4">
          {parameters
            .sort((a, b) => a.order_index - b.order_index)
            .map((link) => {
              const currentStatus = statusPerParameter[link.parameter_id] ?? "pending";
              const parameter = link.parameters;
              const colorClass =
                currentStatus === "out"
                  ? "border-destructive text-destructive"
                  : currentStatus === "in"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-input";

              const inputType = parameter?.input_type ?? "number";
              let control: JSX.Element | null = null;

              if (inputType === "boolean") {
                control = (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(values[link.parameter_id])}
                      onChange={(event) => updateValue(link.parameter_id, event.target.checked)}
                    />
                    {parameter?.unit ?? "OK"}
                  </label>
                );
              } else if (inputType === "select") {
                control = (
                  <Select
                    value={(values[link.parameter_id] as string) ?? ""}
                    onChange={(event) => updateValue(link.parameter_id, event.target.value)}
                  >
                    <option value="">Choose...</option>
                    <option value="in_spec">In Control</option>
                    <option value="deviation">Deviation</option>
                    <option value="critical_failure">Critical Failure</option>
                  </Select>
                );
              } else if (inputType === "text") {
                control = (
                  <Input
                    value={(values[link.parameter_id] as string) ?? ""}
                    onChange={(event) => updateValue(link.parameter_id, event.target.value)}
                  />
                );
              } else {
                control = (
                  <Input
                    type="number"
                    step="any"
                    className={colorClass}
                    value={(values[link.parameter_id] as string) ?? ""}
                    onChange={(event) => updateValue(link.parameter_id, event.target.value)}
                  />
                );
              }

              return (
                <div key={link.id} className="rounded-md border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{parameter?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Spec: {link.min_value ?? "—"} / {link.target_value ?? "—"} / {link.max_value ?? "—"} {parameter?.unit}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase ${
                        currentStatus === "out"
                          ? "text-destructive"
                          : currentStatus === "in"
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {currentStatus === "out"
                        ? "Out of Spec"
                        : currentStatus === "in"
                        ? "In Spec"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="mt-3">{control}</div>
                </div>
              );
            })}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Overall status: {overallStatus === "out_of_spec" ? "⚠️ Out of Spec" : "✅ In Spec"}
        </p>
        <Button type="submit" disabled={!selectedProduct || parameters.length === 0 || submissionState === "saving"}>
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}

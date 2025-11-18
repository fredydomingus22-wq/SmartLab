"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(3, "O nome da linha é obrigatório."),
  packagingType: z.enum(["lata", "pet", "vidro"]),
  packagingFormat: z.string().min(2, "O formato é obrigatório."),
});

type ProductionLineFormValues = z.infer<typeof schema>;

export default function CreateProductionLinePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductionLineFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      packagingType: "lata",
    },
  });

  async function onSubmit(values: ProductionLineFormValues) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produção</p>
          <h1 className="text-3xl font-semibold text-white">Nova Linha de Produção</h1>
          <p className="text-slate-400">Cadastre uma nova linha e configure seus tipos de embalagem.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/production-lines">Voltar</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Detalhes da Linha</CardTitle>
            <CardDescription>Forneça um nome e as configurações de embalagem da linha.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Linha</Label>
              <Input id="name" placeholder="Ex: Linha de Enchimento C" {...register("name")} />
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packagingType">Tipo de Embalagem</Label>
                <Select id="packagingType" {...register("packagingType")}>
                  <option value="lata">Lata</option>
                  <option value="pet">PET</option>
                  <option value="vidro">Vidro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingFormat">Formato de Embalagem</Label>
                <Input id="packagingFormat" placeholder="Ex: 500ml, 1L" {...register("packagingFormat")} />
                {errors.packagingFormat && <p className="text-sm text-red-400">{errors.packagingFormat.message}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Linha"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

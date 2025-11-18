import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const specs = [
  {
    id: "SPEC-101",
    product: "Cola Zero 350ml",
    parameter: "Brix",
    unit: "°Bx",
    min: 11.8,
    target: 12.0,
    max: 12.2,
    status: "Atualizado",
  },
  {
    id: "SPEC-102",
    product: "Cola Zero 350ml",
    parameter: "pH",
    unit: "pH",
    min: 3.1,
    target: 3.2,
    max: 3.3,
    status: "Revisar",
  },
  {
    id: "SPEC-118",
    product: "Guaraná 2L",
    parameter: "CO₂",
    unit: "g/L",
    min: 5.8,
    target: 6.0,
    max: 6.3,
    status: "Atualizado",
  },
];

export default function ProductSpecsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Product Specs</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Biblioteca de especificações</h1>
          <p className="text-slate-400">Defina limites mínimos, alvo e máximo por SKU e parâmetro.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/product-specs/create">Nova especificação</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Brix", "CO₂", "pH"].map((parameter) => (
          <Card key={parameter} className="border-slate-900 bg-slate-950/70 p-4">
            <CardHeader className="p-0">
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Parâmetro foco
              </CardDescription>
              <CardTitle className="text-2xl text-white">{parameter}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-slate-400">
              Última revisão há 15 dias
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Especificações cadastradas</CardTitle>
            <CardDescription>Produto · parâmetro · limites</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/product-specs/create">Adicionar</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Max</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell className="font-semibold text-white">{spec.product}</TableCell>
                  <TableCell className="text-slate-300">{spec.parameter}</TableCell>
                  <TableCell className="text-slate-400">{spec.unit}</TableCell>
                  <TableCell>{spec.min}</TableCell>
                  <TableCell>{spec.target}</TableCell>
                  <TableCell>{spec.max}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={spec.status === "Atualizado" ? "success" : "warning"}>{spec.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

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

const rawMaterialLots = [
  {
    codigo: "RML-2024-0915-01",
    material: "Açúcar VHP",
    fornecedor: "Sweet Harvest",
    status: "quarentena",
    data: "2024-09-15",
  },
  {
    codigo: "RML-2024-0915-02",
    material: "CO₂ Alimentício",
    fornecedor: "GásSul",
    status: "liberado",
    data: "2024-09-15",
  },
  {
    codigo: "RML-2024-0915-03",
    material: "Concentrado Guaraná",
    fornecedor: "Citrus Prime",
    status: "bloqueado",
    data: "2024-09-14",
  },
];

const statusMeta = {
  quarentena: { label: "Quarentena", variant: "warning" },
  liberado: { label: "Liberado", variant: "success" },
  bloqueado: { label: "Bloqueado", variant: "danger" },
} as const;

export default function RawMaterialLotsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Matéria-prima</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Lotes de matéria-prima</h1>
          <p className="text-slate-400">Controle as liberações e bloqueios das últimas recepções.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/raw-material-lots/create">Criar Lote</Link>
        </Button>
      </div>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Registro de recebimentos</CardTitle>
          <CardDescription>Atualizado com as últimas inspeções.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawMaterialLots.map((lot) => (
                <TableRow key={lot.codigo}>
                  <TableCell className="font-semibold text-white">{lot.codigo}</TableCell>
                  <TableCell>{lot.material}</TableCell>
                  <TableCell>{lot.fornecedor}</TableCell>
                  <TableCell>
                    <Badge variant={statusMeta[lot.status as keyof typeof statusMeta].variant}>
                      {statusMeta[lot.status as keyof typeof statusMeta].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{lot.data}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/raw-material-lots/${lot.codigo}`}>Ver</Link>
                    </Button>
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

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

const ncList = [
  {
    code: "NC-4826",
    type: "PCC",
    severity: "Crítica",
    status: "Aberta",
    variant: "danger" as const,
  },
  {
    code: "NC-4810",
    type: "Lab",
    severity: "Major",
    status: "Investigando",
    variant: "warning" as const,
  },
  {
    code: "NC-4791",
    type: "Fornecedor",
    severity: "Minor",
    status: "Fechada",
    variant: "success" as const,
  },
];

export default function NonConformitiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">NC & 8D</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registro de não conformidades</h1>
          <p className="text-slate-400">Monitore severidade, origem e status para acelerar 8D.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/nc/create">Criar NC</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Abertas", "Em 8D", "Fechadas"].map((label, index) => (
          <Card key={label} className="border-slate-900 bg-slate-950/70 p-4">
            <CardHeader className="p-0">
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {label}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{[6, 3, 14][index]}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-slate-400">
              Atualizado há 2h
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Fila de NCs</CardTitle>
            <CardDescription>Código · tipo · severidade · status</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/nc/create">Novo registro</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ncList.map((nc) => (
                <TableRow key={nc.code}>
                  <TableCell className="font-semibold text-white">
                    <Link href={`/nc/${nc.code}`}>{nc.code}</Link>
                  </TableCell>
                  <TableCell className="text-slate-300">{nc.type}</TableCell>
                  <TableCell className="text-slate-400">{nc.severity}</TableCell>
                  <TableCell>
                    <Badge variant={nc.variant}>{nc.status}</Badge>
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

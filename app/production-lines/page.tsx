"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const productionLines = [
  { id: "LINE-01", name: "Linha de Enchimento A", status: "operational", product: "Cola Zero 350ml", packaging: "Lata", format: "350ml" },
  { id: "LINE-02", name: "Linha de Enchimento B", status: "stopped", product: "Guaraná 2L", packaging: "PET", format: "2L" },
  { id: "LINE-03", name: "Linha de Xarope", status: "maintenance", product: "Xarope Base", packaging: "N/A", format: "N/A" },
];

const statusMap = {
  operational: { label: "Operacional", variant: "success" as const },
  stopped: { label: "Parada", variant: "warning" as const },
  maintenance: { label: "Manutenção", variant: "danger" as const },
};

export default function ProductionLinesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produção</p>
          <h1 className="text-3xl font-semibold text-white">Linhas de Produção</h1>
          <p className="text-slate-400">Monitore o status e o produto de cada linha em tempo real.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/production-lines/create">Nova Linha</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Status das Linhas</CardTitle>
          <CardDescription>Visão geral de todas as linhas de produção cadastradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Linha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produto Atual</TableHead>
                <TableHead>Embalagem</TableHead>
                <TableHead>Formato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-semibold text-white">{line.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[line.status as keyof typeof statusMap].variant}>
                      {statusMap[line.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{line.product}</TableCell>
                  <TableCell>{line.packaging}</TableCell>
                  <TableCell>{line.format}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

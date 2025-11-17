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

const suppliers = [
  {
    id: "SUP-401",
    name: "Sweet Harvest",
    category: "Açúcares",
    risk: "medium",
    status: "Aprovado",
    contact: "qa@sweetharvest.com",
  },
  {
    id: "SUP-215",
    name: "Citrus Prime",
    category: "Aromas",
    risk: "low",
    status: "Aprovado",
    contact: "qualidade@citrusprime.com",
  },
  {
    id: "SUP-511",
    name: "GasTech",
    category: "CO₂",
    risk: "high",
    status: "Quarentena",
    contact: "support@gastech.com",
  },
  {
    id: "SUP-109",
    name: "PackPro",
    category: "Embalagens",
    risk: "medium",
    status: "Auditoria pendente",
    contact: "auditoria@packpro.com",
  },
];

const riskVariant: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export default function SuppliersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fornecedores</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Base qualificada de parceiros</h1>
          <p className="text-slate-400">Rastreie categoria, risco e status de homologação.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/suppliers/create">Criar fornecedor</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Homologados", value: "42", helper: "+3 este mês" },
          { label: "Auditorias agendadas", value: "5", helper: "Próx. 14 dias" },
          { label: "Risco alto", value: "2", helper: "Monitorar COA" },
        ].map((item) => (
          <Card key={item.label} className="border-slate-900 bg-slate-950/70 p-4">
            <CardHeader className="p-0">
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {item.label}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{item.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-slate-400">{item.helper}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Fornecedores monitorados</CardTitle>
            <CardDescription>Nome · categoria · risco · contacto</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/suppliers/create">Novo cadastro</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-semibold text-white">{supplier.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-white">{supplier.name}</p>
                    <Badge variant={riskVariant[supplier.risk] || "warning"} className="mt-1">
                      Risco {supplier.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">{supplier.category}</TableCell>
                  <TableCell className="text-slate-400">{supplier.contact}</TableCell>
                  <TableCell className="text-right text-slate-300">{supplier.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

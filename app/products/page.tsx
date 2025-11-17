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

const catalog = [
  {
    id: "PRD-001",
    name: "Cola Zero 350ml",
    category: "Produto final",
    sku: "CZ-350",
    package: "Lata 350ml",
    status: "Ativo",
  },
  {
    id: "PRD-017",
    name: "Guaraná Xarope",
    category: "Intermediário",
    sku: "GX-INT",
    package: "Tanque 10kL",
    status: "Em revisão",
  },
  {
    id: "PRD-024",
    name: "Chá Pêssego 1L",
    category: "Produto final",
    sku: "CP-1L",
    package: "PET 1L",
    status: "Ativo",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catálogo SmartLab</h1>
          <p className="text-slate-400">Mantenha SKUs finais e intermediários sincronizados com qualidade.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/products/create">Criar produto</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Produto final", "Intermediário", "RM vinculada"].map((item) => (
          <Card key={item} className="border-slate-900 bg-slate-950/70 p-4">
            <CardHeader className="p-0">
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {item}
              </CardDescription>
              <CardTitle className="text-2xl text-white">{item === "Produto final" ? "34 SKUs" : item === "Intermediário" ? "12 receitas" : "28 RM"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-slate-400">
              Atualizado em 05/09
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Produtos cadastrados</CardTitle>
            <CardDescription>Nome · categoria · SKU · embalagem</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products/create">Adicionar</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Embalagem</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-semibold text-white">{product.id}</TableCell>
                  <TableCell className="text-slate-200">{product.name}</TableCell>
                  <TableCell className="text-slate-400">{product.category}</TableCell>
                  <TableCell className="text-slate-400">{product.sku}</TableCell>
                  <TableCell className="text-slate-400">{product.package}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.status === "Ativo" ? "success" : "warning"}>{product.status}</Badge>
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

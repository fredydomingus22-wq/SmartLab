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

const documents = [
  {
    codigo: "DOC-PR-001",
    nome: "Procedimento de Pasteurização",
    tipo: "Procedimento",
    data: "2024-08-30",
    status: "effective",
  },
  {
    codigo: "DOC-WI-010",
    nome: "WI Coleta de Brix",
    tipo: "Instrução de Trabalho",
    data: "2024-08-12",
    status: "review",
  },
  {
    codigo: "DOC-FM-220",
    nome: "Formulário PCC Carbonatação",
    tipo: "Formulário",
    data: "2024-09-01",
    status: "draft",
  },
];

const statusMap = {
  effective: { label: "Vigente", variant: "success" },
  review: { label: "Revisão", variant: "warning" },
  draft: { label: "Rascunho", variant: "neutral" },
} as const;

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Documentação</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Repositório SmartLab</h1>
          <p className="text-slate-400">Centralize políticas, procedimentos e formulários controlados.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/documents/create">Upload</Link>
        </Button>
      </div>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>Todos os arquivos são auditáveis e versionados.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.codigo}>
                  <TableCell className="font-semibold text-white">{document.codigo}</TableCell>
                  <TableCell>{document.nome}</TableCell>
                  <TableCell>{document.tipo}</TableCell>
                  <TableCell>{document.data}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[document.status as keyof typeof statusMap].variant}>
                      {statusMap[document.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/documents/${document.codigo}`}>Abrir</Link>
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

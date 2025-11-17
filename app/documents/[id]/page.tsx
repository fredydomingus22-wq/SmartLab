import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const documents = {
  "DOC-PR-001": {
    codigo: "DOC-PR-001",
    nome: "Procedimento de Pasteurização",
    tipo: "Procedimento",
    categoria: "Food Safety",
    status: "effective",
    owner: "QA Manager",
    ultimaRevisao: "2024-08-30",
  },
  "DOC-WI-010": {
    codigo: "DOC-WI-010",
    nome: "WI Coleta de Brix",
    tipo: "Instrução de Trabalho",
    categoria: "Laboratório",
    status: "review",
    owner: "Tech Lead",
    ultimaRevisao: "2024-08-12",
  },
} as const;

const statusMeta = {
  effective: { label: "Vigente", variant: "success" },
  review: { label: "Revisão", variant: "warning" },
  draft: { label: "Rascunho", variant: "neutral" },
} as const;

interface DocumentPageProps {
  params: { id: string };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const document = documents[params.id as keyof typeof documents];

  if (!document) {
    notFound();
  }

  const status = statusMeta[document.status as keyof typeof statusMeta];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Documentação</p>
        <h1 className="text-3xl font-semibold text-white">{document.nome}</h1>
        <p className="text-slate-400">Código {document.codigo} • Categoria {document.categoria}</p>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Metadados</CardTitle>
            <CardDescription>Resumo de controle e última revisão.</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tipo</p>
            <p className="text-base text-white">{document.tipo}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Categoria</p>
            <p className="text-base text-white">{document.categoria}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Responsável</p>
            <p className="text-base text-white">{document.owner}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Última revisão</p>
            <p className="text-base text-white">{document.ultimaRevisao}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Visualização estática do arquivo (mock).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-slate-500">
            Pré-visualização do documento {document.codigo}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Ações</CardTitle>
          <CardDescription>Operações disponíveis somente na UI.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="primary" asChild>
            <Link href="#">Download</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="#">Substituir arquivo</Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href="#">Excluir</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

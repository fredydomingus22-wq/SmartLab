"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EightDLandingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Qualidade</p>
          <h1 className="text-3xl font-semibold text-white">Relatórios 8D</h1>
          <p className="text-slate-400">Página em construção.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/nc">Voltar para NCs</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Funcionalidade Futura</CardTitle>
          <CardDescription>Esta página irá listar todos os relatórios 8D em andamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            A implementação completa está sendo rastreada e será disponibilizada em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

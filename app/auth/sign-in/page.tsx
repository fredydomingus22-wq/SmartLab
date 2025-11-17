import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 shadow-[0_0_120px_rgba(15,23,42,0.8)]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden>
        <div className="absolute inset-y-0 left-1/4 h-64 w-64 rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="absolute inset-y-0 right-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SmartLab • Access Control</p>
          <div>
            <h1 className="text-4xl font-semibold text-white">Entrar no console industrial</h1>
            <p className="mt-3 text-lg text-slate-300">
              Controle qualidade, laboratório e food safety em uma única superfície operacional. Autentique-se para continuar.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-900/80 bg-slate-950/60 p-6">
            <p className="text-sm text-slate-400">
              Precisa testar cenários de permissão? Utilize o link abaixo para visualizar o fluxo de acesso negado.
            </p>
            <Link
              href="/auth/forbidden"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
            >
              Simular página de acesso negado →
            </Link>
          </div>
        </div>
        <Card className="border-slate-900/80 bg-slate-950/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Sign in</CardTitle>
            <CardDescription className="text-slate-400">
              Informe suas credenciais corporativas para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="qa.manager@smartlab.io"
                  className="bg-slate-950/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-950/40"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

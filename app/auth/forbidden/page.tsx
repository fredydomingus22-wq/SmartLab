import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Não tem permissões para executar esta ação. Por favor, contacte o seu administrador.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Voltar ao Dashboard</Link>
      </Button>
    </div>
  );
}

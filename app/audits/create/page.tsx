import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function CreateAuditPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agendar Auditoria</h1>
          <p className="text-muted-foreground">Defina o escopo e atribua o auditor.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/audits">Voltar</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Auditoria</Label>
              <Select id="type" defaultValue="internal">
                <option value="internal">Interna</option>
                <option value="external">Externa</option>
                <option value="customer">Cliente</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="standard">Norma</Label>
              <Input id="standard" placeholder="ex: FSSC 22000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auditor">Auditor</Label>
              <Input id="auditor" placeholder="Auditor responsável" />
            </div>
            <Button type="submit" className="justify-self-start">
              Agendar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

export default function ReportGeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Gerador de Relatórios
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Crie relatórios de marketing personalizados com base nos dados dos seus clientes.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Novo Relatório</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para gerar um novo relatório.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="client-name">Nome do Cliente</Label>
                    <Input id="client-name" placeholder="Ex: Empresa Alpha" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="report-period">Período do Relatório</Label>
                    <Input id="report-period" placeholder="Ex: 01/01/2024 - 31/01/2024" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="report-goals">Objetivos Principais</Label>
                <Textarea
                    id="report-goals"
                    placeholder="Descreva os principais objetivos que este relatório deve analisar. Ex: Análise de crescimento de seguidores, engajamento nas publicações, etc."
                    className="min-h-[100px]"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="additional-info">Informações Adicionais</Label>
                <Textarea
                    id="additional-info"
                    placeholder="Inclua quaisquer outros dados ou contexto relevante que a IA deve considerar ao gerar o relatório."
                    className="min-h-[100px]"
                />
              </div>
               <div className="flex justify-end">
                <Button type="submit" size="lg">
                  <FileText className="mr-2 h-5 w-5" />
                  Gerar Relatório com IA
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

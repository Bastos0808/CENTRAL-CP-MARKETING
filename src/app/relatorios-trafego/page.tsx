
"use client";

import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert } from "lucide-react";

export default function ReportGeneratorPage() {

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Gerador de Relatórios de Tráfego Pago
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Esta seção está recebendo uma grande atualização para se tornar ainda mais poderosa.
          </p>
        </header>
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="items-center text-center">
                    <ShieldAlert className="h-16 w-16 text-primary mb-4" />
                    <CardTitle className="text-2xl">Em Manutenção</CardTitle>
                    <CardDescription className="text-base">
                        Estamos aprimorando esta ferramenta para oferecer uma análise de dados ainda mais inteligente.
                        <br />
                        Volte em breve para conferir as novidades!
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
      </div>
    </main>
  );
}

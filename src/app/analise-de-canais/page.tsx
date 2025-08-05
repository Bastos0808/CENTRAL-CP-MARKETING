
"use client";

import { BackButton } from '@/components/ui/back-button';
import ChannelStrategyAnalyzer from '@/components/channel-strategy-analyzer';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnaliseDeCanaisPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-lg text-center">
                 <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                        Diagnóstico de Canais
                    </h1>
                </header>
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-3 text-yellow-600 dark:text-yellow-400">
                            <ShieldAlert className="h-8 w-8" />
                            Em Manutenção
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-yellow-700/80 dark:text-yellow-500/80">
                            Esta ferramenta está passando por atualizações e está disponível apenas para administradores no momento.
                        </p>
                    </CardContent>
                </Card>
                 <div className="mt-8">
                    <BackButton />
                </div>
            </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Diagnóstico Estratégico de Canais
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Use este framework guiado para analisar os canais de um prospect e gerar insights com IA.
          </p>
        </header>
        <div className="max-w-6xl mx-auto">
          <ChannelStrategyAnalyzer />
        </div>
      </div>
    </main>
  );
}

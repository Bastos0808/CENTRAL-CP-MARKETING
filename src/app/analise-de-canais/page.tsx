
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


import { BackButton } from '@/components/ui/back-button';
import ChannelStrategyAnalyzer from '@/components/channel-strategy-analyzer';

export default function AnaliseDeCanaisPage() {
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


import { BackButton } from '@/components/ui/back-button';
import ChannelAnalyzer from '@/components/channel-analyzer';

export default function AnaliseDeCanaisPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Análise de Canais com IA
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Insira a URL de um canal (Instagram, Site, etc.) para obter uma análise estratégica.
          </p>
        </header>
        <div className="max-w-6xl mx-auto">
          <ChannelAnalyzer />
        </div>
      </div>
    </main>
  );
}

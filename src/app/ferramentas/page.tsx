
import { BackButton } from '@/components/ui/back-button';
import SdrAiTool from '@/components/sdr-ai-tool';

export default function FerramentasPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Ferramentas de IA
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Recursos inteligentes para potencializar sua prospecção.
          </p>
        </header>
        <div className="max-w-6xl mx-auto">
          <SdrAiTool />
        </div>
      </div>
    </main>
  );
}

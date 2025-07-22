
import ContentPlanner from '@/components/content-planner';

export default function PlannerPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Planner de Conteúdo
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecione um cliente para visualizar, adicionar e organizar as publicações.
          </p>
        </header>

        <ContentPlanner />

      </div>
    </main>
  );
}

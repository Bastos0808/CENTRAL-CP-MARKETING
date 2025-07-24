

import { BackButton } from '@/components/ui/back-button';
import PodcastManager from '@/components/podcast-manager';

export default function PodcastPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Gerenciamento de Podcast
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Gerencie clientes, saldos de gravações e agende os próximos episódios.
          </p>
        </header>

        <PodcastManager />

      </div>
    </main>
  );
}

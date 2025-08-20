
"use client";

import { BackButton } from '@/components/ui/back-button';
import PresentationGenerator from '@/components/presentation-generator';


export default function GeradorApresentacoesPage() {

  return (
      <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
        <div className="w-full">
          <BackButton />
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Gerador de Apresentações e Propostas
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Crie propostas e apresentações de projeto com base em um diagnóstico inicial.
            </p>
          </header>
          <div className="mx-auto w-full max-w-7xl">
            <PresentationGenerator />
          </div>
        </div>
      </main>
    );
}


"use client";

import { BackButton } from '@/components/ui/back-button';
import ProposalGeneratorV2 from '@/components/proposal-generator-v2';

export default function GeradorPropostasPage() {

  return (
      <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
        <div className="w-full">
          <BackButton />
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Gerador de Propostas
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Crie propostas comerciais modernas e personalizadas para seus clientes.
            </p>
          </header>
          <div className="mx-auto w-full max-w-4xl">
            <ProposalGeneratorV2 />
          </div>
        </div>
      </main>
    );
}

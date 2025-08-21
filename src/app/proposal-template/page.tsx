
"use client";

import { BackButton } from "@/components/ui/back-button";

export default function ProposalTemplatePage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <BackButton />
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Template de Proposta
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Esta página foi usada para testes e seu conteúdo foi movido para o Gerador de Apresentações.
          </p>
        </header>
      </div>
    </main>
  );
}

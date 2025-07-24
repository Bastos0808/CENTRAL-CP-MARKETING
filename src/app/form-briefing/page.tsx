
import { BackButton } from '@/components/ui/back-button';
import BriefingForm from '@/components/briefing-form';

export default function FormBriefingPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Briefing CP Marketing Digital
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecione um cliente para preencher ou atualizar o formulário de briefing.
          </p>
        </header>
        <div className="max-w-4xl mx-auto">
          <BriefingForm />
        </div>
      </div>
    </main>
  );
}

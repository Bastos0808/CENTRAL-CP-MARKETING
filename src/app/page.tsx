import BriefingForm from '@/components/briefing-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Briefing CP Marketing Digital
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Preencha o formulário abaixo para que possamos entender suas necessidades e iniciar o projeto.
          </p>
        </header>
        <BriefingForm />
      </div>
    </main>
  );
}

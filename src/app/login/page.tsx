import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            CP Marketing
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Acesse sua conta para continuar.
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}

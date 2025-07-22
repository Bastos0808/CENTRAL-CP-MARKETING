import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Bem-vindo à Intranet da CP Marketing
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Acesse as ferramentas e recursos internos abaixo.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Briefing</CardTitle>
            <CardDescription>Crie um novo briefing de projeto para clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/form-briefing" passHref>
              <Button className="w-full">
                Acessar Formulário
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Bem-vindo à Central Mödus
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
              <Button className="w-full" variant="outline">
                Acessar Formulário
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Base de Dados de Clientes</CardTitle>
            <CardDescription>Visualize e gerencie todos os clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/client-database" passHref>
              <Button className="w-full" variant="outline">
                Acessar Base de Dados
                <Database className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Relatórios</CardTitle>
            <CardDescription>Crie relatórios de desempenho personalizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/report-generator" passHref>
              <Button className="w-full" variant="outline">
                Gerar Relatório
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

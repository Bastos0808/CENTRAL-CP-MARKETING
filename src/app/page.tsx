
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, CalendarCheck, Mic } from 'lucide-react';
import MindMap from '@/components/mind-map';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Bem-vindo à Central Mödus
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Navegue pelo ecossistema Mödus e acesse as ferramentas abaixo.
        </p>
      </div>

      <div className="w-full max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Base de Dados de Clientes</CardTitle>
            <CardDescription>Adicione novos clientes e gerencie seus dossiês.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/base-de-dados" passHref>
              <Button className="w-full" variant="outline">
                Acessar Base de Dados
                <Database className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Briefing</CardTitle>
            <CardDescription>Preencha os briefings de clientes pendentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/form-briefing" passHref>
              <Button className="w-full" variant="outline">
                Preencher Briefing
                <ArrowRight className="ml-2 h-4 w-4" />
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
            <Link href="/relatorios" passHref>
              <Button className="w-full" variant="outline">
                Gerar Relatório
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full max-w-6xl grid gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Planner de Conteúdo</CardTitle>
            <CardDescription>Planeje e organize as publicações dos seus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/planner" passHref>
              <Button className="w-full" variant="outline">
                Acessar Planner
                <CalendarCheck className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Podcast</CardTitle>
            <CardDescription>Gerencie clientes, saldos de gravações e agendamentos de podcasts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/podcast" passHref>
              <Button className="w-full" variant="outline">
                Gerenciar Podcasts
                <Mic className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do CP MÖDUS</CardTitle>
            <CardDescription>O mapa mental estratégico que guia nossas operações.</CardDescription>
          </CardHeader>
          <CardContent>
            <MindMap />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

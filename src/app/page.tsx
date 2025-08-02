
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, LogOut, Users, Wand2, Briefcase, Podcast, Target, Mic, Loader2, Lock, Waypoints, FileSignature, DollarSign, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const commercialTools = [
      {
        title: "Onboarding de SDRs",
        description: "Jornada de integração guiada para novos vendedores.",
        href: "/onboarding",
        icon: Users
      },
      {
        title: "Ferramentas de IA",
        description: "Recursos para potencializar sua prospecção.",
        href: "/ferramentas",
        icon: Wand2
      },
      {
        title: "Gerador de Propostas",
        description: "Crie propostas comerciais modernas e personalizadas.",
        href: "/gerador-propostas",
        icon: FileSignature
      }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 relative">
      <div className="w-full max-w-6xl text-center mb-12 mt-12 sm:mt-8">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Central da Agência
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
          Recursos e ferramentas para as equipes da CP Marketing Digital.
        </p>
      </div>

      <div className="w-full max-w-5xl space-y-10">
        <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center"><Briefcase className="h-8 w-8 text-primary/80"/> Área Comercial</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {commercialTools.map(tool => (
                    <Card key={tool.title} className="flex flex-col">
                        <CardHeader className="flex-grow">
                            <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <tool.icon className="h-7 w-7" />
                            </div>
                            <CardTitle>{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={tool.href} passHref>
                            <Button className="w-full">
                                Acessar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center"><Target className="h-8 w-8 text-primary/80"/> Área de Estratégia</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="flex flex-col opacity-50 cursor-not-allowed">
                    <CardHeader className="flex-grow">
                        <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <Database className="h-7 w-7" />
                        </div>
                        <CardTitle>Base de Dados de Clientes</CardTitle>
                        <CardDescription>Acesse o dossiê completo de todos os clientes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" disabled>
                            Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col opacity-50 cursor-not-allowed">
                    <CardHeader className="flex-grow">
                        <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <FileText className="h-7 w-7" />
                        </div>
                        <CardTitle>Gerador de Relatórios</CardTitle>
                        <CardDescription>Crie relatórios de desempenho com análise de IA.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" disabled>
                            Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="flex flex-col opacity-50 cursor-not-allowed">
                    <CardHeader className="flex-grow">
                        <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <Waypoints className="h-7 w-7" />
                        </div>
                        <CardTitle>Método CP MÖDUS</CardTitle>
                        <CardDescription>Mapa mental com o framework estratégico da agência.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" disabled>
                            Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
             </div>
        </div>
        
        <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center"><Mic className="h-8 w-8 text-primary/80"/> Área de Podcast</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col opacity-50 cursor-not-allowed">
                    <CardHeader className="flex-grow">
                        <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <Podcast className="h-7 w-7" />
                        </div>
                        <CardTitle>Gerenciamento de Clientes</CardTitle>
                        <CardDescription>Gerencie saldos e agendamentos de gravações.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" disabled>
                            Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col opacity-50 cursor-not-allowed">
                    <CardHeader className="flex-grow">
                        <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <DollarSign className="h-7 w-7" />
                        </div>
                        <CardTitle>Tabela de Valores</CardTitle>
                        <CardDescription>Consulte os preços de gravações e edições.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" disabled>
                            Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </main>
  );
}

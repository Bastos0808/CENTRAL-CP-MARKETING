
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, LogOut, Users, Wand2, Briefcase, Podcast, Target, Mic, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const { user, logout, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<string>('strategy');
  
  const strategicTools = [
      {
        title: "Base de Dados de Clientes",
        description: "Adicione novos clientes e gerencie seus dossiês.",
        href: "/base-de-dados",
        icon: Database
      },
      {
        title: "Formulário de Briefing",
        description: "Preencha os briefings de clientes pendentes.",
        href: "/form-briefing",
        icon: FileText
      },
      {
        title: "Gerador de Relatórios",
        description: "Crie relatórios de desempenho com IA.",
        href: "/relatorios",
        icon: Wand2
      }
  ];
  
  const podcastTools = [
       {
        title: "Gerenciamento de Podcast",
        description: "Gerencie clientes, saldos de gravações e agendamentos.",
        href: "/podcast",
        icon: Mic
      }
  ];
  
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
      }
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const renderTabs = () => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const allTabs = [
        { value: 'strategy', label: 'Estratégia', icon: Briefcase, content: strategicTools },
        { value: 'podcast', label: 'Podcast', icon: Podcast, content: podcastTools },
        { value: 'commercial', label: 'Comercial', icon: Target, content: commercialTools }
    ];

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className={`grid w-full h-auto grid-cols-${allTabs.length}`}>
                {allTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value} className="py-2.5">
                        <tab.icon className="mr-2"/> {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            
            {allTabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="mt-8">
                    <div className={`grid gap-6 md:grid-cols-2 ${tab.content.length === 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}`}>
                        {tab.content.map(tool => (
                            <Card key={tool.title} className={`${tab.content.length === 1 ? 'lg:col-start-2' : ''} flex flex-col`}>
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
                </TabsContent>
            ))}
        </Tabs>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 relative">
      <div className="absolute top-4 right-4">
        {user && (
            <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        )}
      </div>
      
      <div className="w-full max-w-6xl text-center mb-12 mt-12 sm:mt-8">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Bem-vindo à Central Mödus
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
          Navegue pelas abas abaixo para acessar as ferramentas e recursos específicos do seu setor de atuação.
        </p>
      </div>

      <div className="w-full max-w-5xl">
         {renderTabs()}
      </div>
    </main>
  );
}

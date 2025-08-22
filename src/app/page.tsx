
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, LogOut, Users, Wand2, Briefcase, Mic, Target, Loader2, Waypoints, FileSignature, DollarSign, Megaphone, Workflow, Lightbulb, Video, Search, ShieldAlert, Presentation, Dices, TestTube2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function Home() {
  const { user, logout, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<string>('production');
  
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
      },
      {
        title: "Método Modus",
        description: "Explore nosso mapa mental estratégico para guiar as operações.",
        href: "/metodo-modus",
        icon: Waypoints
      }
  ];
  
  const podcastTools = [
       {
        title: "Gerenciamento de Podcast",
        description: "Gerencie clientes, saldos de gravações e agendamentos.",
        href: "/podcast",
        icon: Mic
      },
      {
        title: "Valores por Hora",
        description: "Consulte os valores para gravações de podcast.",
        href: "/valores-podcast",
        icon: DollarSign
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
        title: "Rotina SDR",
        description: "Acompanhe a rotina e as metas de performance do SDR.",
        href: "/rotina-sdr",
        icon: Target
      },
      {
        title: "Gerador de Mensagens",
        description: "Crie mensagens de prospecção com a ajuda da IA.",
        href: "/ferramentas",
        icon: Wand2
      },
      {
        title: "Análise de Canais",
        description: "Obtenha uma análise de pontos fortes e fracos de um canal.",
        href: "/analise-de-canais",
        icon: Search
      },
      {
        title: "Gerador de Apresentações",
        description: "Crie propostas e apresentações de projetos com IA a partir de um diagnóstico.",
        href: "/gerador-apresentacoes",
        icon: Presentation
      },
  ];
  
  const trafficTools = [
  ];
  
  const internalTools = [
     {
        title: "HTML Test Page",
        description: "Espaço de trabalho para construir e testar o template HTML interativo.",
        href: "/html-test",
        icon: TestTube2
      },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const userRole = user?.role;
    const isAdmin = userRole === 'admin';
    const canAccessStrategy = isAdmin || userRole === 'estrategia';
    const canAccessPodcast = isAdmin || userRole === 'podcast';
    const canAccessCommercial = isAdmin || userRole === 'comercial';
    const canAccessTraffic = isAdmin || userRole === 'trafego';
    const canAccessProduction = canAccessStrategy || canAccessPodcast || canAccessTraffic;

    const allTabs = [
        { value: 'production', label: 'Produção', icon: Workflow, enabled: canAccessProduction },
        { value: 'commercial', label: 'Comercial', icon: Target, content: commercialTools, enabled: canAccessCommercial },
        { value: 'internal', label: 'Interno', icon: Dices, content: internalTools, enabled: isAdmin },
    ];

    const enabledTabs = allTabs.filter(tab => tab.enabled);

    // If the active tab is not enabled anymore, switch to the first available one
    if (enabledTabs.length > 0 && !enabledTabs.find(t => t.value === activeTab)) {
        setActiveTab(enabledTabs[0].value);
    }

    const renderTools = (tools: any[]) => (
        <div className={cn("grid gap-6 md:grid-cols-2", tools.length > 2 ? 'lg:grid-cols-3' : `lg:grid-cols-${tools.length}`)}>
            {tools.map(tool => {
              const isDisabled = tool.disabled && !isAdmin;

              return isDisabled ? (
                <TooltipProvider key={tool.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Card className="flex flex-col h-full opacity-50 cursor-not-allowed">
                          <CardHeader className="flex-grow">
                              <div className="bg-muted text-muted-foreground p-3 rounded-full w-fit mb-4">
                                  <tool.icon className="h-7 w-7" />
                              </div>
                              <CardTitle className="text-muted-foreground">{tool.title}</CardTitle>
                              <CardDescription>{tool.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Button className="w-full" disabled>
                                  <ShieldAlert className="mr-2 h-4 w-4" /> Em Breve
                              </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tool.disabledMessage}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
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
              )
            })}
        </div>
    );
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 relative">
             <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
                {user && (
                    <span className="text-sm text-muted-foreground">
                        Olá, {user.displayName || user.email}
                    </span>
                )}
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
            </div>
            <div className="w-full max-w-6xl text-center mb-12 mt-12 sm:mt-8">
                <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                  Central CP Marketing
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                  Recursos e ferramentas para as equipes da CP Marketing Digital.
                </p>
            </div>
            {enabledTabs.length === 0 && !loading ? (
                 <div className="text-center text-muted-foreground mt-10">
                  <p className="text-lg">Você não tem permissão para acessar nenhuma área.</p>
                  <p>Entre em contato com um administrador.</p>
                </div>
            ) : (
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-5xl">
                    <TabsList className={`grid w-full h-auto grid-cols-${enabledTabs.length > 0 ? enabledTabs.length : 1}`}>
                        {enabledTabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value} className="py-2.5">
                                <tab.icon className="mr-2"/> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                     <TabsContent value="production" className="mt-8 space-y-8">
                        {canAccessStrategy && (
                            <section>
                                <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary/80"/> Estratégia</h2>
                                {renderTools(strategicTools)}
                            </section>
                        )}
                        {canAccessPodcast && (
                            <section>
                                 <Separator className="my-8" />
                                <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Video className="h-6 w-6 text-primary/80"/> Podcast</h2>
                                {renderTools(podcastTools)}
                            </section>
                        )}
                        {canAccessTraffic && (
                             <section>
                                <Separator className="my-8" />
                                <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Megaphone className="h-6 w-6 text-primary/80"/> Tráfego Pago</h2>
                                {trafficTools.length > 0 ? renderTools(trafficTools) : (
                                    <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
                                        <p>Nenhuma ferramenta de Tráfego Pago disponível ainda.</p>
                                    </div>
                                )}
                            </section>
                        )}
                     </TabsContent>
                     <TabsContent value="commercial" className="mt-8">
                        {commercialTools.length > 0 ? renderTools(commercialTools) : (
                             <div className="text-center text-muted-foreground p-8">
                                <p>Nenhuma ferramenta disponível para esta área ainda.</p>
                            </div>
                        )}
                     </TabsContent>
                      <TabsContent value="internal" className="mt-8">
                        {internalTools.length > 0 ? renderTools(internalTools) : (
                             <div className="text-center text-muted-foreground p-8">
                                <p>Nenhuma ferramenta interna disponível.</p>
                            </div>
                        )}
                     </TabsContent>
                </Tabs>
            )}
        </main>
    );
}

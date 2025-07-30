
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, LogOut, Users, Wand2, Briefcase, Podcast, Target, Mic } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado e será redirecionado.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao tentar desconectar. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 relative">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
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
         <Tabs defaultValue="strategy" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
                <TabsTrigger value="strategy" className="py-2.5"><Briefcase className="mr-2"/> Estratégia</TabsTrigger>
                <TabsTrigger value="podcast" className="py-2.5"><Podcast className="mr-2"/> Podcast</TabsTrigger>
                <TabsTrigger value="commercial" className="py-2.5"><Target className="mr-2"/> Comercial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategy" className="mt-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {strategicTools.map(tool => (
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
            </TabsContent>
            
            <TabsContent value="podcast" className="mt-8">
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center">
                    {podcastTools.map(tool => (
                        <Card key={tool.title} className="lg:col-start-2 flex flex-col">
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

            <TabsContent value="commercial" className="mt-8">
                 <div className="grid gap-6 md:grid-cols-2">
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
            </TabsContent>
        </Tabs>
      </div>

    </main>
  );
}


"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, Users, Wand2, Briefcase, Podcast, Target, Mic, Loader2, Lock, Waypoints, FileSignature, DollarSign, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  
  const UNLOCK_PASSWORD = "1201";

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
  
  const strategyTools = [
      {
        title: "Base de Dados de Clientes",
        description: "Acesse o dossiê completo de todos os clientes.",
        href: "/base-de-dados",
        icon: Database
      },
      {
        title: "Gerador de Relatórios",
        description: "Crie relatórios de desempenho com análise de IA.",
        href: "/relatorios",
        icon: FileText
      },
      {
        title: "Formulário de Briefing",
        description: "Preencha e edite os briefings dos clientes.",
        href: "/form-briefing",
        icon: Mail
      },
       {
        title: "Método CP MÖDUS",
        description: "Mapa mental com o framework estratégico da agência.",
        href: "/metodo-modus",
        icon: Waypoints
      },
  ];

  const podcastTools = [
       {
        title: "Gerenciamento de Clientes",
        description: "Gerencie saldos e agendamentos de gravações.",
        href: "/podcast",
        icon: Podcast
      },
      {
        title: "Tabela de Valores",
        description: "Consulte os preços de gravações e edições.",
        href: "/valores-podcast",
        icon: DollarSign
      },
  ];

  const handleUnlockAttempt = () => {
    if (password === UNLOCK_PASSWORD) {
      setIsUnlocked(true);
      setIsDialogOpen(false);
      setPassword('');
      toast({
        title: "Acesso Liberado!",
        description: "As áreas de Estratégia e Podcast foram desbloqueadas.",
      });
    } else {
      toast({
        title: "Senha Incorreta",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const renderCard = (tool: { title: string; description: string; href: string; icon: React.ElementType }, locked: boolean) => {
    const CardContentWrapper = ({ children }: { children: React.ReactNode }) => 
        locked ? <div onClick={() => setIsDialogOpen(true)} className="h-full flex flex-col">{children}</div> 
               : <Link href={tool.href} className="h-full flex flex-col">{children}</Link>;

    return (
        <Card 
            key={tool.title} 
            className={cn(
              "flex flex-col transition-all duration-200 ease-in-out", 
              locked ? "cursor-pointer opacity-60 hover:opacity-100 hover:border-primary/50" : "hover:border-primary",
              "group"
            )}
        >
            <CardContentWrapper>
                <CardHeader className="flex-grow">
                    <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <tool.icon className="h-7 w-7" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={cn("w-full h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium", locked ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground")}>
                        {locked ? <Lock className="mr-2 h-4 w-4" /> : 'Acessar'}
                        {!locked && <ArrowRight className="ml-2 h-4 w-4" />}
                    </div>
                </CardContent>
            </CardContentWrapper>
        </Card>
    );
  };

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
                {commercialTools.map(tool => renderCard(tool, false))}
            </div>
        </div>

        <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center"><Target className="h-8 w-8 text-primary/80"/> Área de Estratégia</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {strategyTools.map(tool => renderCard(tool, !isUnlocked))}
             </div>
        </div>
        
        <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 justify-center"><Mic className="h-8 w-8 text-primary/80"/> Área de Podcast</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {podcastTools.map(tool => renderCard(tool, !isUnlocked))}
            </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Acesso Restrito</DialogTitle>
                  <DialogDescription>
                      Para acessar esta área, por favor, insira a senha.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password-input" className="text-right">
                          Senha
                      </Label>
                      <Input
                          id="password-input"
                          type="password"
                          className="col-span-3"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
                      />
                  </div>
              </div>
              <DialogFooter>
                  <Button onClick={handleUnlockAttempt}>Desbloquear</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </main>
  );
}

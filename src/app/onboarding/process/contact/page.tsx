
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, CheckSquare, Wand2, Lightbulb, Video, FileText, ArrowRight, Mic, Users, Target, Clock, MessageSquare, Handshake } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useOnboarding } from "../../layout";

const principles = [
    { 
        icon: Target,
        title: "O Objetivo Principal",
        text: "Sua meta NUNCA é vender na primeira mensagem. É validar a dor do prospect para agendar uma reunião de diagnóstico com o time de Closers." 
    },
    { 
        icon: Wand2,
        title: "Personalização é a Chave",
        text: "Use o 'gancho' que você identificou na Fase 1 para iniciar a conversa e provar que fez a lição de casa. Isso quebra a barreira do contato frio." 
    },
    { 
        icon: Clock,
        title: "Breve e Direto",
        text: "Respeite o tempo do prospect. Apresente-se, mencione o 'gancho', conecte com a dor observada e faça uma pergunta direta." 
    },
    { 
        icon: MessageSquare,
        title: "Adapte o Script",
        text: "Use os modelos de abordagem como inspiração, mas sempre adapte com sua personalidade e com as informações que você pesquisou." 
    },
    { 
        icon: Handshake,
        title: "Foco no Agendamento",
        text: "Se o lead demonstrar o mínimo de interesse, sua única meta é levá-lo para a Fase 3 (Agendamento). Não tente explicar a solução inteira." 
    },
];

export default function ContactPage() {
    const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // This is a detail page, so we mark it as completed on load to allow navigation.
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Phone className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 2: Contato Direto</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Este é o momento da verdade. Com a pesquisa feita, você tem os contatos do prospect e um motivo relevante para iniciar a conversa. A qualidade da sua abordagem definirá o sucesso.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Princípios da Abordagem de Sucesso</CardTitle>
            <CardDescription>Estes são os fundamentos inegociáveis para qualquer contato que você fizer. Internalize-os.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {principles.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><Lightbulb /> Isca de Leads: A Consultoria Estratégica Gratuita</CardTitle>
            <CardDescription>Esta é nossa principal ferramenta para qualificar e gerar valor. Oferecer um diagnóstico gratuito é a melhor forma de quebrar o gelo e mostrar autoridade.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-orange-500" /> 1. Formulário de Qualificação</h3>
                    <p className="text-sm text-muted-foreground">Quando um lead mostra interesse inicial, o primeiro passo é enviar um link para nosso formulário de qualificação. Ele é curto e direto, desenhado para coletar as informações que precisamos para saber se ele se encaixa em nosso ICP.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Phone className="h-5 w-5 text-green-500" /> 2. Consulta Personalizada (Qualificados)</h3>
                    <p className="text-sm text-muted-foreground">Se as respostas do formulário mostrarem que o lead está <strong>100% alinhado ao nosso ICP</strong>, sua missão é agendar uma chamada de consultoria ao vivo, que será conduzida por um de nossos Closers.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Video className="h-5 w-5 text-yellow-500" /> 3. Consulta Gravada (Não Qualificados)</h3>
                    <p className="text-sm text-muted-foreground">Se o formulário mostrar que o lead <strong>não se encaixa no ICP</strong>, agradeça e explique que ele não se qualifica para a consultoria ao vivo, mas que, como agradecimento, preparamos uma consultoria gravada com dicas práticas.</p>
                </div>
            </div>
            <div className="pt-4 mt-2 border-t border-dashed">
                <h4 className="font-semibold text-sm text-foreground mb-2">Gancho de Venda:</h4>
                <p className="text-sm text-muted-foreground">"Olá [Nome], vi [Problema Observado]. Notei que muitas empresas como a sua enfrentam [Dor Conectada]. Para te ajudar, oferecemos uma consultoria estratégica gratuita. Para garantir que ela seja 100% personalizada para você, poderia preencher este rápido formulário de qualificação? Leva 2 minutos."</p>
            </div>
        </CardContent>
      </Card>
      
       <Card className="bg-purple-600/10 border-purple-600/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-400"><Mic /> Isca de Alto Valor: O Episódio de Podcast Gratuito</CardTitle>
            <CardDescription>Para leads com altíssimo potencial e que se encaixam perfeitamente no nosso perfil de cliente para podcast, temos uma oferta irresistível: a gravação de um episódio piloto completo.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="pt-4 border-t border-dashed">
                <h4 className="font-semibold text-sm text-foreground mb-2">Gancho de Venda:</h4>
                <p className="text-sm text-muted-foreground">"Olá [Nome], vi que você é uma referência no setor de [Setor] e compartilha conteúdos muito ricos. Acreditamos que seu conhecimento tem um potencial incrível para um podcast. Para que você veja o poder disso na prática, estamos oferecendo a especialistas como você a oportunidade de gravar um episódio piloto completo em nosso estúdio profissional, sem custo algum. Você só precisa vir com seu conteúdo, nós cuidamos de toda a técnica. O que acha da ideia?"</p>
            </div>
        </CardContent>
      </Card>

       <Link href="/onboarding/process/templates" className="group block">
            <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Wand2 className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Playbook de Comunicação</CardTitle>
                            <CardDescription>Acesse todos os modelos de mensagem, scripts de ligação e como lidar com objeções.</CardDescription>
                        </div>
                    </div>
                     <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                </CardHeader>
            </Card>
        </Link>
    </div>
  );
}

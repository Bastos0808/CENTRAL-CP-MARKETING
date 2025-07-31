
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, CheckSquare, Wand2, Lightbulb, Video, FileText, ArrowRight, Mic } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useOnboarding } from "../../layout";


const checklist = [
    { text: "O objetivo NUNCA é vender na primeira mensagem. O objetivo é validar a dor e agendar uma reunião de diagnóstico." },
    { text: "Use o 'gancho' que você identificou na Fase 1 para iniciar a conversa de forma personalizada e mostrar que fez a lição de casa." },
    { text: "Seja breve e direto. Apresente-se, mencione o 'gancho' e conecte com a dor observada." },
    { text: "Use os modelos de abordagem como base, mas sempre adapte com sua própria personalidade e com as informações do prospect." },
    { text: "Se o lead demonstrar interesse, a única meta é levá-lo para a Fase 3: Agendamento. Não tente explicar a solução ou dar muitos detalhes." },
];

export default function ContactPage() {
    const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // This is a detail page, so we mark it as completed on load to allow navigation.
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-6">
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
            <CardTitle>Checklist da Abordagem</CardTitle>
        </CardHeader>
        <CardContent>
             <ul className="space-y-4">
                {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item.text}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><Lightbulb /> Isca de Leads: A Consultoria Estratégica Gratuita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">
                Esta é nossa principal ferramenta para qualificar e gerar valor. Oferecer um diagnóstico gratuito é a melhor forma de quebrar o gelo, mostrar autoridade e conseguir a atenção do lead. O processo é desenhado para filtrar os leads certos para o time de vendas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-orange-500" /> 1. Formulário de Qualificação</h3>
                    <p className="text-sm text-muted-foreground">Quando um lead mostra interesse inicial, o primeiro passo é enviar um link para nosso formulário de qualificação. Ele é curto e direto, desenhado para coletar as informações que precisamos para saber se ele se encaixa em nosso ICP.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Phone className="h-5 w-5 text-green-500" /> 2. Consulta Personalizada (Leads Qualificados)</h3>
                    <p className="text-sm text-muted-foreground">Se as respostas do formulário mostrarem que o lead está <strong>100% alinhado ao nosso ICP</strong>, sua missão é agendar uma chamada de consultoria ao vivo. Esta chamada será conduzida por um de nossos Closers e é a porta de entrada para o fechamento.</p>
                </div>
                 <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Video className="h-5 w-5 text-yellow-500" /> 3. Consulta Gravada (Leads Não Qualificados)</h3>
                    <p className="text-sm text-muted-foreground">Se o formulário mostrar que o lead <strong>não se encaixa no ICP</strong> (ou não está no momento de compra), nós não o descartamos. Você enviará uma mensagem educada agradecendo e explicando que, no momento, ele não se qualifica para a consultoria personalizada, mas que, como agradecimento, preparamos uma consultoria gravada com dicas práticas. Isso nutre o lead e mantém a porta aberta para o futuro.</p>
                </div>
            </div>
            <div className="pt-4 border-t border-dashed">
                <h4 className="font-semibold text-sm text-foreground mb-2">Gancho de Venda:</h4>
                <p className="text-sm text-muted-foreground">"Olá [Nome], vi [Problema Observado]. Notei que muitas empresas como a sua enfrentam [Dor Conectada]. Para te ajudar, oferecemos uma consultoria estratégica gratuita. Para garantir que ela seja 100% personalizada para você, poderia preencher este rápido formulário de qualificação? Leva 2 minutos."</p>
            </div>
        </CardContent>
      </Card>
      
       <Card className="bg-purple-600/10 border-purple-600/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-400"><Mic /> Isca de Alto Valor: O Episódio de Podcast Gratuito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">
                Para leads com altíssimo potencial e que se encaixam perfeitamente no nosso perfil de cliente para podcast (especialistas, empresários com conhecimento para compartilhar), temos uma oferta irresistível: a gravação de um episódio piloto completo, em nosso estúdio, de forma 100% gratuita.
            </p>
            <div className="pt-4 border-t border-dashed">
                <h4 className="font-semibold text-sm text-foreground mb-2">Gancho de Venda:</h4>
                <p className="text-sm text-muted-foreground">"Olá [Nome], vi que você é uma referência no setor de [Setor] e compartilha conteúdos muito ricos. Acreditamos que seu conhecimento tem um potencial incrível para um podcast, que é a melhor ferramenta para construir autoridade hoje. Para que você veja na prática o poder disso, estamos oferecendo a especialistas como você a oportunidade de gravar um episódio piloto completo em nosso estúdio profissional, sem custo algum. Você só precisa vir com seu conteúdo, nós cuidamos de toda a técnica. O que acha da ideia?"</p>
            </div>
        </CardContent>
      </Card>

       <Link href="/onboarding/process/templates" className="group block">
            <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Wand2 className="h-8 w-8 text-primary" />
                        <CardTitle>Playbook: Modelos de Abordagem e Scripts</CardTitle>
                    </div>
                     <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Acesse todos os modelos de mensagem, scripts de ligação e como lidar com objeções. Use como base para suas abordagens.</p>
                </CardContent>
            </Card>
        </Link>
    </div>
  );
}

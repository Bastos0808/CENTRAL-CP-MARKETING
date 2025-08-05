
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MessageSquare, PhoneCall, ShieldQuestion, Users, Handshake, Bot } from "lucide-react";
import { useOnboarding } from "../../layout";
import { useEffect } from "react";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // This is a detail page, so we mark it as completed on load to allow navigation.
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Playbook de Comunicação</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Aqui estão seus modelos de abordagem. Use-os como ponto de partida, mas lembre-se: a personalização com base na sua pesquisa (Fase 1) é o que fará a diferença.
            </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><MessageSquare /> Modelo 1: WhatsApp (Oportunidade)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full space-y-2">
                    <p className="text-foreground"><strong>Situação:</strong> Você viu que o prospect participou de um evento, lançou um produto ou saiu na mídia.</p>
                    <p className="whitespace-pre-wrap text-foreground pt-2 border-t mt-2">
                        Olá [Nome do Prospect], tudo bem?
                        <br/><br/>
                        Meu nome é [Seu Nome], sou da CP Marketing Digital.
                        <br/><br/>
                        Vi que vocês [Gancho - ex: participaram da Feira ABC semana passada, parabéns pela iniciativa!].
                        <br/><br/>
                        Geralmente, empresas que investem em eventos como esse têm o desafio de [Dor Conectada - ex: transformar o networking e os contatos feitos lá em clientes reais].
                        <br/><br/>
                        Isso faz sentido para você ou é um desafio que já superaram?
                    </p>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Mail /> Modelo 2: E-mail (Dor Observada)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full space-y-2">
                   <p className="text-foreground"><strong>Situação:</strong> Você viu que o site do prospect está desatualizado, o Instagram está parado ou o blog não é atualizado há tempos.</p>
                    <p className="whitespace-pre-wrap text-foreground pt-2 border-t mt-2">
                        Olá [Nome do Prospect],
                        <br/><br/>
                        Sou [Seu Nome] da CP Marketing.
                        <br/><br/>
                        Enquanto pesquisava sobre o setor de [Setor], notei que [Gancho - ex: o blog de vocês tem um conteúdo ótimo, mas não é atualizado desde o ano passado].
                        <br/><br/>
                        Isso às vezes acontece quando a equipe está focada em outras prioridades, mas a consequência pode ser a [Dor Conectada - ex: perda de autoridade e de posições no Google para concorrentes mais ativos].
                        <br/><br/>
                        Vocês têm um plano para reativar essa frente?
                    </p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users /> Modelo 3: WhatsApp (Concorrência)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full space-y-2">
                   <p className="text-foreground"><strong>Situação:</strong> Você notou que um concorrente direto do prospect está investindo pesado em anúncios ou conteúdo de alta qualidade.</p>
                    <p className="whitespace-pre-wrap text-foreground pt-2 border-t mt-2">
                        Olá [Nome do Prospect],
                        <br/><br/>
                        Aqui é [Seu Nome] da CP Marketing.
                        <br/><br/>
                        Notei que a [Concorrente] tem investido bastante em anúncios sobre [Tópico]. Você acredita que isso tem impactado a [Sua Empresa]?
                        <br/><br/>
                        Ajudamos empresas de [Setor] a não só competir, mas a se destacar nesse cenário.
                        <br/><br/>
                        Faz sentido conversarmos sobre como podemos fazer isso por vocês?
                    </p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><PhoneCall /> Modelo 4: Script Ligação (Direto)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full space-y-3">
                   <p className="text-foreground"><strong>Objetivo:</strong> Rápido, respeitoso e focado em validar uma dor para agendar. Ideal para quando o 'gancho' é muito claro.</p>
                   <div className="space-y-2 pt-2 border-t mt-2">
                        <p className="text-foreground"><strong>Você:</strong> "Oi, [Nome do Prospect], tudo bem? Aqui é [Seu Nome] da CP Marketing. Consegue falar por 1 minuto?"</p>
                        <p className="text-foreground"><strong>Você:</strong> "Ótimo. Vi que [Gancho/Problema Observado]. Notei que muitas empresas de [Setor] que fazem isso, depois sentem dificuldade em [Dor Conectada]."</p>
                        <p className="text-foreground"><strong>Você:</strong> "Isso acontece aí com vocês também ou a realidade é diferente?"</p>
                        <p className="text-foreground"><strong>(Se sim/curiosidade...)</strong> "Entendi. Não quero tomar seu tempo, mas acho que consigo te ajudar. Que tal conversarmos por 15 minutos amanhã para eu te apresentar um diagnóstico rápido? Sugiro 10h ou 14h."</p>
                        <p className="text-foreground"><strong>(Se não/negativa...)</strong> "Entendo, [Nome]. Fico feliz que já tenham isso sob controle! Agradeço seu tempo. Tenha um ótimo dia!"</p>
                   </div>
                </div>
            </CardContent>
        </Card>

         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Handshake /> Como Passar pelo 'Gatekeeper' (Secretária, Assistente)</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="p-4 bg-muted/50 rounded-lg w-full space-y-3">
                    <p className="text-foreground"><strong>Mentalidade:</strong> O gatekeeper não é um inimigo, é um aliado em potencial. Seu objetivo é dar a ele um motivo claro para te passar para o decisor. Seja firme, educado e transmita importância.</p>
                    <div className="space-y-2 pt-2 border-t mt-2">
                        <p className="text-foreground font-semibold">Script da Ligação:</p>
                        <p className="text-muted-foreground"><strong>Gatekeeper:</strong> "Empresa X, bom dia."</p>
                        <p className="text-foreground"><strong>Você:</strong> "Bom dia, aqui é [Seu Nome] da CP Marketing. Gostaria de falar com o(a) [Nome do Decisor], por favor."</p>
                        <p className="text-muted-foreground"><strong>Gatekeeper:</strong> "Qual seria o assunto?"</p>
                        <p className="text-foreground"><strong>Você (com confiança):</strong> "É sobre um levantamento de posicionamento digital que fizemos sobre a [Nome da Empresa] e seus concorrentes. Acredito que o(a) [Nome do Decisor] terá interesse nos dados."</p>
                        <p className="text-muted-foreground"><strong>Gatekeeper:</strong> "Ele(a) não está no momento. Quer deixar recado?"</p>
                        <p className="text-foreground"><strong>Você:</strong> "Claro. Pode dizer que o(a) [Seu Nome], da CP Marketing, ligou sobre a análise de concorrência. Meu número é [Seu Número]. Ele(a) tem algum horário específico que seja melhor para retornar?"</p>
                    </div>
                 </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><ShieldQuestion /> Como Lidar com Objeções Iniciais</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="p-4 bg-muted/50 rounded-lg w-full space-y-3">
                    <div className="space-y-1">
                        <p className="text-foreground font-semibold">"Não tenho tempo agora."</p>
                        <p className="text-muted-foreground"><strong>Resposta:</strong> "Compreendo perfeitamente, por isso fui direto ao ponto. Qual o melhor horário para te ligar por 2 minutos amanhã?"</p>
                    </div>
                     <div className="space-y-1 pt-2 border-t">
                        <p className="text-foreground font-semibold">"Já tenho uma agência."</p>
                        <p className="text-muted-foreground"><strong>Resposta:</strong> "Que ótimo! Não quero de forma alguma atrapalhar uma parceria que funciona. Apenas por curiosidade, eles estão ajudando vocês a resolver [Dor Conectada que você identificou]?"</p>
                    </div>
                     <div className="space-y-1 pt-2 border-t">
                        <p className="text-foreground font-semibold">"Não tenho interesse."</p>
                        <p className="text-muted-foreground"><strong>Resposta:</strong> "Sem problemas. Só para eu não te incomodar mais, o desinteresse é porque você não vê valor em marketing digital agora ou porque está satisfeito com os resultados atuais?"</p>
                    </div>
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-foreground font-semibold">"Me mande por e-mail."</p>
                        <p className="text-muted-foreground"><strong>Resposta:</strong> "Claro! Para não te enviar um material genérico, você se importa de me dizer qual é seu maior desafio em relação a [Dor Conectada] hoje? Assim eu consigo te mandar algo que realmente te ajude."</p>
                    </div>
                    <div className="space-y-1 pt-2 border-t">
                        <p className="text-foreground font-semibold">"Mande sua apresentação."</p>
                        <p className="text-muted-foreground"><strong>Resposta:</strong> "Nossa apresentação é focada em resultados, e seria um desserviço te enviar algo genérico sem antes entender seus desafios. Que tal uma conversa rápida de 15 minutos? Se não fizer sentido, não te incomodo mais. O que me diz?"</p>
                    </div>
                 </div>
            </CardContent>
        </Card>
      </div>

       <div className="flex justify-center mt-8">
            <Link href="/ferramentas" passHref>
                <Button>
                    Ir para Ferramentas de IA
                </Button>
            </Link>
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Search, Handshake, Calendar, Mail, Network, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from "next/link";

const processSteps = [
    {
        title: "Fase 1: Pesquisa e Qualificação",
        icon: Search,
        checklist: [
            "Identificar potenciais clientes que se encaixam no nosso ICP.",
            "Analisar a presença digital atual do prospect (site, redes sociais).",
            "Identificar o decisor (CEO, Diretor de Marketing, etc).",
            "Procurar por 'ganchos' ou dores evidentes na comunicação atual dele.",
        ]
    },
    {
        title: "Fase 2: Primeira Abordagem (Conexão)",
        icon: Handshake,
        checklist: [
            "Conectar-se com o decisor no LinkedIn (sem mensagem de venda).",
            "Interagir com 1 ou 2 posts recentes para criar familiaridade.",
            "O objetivo aqui é aparecer no radar, não vender.",
        ]
    },
    {
        title: "Fase 3: Contato Direto (Mensagem)",
        icon: Mail,
        checklist: [
            "Enviar uma mensagem curta e personalizada (use a ferramenta de IA para treinar!).",
            "A mensagem deve focar na dor observada e sugerir uma solução, não listar nossos serviços.",
            "Exemplo: 'Vi que seu perfil [problema/oportunidade]. Muitos dos nossos clientes [setor] enfrentavam isso e conseguiram [resultado]. Faz sentido conversarmos 15min sobre?'",
            "O objetivo é despertar curiosidade para uma chamada.",
        ]
    },
    {
        title: "Fase 4: Agendamento da Reunião",
        icon: Calendar,
        checklist: [
            "Se houver resposta positiva, seja rápido e objetivo.",
            "Ofereça 2 ou 3 opções de horários diretamente.",
            "Envie o convite na agenda com o link da chamada.",
            "Sua missão está cumprida! A reunião será com um Closer.",
        ]
    }
];

export default function ProcessPage() {
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Com o 'o quê' e o 'para quem' definidos, vamos ao 'como'. Este é o nosso processo de prospecção. Siga-o para garantir eficiência e melhores taxas de conversão.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processSteps.map((step) => (
                    <Card key={step.title}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <step.icon className="h-7 w-7 text-primary" />
                                {step.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                                {step.checklist.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                           </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Network className="h-7 w-7 text-primary"/>
                        Aprofunde no Mödus
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground flex-1">
                       As etapas acima são o fluxo prático. Para entender a estratégia por trás de cada ação, explore nosso mapa mental completo do Mödus.
                    </p>
                    <Link href="/onboarding/modus">
                        <Button>
                            Acessar o Mödus Completo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
    );
}

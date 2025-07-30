
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Megaphone, Mic, Palette } from "lucide-react";

const solutions = [
    {
        icon: Palette,
        title: "Gestão de Mídias Sociais",
        description: "Criamos e gerenciamos conteúdo estratégico para construir autoridade, engajar a audiência e transformar seguidores em clientes.",
        hooks: [
            "Seu perfil não reflete a qualidade do seu trabalho?",
            "Posta, posta, posta e não vê resultado em vendas?",
            "Sem tempo ou criatividade para manter a consistência?",
        ]
    },
    {
        icon: Megaphone,
        title: "Tráfego Pago (Ads)",
        description: "Desenvolvemos e otimizamos campanhas de anúncios para alcançar o público certo, gerar leads qualificados e acelerar as vendas.",
        hooks: [
            "Sente que está 'queimando dinheiro' com anúncios sem retorno?",
            "Seus concorrentes aparecem para todos, menos você?",
            "Precisa de mais clientes chegando todos os dias?",
        ]
    },
    {
        icon: Mic,
        title: "Produção de Podcast",
        description: "Oferecemos uma solução completa de produção de podcast, desde a gravação até a distribuição, para transformar seu conhecimento em um ativo de autoridade.",
        hooks: [
            "Quer construir autoridade e se tornar uma referência no seu mercado?",
            "Tem muito conhecimento para compartilhar, mas não sabe como começar?",
            "Busca um formato de conteúdo profundo para se conectar com sua audiência?",
        ]
    },
    {
        icon: Lightbulb,
        title: "Consultoria Estratégica",
        description: "Analisamos seu cenário atual e desenhamos um plano de ação de marketing digital claro e acionável para você executar com sua equipe.",
        hooks: [
            "Se sente perdido, sem saber qual o próximo passo no seu marketing?",
            "Sua equipe interna precisa de uma direção estratégica clara?",
            "Investe em várias ações, mas sente que falta uma estratégia unificada?",
        ]
    }
];


export default function SolutionsPage() {
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Agora que você conhece nossa cultura, entenda o que vendemos. Cada solução resolve um problema específico do nosso cliente. Seu trabalho é identificar essa dor e conectar com nossa solução.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((solution) => (
                    <Card key={solution.title}>
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <solution.icon className="h-8 w-8 text-primary" />
                                <CardTitle>{solution.title}</CardTitle>
                            </div>
                            <CardDescription>{solution.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <h4 className="font-semibold text-foreground mb-2">Ganchos de Venda (Dores):</h4>
                           <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                                {solution.hooks.map(hook => <li key={hook}>{hook}</li>)}
                           </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

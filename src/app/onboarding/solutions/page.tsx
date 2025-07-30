
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Megaphone, Mic, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";


const solutionsData = [
    {
        icon: Palette,
        title: "Gestão de Mídias Sociais",
        description: "Construa autoridade, engaje a audiência e transforme seguidores em clientes.",
        href: "/onboarding/solutions/gestao-de-midias-sociais"
    },
    {
        icon: Megaphone,
        title: "Tráfego Pago (Ads)",
        description: "Alcance o público certo, gere leads qualificados e acelere as vendas.",
        href: "/onboarding/solutions/trafego-pago"
    },
    {
        icon: Mic,
        title: "Produção de Podcast",
        description: "Transforme seu conhecimento em um ativo de autoridade e conexão.",
        href: "/onboarding/solutions/producao-de-podcast"
    },
    {
        icon: Lightbulb,
        title: "Consultoria Estratégica",
        description: "Receba um plano de ação claro e acionável para sua equipe executar.",
        href: "/onboarding/solutions/consultoria-estrategica"
    }
];


export default function SolutionsPage() {
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Agora que você conhece nossa cultura, entenda o que vendemos. Cada solução resolve um problema específico do nosso cliente. Clique nos cards para ver os detalhes, entregáveis e ganchos de venda de cada um.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutionsData.map((solution) => (
                    <Link href={solution.href} key={solution.title} className="group block">
                        <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                            <CardHeader className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="bg-primary/10 p-3 rounded-full">
                                    <solution.icon className="h-8 w-8 text-primary" />
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                                </div>
                                <CardTitle>{solution.title}</CardTitle>
                                <CardDescription>{solution.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

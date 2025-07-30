
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Search, Handshake, Calendar, Mail, Network, ArrowRight } from "lucide-react";
import Link from "next/link";

const processSteps = [
    {
        title: "Fase 1: Pesquisa e Qualificação",
        icon: Search,
        description: "Onde tudo começa. Identificar os melhores alvos e entender suas dores antes do primeiro contato.",
        href: "/onboarding/process/research"
    },
    {
        title: "Fase 2: Conexão",
        icon: Handshake,
        description: "A arte de aparecer no radar do prospect de forma sutil e profissional, sem vender nada.",
        href: "/onboarding/process/connection"
    },
    {
        title: "Fase 3: Contato Direto",
        icon: Mail,
        description: "O momento da abordagem. Como enviar uma mensagem personalizada que desperta curiosidade.",
        href: "/onboarding/process/contact"
    },
    {
        title: "Fase 4: Agendamento",
        icon: Calendar,
        description: "A missão final do SDR. Converter o interesse em uma reunião qualificada para o time de Closers.",
        href: "/onboarding/process/schedule"
    }
];

export default function ProcessPage() {
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Com o 'o quê' e o 'para quem' definidos, vamos ao 'como'. Este é o nosso processo de prospecção. Clique em cada fase para entender o passo a passo, as ferramentas e as melhores práticas.
            </p>

            <div className="space-y-4">
                {processSteps.map((step) => (
                    <Link href={step.href} key={step.title} className="group block">
                        <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <step.icon className="h-8 w-8 text-primary" />
                                    <CardTitle>{step.title}</CardTitle>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

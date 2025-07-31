
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, DollarSign, Target, Milestone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useOnboarding } from "../layout";

const icpCriteria = [
    {
        icon: Milestone,
        title: "Estágio do Negócio",
        description: "Focamos em empresas que já têm tração e estão prontas para escalar.",
        href: "/onboarding/icp/business-stage"
    },
    {
        icon: Building,
        title: "Setores Prioritários",
        description: "Nossas estratégias têm maior impacto em setores específicos.",
        href: "/onboarding/icp/priority-sectors"
    },
    {
        icon: DollarSign,
        title: "Capacidade de Investimento",
        description: "O cliente precisa entender o marketing como um investimento, não um custo.",
        href: "/onboarding/icp/investment-capacity"
    },
    {
        icon: Target,
        title: "Mentalidade do Decisor",
        description: "Buscamos parceiros que confiam no processo e miram o longo prazo.",
        href: "/onboarding/icp/decision-maker-mindset"
    },
    {
        icon: MapPin,
        title: "Localização",
        description: "Atendemos clientes em todo o Brasil, com foco em grandes centros.",
        href: "/onboarding/icp/location"
    },
];

export default function IcpPage() {
    const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // Esta é uma página de menu, então consideramos a etapa completa ao carregar.
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Não vendemos para todo mundo. Focamos em clientes que podemos genuinamente ajudar a crescer. Clique em cada card para entender os critérios do nosso Perfil de Cliente Ideal (ICP).
        </p>

        <div className="space-y-4">
            {icpCriteria.map((criterion) => (
                 <Link href={criterion.href} key={criterion.title} className="group block">
                    <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <criterion.icon className="h-8 w-8 text-primary" />
                                <CardTitle>{criterion.title}</CardTitle>
                            </div>
                             <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{criterion.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}

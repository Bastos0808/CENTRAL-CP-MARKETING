
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Gem, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const cultureData = [
    {
        icon: Target,
        title: "Nossa Missão",
        description: "Transformar o potencial de negócios em performance de mercado. Entenda como aplicamos isso na prática.",
        href: "/onboarding/culture/mission"
    },
    {
        icon: Eye,
        title: "Nossa Visão",
        description: "Ser a agência parceira de crescimento para empresas ambiciosas. Veja onde queremos chegar.",
        href: "/onboarding/culture/vision"
    },
    {
        icon: Gem,
        title: "Nossos Valores",
        description: "Os princípios que guiam cada decisão, projeto e interação. Conheça nosso código de conduta.",
        href: "/onboarding/culture/values"
    }
];


export default function CulturePage() {
  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Para vender com convicção, você precisa entender o 'porquê' do nosso trabalho. A cultura da CP Marketing é a base de tudo que fazemos. Clique nos cards para explorar cada pilar.
        </p>

        <div className="space-y-4">
            {cultureData.map((item) => (
                <Link href={item.href} key={item.title} className="group block">
                    <Card className="transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <item.icon className="h-8 w-8 text-primary" />
                                <CardTitle>{item.title}</CardTitle>
                            </div>
                             <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:text-primary group-hover:translate-x-1" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Gem } from "lucide-react";

const cultureData = [
    {
        icon: Target,
        title: "Nossa Missão",
        description: "Transformar o potencial de negócios em performance de mercado através de estratégias digitais criativas e orientadas por dados, construindo marcas fortes e resultados mensuráveis.",
    },
    {
        icon: Eye,
        title: "Nossa Visão",
        description: "Ser a agência de marketing digital referência em inovação estratégica e parceria de crescimento para empresas que buscam não apenas presença online, mas domínio de mercado.",
    },
    {
        icon: Gem,
        title: "Nossos Valores",
        points: [
            "Obsessão pelo resultado do cliente",
            "Parceria e transparência radical",
            "Criatividade com propósito",
            "Inovação como rotina",
            "Excelência em cada detalhe",
        ]
    }
]

export default function CulturePage() {
  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Para vender com convicção, você precisa entender o 'porquê' do nosso trabalho. A cultura da CP Marketing é a base de tudo que fazemos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cultureData.map((item) => (
                <Card key={item.title} className="flex-1 md:col-span-1 first:md:col-span-2 last:md:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <item.icon className="h-8 w-8 text-primary" />
                        <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                        {item.points && (
                            <ul className="mt-4 space-y-2 list-disc pl-5 text-muted-foreground">
                                {item.points.map((point) => <li key={point}>{point}</li>)}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}

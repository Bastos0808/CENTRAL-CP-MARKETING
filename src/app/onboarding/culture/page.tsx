
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Gem } from "lucide-react";

const cultureData = [
    {
        icon: Target,
        title: "Nossa Missão",
        description: "Transformar o potencial de negócios em performance de mercado. Fazemos isso através de estratégias digitais criativas e orientadas por dados, construindo marcas fortes e gerando resultados que os clientes podem ver e medir.",
    },
    {
        icon: Eye,
        title: "Nossa Visão",
        description: "Ser a agência de marketing digital reconhecida como a principal parceira de crescimento para empresas ambiciosas. Buscamos ser sinônimo de inovação estratégica e domínio de mercado, não apenas de presença online.",
    },
    {
        icon: Gem,
        title: "Nossos Valores",
        points: [
           { title: "Obsessão pelo resultado do cliente", detail: "O sucesso do nosso cliente é a nossa métrica principal. Pensamos como donos do negócio." },
           { title: "Parceria e transparência radical", detail: "Construímos relações de confiança, com comunicação aberta sobre vitórias e desafios." },
           { title: "Criatividade com propósito", detail: "Nossas ideias não são apenas bonitas; elas são desenhadas para atingir objetivos claros." },
           { title: "Inovação como rotina", detail: "Estamos sempre aprendendo, testando e aplicando o que há de mais novo para manter nossos clientes à frente." },
           { title: "Excelência em cada detalhe", detail: "Da estratégia ao post, buscamos o mais alto padrão de qualidade em tudo que entregamos." },
        ]
    }
];

export default function CulturePage() {
  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Para vender com convicção, você precisa entender o 'porquê' do nosso trabalho. A cultura da CP Marketing é a base de tudo que fazemos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                    <cultureData[0].icon className="h-8 w-8 text-primary" />
                    <CardTitle>{cultureData[0].title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{cultureData[0].description}</p>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                    <cultureData[1].icon className="h-8 w-8 text-primary" />
                    <CardTitle>{cultureData[1].title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{cultureData[1].description}</p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                 <CardHeader className="flex flex-row items-center gap-4">
                    <cultureData[2].icon className="h-8 w-8 text-primary" />
                    <CardTitle>{cultureData[2].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {cultureData[2].points.map((point) => (
                          <li key={point.title}>
                            <p className="font-semibold text-foreground">{point.title}</p>
                            <p className="text-sm text-muted-foreground pl-2">{point.detail}</p>
                          </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

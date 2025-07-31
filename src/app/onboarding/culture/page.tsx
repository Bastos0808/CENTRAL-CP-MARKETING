
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Gem, CheckCircle, HeartHandshake, Lightbulb, Search, Trophy, Smile } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const valuesData = [
  {
    icon: Trophy,
    title: "Obsessão pelo resultado do cliente",
    detail: "O sucesso do nosso cliente é a nossa métrica principal. Pensamos como donos do negócio, e cada ação que tomamos deve estar alinhada a um objetivo claro de crescimento para quem confia em nosso trabalho. Se o cliente não ganha, nós não ganhamos."
  },
  {
    icon: HeartHandshake,
    title: "Parceria, lealdade e transparência",
    detail: "Construímos relações de confiança e lealdade, com comunicação aberta sobre vitórias e desafios. O cliente não é um número; é um parceiro de longo prazo. Acreditamos que a empatia e a honestidade radical aceleram a resolução de problemas e fortalecem a relação."
  },
  {
    icon: Lightbulb,
    title: "Criatividade com propósito",
    detail: "Nossas ideias não são apenas bonitas ou 'virais' por acaso. Elas são desenhadas para atingir objetivos claros e resolver problemas reais da persona do cliente. A criatividade, para nós, é uma ferramenta estratégica para gerar resultados, não apenas aplausos."
  },
  {
    icon: Search,
    title: "Inovação como rotina",
    detail: "O cenário digital muda diariamente, e quem para no tempo, fica para trás. Estamos sempre aprendendo, testando e aplicando o que há de mais novo para manter nossos clientes à frente da concorrência. A curiosidade e a busca pelo novo fazem parte do nosso DNA."
  },
  {
    icon: Gem,
    title: "Excelência em cada detalhe",
    detail: "Da estratégia macro ao texto de um stories, buscamos o mais alto padrão de qualidade em tudo que entregamos. Acreditamos que a excelência não é um ato, mas um hábito. É o cuidado nos detalhes que constrói grandes marcas."
  },
  {
    icon: Smile,
    title: "Ambiente leve, trabalho sério",
    detail: "Promovemos um ambiente descontraído, colaborativo e com espaço para o bom humor. Acreditamos que a leveza no dia a dia impulsiona a criatividade e a performance, mas sem nunca perder o foco na seriedade e na responsabilidade que cada projeto exige."
  }
];


export default function CulturePage() {
  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Para vender com convicção, você precisa entender o 'porquê' do nosso trabalho. A cultura da CP Marketing é a base de tudo que fazemos. Explore cada pilar abaixo para entender nossa essência.
        </p>

        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['mission']}>
            {/* Mission */}
            <AccordionItem value="mission">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-4 text-xl">
                        <Target className="h-8 w-8 text-primary" />
                        Nossa Missão
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pl-4">
                    <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 mb-4">
                        Transformar o potencial de negócios em performance de mercado.
                    </p>
                    <p className="text-foreground">
                        Essa não é apenas uma frase de efeito; é o núcleo da nossa operação. Em um mundo digital onde a presença é facilmente confundível com progresso, nosso foco é gerar resultados tangíveis. Não vendemos "posts bonitos" ou "mais seguidores" como um fim em si. Vendemos crescimento, autoridade e, principalmente, impacto no negócio do cliente.
                    </p>
                </AccordionContent>
            </AccordionItem>
            
            {/* Vision */}
            <AccordionItem value="vision">
                 <AccordionTrigger>
                    <CardTitle className="flex items-center gap-4 text-xl">
                        <Eye className="h-8 w-8 text-primary" />
                        Nossa Visão
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pl-4">
                     <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 mb-4">
                       Ser a agência de marketing digital reconhecida como a principal parceira de crescimento para empresas ambiciosas.
                    </p>
                    <p className="text-foreground">
                       Nossa visão vai além de sermos apenas mais uma agência no mercado. Almejamos ser a primeira escolha para empresas que não querem apenas "estar no digital", mas sim dominar seus nichos. Quando um negócio pensa em escalar, em se tornar autoridade e em traduzir marketing em faturamento, queremos que o nome "CP Marketing Digital" seja a resposta óbvia.
                    </p>
                </AccordionContent>
            </AccordionItem>

            {/* Values */}
            <AccordionItem value="values">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-4 text-xl">
                        <Gem className="h-8 w-8 text-primary" />
                        Nossos Valores
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pl-4">
                    <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 mb-6">
                        Estes são os pilares que sustentam nossa cultura, nossas decisões e nossas relações. É o nosso código de conduta inegociável.
                    </p>
                    <div className="space-y-4">
                        {valuesData.map((value) => (
                        <div key={value.title}>
                            <h3 className="font-semibold flex items-center gap-3 mb-1">
                                <value.icon className="h-5 w-5 text-primary" />
                                {value.title}
                            </h3>
                            <p className="text-muted-foreground pl-8">{value.detail}</p>
                        </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}


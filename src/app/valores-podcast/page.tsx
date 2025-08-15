

import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const dayPrices = [
    { name: "Gravação Avulsa (1h) | Seg a Sex (8h-17h)", value: "R$ 249,00" },
    { name: "Gravação Avulsa (1h) | Seg a Sex (17h-22h)", value: "R$ 399,00" },
];

const specialPrices = [
    { name: "Sábado (8h-12h) | 1h de gravação", value: "R$ 349,00" },
    { name: "Sábado (12h-22h) | 1h de gravação", value: "R$ 449,00" },
    { name: "Domingo e Feriados | 1h de gravação", value: "R$ 599,00" }
];

const cutsPrices = [
    { name: "1 Corte", value: "R$ 50,00" },
    { name: "5 Cortes", value: "R$ 200,00" },
    { name: "10 Cortes", value: "R$ 350,00" },
    { name: "Edição de Episódio (Avulso)", value: "R$ 299,00" },
];

const interviewOffer = {
    items: [
        "Entrevista Profissional em Estúdio Completo",
        "Entrevistador experiente da nossa equipe",
        "Roteiro de perguntas enviado pelo cliente",
        "Gravação com qualidade de áudio e vídeo profissional",
    ],
    price: "R$ 599,00",
};


export default function ValoresPodcastPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Valores de Gravação e Edição
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Consulte os preços para gravações de podcast e pacotes de cortes.
          </p>
        </header>
        <div className="max-w-2xl mx-auto space-y-8">
            <Card className="border-primary/30">
                <CardHeader>
                    <CardTitle>Oferta Especial: Podcast Entrevista</CardTitle>
                    <CardDescription>Pacote completo para quem quer gravar um podcast sendo entrevistado por nossa equipe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2">
                       {interviewOffer.items.map((item) => (
                         <li key={item} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0"/>
                            <span className="font-medium">{item}</span>
                         </li>
                       ))}
                    </ul>
                    <div className="text-center pt-4 mt-4 border-t">
                        <p className="text-4xl font-bold text-primary">{interviewOffer.price}</p>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Gravação Avulsa por Hora (Segunda a Sexta)</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {dayPrices.map((price) => (
                         <li key={price.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <span className="flex items-center gap-3 font-medium">
                                <Check className="h-5 w-5 text-primary"/>
                                {price.name}
                            </span>
                            <span className="font-bold text-lg text-primary">{price.value}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gravação Avulsa por Hora (Fim de Semana e Feriados)</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {specialPrices.map((price) => (
                         <li key={price.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <span className="flex items-center gap-3 font-medium">
                                <Check className="h-5 w-5 text-primary"/>
                                {price.name}
                            </span>
                            <span className="font-bold text-lg text-primary">{price.value}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Serviços de Edição</CardTitle>
                    <CardDescription>Pacotes de cortes e valor para edição completa de episódio.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {cutsPrices.map((price) => (
                         <li key={price.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <span className="flex items-center gap-3 font-medium">
                                <Check className="h-5 w-5 text-primary"/>
                                {price.name}
                            </span>
                            <span className="font-bold text-lg text-primary">{price.value}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>

        </div>
      </div>
    </main>
  );
}

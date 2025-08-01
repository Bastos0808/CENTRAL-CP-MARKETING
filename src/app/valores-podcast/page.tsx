
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const dayPrices = [
    { name: "1 Episódio de 1h", value: "R$ 249,00" },
    { name: "1 Episódio de 2h", value: "R$ 440,00" },
    { name: "Pacote (4 episódios de 1h)", value: "R$ 840,00" },
    { name: "Pacote (4 episódios de 2h)", value: "R$ 1.600,00" }
];

const nightPrices = [
    { name: "1 Episódio de 1h", value: "R$ 399,00" },
    { name: "1 Episódio de 2h", value: "R$ 740,00" },
    { name: "Pacote (4 episódios de 1h)", value: "R$ 1.440,00" },
    { name: "Pacote (4 episódios de 2h)", value: "R$ 2.800,00" }
];

const specialPrices = [
    { name: "Sábado | 1 Episódio de 1h", value: "R$ 349,00" },
    { name: "Feriados | 1 Episódio de 1h", value: "R$ 399,00" },
    { name: "Domingo | 1 Episódio de 1h", value: "R$ 499,00" }
];

const specialAfternoonPrices = [
    { name: "Sábado | 1 Episódio de 1h", value: "R$ 399,00" },
    { name: "Feriados | 1 Episódio de 1h", value: "R$ 549,00" },
    { name: "Domingo | 1 Episódio de 1h", value: "R$ 549,00" }
];

const specialNightPrices = [
    { name: "Sábado | 1 Episódio de 1h", value: "R$ 499,00" },
    { name: "Feriados | 1 Episódio de 1h", value: "R$ 599,00" },
    { name: "Domingo | 1 Episódio de 1h", value: "R$ 599,00" }
];

const cutsPrices = [
    { name: "2 Cortes", value: "R$ 80,00" },
    { name: "4 Cortes", value: "R$ 140,00" },
    { name: "6 Cortes", value: "R$ 200,00" },
    { name: "8 Cortes", value: "R$ 240,00" },
    { name: "10 Cortes", value: "R$ 300,00" },
    { name: "12 Cortes", value: "R$ 340,00" },
];


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
             <Card>
                <CardHeader>
                    <CardTitle>Segunda a Sexta (Manhã e Tarde)</CardTitle>
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
                    <CardTitle>Segunda a Sexta (Período Noturno)</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {nightPrices.map((price) => (
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
                    <CardTitle>Especial (Sábados, Domingos e Feriados) - Manhã</CardTitle>
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
                    <CardTitle>Especial (Sábados, Domingos e Feriados) - Tarde</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {specialAfternoonPrices.map((price) => (
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
                    <CardTitle>Especial (Sábados, Domingos e Feriados) - Noite</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {specialNightPrices.map((price) => (
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
                    <CardTitle>Valores para Cortes</CardTitle>
                    <CardDescription>Pacotes de cortes simples e valor para cortes magnéticos.</CardDescription>
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
                       <li className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <span className="flex items-center gap-3 font-medium">
                                <Check className="h-5 w-5 text-primary"/>
                                Cortes Magnéticos (cada)
                            </span>
                            <span className="font-bold text-lg text-primary">R$ 50,00</span>
                         </li>
                    </ul>
                </CardContent>
            </Card>

        </div>
      </div>
    </main>
  );
}

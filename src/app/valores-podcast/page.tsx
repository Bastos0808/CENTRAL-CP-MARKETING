
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const prices = [
    { name: "1 Episódio de 1h", value: "R$ 249,00" },
    { name: "1 Episódio de 2h", value: "R$ 440,00" },
    { name: "Pacote (4 episódios de 1h)", value: "R$ 840,00" },
    { name: "Pacote (4 episódios de 2h)", value: "R$ 1.600,00" }
]

export default function ValoresPodcastPage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Valores por Hora de Gravação
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Consulte os preços para gravações de podcast de segunda a sexta.
          </p>
        </header>
        <div className="max-w-2xl mx-auto">
             <Card>
                <CardHeader>
                    <CardTitle>Período da Manhã e da Tarde</CardTitle>
                    <CardDescription>Valores para gravação em nosso estúdio profissional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {prices.map((price) => (
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, HeartHand, Lightbulb, Search, Trophy } from "lucide-react";

const valuesData = [
  {
    icon: Trophy,
    title: "Obsessão pelo resultado do cliente",
    detail: "O sucesso do nosso cliente é a nossa métrica principal. Pensamos como donos do negócio, e cada ação que tomamos deve estar alinhada a um objetivo claro de crescimento para quem confia em nosso trabalho. Se o cliente não ganha, nós não ganhamos."
  },
  {
    icon: HeartHand,
    title: "Parceria e transparência radical",
    detail: "Construímos relações de confiança, com comunicação aberta sobre vitórias, desafios e até mesmo erros. O cliente não é um número; é um parceiro. Acreditamos que a honestidade radical acelera a resolução de problemas e fortalece a relação."
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
  }
];

export default function ValuesPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Gem className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl">Nossos Valores</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-muted-foreground border-l-4 border-primary pl-4">
            Estes são os cinco pilares que sustentam nossa cultura, nossas decisões e nossas relações. É o nosso código de conduta inegociável.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {valuesData.map((value) => (
          <Card key={value.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <value.icon className="h-6 w-6 text-primary" />
                {value.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{value.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

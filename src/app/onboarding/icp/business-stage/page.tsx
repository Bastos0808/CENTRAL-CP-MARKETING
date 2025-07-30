
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milestone, CheckCircle, TrendingUp, Users, History } from "lucide-react";

const stages = [
    {
        icon: History,
        title: "Mínimo de 2 anos de operação",
        description: "Isso indica que o negócio já superou as fases iniciais de validação, possui um histórico de mercado e um modelo de negócio minimamente testado. Nos dá uma base para analisar."
    },
    {
        icon: TrendingUp,
        title: "Faturamento recorrente",
        description: "A empresa já possui um fluxo de caixa que pode suportar o investimento em marketing de forma consistente para escalar, em vez de ações pontuais e sem continuidade."
    },
    {
        icon: Users,
        title: "Base de clientes estabelecida",
        description: "Já existe um público para analisar, extrair dados e engajar. Isso acelera a obtenção de resultados, pois não estamos começando do zero absoluto."
    },
    {
        icon: CheckCircle,
        title: "Busca clara por escala",
        description: "O objetivo principal do cliente não é apenas 'existir' no digital, mas sim crescer, profissionalizar e dominar seu nicho. Ele está buscando um parceiro de crescimento."
    }
]

export default function BusinessStagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Milestone className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Estágio do Negócio</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Procuramos empresas com um mínimo de maturidade. Não somos a agência ideal para quem está começando do zero absoluto, pois nossas estratégias visam a escala.
            </p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stages.map((stage) => (
            <Card key={stage.title}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <stage.icon className="h-7 w-7 text-primary" />
                        {stage.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{stage.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

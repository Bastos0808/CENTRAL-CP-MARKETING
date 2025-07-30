
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PiggyBank, Target, TrendingUp, Handshake } from "lucide-react";

const capacities = [
    {
        icon: PiggyBank,
        title: "Orçamento dedicado para marketing",
        description: "A empresa já separa uma verba mensal ou trimestral para ações de marketing e anúncios. Marketing não é visto como o 'primeiro a ser cortado' em momentos de aperto.",
        filter: "Um sinal de alerta é quando o prospect não sabe quanto pode investir ou diz 'depende do resultado'. O cliente ideal já tem uma noção clara de seu orçamento de marketing."
    },
    {
        icon: TrendingUp,
        title: "Mentalidade de investimento, não de custo",
        description: "O decisor não busca o 'mais barato', mas sim o maior retorno sobre o investimento (ROI). Ele entende que marketing é um motor de crescimento para o negócio.",
        filter: "Se o prospect foca apenas em preço e quantidade de posts, é um sinal de alerta. O cliente ideal pergunta sobre estratégia, valor e resultados de negócio."
    },
    {
        icon: Target,
        title: "Ticket médio que justifica o investimento",
        description: "O valor do produto ou serviço do cliente permite um ROI saudável e escalável. Um ticket médio muito baixo pode tornar a operação de marketing insustentável.",
        filter: "Clientes com ticket médio abaixo de R$500 podem ter dificuldade em ver o retorno, a menos que o volume de vendas seja muito alto. Foque em negócios com maior valor agregado."
    },
    {
        icon: Handshake,
        title: "Disponibilidade para tráfego pago",
        description: "O cliente entende a necessidade de impulsionar o conteúdo e as ofertas para acelerar os resultados, não dependendo apenas do alcance orgânico, que é limitado.",
        filter: "Prospects que dizem 'não acredito em anúncios' ou 'quero tudo no orgânico' geralmente não estão prontos para o crescimento acelerado que propomos."
    }
]

export default function InvestmentCapacityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <DollarSign className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Capacidade de Investimento</h1>
            <p className="text-lg text-muted-foreground mt-1">
                O sucesso de uma estratégia de marketing depende de um investimento consistente. O cliente ideal entende que marketing é um motor de crescimento, não uma despesa.
            </p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capacities.map((item) => (
            <Card key={item.title}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <item.icon className="h-7 w-7 text-primary" />
                        {item.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                     <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-sm text-foreground mb-2">Sinal de Alerta:</h4>
                        <p className="text-sm text-muted-foreground">{item.filter}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

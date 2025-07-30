
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PiggyBank, Target, TrendingUp, Handshake } from "lucide-react";

const capacities = [
    {
        icon: PiggyBank,
        title: "Orçamento dedicado para marketing",
        description: "A empresa já separa uma verba mensal ou trimestral para ações de marketing e anúncios, demonstrando compromisso."
    },
    {
        icon: TrendingUp,
        title: "Mentalidade de investimento",
        description: "O decisor não busca o 'mais barato', mas sim o maior retorno sobre o investimento (ROI), entendendo que marketing é um motor de crescimento."
    },
    {
        icon: Target,
        title: "Ticket médio compatível",
        description: "O valor do produto ou serviço do cliente justifica o investimento em uma agência, permitindo um ROI saudável e escalável."
    },
    {
        icon: Handshake,
        title: "Disponibilidade para tráfego pago",
        description: "O cliente entende a necessidade e tem capacidade de impulsionar o conteúdo para acelerar os resultados e atingir novos públicos."
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
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

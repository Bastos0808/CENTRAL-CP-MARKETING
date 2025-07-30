
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, Lightbulb, Handshake, Calendar, ShieldCheck } from "lucide-react";

const mindsets = [
    {
        icon: Lightbulb,
        title: "Aberto a inovação",
        description: "Não está preso ao 'sempre fizemos assim'. Confia em nossa expertise para testar novas abordagens e estratégias."
    },
    {
        icon: Handshake,
        title: "Busca parceria de longo prazo",
        description: "Entende que resultados sólidos em marketing são construídos com tempo e consistência, não com soluções mágicas."
    },
    {
        icon: Calendar,
        title: "Valoriza o trabalho estratégico",
        description: "Não quer apenas 'posts bonitos' ou 'mais seguidores', mas sim crescimento de negócio e construção de autoridade."
    },
    {
        icon: ShieldCheck,
        title: "Delega e confia no processo",
        description: "Participa ativamente, mas confia na agência para executar a estratégia, sem microgerenciamento excessivo."
    }
]


export default function DecisionMakerMindsetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Target className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Mentalidade do Decisor</h1>
            <p className="text-lg text-muted-foreground mt-1">
                A melhor estratégia do mundo falha se o cliente não for um verdadeiro parceiro. Buscamos uma mentalidade específica no decisor com quem vamos trabalhar.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mindsets.map((item) => (
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

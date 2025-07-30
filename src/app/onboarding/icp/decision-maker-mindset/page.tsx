
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, Lightbulb, Handshake, Calendar, ShieldCheck } from "lucide-react";

const mindsets = [
    {
        icon: Lightbulb,
        title: "Aberto a inovação e novas ideias",
        description: "Não está preso ao 'sempre fizemos assim'. Confia em nossa expertise para testar novas abordagens, formatos de conteúdo e estratégias que fujam do óbvio.",
        filter: "Na conversa, apresente uma ideia contraintuitiva. Se ele se mostrar curioso em vez de defensivo, é um bom sinal."
    },
    {
        icon: Handshake,
        title: "Busca uma parceria de longo prazo",
        description: "Entende que resultados sólidos em marketing são construídos com tempo e consistência, não com soluções mágicas ou resultados imediatos de 30 dias.",
        filter: "Pergunte sobre experiências passadas com outras agências. Se ele trocou de parceiro várias vezes em pouco tempo, pode ser um sinal de alerta de imediatismo."
    },
    {
        icon: Calendar,
        title: "Valoriza o trabalho estratégico",
        description: "Não quer apenas 'posts bonitos', mas sim crescimento de negócio e autoridade. Pergunta sobre ROI e estratégia, não apenas sobre a quantidade de entregáveis.",
        filter: "Observe as perguntas que ele faz. São sobre o 'como' (estratégia) ou apenas sobre o 'o quê' (entregáveis)? O cliente ideal quer entender o plano."
    },
    {
        icon: ShieldCheck,
        title: "Delega e confia no processo",
        description: "Participa ativamente das decisões estratégicas, mas confia na agência para executar a operação, sem microgerenciamento ou mudanças constantes de rota.",
        filter: "Verifique se ele tem uma equipe interna de marketing. Se sim, entenda se o objetivo é colaborar ou controlar. A confiança na nossa execução é fundamental."
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
                    <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-sm text-foreground mb-2">Como Validar:</h4>
                        <p className="text-sm text-muted-foreground">{item.filter}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

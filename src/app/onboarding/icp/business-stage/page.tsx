
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milestone, CheckCircle, TrendingUp, Users, History } from "lucide-react";

const stages = [
    {
        icon: History,
        title: "Mínimo de 2 anos de operação",
        description: "Isso indica que o negócio já superou as fases iniciais de validação. Nos dá uma base de histórico e dados para analisar, em vez de começar do zero absoluto.",
        filter: "Pesquisar data de abertura do CNPJ ou verificar posts antigos nas redes sociais. Um negócio muito novo geralmente precisa de validação de produto, não de escala."
    },
    {
        icon: TrendingUp,
        title: "Faturamento recorrente",
        description: "A empresa já possui um fluxo de caixa que pode suportar o investimento em marketing de forma consistente. Marketing para eles é para escalar, não para 'salvar o mês'.",
        filter: "Na qualificação, pergunte sobre a consistência das vendas. O negócio sobrevive ou está crescendo? Evite empresas que buscam uma 'solução mágica' para problemas de fluxo de caixa."
    },
    {
        icon: Users,
        title: "Base de clientes estabelecida",
        description: "Já existe um público para analisar, extrair dados e engajar. Isso acelera a obtenção de resultados e nos permite entender o que já funciona (ou não).",
        filter: "Analise o engajamento nas redes, a existência de depoimentos e, se possível, pergunte sobre o volume de clientes já atendidos. A ausência total de clientes é um sinal de alerta."
    },
    {
        icon: CheckCircle,
        title: "Busca clara por escala",
        description: "O objetivo principal do cliente não é apenas 'existir' no digital, mas sim crescer, profissionalizar e dominar seu nicho. Ele busca um parceiro de crescimento.",
        filter: "No site ou LinkedIn do decisor, procure por termos como 'crescimento', 'expansão', 'novos mercados'. A comunicação da empresa foca em crescimento ou apenas em manutenção?"
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
                    <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-sm text-foreground mb-2">Filtro SDR:</h4>
                        <p className="text-sm text-muted-foreground">{stage.filter}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

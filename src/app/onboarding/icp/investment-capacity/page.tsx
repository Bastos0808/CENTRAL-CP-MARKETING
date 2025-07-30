
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle } from "lucide-react";

export default function InvestmentCapacityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <DollarSign className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Capacidade de Investimento</h1>
      </div>
      <p className="text-lg text-muted-foreground pl-16">
        O sucesso de uma estratégia de marketing depende de um investimento consistente. O cliente ideal entende que marketing é um motor de crescimento, não uma despesa.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Checklist de Qualificação Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Possui orçamento dedicado para marketing:</strong> A empresa já separa uma verba mensal ou trimestral para ações de marketing e anúncios.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Mentalidade de investimento, não de custo:</strong> O decisor não busca o "mais barato", mas sim o maior retorno sobre o investimento (ROI).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Ticket médio compatível:</strong> O valor do produto ou serviço do cliente deve justificar o investimento em uma agência, permitindo um ROI saudável.
              </span>
            </li>
             <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Disponibilidade para investir em tráfego pago:</strong> O cliente entende a necessidade de impulsionar o conteúdo para acelerar os resultados.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milestone, CheckCircle } from "lucide-react";

export default function BusinessStagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Milestone className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Estágio do Negócio</h1>
      </div>
      <p className="text-lg text-muted-foreground pl-16">
        Procuramos empresas com um mínimo de maturidade. Não somos a agência ideal para quem está começando do zero absoluto, pois nossas estratégias visam a escala.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Checklist de Qualificação</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Mínimo de 2 anos de operação:</strong> Isso indica que o negócio já superou as fases iniciais de validação.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Faturamento recorrente:</strong> A empresa já possui um fluxo de caixa que pode suportar o investimento em marketing.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Base de clientes estabelecida:</strong> Já existe um público para analisar e engajar, acelerando nossos resultados.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Busca por escala:</strong> O objetivo principal do cliente não é apenas 'existir' no digital, mas sim crescer, profissionalizar e dominar seu nicho.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

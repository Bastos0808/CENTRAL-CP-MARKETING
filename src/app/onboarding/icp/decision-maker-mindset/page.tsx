
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";

export default function DecisionMakerMindsetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Target className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mentalidade do Decisor</h1>
      </div>
      <p className="text-lg text-muted-foreground pl-16">
        A melhor estratégia do mundo falha se o cliente não for um verdadeiro parceiro. Buscamos uma mentalidade específica no decisor com quem vamos trabalhar.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Características do Parceiro Ideal</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Aberto a novas estratégias e inovação:</strong> Não está preso ao "sempre fizemos assim". Confia em nossa expertise para testar novas abordagens.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Busca uma parceria de longo prazo:</strong> Entende que resultados sólidos em marketing são construídos com o tempo e consistência.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Valoriza o trabalho estratégico:</strong> Não quer apenas "posts bonitos" ou "mais seguidores", mas sim crescimento de negócio e autoridade.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Delega e confia no processo:</strong> Participa ativamente, mas confia na agência para executar a estratégia, sem microgerenciamento excessivo.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

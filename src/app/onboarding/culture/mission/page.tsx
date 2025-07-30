
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Target className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl">Nossa Missão</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xl text-muted-foreground border-l-4 border-primary pl-4">
            Transformar o potencial de negócios em performance de mercado.
          </p>
          <p className="text-foreground">
            Essa não é apenas uma frase de efeito; é o núcleo da nossa operação. Em um mundo digital onde a presença é facilmente confundível com progresso, nosso foco é gerar resultados tangíveis. Não vendemos "posts bonitos" ou "mais seguidores" como um fim em si. Vendemos crescimento, autoridade e, principalmente, impacto no negócio do cliente.
          </p>
        </CardContent>
      </Card>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>O Que Fazemos?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Nós construímos e executamos estratégias digitais que unem criatividade e dados. Isso significa que cada peça de conteúdo, cada campanha de anúncio e cada podcast que produzimos tem um propósito claro e uma métrica de sucesso atrelada.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Como Fazemos?</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Diagnóstico Profundo:</strong> Mergulhamos no negócio do cliente antes de qualquer proposta.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Execução com Excelência:</strong> Da estratégia ao design, buscamos o mais alto padrão.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Análise Contínua:</strong> Medimos, analisamos e otimizamos. O que não pode ser medido, não pode ser melhorado.</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function ConsultoriaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Lightbulb className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Consultoria Estratégica</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Analisamos seu cenário atual e desenhamos um plano de ação de marketing digital claro e acionável para você executar com sua equipe.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas com equipe interna que precisam de direção.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios que se sentem perdidos, sem saber o próximo passo.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Decisores que investem em várias ações, mas sem uma estratégia unificada.</span></li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Se sente perdido, sem saber qual o próximo passo no seu marketing?"</li>
            <li>"Sua equipe interna precisa de uma direção estratégica clara?"</li>
            <li>"Investe em várias ações, mas sente que falta uma estratégia unificada?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Diagnóstico Completo:</strong> Análise aprofundada da sua presença digital, concorrência e oportunidades de mercado.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Plano de Ação Detalhado:</strong> Um documento estratégico com pilares de conteúdo, funil de vendas, canais prioritários e cronograma para 90 dias.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Definição de KPIs:</strong> Estabelecimento de métricas claras para que sua equipe possa medir o sucesso das ações propostas.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Sessão de Apresentação:</strong> Uma reunião para apresentar o plano, tirar dúvidas e garantir que sua equipe esteja pronta para executar.</div></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

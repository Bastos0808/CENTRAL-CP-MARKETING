
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle, UserCheck, AlertTriangle, Video, Phone } from "lucide-react";

export default function ConsultoriaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Lightbulb className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Consultoria Estratégica Gratuita (Isca de Leads)</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Nossa principal ferramenta de qualificação. Oferecemos um diagnóstico gratuito para atrair e segmentar leads, direcionando os qualificados para uma chamada e nutrindo os demais com conteúdo de valor.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Tipos de Consultoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Phone className="h-5 w-5 text-green-500" /> Em Chamada (Leads Qualificados)</h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                    <li>Empresas que se encaixam no nosso Perfil de Cliente Ideal (ICP).</li>
                    <li>Decisores que demonstram claro potencial de investimento.</li>
                    <li>Negócios que já possuem alguma maturidade de mercado.</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Video className="h-5 w-5 text-yellow-500" /> Gravada (Leads Desqualificados)</h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                    <li>Empresas que NÃO se encaixam no ICP, mas têm interesse.</li>
                    <li>Leads que ainda não estão no momento de compra/investimento.</li>
                    <li>Serve como um material de nutrição para manter o lead no nosso ecossistema.</li>
                </ul>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Quer um diagnóstico 100% gratuito do seu marketing digital?"</li>
            <li>"Não sabe por onde começar ou qual o próximo passo para crescer?"</li>
            <li>"Receba um plano de ação claro e acionável para sua empresa decolar."</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Phone className="h-5 w-5 text-green-500" /> Entregáveis da Consultoria em Chamada:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Sessão ao vivo de 30-45 minutos</span>
                      <p className="text-sm text-muted-foreground">Uma conversa profunda com um especialista para entender o cenário e os desafios do lead.</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Plano de Ação Direcionado</span>
                      <p className="text-sm text-muted-foreground">Apresentação de um plano de 90 dias com as ações prioritárias para o lead. O objetivo é levá-lo para o fechamento de um dos nossos planos.</p>
                  </div>
              </li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Video className="h-5 w-5 text-yellow-500" /> Entregáveis da Consultoria Gravada:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Análise Assíncrona</span>
                      <p className="text-sm text-muted-foreground">Nossa equipe analisa as informações fornecidas pelo lead (formulário, site, etc) internamente.</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Gravação Personalizada (Loom)</span>
                      <p className="text-sm text-muted-foreground">Enviamos um vídeo curto e personalizado com um diagnóstico rápido e 2 ou 3 dicas práticas que o lead pode aplicar imediatamente.</p>
                  </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

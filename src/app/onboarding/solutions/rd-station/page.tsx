
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, CheckCircle, UserCheck, AlertTriangle, BadgeCheck, Filter, LineChart, Target, Bot } from "lucide-react";

export default function RdStationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Network className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">RD Station (Marketing & CRM)</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Como parceiros oficiais <strong className="text-primary">(Partner)</strong> da RD Station, implementamos e gerenciamos as principais ferramentas de automação de marketing e vendas do Brasil para organizar e acelerar seu crescimento.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas que perdem vendas por falta de acompanhamento (follow-up).</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios com processo comercial manual, desorganizado e dependente de planilhas.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas que geram leads mas não conseguem nutri-los de forma inteligente e automática.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Você sente que está perdendo vendas por falta de organização no acompanhamento?"</li>
            <li>"Seu processo comercial é todo manual e você não sabe em que etapa cada cliente está?"</li>
            <li>"Gostaria de nutrir seus leads de forma automática e só abordar quem está pronto para comprar?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BadgeCheck /> O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Bot className="h-5 w-5 text-primary" /> Implantação de RD Station Marketing</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Automação de Marketing</span>
                      <p className="text-sm text-muted-foreground">Criação de fluxos de automação para nutrir leads, qualificar oportunidades e enviar comunicações personalizadas em escala.</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Landing Pages e Formulários</span>
                      <p className="text-sm text-muted-foreground">Desenvolvimento de páginas de captura de alta conversão para transformar visitantes em leads.</p>
                  </div>
              </li>
               <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Email Marketing Estratégico</span>
                      <p className="text-sm text-muted-foreground">Gestão de campanhas de email, desde a criação de templates até a segmentação e análise de resultados.</p>
                  </div>
              </li>
            </ul>
          </div>
           <div className="pt-6 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Filter className="h-5 w-5 text-primary" /> Implantação de RD Station CRM</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Estruturação do Funil de Vendas</span>
                      <p className="text-sm text-muted-foreground">Configuração das etapas do funil de vendas dentro do CRM para dar clareza total sobre o andamento de cada negociação.</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Automação de Tarefas Comerciais</span>
                      <p className="text-sm text-muted-foreground">Criação de automações para agendamento de follow-ups, envio de lembretes e atualização de status de negociações.</p>
                  </div>
              </li>
               <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Relatórios de Vendas</span>
                      <p className="text-sm text-muted-foreground">Configuração de dashboards para acompanhar as principais métricas de vendas, taxas de conversão e performance da equipe.</p>
                  </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

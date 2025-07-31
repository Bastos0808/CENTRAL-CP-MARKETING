
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
            <h1 className="text-3xl font-bold tracking-tight">O que é a Implantação de RD Station?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Como parceiros oficiais da RD Station, nós implementamos as ferramentas de marketing e vendas líderes no Brasil. Na prática, criamos um sistema para <strong>organizar o processo comercial e automatizar a comunicação</strong>, fazendo com que o cliente pare de perder vendas por desorganização e falta de acompanhamento.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é o Cliente Ideal?</CardTitle>
          <CardDescription>Este serviço é perfeito para negócios que se encontram nestas situações:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Perde Vendas por Desorganização:</strong> O cliente recebe contatos (leads), mas esquece de responder, não faz acompanhamento (follow-up) e acaba perdendo a venda para um concorrente mais ágil.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Processo Comercial em Planilhas:</strong> Todo o controle de clientes e negociações é feito em planilhas do Excel ou cadernos, o que torna o processo lento, confuso e impossível de gerenciar em equipe.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Gera Leads, Mas Não Vende:</strong> A empresa atrai interessados, mas não tem um processo para "aquecer" esses contatos. Eles acabam esfriando e nunca chegam a comprar.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (As Dores que Resolvemos)</CardTitle>
          <CardDescription>Use estas perguntas para fazer o prospect sentir a dor que a nossa solução cura.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Já aconteceu de você lembrar de um cliente interessado semanas depois e perceber que ele já fechou com um concorrente?"</li>
            <li>"Como você organiza seu processo de vendas hoje? Consegue saber exatamente em que etapa cada cliente está?"</li>
            <li>"O que você faz com os contatos que pedem orçamento mas não fecham na hora? Gostaria de ter um 'robô' trabalhando para aquecer esses contatos para você?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BadgeCheck /> O Que Entregamos? (Nossas Duas Frentes de Atuação)</CardTitle>
          <CardDescription>Implementamos as duas principais ferramentas da RD Station, dependendo da necessidade do cliente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Bot className="h-5 w-5 text-primary" /> RD Station Marketing (Automação)</h3>
            <p className="text-sm text-muted-foreground mb-4">O objetivo aqui é criar uma máquina de comunicação que trabalha 24/7 para a empresa.</p>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Fluxos de Automação</span>
                      <p className="text-sm text-muted-foreground">Criamos "caminhos" automáticos. Ex: quando alguém baixa um e-book, o sistema envia uma sequência de e-mails educativos durante uma semana e, se a pessoa interagir, notifica o vendedor.</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Landing Pages e Formulários</span>
                      <p className="text-sm text-muted-foreground">Desenvolvemos páginas focadas em um único objetivo (ex: se inscrever em um webinar), com formulários que capturam os dados do visitante e os inserem automaticamente nos fluxos de automação.</p>
                  </div>
              </li>
               <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Email Marketing Inteligente</span>
                      <p className="text-sm text-muted-foreground">Gerenciamos o envio de e-mails para a base de contatos, mas de forma segmentada. Ex: enviar uma promoção de um produto apenas para quem já demonstrou interesse nele.</p>
                  </div>
              </li>
            </ul>
          </div>
           <div className="pt-6 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Filter className="h-5 w-5 text-primary" /> RD Station CRM (Organização de Vendas)</h3>
             <p className="text-sm text-muted-foreground mb-4">O objetivo aqui é dar total clareza e organização ao processo de vendas, acabando com a desordem.</p>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Funil de Vendas Visual</span>
                      <p className="text-sm text-muted-foreground">Configuramos um painel visual onde o vendedor pode ver todas as negociações em andamento e em qual etapa cada uma está (ex: "Primeiro Contato", "Proposta Enviada", "Negociação").</p>
                  </div>
              </li>
              <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Automação de Tarefas Comerciais</span>
                      <p className="text-sm text-muted-foreground">O sistema cria tarefas automáticas para o vendedor, como "Ligar para o cliente X" ou "Enviar e-mail de acompanhamento para Y", garantindo que nenhuma oportunidade seja esquecida.</p>
                  </div>
              </li>
               <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">Relatórios de Vendas</span>
                      <p className="text-sm text-muted-foreground">Configuramos painéis que mostram, de forma simples, o desempenho das vendas: quantas negociações foram ganhas, qual a taxa de conversão e qual vendedor está performando melhor.</p>
                  </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

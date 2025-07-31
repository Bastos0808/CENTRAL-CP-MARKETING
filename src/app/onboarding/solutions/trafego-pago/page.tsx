
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, CheckCircle, UserCheck, AlertTriangle, BookOpen, Hand, BarChart, Search, Target, Settings, MonitorPlay } from "lucide-react";

// SVG components for logos
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
);

const MetaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.4 0 .8 0 1.2-.1L12 18l-1.4-2.8c-1.4-.4-2.6-1.3-3.4-2.5L3.5 9.8c.2-.5.4-1 .7-1.5L2 6l3.3 2.7c.6-.4 1.3-.7 2-1L6 2l4 3.2c.7-.2 1.3-.2 2 0L16 2l-2.3 5.7c.7.2 1.4.5 2 1L22 6l-2.2 2.3c.3.5.5 1 .7 1.5l-3.7 2.9c-.8 1.2-2 2-3.4 2.5L12 18l1.2 3.9c.4.1.8.1 1.2.1 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
);


export default function TrafegoPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Megaphone className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">O que é Tráfego Pago (Anúncios)?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
             <strong>Tráfego pago</strong> é, de forma simples, pagar para criar anúncios na internet e aparecer para mais pessoas. É como colocar um outdoor na avenida mais movimentada do mundo digital. Nosso trabalho é fazer com que esses anúncios apareçam para as pessoas certas, gerando contatos interessados e acelerando as vendas de forma previsível.
          </p>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen /> Definições Básicas</CardTitle>
          <CardDescription>Conceitos e ferramentas que você precisa saber para vender este serviço.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Leads</h3>
            <p className="text-sm text-muted-foreground pl-6">São contatos de pessoas que demonstraram interesse em um produto ou serviço, geralmente ao preencherem um formulário. Nosso objetivo é gerar o máximo de leads qualificados para o cliente.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><BarChart className="h-4 w-4 text-primary" /> ROI (Retorno sobre o Investimento)</h3>
            <p className="text-sm text-muted-foreground pl-6">É a principal métrica do nosso trabalho. Para cada R$1 que o cliente investe em anúncios, o ROI nos diz quantos reais voltaram em vendas. É o que prova que marketing não é custo, é investimento.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Pixel de Rastreamento</h3>
            <p className="text-sm text-muted-foreground pl-6">É um código que instalamos no site do cliente e que rastreia o comportamento dos visitantes. Com essas informações, podemos criar anúncios ultra específicos para quem já demonstrou interesse (remarketing).</p>
          </div>
           <div className="pt-4 border-t">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><MetaIcon className="h-4 w-4 text-primary" /> Meta Ads (Facebook/Instagram Ads)</h3>
            <p className="text-sm text-muted-foreground pl-6">É a ferramenta para criar anúncios que aparecem no Instagram e no Facebook. É perfeita para despertar o desejo por um produto, pois conseguimos segmentar por interesses, comportamentos e dados demográficos. É ideal para encontrar novos clientes que ainda não conhecem a marca.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><GoogleIcon className="h-4 w-4 text-primary" /> Google Ads</h3>
            <p className="text-sm text-muted-foreground pl-6">É a plataforma para anunciar no Google. A grande vantagem é que alcançamos pessoas que estão ativamente procurando por uma solução naquele exato momento. Se alguém busca "clínica de estética em Goiânia", nós fazemos nosso cliente aparecer em primeiro lugar.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /> Gerenciador de Anúncios</h3>
            <p className="text-sm text-muted-foreground pl-6">É o painel de controle profissional para criar e gerenciar campanhas, tanto no Meta quanto no Google. É a nossa "cabine de piloto", que nos dá acesso a todas as ferramentas avançadas, muito diferente do simples botão "Impulsionar", que é como um "modo automático" com pouquíssimos recursos.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é o Cliente Ideal?</CardTitle>
          <CardDescription>Este serviço é perfeito para negócios que se encontram nestas situações:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Anúncios Sem Retorno:</strong> A empresa já tentou "impulsionar" posts ou criar anúncios, mas sente que está apenas "queimando dinheiro" sem ver um retorno claro em vendas ou contatos.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Concorrência Agressiva:</strong> Eles percebem que os concorrentes estão sempre aparecendo em anúncios e alcançando mais clientes, enquanto eles ficam para trás, dependendo apenas do alcance orgânico.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Precisa de Clientes Agora:</strong> O negócio precisa de um fluxo mais constante e previsível de novos clientes (leads) entrando em contato todos os dias, e não pode mais depender apenas de indicações.</span></li>
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
            <li>"Já teve a sensação de estar 'queimando dinheiro' com anúncios que não trazem clientes de volta?"</li>
            <li>"Você percebe que seus concorrentes estão sempre aparecendo para novos clientes através de anúncios? Como isso tem impactado seu negócio?"</li>
            <li>"Como seria para o seu negócio ter um fluxo constante de pessoas interessadas entrando em contato todos os dias?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Diferencial: Sistema de Aquisição)</CardTitle>
          <CardDescription>Não apenas apertamos o botão "impulsionar". Nós criamos um sistema de aquisição de clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-foreground">
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Planejamento e Estrutura de Campanhas</span>
                    <p className="text-sm text-muted-foreground">Primeiro, definimos quem é o cliente ideal e onde ele está. Depois, estruturamos as campanhas no Gerenciador de Anúncios com objetivos claros: é para gerar mensagens? Vendas no site? Preenchimento de formulário?</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Criação dos Anúncios (Criativos)</span>
                    <p className="text-sm text-muted-foreground">Nós criamos as imagens, vídeos e textos que serão usados nos anúncios. Cada elemento é pensado para chamar a atenção do público certo e convencê-lo a clicar.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Gestão e Otimização Diária</span>
                    <p className="text-sm text-muted-foreground">Acompanhamos os anúncios todos os dias, vendo o que funciona melhor. Fazemos <strong>Testes A/B</strong> (ex: comparamos o anúncio A com o anúncio B para ver qual vende mais) e movemos o dinheiro para as campanhas que trazem mais resultado.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Pixel e Rastreamento (O 'espião')</span>
                    <p className="text-sm text-muted-foreground">Instalamos códigos (como o <strong>Pixel do Facebook</strong>) no site do cliente. Isso nos permite "ver" quem visitou o site ou quem comprou. Com essa informação, podemos criar anúncios específicos para essas pessoas (remarketing), o que aumenta muito a chance de conversão.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Relatórios de Performance Focados em ROI</span>
                    <p className="text-sm text-muted-foreground">Mostramos para o cliente, de forma clara, quanto foi investido e quanto retornou em vendas (o <strong>ROI</strong>). É um relatório focado em resultado de negócio, não em métricas confusas.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

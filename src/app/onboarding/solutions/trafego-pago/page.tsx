
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, CheckCircle, UserCheck, AlertTriangle, BookOpen } from "lucide-react";

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
             <strong>Tráfego pago</strong> é, de forma simples, pagar para criar anúncios na internet e aparecer para mais pessoas. Nosso trabalho é fazer com que esses anúncios apareçam para as pessoas certas, gerando contatos interessados e acelerando as vendas de forma previsível.
          </p>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen /> Definições Básicas</CardTitle>
          <CardDescription>Conceitos que você precisa saber para vender este serviço.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">Meta Ads (Facebook e Instagram Ads)</h3>
            <p className="text-sm text-muted-foreground">A plataforma para criar anúncios que aparecem no Instagram, Facebook, Messenger e WhatsApp. Ideal para gerar desejo e alcançar clientes com base em seus interesses e comportamentos.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Google Ads</h3>
            <p className="text-sm text-muted-foreground">A plataforma de anúncios do Google. Aparecemos para pessoas que já estão procurando ativamente por um produto ou serviço, geralmente no topo dos resultados de busca.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground">Leads</h3>
            <p className="text-sm text-muted-foreground">Pessoas que demonstraram interesse no seu produto ou serviço ao interagir com um anúncio (clicando, enviando uma mensagem, preenchendo um formulário). São potenciais clientes.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">ROI (Retorno sobre o Investimento)</h3>
            <p className="text-sm text-muted-foreground">A métrica mais importante: mostra quanto dinheiro a empresa ganhou para cada real que investiu em anúncios. É a prova de que o marketing está funcionando.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground">Pixel de Rastreamento</h3>
            <p className="text-sm text-muted-foreground">Um pequeno código que instalamos no site do cliente. Funciona como um "espião" que nos diz quais usuários visitaram o site, permitindo-nos criar anúncios específicos para eles (remarketing).</p>
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

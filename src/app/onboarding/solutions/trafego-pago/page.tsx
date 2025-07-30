
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function TrafegoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Megaphone className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Tráfego Pago (Ads)</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
             Desenvolvemos e otimizamos campanhas de anúncios para alcançar o público certo, gerar leads qualificados e acelerar as vendas.
          </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas que sentem que estão "queimando dinheiro" com anúncios sem retorno.</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios que veem seus concorrentes em todos os lugares, mas não conseguem o mesmo alcance.</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Profissionais que precisam de um fluxo constante de novos clientes (leads).</span></li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>"Sente que está 'queimando dinheiro' com anúncios sem retorno?"</li>
              <li>"Seus concorrentes aparecem para todos, menos você?"</li>
              <li>"Precisa de mais clientes chegando todos os dias?"</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Planejamento e Estruturação de Campanhas:</strong> Mapeamento de público, definição de objetivos e estruturação completa no Gerenciador de Anúncios.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Criação de Anúncios (Criativos):</strong> Desenvolvimento de imagens, vídeos e textos (copy) otimizados para conversão em cada etapa do funil.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Gestão e Otimização Diária:</strong> Acompanhamento constante das métricas, testes A/B e ajustes para maximizar o retorno sobre o investimento (ROAS).</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Pixel e Rastreamento:</strong> Instalação e configuração correta das ferramentas de rastreamento para mensurar resultados com precisão.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Relatórios de Performance:</strong> Relatórios claros e objetivos que mostram o desempenho das campanhas, o custo por lead/venda e os próximos passos.</div></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

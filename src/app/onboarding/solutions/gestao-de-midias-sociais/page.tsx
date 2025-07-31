
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function GestaoMidiasPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Palette className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Mídias Sociais</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Criamos e gerenciamos conteúdo estratégico para construir autoridade, engajar a audiência e transformar seguidores em clientes.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas cujo perfil não reflete a qualidade do seu trabalho.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios que postam conteúdo, mas não conseguem gerar vendas.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Profissionais sem tempo ou criatividade para manter a consistência.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Seu perfil não reflete a qualidade do seu trabalho?"</li>
            <li>"Posta, posta, posta e não vê resultado em vendas?"</li>
            <li>"Sem tempo ou criatividade para manter a consistência?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Nosso Processo)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Diagnóstico e Planejamento Estratégico Personalizado</span>
                    <p className="text-sm text-muted-foreground">Não criamos posts aleatórios. Mergulhamos no negócio do cliente para entender o mercado, os objetivos e o público. Aqui definimos os pilares de conteúdo, a linha editorial e o tom de voz que guiarão toda a comunicação.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Produção de Conteúdo de Alta Qualidade</span>
                    <p className="text-sm text-muted-foreground">Criamos posts em múltiplos formatos (Artes, Carrosséis, Reels, Stories) com design profissional, utilizando ferramentas como Photoshop, Premiere e After Effects. Desenvolvemos legendas (copywriting) persuasivas, pensadas para engajar e converter.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Gestão e Publicação Consistente</span>
                    <p className="text-sm text-muted-foreground">Gerenciamos todo o fluxo de aprovação e agendamento dos posts, garantindo a frequência e os melhores horários de publicação para maximizar o alcance e manter a marca do cliente sempre presente na mente do consumidor.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Análise de Performance e Otimização</span>
                    <p className="text-sm text-muted-foreground">Apresentamos relatórios mensais que vão além das métricas de vaidade. Analisamos o que funcionou, o que não funcionou e por quê, usando esses insights para otimizar a estratégia e direcionar os próximos passos de forma inteligente.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

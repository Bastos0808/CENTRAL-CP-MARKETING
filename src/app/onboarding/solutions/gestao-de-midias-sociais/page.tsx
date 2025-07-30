
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function GestaoMidiasPage() {
  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Planejamento Estratégico de Conteúdo:</strong> Definição de pilares, editoriais e calendário mensal alinhado aos seus objetivos.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Criação e Design de Posts:</strong> Produção de artes, carrosséis e vídeos (Reels/TikTok) com design profissional e copywriting persuasivo.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Agendamento e Publicação:</strong> Gerenciamos todo o fluxo de publicação para garantir consistência e os melhores horários.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Relacionamento e Engajamento:</strong> Interação estratégica nos stories, resposta a comentários e DMs para construir uma comunidade.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Análise e Relatórios Mensais:</strong> Apresentamos os resultados, o que funcionou e os planos para o próximo ciclo.</div></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

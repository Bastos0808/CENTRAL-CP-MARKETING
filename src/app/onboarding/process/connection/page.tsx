
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, CheckSquare, AlertTriangle, UserPlus, MessageSquare, Clock, Mail } from "lucide-react";

const connectionSteps = [
    {
        icon: UserPlus,
        title: "Envio do Convite de Conexão",
        details: [
            "Envie o convite de conexão para o decisor identificado no LinkedIn.",
            "<strong>Ponto Crítico:</strong> Não envie uma mensagem junto ao convite. O objetivo inicial é estritamente a conexão.",
            "<strong>Fundamento:</strong> Um convite sem mensagem tem maior taxa de aceitação, pois é percebido como menos comercial e estabelece um primeiro ponto de contato neutro."
        ]
    },
    {
        icon: MessageSquare,
        title: "Interação Pós-Conexão",
        details: [
            "Após a aceitação do convite, monitore a atividade do lead ou visite seu perfil.",
            "Interaja com 1 ou 2 publicações recentes do decisor ou da página da empresa.",
            "<strong>Melhor Prática:</strong> Um comentário relevante que contribua para a discussão é superior a uma simples curtida. Demonstra interesse genuíno no conteúdo do lead.",
            "<strong>Fundamento:</strong> Esta ação gera uma segunda notificação, reforçando o reconhecimento do seu nome e associando-o a uma interação profissional."
        ]
    },
    {
        icon: Clock,
        title: "Intervalo Estratégico",
        details: [
            "Aguarde de 1 a 2 dias úteis após a interação antes de iniciar o contato direto (Fase 3).",
            "Não envie a mensagem de prospecção no mesmo dia da aceitação do convite.",
            "<strong>Fundamento:</strong> O intervalo de tempo remove a percepção de urgência ou desespero, tornando a abordagem subsequente mais natural e profissional."
        ]
    }
];

export default function ConnectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Handshake className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 2: Conexão</h1>
            <p className="text-lg text-muted-foreground mt-1">
                O objetivo desta fase é estabelecer familiaridade com o prospect de forma sutil e profissional. A prospecção é mais eficaz quando o lead já reconhece seu nome antes da abordagem direta.
            </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {connectionSteps.map((step) => (
            <Card key={step.title}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <step.icon className="h-6 w-6 text-primary" />
                        {step.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {step.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: detail }}/>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        ))}
      </div>


       <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-500"><AlertTriangle /> Procedimento Alternativo: Falha na Conexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <p className="text-yellow-700/80 dark:text-yellow-500/80">
                  Se o convite no LinkedIn não for aceito em 3-4 dias úteis, ou se o decisor for inativo na plataforma, o plano de aquecimento deve ser adaptado.
              </p>
               <div className="flex items-start gap-3 text-yellow-700/80 dark:text-yellow-500/80">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span><strong>Ação Corretiva:</strong> Avance diretamente para a Fase 3 (Contato Direto), utilizando o e-mail do prospect como canal principal. A pesquisa da Fase 1 continua sendo o ativo mais importante para a personalização da mensagem.</span>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

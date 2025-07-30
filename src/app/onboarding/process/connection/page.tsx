
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, CheckSquare, AlertTriangle, UserPlus, MessageSquare, Clock, Mail } from "lucide-react";

const connectionSteps = [
    {
        icon: UserPlus,
        title: "O Convite Silencioso (LinkedIn)",
        details: [
            "Envie um convite de conexão para o decisor identificado.",
            "<strong>CRÍTICO:</strong> Não envie uma mensagem junto com o convite. O objetivo é apenas a conexão, sem vender nada.",
            "<strong>O Porquê:</strong> Um convite sem mensagem é percebido como menos 'vendedor' e tem uma taxa de aceitação muito maior. Você está apenas aparecendo no radar, não pedindo nada."
        ]
    },
    {
        icon: MessageSquare,
        title: "A Interação Estratégica",
        details: [
            "Após a conexão ser aceita, espere o lead aparecer no seu feed ou visite o perfil dele.",
            "Interaja com 1 ou 2 posts recentes do decisor ou da empresa.",
            "<strong>A Melhor Prática:</strong> Um comentário genuíno que adiciona valor à discussão é muito mais poderoso do que uma simples curtida. Mostra que você leu e pensou sobre o assunto.",
            "<strong>O Porquê:</strong> Isso gera uma segunda notificação e reforça a familiaridade. Ele vê seu nome novamente, agora associado a uma interação positiva."
        ]
    },
    {
        icon: Clock,
        title: "O Jogo da Paciência",
        details: [
            "Aguarde de 1 a 2 dias úteis após a sua interação antes de passar para a próxima fase (Contato Direto).",
            "Não envie a mensagem de prospecção no mesmo dia em que ele aceitou o convite.",
            "<strong>O Porquê:</strong> A paciência nesta fase não é passividade, é uma tática. Ela remove a percepção de desespero e torna sua abordagem na Fase 3 muito mais natural e bem-recebida."
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
                O objetivo aqui é simples: aparecer no radar do prospect de forma sutil e profissional. Pessoas compram de quem elas conhecem e confiam. Esta fase inicia o processo de familiaridade.
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
              <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-500"><AlertTriangle /> Plano B: E se não houver conexão?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <p className="text-yellow-700/80 dark:text-yellow-500/80">
                  Nem todo decisor é ativo no LinkedIn ou aceitará seu convite. Se após 3-4 dias úteis o convite não for aceito, não se desespere. É hora de mudar de canal.
              </p>
               <div className="flex items-start gap-3 text-yellow-700/80 dark:text-yellow-500/80">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span><strong>Ação:</strong> Abandone a estratégia de aquecimento no LinkedIn e parta para a Fase 3 (Contato Direto) usando o e-mail do prospect como canal principal. A pesquisa que você fez na Fase 1 continua sendo seu maior trunfo.</span>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

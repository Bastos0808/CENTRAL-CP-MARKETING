
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, CheckSquare, Wand2, Mail, MessageSquare, PhoneCall } from "lucide-react";

const checklist = [
    { text: "O objetivo NUNCA é vender na primeira mensagem. O objetivo é validar a dor e agendar uma reunião de diagnóstico." },
    { text: "Use o 'gancho' que você identificou na Fase 1 para iniciar a conversa de forma personalizada e mostrar que fez a lição de casa." },
    { text: "Seja breve e direto. Apresente-se, mencione o 'gancho' e conecte com a dor observada." },
    { text: "Use os modelos de abordagem como base, mas sempre adapte com sua própria personalidade e com as informações do prospect." },
    { text: "Se o lead demonstrar interesse, a única meta é levá-lo para a Fase 3: Agendamento. Não tente explicar a solução ou dar muitos detalhes." },
];

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Phone className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 2: Contato Direto</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Este é o momento da verdade. Com a pesquisa feita, você tem os contatos do prospect e um motivo relevante para iniciar a conversa. A qualidade da sua abordagem definirá o sucesso.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Checklist da Abordagem</CardTitle>
        </CardHeader>
        <CardContent>
             <ul className="space-y-4">
                {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item.text}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><MessageSquare /> Modelo de Abordagem (WhatsApp / E-mail)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full">
                    <p className="whitespace-pre-wrap text-foreground">
                        Olá [Nome do Prospect], tudo bem?
                        <br/><br/>
                        Meu nome é [Seu Nome], sou da CP Marketing Digital.
                        <br/><br/>
                        Vi que vocês [Gancho/Problema Observado - ex: estão investindo bastante em feiras e eventos, parabéns pela iniciativa].
                        <br/><br/>
                        Normalmente, empresas de [Setor] que focam nisso encontram o desafio de [Dor Conectada - ex: transformar o networking do evento em clientes reais depois].
                        <br/><br/>
                        Isso faz sentido para você?
                    </p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><PhoneCall /> Modelo de Script (Ligação)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg w-full space-y-2">
                   <p className="text-foreground"><strong>Você:</strong> "Oi, [Nome do Prospect], tudo bem? Aqui é o [Seu Nome] da CP Marketing. Te atrapalho?"</p>
                   <p className="text-foreground"><strong>Você:</strong> "Vi que [Gancho/Problema Observado]. Notei que muitas empresas de [Setor] que fazem isso, depois sentem dificuldade em [Dor Conectada]."</p>
                   <p className="text-foreground"><strong>Você:</strong> "Isso acontece aí com vocês também ou é diferente?"</p>
                   <p className="text-foreground"><strong>(Se a resposta for sim...)</strong></p>
                   <p className="text-foreground"><strong>Você:</strong> "Entendi. Não quero tomar seu tempo, mas acho que consigo te ajudar. Que tal conversarmos por 15 minutos amanhã para eu te apresentar um diagnóstico rápido? O que acha das 10h ou 14h?"</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
              <CardTitle className="flex items-center gap-3"><Wand2 /> Use a IA a seu favor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex-1">
                Está sem criatividade? Nossa ferramenta de IA pode te ajudar a criar o script inicial para sua ligação ou a mensagem de texto para o WhatsApp/E-mail. Use-a como fonte de inspiração para aprimorar e personalizar sua abordagem.
            </p>
          </CardContent>
      </Card>
    </div>
  );
}

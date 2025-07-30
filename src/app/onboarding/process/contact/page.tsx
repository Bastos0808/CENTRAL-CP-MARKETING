
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, CheckSquare, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const checklist = [
    { text: "O canal principal de contato é o telefone (ligação ou WhatsApp) fornecido no CRM ou obtido na prospecção." },
    { text: "Use o 'gancho' que você identificou na Fase 1 para iniciar a conversa de forma personalizada." },
    { text: "Seja breve e direto. Apresente-se, mencione o 'gancho' e conecte com a dor observada." },
    { text: "Exemplo de abordagem: 'Olá [Nome], aqui é [Seu Nome] da CP. Vi que [Gancho/Problema]. Isso tem sido um desafio para vocês?'" },
    { text: "O objetivo NUNCA é vender na primeira ligação. O objetivo é validar a dor e agendar uma reunião de diagnóstico." },
    { text: "Se o lead demonstrar interesse, a única meta é levá-lo para a Fase 4: Agendamento." }
];

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Phone className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 3: Contato Direto (Ligação ou WhatsApp)</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Este é o momento da verdade. Com a pesquisa feita, você tem o número do prospect e um motivo relevante para ligar. A qualidade da sua abordagem definirá o sucesso.
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

      <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
              <CardTitle className="flex items-center gap-3"><Wand2 /> Use a IA a seu favor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground flex-1">
                Nossa ferramenta de IA pode ajudar a criar o script inicial para sua ligação ou a mensagem de texto para o WhatsApp. Use-a para gerar ideias e aprimorar sua abordagem.
            </p>
            <Link href="/ferramentas">
                <Button>
                    Acessar Ferramenta de IA
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
          </CardContent>
      </Card>
    </div>
  );
}

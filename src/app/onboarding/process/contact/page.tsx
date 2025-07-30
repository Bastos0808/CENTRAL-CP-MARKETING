
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckSquare, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const checklist = [
    { text: "Envie uma mensagem curta, direta e personalizada, usando o 'gancho' que você identificou na fase de pesquisa." },
    { text: "A mensagem deve focar na DOR do prospect, não em listar os serviços da CP Marketing." },
    { text: "Estrutura ideal: 'Olá [Nome], vi que [Problema/Oportunidade]. Muitos dos nossos clientes de [Setor] enfrentavam isso e conseguiram [Resultado]. Faz sentido conversarmos 15min sobre?'" },
    { text: "Use nossa ferramenta de IA para gerar versões dessa mensagem e treinar sua escrita." },
    { text: "O objetivo da mensagem é despertar curiosidade e conseguir uma resposta positiva para uma chamada, não vender a solução completa." }
];

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 3: Contato Direto (Mensagem)</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Este é o momento da verdade. Com a pesquisa feita e a conexão estabelecida, você tem a permissão para enviar uma mensagem. A qualidade da sua mensagem definirá o sucesso.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Checklist de Ações</CardTitle>
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
                Nossa ferramenta de IA foi treinada para criar mensagens de prospecção com base nos dados do prospect. Use-a para gerar ideias e aprimorar sua abordagem.
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Trophy } from "lucide-react";

const checklist = [
    { text: "Se o prospect responder positivamente ('sim', 'tenho interesse', 'como funciona?'), sua única missão é agendar a reunião." },
    { text: "Seja rápido e objetivo. Não tente vender ou dar muitos detalhes pelo chat/e-mail. Responda com: 'Ótimo! Para te explicar melhor, qual desses horários fica bom para uma chamada de 15min?'" },
    { text: "Ofereça 2 ou 3 opções de horários diretamente (ex: 'Amanhã às 10h ou 14h?'). Isso evita a fadiga de decisão." },
    { text: "Assim que o horário for confirmado, envie o convite na agenda (Google Calendar) com o link da chamada de vídeo." },
    { text: "Confirme o recebimento do convite e informe que um de nossos especialistas (Closer) conduzirá a conversa." },
];

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Calendar className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 3: Agendamento da Reunião</h1>
            <p className="text-lg text-muted-foreground mt-1">
                A etapa final do processo de SDR. O "sim" do prospect é o gatilho para uma transição rápida e eficiente para o time de vendas (Closers).
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

      <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-500"><Trophy /> Missão Cumprida!</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-green-700/80 dark:text-green-500/80">
                  Parabéns! Ao agendar a reunião, você completou seu ciclo com sucesso. O lead agora está qualificado e será assumido por um Closer, que ficará responsável pela apresentação da proposta e pelo fechamento. Seu trabalho foi fundamental para que essa oportunidade existisse.
              </p>
          </CardContent>
      </Card>

    </div>
  );
}

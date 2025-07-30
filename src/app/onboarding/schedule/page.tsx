
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search, Mail, Coffee, BookOpen } from "lucide-react";

const scheduleBlocks = [
  { time: "09:00 - 09:30", title: "Planejamento e Aquecimento", icon: Coffee, description: "Organize seu dia, defina metas e revise seus leads prioritários." },
  { time: "09:30 - 12:00", title: "Bloco de Prospecção Focada 1", icon: Mail, description: "Pesquisa, personalização e envio de primeiras mensagens e follow-ups." },
  { time: "12:00 - 13:00", title: "Almoço e Descanso", icon: Clock, description: "Recarregue as energias. Evite checar e-mails." },
  { time: "13:00 - 14:00", title: "Pesquisa de Novos Leads", icon: Search, description: "Alimente sua lista com novas empresas dentro do ICP." },
  { time: "14:00 - 16:30", title: "Bloco de Prospecção Focada 2", icon: Mail, description: "Continue o trabalho de contato e acompanhamento." },
  { time: "16:30 - 17:00", title: "Aprendizado e Fechamento", icon: BookOpen, description: "Estude o mercado, organize o CRM e planeje o dia seguinte." },
];

export default function SchedulePage() {
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Consistência é a chave do sucesso em prospecção. Este é um modelo de rotina diária para otimizar sua produtividade. Adapte-o à sua realidade, mas mantenha a disciplina dos blocos de foco.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Modelo de Rotina Diária do SDR</CardTitle>
                    <CardDescription>Uma estrutura para um dia produtivo e focado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {scheduleBlocks.map((block) => (
                        <div key={block.time} className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                            <div className="hidden sm:block bg-primary/10 p-3 rounded-full">
                                <block.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 grid grid-cols-4 items-center gap-4">
                                <p className="font-bold text-primary col-span-1">{block.time}</p>
                                <div className="col-span-3">
                                    <h4 className="font-semibold text-foreground">{block.title}</h4>
                                    <p className="text-sm text-muted-foreground">{block.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

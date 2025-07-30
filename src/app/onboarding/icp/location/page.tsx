
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle, Globe, Building, Mic } from "lucide-react";

const locations = [
    {
        icon: Globe,
        title: "Atendimento Remoto em todo o Brasil",
        description: "Estamos equipados para atender clientes em qualquer estado do país de forma 100% remota para serviços de gestão de mídias e tráfego pago.",
        filter: "Para serviços digitais, a localização não é uma barreira. Qualifique com base nos outros critérios do ICP, independentemente do estado."
    },
    {
        icon: Building,
        title: "Foco de Prospecção em Capitais",
        description: "Nossa prospecção ativa é direcionada principalmente para capitais e grandes centros (São Paulo, Rio de Janeiro, Belo Horizonte, Goiânia, etc).",
        filter: "Ao montar suas listas de prospecção, priorize empresas localizadas em capitais, onde a concentração de negócios do nosso ICP é maior."
    },
    {
        icon: Mic,
        title: "Podcast Studio Físico (Goiânia)",
        description: "Para clientes do serviço de produção de podcast, a gravação presencial ocorre em nosso estúdio em Goiânia. Outras localidades podem ser atendidas remotamente.",
        filter: "Se o prospect tem interesse em podcast, a primeira pergunta de qualificação é sua localização. Se não for de Goiânia, ele precisa ter estrutura própria para gravação remota."
    }
]

export default function LocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Localização e Atendimento</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Nosso modelo de trabalho é flexível, mas temos um foco geográfico estratégico para otimizar a prospecção e os serviços que exigem presença física.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((item, index) => (
            <Card key={item.title} className={locations.length === 3 && index === 0 ? "md:col-span-2 lg:col-span-1" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <item.icon className="h-7 w-7 text-primary" />
                        {item.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-sm text-foreground mb-2">Orientação SDR:</h4>
                        <p className="text-sm text-muted-foreground">{item.filter}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

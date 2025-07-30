
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle, Globe, Building, Mic } from "lucide-react";

const locations = [
    {
        icon: Globe,
        title: "Atendimento Remoto em todo o Brasil",
        description: "Estamos equipados para atender clientes em qualquer estado do país de forma 100% remota, usando ferramentas de comunicação eficientes."
    },
    {
        icon: Building,
        title: "Foco de Prospecção em Capitais",
        description: "Nossa prospecção ativa é direcionada principalmente para capitais e grandes cidades, onde a concentração de empresas do nosso ICP é maior e mais fácil de identificar."
    },
    {
        icon: Mic,
        title: "Podcast Studio Físico",
        description: "Para clientes do serviço de podcast, a gravação presencial ocorre em nosso estúdio. Clientes de outras localidades podem ser atendidos remotamente se tiverem estrutura própria."
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
        {locations.map((item) => (
            <Card key={item.title} className={locations.length === 3 && item.icon === Globe ? "lg:col-start-2" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <item.icon className="h-7 w-7 text-primary" />
                        {item.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

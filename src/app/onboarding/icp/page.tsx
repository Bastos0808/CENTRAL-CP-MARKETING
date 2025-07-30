
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, DollarSign, Target, Milestone } from "lucide-react";

const icpCriteria = [
    {
        icon: Milestone,
        title: "Estágio do Negócio",
        items: ["Empresas estabelecidas (mínimo 2 anos)", "Possuem faturamento recorrente", "Já têm uma base de clientes", "Buscam escalar e profissionalizar o marketing"],
    },
    {
        icon: Building,
        title: "Setores Prioritários",
        items: ["Saúde e bem-estar (clínicas, médicos, dentistas)", "Serviços B2B (consultorias, agências, tecnologia)", "E-commerce com produto validado", "Negócios locais premium (restaurantes, estética)"],
    },
    {
        icon: DollarSign,
        title: "Capacidade de Investimento",
        items: ["Possuem orçamento dedicado para marketing", "Entendem que marketing é investimento, não custo", "Ticket médio que justifique o investimento em agência"],
    },
    {
        icon: Target,
        title: "Mentalidade do Decisor",
        items: ["Aberto a novas estratégias e inovação", "Busca uma parceria de longo prazo", "Valoriza o trabalho estratégico e não apenas 'posts bonitos'", "Delega e confia no trabalho da agência"],
    },
    {
        icon: MapPin,
        title: "Localização",
        items: ["Atuação em todo o Brasil", "Foco principal em capitais e grandes centros urbanos"],
    },
];

export default function IcpPage() {
  return (
    <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
            Não vendemos para todo mundo. Focamos em clientes que podemos genuinamente ajudar a crescer. Conheça nosso Perfil de Cliente Ideal (ICP).
        </p>

        <div className="space-y-4">
            {icpCriteria.map((criterion) => (
                <Card key={criterion.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <criterion.icon className="h-6 w-6 text-primary" />
                            {criterion.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            {criterion.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}

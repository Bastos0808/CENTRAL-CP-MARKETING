
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CheckCircle, Heart, Stethoscope, Briefcase, ShoppingCart } from "lucide-react";

const sectors = [
    {
        icon: Stethoscope,
        title: "Saúde e Bem-Estar",
        description: "Clínicas, médicos, dentistas, psicólogos e outros profissionais da saúde que precisam construir autoridade e atrair pacientes."
    },
    {
        icon: Briefcase,
        title: "Serviços B2B",
        description: "Consultorias, agências de nicho, empresas de tecnologia e outros negócios que vendem para outras empresas e precisam de leads qualificados."
    },
    {
        icon: ShoppingCart,
        title: "E-commerce com Produto Validado",
        description: "Lojas virtuais que já têm um produto testado e aprovado pelo mercado, e que agora precisam escalar as vendas de forma consistente."
    },
    {
        icon: Heart,
        title: "Negócios Locais Premium",
        description: "Restaurantes, clínicas de estética, e outros serviços locais que atendem a um público de alto padrão e precisam de um posicionamento forte."
    }
]

export default function PrioritySectorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Building className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Setores Prioritários</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Embora sejamos versáteis, nossa expertise e os resultados mais expressivos se concentram em alguns setores-chave onde nossa metodologia gera mais impacto.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectors.map((sector) => (
            <Card key={sector.title}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <sector.icon className="h-7 w-7 text-primary" />
                        {sector.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{sector.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

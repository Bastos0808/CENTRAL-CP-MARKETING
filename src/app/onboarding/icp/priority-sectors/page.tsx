
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CheckCircle, Heart, Stethoscope, Briefcase, ShoppingCart, Sparkles } from "lucide-react";

const sectors = [
    {
        icon: Stethoscope,
        title: "Saúde e Bem-Estar",
        description: "Clínicas, médicos, dentistas, psicólogos e outros profissionais que precisam construir autoridade para atrair pacientes qualificados. O foco é em serviços de ticket médio/alto, onde a percepção de qualidade é fundamental.",
        filter: "Busque por perfis que parecem amadores ou desatualizados, mas o serviço oferecido é de alto valor. A dor principal é não saber comunicar a própria qualidade. A prospecção pode ser feita via pesquisa fria no Instagram e análise de tráfego pago dos concorrentes."
    },
    {
        icon: Sparkles,
        title: "Estética e Beleza",
        description: "Clínicas de estética avançada, salões de beleza de alto padrão e profissionais que oferecem serviços premium. Este setor depende fortemente da imagem e da prova social.",
        filter: "O principal sinal de oportunidade é a falta de consistência visual e a ausência de vídeos mostrando os procedimentos (antes e depois). A dor é a dificuldade em se diferenciar em um mercado concorrido e justificar um preço mais alto."
    },
    {
        icon: Briefcase,
        title: "Serviços B2B e Consultorias",
        description: "Consultorias, agências de nicho, escritórios de advocacia, empresas de tecnologia (SaaS) e negócios que vendem para outras empresas, focando em geração de leads qualificados e construção de autoridade no LinkedIn.",
        filter: "Use nossa ferramenta de prospecção, Exact Spotter, para encontrar empresas com sites institucionais antigos ou LinkedIn com baixa atividade. A dor é a dificuldade em gerar novas oportunidades de negócio de forma previsível."
    },
    {
        icon: Heart,
        title: "Negócios Locais Premium",
        description: "Restaurantes de alto padrão, lojas conceito, e outros serviços locais que atendem a um público exigente e precisam de um posicionamento forte na sua região.",
        filter: "Analise a presença digital de negócios que são referência na cidade, mas cuja comunicação online não reflete seu status. A dor é a dependência de indicações e a falta de um canal digital forte para atrair novos clientes."
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
                Embora sejamos versáteis, nossa expertise e os resultados mais expressivos se concentram em alguns setores-chave onde nossa metodologia gera mais impacto. Focar nesses nichos aumenta drasticamente sua chance de sucesso.
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
                    <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-sm text-foreground mb-2">O que buscar (Dor Oculta):</h4>
                        <p className="text-sm text-muted-foreground">{sector.filter}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserCheck, Link as LinkIcon, Users, ZoomIn, Briefcase } from "lucide-react";
import Link from "next/link";

const researchSteps = [
    { 
        icon: UserCheck,
        title: "Qualificação com o ICP",
        description: "A primeira e mais crítica etapa. Verifique se o prospect se encaixa em TODOS os critérios do nosso Perfil de Cliente Ideal (Setor, Estágio, Mentalidade, etc). Se um critério fundamental falhar, o prospect provavelmente não é um bom fit. Não perca tempo com leads desqualificados." 
    },
    { 
        icon: Users,
        title: "Identificação do Decisor",
        description: "Encontre a pessoa certa para contatar. Geralmente é o Sócio, CEO, Diretor de Marketing ou Gerente da área. Use o LinkedIn Sales Navigator ou a seção 'Equipe/Sobre' do site da empresa. Entrar em contato com a pessoa errada pode encerrar a oportunidade antes mesmo de começar." 
    },
    { 
        icon: ZoomIn,
        title: "Análise da Presença Digital",
        description: "Mergulhe no universo do prospect. Analise o site (está moderno?), o Instagram (frequência, qualidade, engajamento) e o LinkedIn (posts da empresa e do decisor). Entenda como eles se comunicam hoje para encontrar brechas e oportunidades." 
    },
    { 
        icon: LinkIcon,
        title: "Busca por 'Ganchos'",
        description: "Procure por um motivo relevante para iniciar a conversa. Pode ser um post recente, um artigo que o decisor escreveu, uma contratação nova na empresa, ou uma dor evidente (ex: posts antigos, comunicação fraca, concorrentes anunciando forte)." 
    },
    {
        icon: Briefcase,
        title: "Sinais de Crescimento",
        description: "Verifique se a empresa está contratando, especialmente em áreas de vendas ou marketing. Anúncios de vagas no LinkedIn ou no site da empresa são um forte indicativo de que eles estão investindo em crescimento e podem estar abertos a novas soluções."
    }
];

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 1: Pesquisa e Qualificação</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Esta é a fase mais importante. Um bom SDR gasta 80% do seu tempo aqui. Uma prospecção bem-sucedida não depende de quantas pessoas você contata, mas da qualidade desses contatos.
            </p>
        </div>
      </div>

      <div className="space-y-4">
          {researchSteps.map((step) => (
            <Card key={step.title}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <step.icon className="h-6 w-6 text-primary" />
                        {step.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
            </Card>
          ))}
      </div>
      
       <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
              <CardTitle>Ferramentas e Recursos Essenciais</CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                  <li><strong>LinkedIn Sales Navigator:</strong> Para encontrar decisores e filtrar empresas por setor, tamanho e localização.</li>
                  <li><strong>Exact Spotter:</strong> Nossa ferramenta interna para prospecção B2B. <Link href="/ferramentas" className="text-primary hover:underline">Acesse aqui.</Link></li>
                  <li><strong>Biblioteca de Anúncios do Facebook:</strong> Para verificar se os concorrentes do seu prospect (e ele mesmo) estão anunciando.</li>
                   <li><strong>Documentação do ICP:</strong> Use como seu guia principal. Se houver dúvida, consulte antes de avançar. <Link href="/onboarding/icp" className="text-primary hover:underline">Consulte aqui.</Link></li>
              </ul>
          </CardContent>
      </Card>

    </div>
  );
}

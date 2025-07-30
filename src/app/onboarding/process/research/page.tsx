
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, UserCheck, Link as LinkIcon, Users, ZoomIn, Briefcase, CheckCircle } from "lucide-react";
import Link from "next/link";

const researchSteps = [
    { 
        icon: UserCheck,
        title: "Qualificação com o ICP",
        description: "A primeira e mais crítica etapa. Verifique se o prospect se encaixa em TODOS os critérios do nosso Perfil de Cliente Ideal. Se um critério fundamental falhar, descarte o lead. Não perca tempo com leads desqualificados.",
        instructions: [
            "Abra a documentação do ICP.",
            "Verifique o setor, estágio do negócio, e capacidade de investimento.",
            "Analise o site e LinkedIn para entender a mentalidade do decisor."
        ]
    },
    { 
        icon: Users,
        title: "Identificação do Decisor",
        description: "Encontre a pessoa certa para contatar. Geralmente é o Sócio, CEO, Diretor de Marketing ou Gerente da área. Entrar em contato com a pessoa errada pode encerrar a oportunidade antes mesmo de começar.",
        instructions: [
            "Use o LinkedIn Sales Navigator para filtrar por cargo na empresa alvo.",
            "Verifique a seção 'Pessoas' na página do LinkedIn da empresa.",
            "Procure pelo decisor na seção 'Sobre' ou 'Equipe' do site da empresa."
        ]
    },
    { 
        icon: ZoomIn,
        title: "Análise da Presença Digital",
        description: "Mergulhe no universo do prospect. Analise o site, o Instagram e o LinkedIn para entender como eles se comunicam hoje e encontrar brechas.",
        instructions: [
            "O site é moderno ou parece desatualizado?",
            "Qual a frequência de posts no Instagram? A qualidade visual é profissional?",
            "O decisor e a empresa postam no LinkedIn? Qual o nível de engajamento?"
        ]
    },
    { 
        icon: LinkIcon,
        title: "Busca por 'Ganchos'",
        description: "Procure por um motivo relevante e personalizado para iniciar a conversa. Um bom gancho mostra que você fez sua lição de casa.",
        instructions: [
            "Encontre um post recente do decisor ou da empresa para comentar.",
            "Veja se a empresa anunciou uma nova contratação ou expansão.",
            "Identifique uma dor clara: posts antigos, comunicação fraca, concorrentes anunciando forte enquanto eles não."
        ]
    },
    {
        icon: Briefcase,
        title: "Sinais de Crescimento",
        description: "Verifique se a empresa está contratando, especialmente em áreas de vendas ou marketing. Vagas abertas são um forte indicativo de que estão investindo em crescimento.",
        instructions: [
            "Procure pela aba 'Vagas' na página do LinkedIn da empresa.",
            "Verifique se há uma seção 'Trabalhe Conosco' no site da empresa.",
            "Use o Google para pesquisar por '[nome da empresa] vagas'."
        ]
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

      <Accordion type="single" collapsible className="w-full space-y-4">
          {researchSteps.map((step) => (
            <AccordionItem value={step.title} key={step.title} className="border rounded-lg bg-background/50 data-[state=open]:border-primary data-[state=open]:shadow-lg">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                        <div className="bg-primary/10 p-2 rounded-md">
                           <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <h3 className="font-semibold text-foreground">{step.title}</h3>
                           <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                   <div className="border-t pt-4 mt-2">
                     <h4 className="font-semibold text-md text-primary mb-3">Passos Práticos:</h4>
                     <ul className="space-y-3">
                         {step.instructions.map((inst, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{inst}</span>
                            </li>
                         ))}
                     </ul>
                   </div>
                </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

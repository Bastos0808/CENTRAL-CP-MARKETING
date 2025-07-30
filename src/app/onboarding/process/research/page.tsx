
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
            "<strong>Abra o ICP:</strong> Tenha a documentação do nosso <a href='/onboarding/icp' class='text-primary underline'>Perfil de Cliente Ideal</a> aberta em outra aba.",
            "<strong>Checklist de Critérios:</strong> Passe por cada um dos 5 critérios (Setor, Estágio do Negócio, etc.) e valide se a empresa se encaixa.",
            "<strong>Análise do Site e LinkedIn:</strong> Use o site da empresa e seu perfil no LinkedIn para encontrar as informações necessárias para a qualificação.",
            "<strong>Seja Rigoroso:</strong> Um lead que não se encaixa no ICP tem poucas chances de fechar e menos ainda de ter sucesso com nossa metodologia. A qualificação rigorosa economiza tempo para todos."
        ]
    },
    { 
        icon: Users,
        title: "Identificação do Decisor",
        description: "Encontre a pessoa certa para contatar. Geralmente é o Sócio, CEO, Diretor de Marketing ou Gerente da área. Entrar em contato com a pessoa errada pode encerrar a oportunidade antes mesmo de começar.",
        instructions: [
            "<strong>LinkedIn Sales Navigator:</strong> É a ferramenta principal. Filtre a empresa alvo e procure por cargos como 'Sócio(a)', 'CEO', 'Fundador(a)', 'Diretor(a) de Marketing', 'CMO'.",
            "<strong>Site da Empresa:</strong> Verifique as páginas 'Sobre Nós' ou 'Nossa Equipe'. Muitas vezes os decisores estão listados lá.",
            "<strong>Plano B (LinkedIn Comum):</strong> Na página da empresa no LinkedIn, vá na aba 'Pessoas'. Filtre por palavras-chave relacionadas aos cargos de decisão.",
            "<strong>Foco no Decisor:</strong> Evite contatar analistas ou assistentes, a menos que seja uma empresa muito grande e essa seja a única porta de entrada."
        ]
    },
    { 
        icon: ZoomIn,
        title: "Análise da Presença Digital",
        description: "Mergulhe no universo do prospect. Analise o site, o Instagram e o LinkedIn para entender como eles se comunicam hoje e encontrar brechas.",
        instructions: [
            "<strong>Website:</strong> É moderno e otimizado para mobile? Possui blog? A comunicação é clara? Parece ter sido atualizado recentemente?",
            "<strong>Instagram:</strong> Qual a frequência de posts? A identidade visual é profissional e consistente? Usam Reels? O engajamento é real ou parece baixo?",
            "<strong>LinkedIn (Empresa e Decisor):</strong> Eles postam com frequência? O conteúdo é sobre a empresa (vendas) ou sobre o setor (educativo)? Qual o nível de engajamento nos posts do decisor?"
        ]
    },
    { 
        icon: LinkIcon,
        title: "Busca por 'Ganchos'",
        description: "Procure por um motivo relevante e personalizado para iniciar a conversa. Um bom gancho mostra que você fez sua lição de casa.",
        instructions: [
            "<strong>Atividade Recente:</strong> O decisor ou a empresa postaram sobre um evento, um artigo, uma conquista? Use isso como ponto de partida.",
            "<strong>Notícias e Expansão:</strong> A empresa foi mencionada na mídia? Anunciou uma nova contratação ou abertura de filial? Isso é um ótimo sinal de crescimento.",
            "<strong>Dor Evidente:</strong> A análise da presença digital revelou uma dor óbvia? (ex: 'notei que seu último post no Instagram foi há 3 meses', 'vi que seus concorrentes estão fortes em anúncios, mas não encontrei os seus').",
            "<strong>Conexões em Comum:</strong> Vocês têm conexões em comum no LinkedIn? Mencionar isso pode aquecer a abordagem."
        ]
    },
    {
        icon: Briefcase,
        title: "Sinais de Crescimento",
        description: "Verifique se a empresa está contratando, especialmente em áreas de vendas ou marketing. Vagas abertas são um forte indicativo de que estão investindo em crescimento.",
        instructions: [
            "<strong>LinkedIn Vagas:</strong> Na página da empresa no LinkedIn, procure pela aba 'Vagas'. Vagas para 'Vendedor', 'Executivo de Contas' ou 'Analista de Marketing' são excelentes indicadores.",
            "<strong>Site da Empresa:</strong> Procure pela seção 'Trabalhe Conosco' ou 'Carreiras'.",
            "<strong>Interpretação:</strong> Uma empresa que está contratando para a área comercial precisa de mais leads. Uma empresa que contrata para marketing está pronta para investir na área. É um sinal verde para a prospecção."
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
                                <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: inst }} />
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

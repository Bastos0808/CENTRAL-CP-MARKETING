
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, UserCheck, Link as LinkIcon, Users, ZoomIn, Briefcase, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useOnboarding } from "../../layout";

const researchSteps = [
    { 
        icon: UserCheck,
        title: "Passo 1: Qualificação com o ICP",
        description: "A primeira e mais crítica etapa. Antes de gastar um minuto sequer analisando a empresa, você precisa garantir que ela se encaixa em nosso Perfil de Cliente Ideal (ICP). Se um critério fundamental falhar, descarte o lead. Não perca tempo com leads que não têm perfil para comprar.",
        instructions: [
            "<strong>Abra o ICP em outra aba:</strong> Tenha a documentação do nosso <a href='/onboarding/icp' class='text-primary underline font-semibold'>Perfil de Cliente Ideal</a> sempre à mão. Ele é seu guia principal.",
            "<strong>Faça o Checklist de Critérios:</strong> Passe por cada um dos 5 critérios (Setor, Estágio do Negócio, Capacidade de Investimento, etc.) e valide se a empresa se encaixa. Anote suas conclusões.",
            "<strong>Use o Site e as Redes Sociais:</strong> As informações que você precisa para essa qualificação inicial estão no site da empresa, no LinkedIn e em outras redes sociais. Analise-os com o foco em responder às perguntas do ICP.",
            "<strong>Seja Rigoroso, Não Complacente:</strong> Um lead que não se encaixa no ICP tem pouquíssimas chances de fechar e menos ainda de ter sucesso com nossa metodologia. A qualificação rigorosa economiza seu tempo e o da empresa. Sua meta não é ter muitos leads, é ter os leads certos."
        ]
    },
    { 
        icon: Users,
        title: "Passo 2: Identificação do Decisor",
        description: "Você está falando com a pessoa certa? Contatar a pessoa errada pode encerrar a oportunidade antes mesmo de começar. Nosso CRM fornecerá o contato inicial, mas seu trabalho é confirmar se ele é, de fato, o tomador de decisão.",
        instructions: [
            "<strong>Acesse o RD CRM:</strong> Esta é sua principal fonte de informações. Semanalmente, a liderança fornecerá uma lista de leads (empresas e contatos) que são inseridos diretamente no RD CRM para você trabalhar.",
            "<strong>Localize o Lead do Dia:</strong> Encontre a empresa e o contato que você irá trabalhar hoje.",
            "<strong>Verifique o Cargo no LinkedIn:</strong> Use o nome do contato e da empresa para encontrá-lo no LinkedIn. O cargo bate com o de um decisor? Procure por títulos como 'Sócio(a)', 'CEO', 'Diretor(a)', 'Fundador(a)' ou 'Gerente de Marketing'.",
            "<strong>Foco no Decisor:</strong> Evite contatar analistas ou assistentes, a menos que seja uma empresa muito grande e essa seja a única porta de entrada. O objetivo é sempre alcançar quem tem o poder da caneta."
        ]
    },
    { 
        icon: ZoomIn,
        title: "Passo 3: Análise da Presença Digital",
        description: "Agora que o lead está qualificado, mergulhe no universo do prospect. Analise o site, o Instagram e outras mídias para entender como eles se comunicam hoje, quais são suas fraquezas e onde estão as oportunidades de melhoria.",
        instructions: [
            "<strong>Pesquisa no Google:</strong> Pesquise o nome da empresa. Como ela aparece? Existem notícias, artigos ou avaliações no Google Meu Negócio? Avaliações negativas são uma dor explícita e um ótimo gancho.",
            "<strong>Análise do Website:</strong> O site é moderno e otimizado para celular? A mensagem é clara? Parece profissional ou abandonado? Possui blog? Quando foi o último post?",
            "<strong>Análise do Instagram:</strong> Qual a frequência de posts? A identidade visual é profissional? Usam vídeos (Reels)? O engajamento parece real ou baixo? Existem comentários de clientes (positivos ou negativos)?",
            "<strong>Investigação na Biblioteca de Anúncios:</strong> Pesquise na Biblioteca de Anúncios do Meta se a empresa (ou seus concorrentes diretos) estão veiculando campanhas. A ausência de anúncios ou anúncios de baixa qualidade é uma grande oportunidade.",
            "<strong>Verificação de Vídeo (YouTube/TikTok):</strong> Se for relevante para o setor, verifique se possuem canais ativos. A falta de presença em vídeo é uma dor para muitas marcas que querem construir autoridade."
        ]
    },
    { 
        icon: LinkIcon,
        title: "Passo 4: A Arte do Gancho (A Brecha Perfeita)",
        description: "Com base em tudo que você analisou, sua missão é encontrar a 'desculpa' perfeita, um motivo relevante e personalizado para iniciar a conversa. Um bom gancho prova que você fez sua lição de casa e transforma uma mensagem fria em uma conversa quente.",
        instructions: [
            "<strong>A Pista Quente (Atividade Recente):</strong> O que a empresa ou o decisor fizeram nos últimos dias? Ex: 'Vi que vocês participaram do evento X...' ou 'Parabéns pelo novo site, achei a seção de cases muito interessante'. É o gancho mais fácil e eficaz.",
            "<strong>A Notícia (Sinal de Crescimento):</strong> A empresa saiu na mídia? Anunciou uma nova contratação, abertura de filial ou lançamento? Isso é um sinal de crescimento e uma deixa perfeita. Ex: 'Vi no portal ABC que vocês estão expandindo para a região Sul, parabéns!'",
            "<strong>A Dor Evidente (Ponto Fraco):</strong> Sua análise da presença digital revelou uma fraqueza óbvia? Use isso de forma sutil e consultiva, nunca acusatória. Ex: 'Notei que o último post no blog foi em 2022. Estão planejando reativar essa frente?' ou 'Vi que seus concorrentes estão fortes em anúncios de vídeo, mas não encontrei os seus. Existe uma razão estratégica para isso?'"
        ]
    },
    {
        icon: Briefcase,
        title: "Passo 5: Sinais de Contratação (O Indicador de Ouro)",
        description: "Uma empresa que contrata, é uma empresa que investe e está crescendo. Aprenda a identificar esses sinais para abordar prospects no momento exato em que eles precisam de nós.",
        instructions: [
            "<strong>Procure por Vagas:</strong> No LinkedIn da empresa ou na seção 'Trabalhe Conosco' do site, procure por vagas abertas. Vagas para 'Vendedor', 'Executivo de Contas' ou 'Analista de Marketing' são excelentes indicadores.",
            "<strong>Interprete o Sinal:</strong> Uma empresa que contrata para a área comercial (Vendas) precisa de mais leads para seus novos vendedores. Uma empresa que contrata para Marketing está pronta para investir na área.",
            "<strong>Use como Gancho:</strong> Este é um dos ganchos mais fortes. Ex: 'Vi que vocês abriram uma vaga para Executivo de Vendas. Geralmente, quando uma empresa expande o time comercial, o maior desafio é gerar leads qualificados na velocidade certa. Como vocês estão planejando lidar com isso?'"
        ]
    }
];

export default function ResearchPage() {
    const { setStepCompleted } = useOnboarding();

    useEffect(() => {
        // This is a detail page, so we mark it as completed on load to allow navigation.
        setStepCompleted(true);
    }, [setStepCompleted]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 1: Pesquisa e Qualificação</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Esta é a fase mais importante do processo. Um bom SDR gasta 80% do seu tempo aqui. Uma prospecção bem-sucedida não depende de quantas pessoas você contata, mas da qualidade e do timing desses contatos. Siga os passos abaixo.
            </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
          {researchSteps.map((step) => (
            <AccordionItem value={step.title} key={step.title} className="border rounded-lg bg-background/50 data-[state=open]:border-primary data-[state=open]:shadow-lg">
                <AccordionTrigger className="p-4 hover:no-underline text-left">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-md flex-shrink-0">
                           <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                           <p className="text-sm text-muted-foreground mt-1 text-left">{step.description}</p>
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

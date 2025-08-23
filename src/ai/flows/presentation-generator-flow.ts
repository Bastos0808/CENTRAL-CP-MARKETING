
'use server';
/**
 * @fileOverview A Genkit flow to generate a sales presentation from diagnostic data.
 *
 * - generatePresentation: Creates slide content based on a client diagnostic form.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GeneratePresentationInputSchema,
  GeneratePresentationInput,
  GeneratePresentationOutputSchema,
  GeneratePresentationOutput,
} from '@/ai/schemas/presentation-generator-schemas';
import { format, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { packageOptions } from '@/ai/schemas/presentation-generator-schemas';

// Exported function that the frontend will call
export async function generatePresentation(
  input: GeneratePresentationInput
): Promise<GeneratePresentationOutput> {
  return presentationGeneratorFlow(input);
}

// Define the flow that orchestrates the call to the AI
const presentationGeneratorFlow = ai.defineFlow(
  {
    name: 'presentationGeneratorFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async (input) => {
    
    // Format dates
    const today = new Date();
    const proposalDate = format(today, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    const proposalValidityDate = format(add(today, { days: 7 }), "dd/MM/yyyy");

    // Prepare data for the AI prompt
    const { faturamentoMedio, metaFaturamento, ...restOfInput } = input;
    const inputForAI = {
        ...restOfInput,
        faturamentoMedio: faturamentoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        metaFaturamento: metaFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        ticketMedio: input.ticketMedio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A',
        custoProblema: (input.custoProblema || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    };

    const { output } = await ai.generate({
        model: googleAI.model('gemini-1.5-pro-latest'),
        output: { schema: GeneratePresentationOutputSchema },
        system: `Você é um Estrategista de Vendas Sênior e um especialista em criar narrativas comerciais persuasivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico em conteúdo textual para uma apresentação interativa, seguindo rigorosamente as instruções para cada slide.`,
        prompt: `
            **Dados do Diagnóstico:**
            ---
            - **Nome do Cliente:** ${inputForAI.clientName}
            - **Tempo de Empresa:** ${inputForAI.tempoEmpresa}
            - **Faturamento Médio Atual:** ${inputForAI.faturamentoMedio}
            - **Meta de Faturamento (6 meses):** ${inputForAI.metaFaturamento}
            - **Ticket Médio:** ${inputForAI.ticketMedio}
            - **Origem dos Clientes:** ${inputForAI.origemClientes}
            - **Motivação para Investir:** ${inputForAI.motivacaoMarketing}
            - **Experiência Anterior com Marketing:** ${inputForAI.experienciaMarketing}
            - **Tentativas Anteriores que Falharam:** ${inputForAI.tentativasAnteriores}
            - **Principal Gargalo:** ${inputForAI.principalGargalo}
            - **Impacto do Gargalo:** ${inputForAI.impactoGargalo}
            - **Sentimento Pessoal do Gestor:** ${inputForAI.sentimentoPessoal}
            - **Custo Estimado do Problema por Mês:** ${inputForAI.custoProblema}
            - **Visão de Futuro (Negócio):** ${inputForAI.visaoFuturo}
            - **Visão de Futuro (Pessoal):** ${inputForAI.visaoFuturoPessoal}
            - **O que faria com mais clientes:** ${inputForAI.potencialResolucao}
            ---

            **Instrução:** Agora, gere o conteúdo para cada slide da apresentação, preenchendo todos os campos do objeto de saída com textos curtos, diretos e persuasivos, usando os dados acima.

            ---
            **Slide 1: Título da Proposta**
            - **presentationTitle:** Crie um título inspirador e direto para a apresentação. Algo como "A Estratégia para a [Nome do Cliente] Dobrar o Faturamento" ou "O Plano para Transformar a [Nome do Cliente] em Referência de Mercado".

            ---
            **Slide 3: O Diagnóstico**
            - **diagnosticSlide.title:** Gere o título do slide: "Entendemos o seu Desafio".
            - **diagnosticSlide.question:** Gere a pergunta reflexiva: "Você sente que seu negócio tem potencial para muito mais, mas algo está travando esse crescimento?".
            - **diagnosticSlide.meta:** Extraia a Meta de Faturamento. Ex: "${inputForAI.metaFaturamento} em 6 meses".
            - **diagnosticSlide.custo:** Extraia o Custo do Problema. Ex: "${inputForAI.custoProblema} deixados na mesa todo mês".
            - **diagnosticSlide.gargalo:** Com base nos campos 'principalGargalo' e 'impactoGargalo', escreva um parágrafo que humaniza o problema. Em vez de apenas citar o gargalo, explique como ele se manifesta no dia a dia da empresa de forma empática. Por exemplo, se o gargalo é 'geração de leads' e o impacto é 'equipe ociosa', você pode escrever: "O principal desafio que identificamos não é apenas a falta de novos contatos, mas o que isso representa: uma equipe talentosa com tempo ocioso e um potencial de faturamento que não está sendo realizado. É a sensação de ter um motor potente, mas que não consegue tracionar como deveria."
            - **diagnosticSlide.comoAlcancaremos:** Descreva em um parágrafo como o plano macro irá atingir a meta. Ex: "Para atingir essa meta, implementaremos um sistema de aquisição de clientes focado em tráfego pago, direcionado para o seu público ideal, combinado com uma comunicação estratégica no Instagram para construir autoridade e converter seguidores em pacientes."
            - **diagnosticSlide.porqueCustoExiste:** Explique por que o custo da inação existe, conectando-o à ausência de marketing eficaz. Ex: "Esse valor é o reflexo direto de potenciais clientes que, hoje, não encontram sua clínica online e acabam fechando com concorrentes que investem em visibilidade. Cada mês sem uma estratégia de marketing ativa é um mês permitindo que seus concorrentes capturem uma fatia maior do seu mercado."


            ---
            **Slide 4: A Dor e Suas Consequências**
            - **painSlide.title:** Gere o título do slide: "O Custo Real de Adiar a Decisão".
            - **painSlide.question:** Gere a pergunta: "Adiamos decisões por medo de errar, mas qual o custo de não decidir?".
            - **painSlide.content:** Gere três parágrafos curtos sobre as consequências. O primeiro sobre o impacto operacional do gargalo. O segundo deve destacar a frustração das tentativas passadas que falharam. O terceiro deve usar a internet para encontrar um exemplo de empresa do mesmo setor que enfrentou dificuldades (sem citar o nome) e descrever o risco que a concorrência representa. Seja emotivo e gere senso de urgência.

            ---
            **Slide 5: A Visualização do Futuro**
            - **futureSlide.title:** Gere o título do slide: "O Futuro que Vamos Construir Juntos".
            - **futureSlide.question:** Gere a pergunta: "Como seria se, em vez de se preocupar com o gargalo, sua única preocupação fosse em como gerenciar o crescimento?".
            - **futureSlide.content:** Gere um array com 3 ou 4 objetos, cada um com um "title" e uma "description". Use as respostas sobre 'o que faria com mais clientes' e o 'impacto pessoal' para criar transformações vívidas e persuasivas. Foque em benefícios, não em ações.
                - Exemplo de objeto: { title: "Agenda Previsível", description: "Tenha a clareza de saber como sua agenda estará nas próximas semanas, permitindo investimentos e contratações estratégicas." }.
                - Outro exemplo: { title: "Foco na Sua Paixão", description: "Gaste seu tempo atendendo bem seus clientes, em vez de se preocupar em como atrair novos." }.

            ---
            **Slide 7: A Estratégia**
            - **strategySlide.title:** Gere o título do slide: "Nosso Plano para Virar o Jogo".
            - **strategySlide.content:** Para cada um dos três pilares, gere um objeto com "title" e "description".
              - Para o primeiro pilar (Aquisição), o título deve ser 'Aquisição'. A descrição deve focar em resolver o 'gargalo de geração'.
              - Para o segundo pilar (Conversão), o título deve ser 'Conversão'. A descrição deve focar em resolver a falha da 'experiência anterior com leads desqualificados'.
              - Para o terceiro pilar (Autoridade), o título deve ser 'Autoridade'. A descrição deve focar em escalar a 'confiança da indicação'.
              NÃO use markdown (como **) nos títulos.

            ---
            **Slide 9: Métricas de Sucesso**
            - **metricsSlide.title:** Gere o título do slide: "Seu Crescimento em Números".
            - **metricsSlide.subtitle:** Gere um subtítulo motivacional como: "O sucesso será medido com dados claros. Nossas metas mensais são:"
            - **metricsSlide.crescimentoPercentual:** Calcule a porcentagem de crescimento necessária para ir do faturamento médio para a meta. Formate como string (Ex: '140%').
            - **metricsSlide.metaLeadsQualificados:** Com base na meta de faturamento e no ticket médio, calcule uma meta realista de leads qualificados por mês. Retorne como string (Ex: "88").
            - **metricsSlide.metaTaxaConversao:** Defina uma meta de taxa de conversão realista para atingir o objetivo. Retorne como string (Ex: "20%").
        `,
    });
    
    // Manually add the date and client name fields which don't require AI generation
    if (output) {
      output.clientName = input.clientName;
      output.proposalDate = proposalDate;
      output.proposalValidityDate = proposalValidityDate;
      
      const totalPackages = input.packages?.reduce((acc, pkgKey) => acc + (packageOptions[pkgKey as keyof typeof packageOptions]?.price || 0), 0) || 0;
      const finalInvestment = totalPackages - (input.discount || 0);
      output.investmentValue = finalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      output.packages = input.packages?.map(key => packageOptions[key as keyof typeof packageOptions]) || [];
      
      // Manually populate fields for slide 6, which are direct calculations
      const custoMensal = input.custoProblema || 0;
      output.inactionCostSlide = {
          title: "O Custo da Inação",
          custo_6_meses: (custoMensal * 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          custo_1_ano: (custoMensal * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          cenario_inercia: "Enquanto a decisão é adiada, o faturamento pode continuar estagnado e a concorrência, que investe em marketing, pode abocanhar uma fatia maior do seu mercado, tornando a recuperação futura ainda mais difícil e cara."
      };
      
       // Manually populate fields for slide 10, which are also more direct
       output.investmentSlide = {
           title: "O Investimento no seu Crescimento",
           ancoragemPreco: `Considerando que o problema atual custa ${inputForAI.custoProblema} por mês, o investimento para resolver a causa raiz desse problema é significativamente menor.`,
           ganchoDecisao: "Diante de tudo que conversamos, existem dois futuros possíveis: um de crescimento previsível e outro de estagnação. Qual deles você escolherá construir a partir de hoje?",
           gatilhoEscassez: "Para garantir a dedicação e a qualidade que você viu, só temos capacidade para iniciar com 3 novos clientes este mês.",
           gatilhoBonus: "Além disso, fechando a parceria nesta semana, você garante como bônus a produção de um episódio de podcast em nosso estúdio para lançar sua nova fase de autoridade no mercado."
       };
    }
    
    return output!;
  }
);
    

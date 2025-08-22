
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
  GeneratePresentationOutput
} from '@/ai/schemas/presentation-generator-schemas';
import { format, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
            **Slide 3: O Diagnóstico**
            - **resumoEmpatico:** Gere o parágrafo de 'Resumo Empático', conectando a meta de faturamento ao gargalo principal e ao sentimento de frustração/estar perdido do cliente.
            - **analiseReflexiva:** Gere a 'Análise Reflexiva' começando com 'Uma empresa com [X] anos de história decide agir agora porque...' e conecte com as respostas sobre 'aumento da concorrência' ou 'chegamos num platô'.

            ---
            **Slide 4: A Dor e Suas Consequências**
            - **consequencia_1:** Descreva o impacto operacional do gargalo (equipe ociosa, agenda com buracos).
            - **consequencia_2:** Destaque a frustração de já ter tentado resolver isso sem sucesso, mostrando que o problema não é a falta de esforço, mas da estratégia correta.
            - **consequencia_3:** Mostre como a inação fortalece a concorrência que está investindo em marketing.

            ---
            **Slide 5: A Visualização do Futuro**
            - **cenario_6_meses:** Descreva a conquista da meta de faturamento, a previsibilidade e a agenda cheia.
            - **cenario_1_ano:** Projete a transformação completa do negócio, usando as respostas sobre 'o que faria com mais clientes' e o 'impacto pessoal'.

            ---
            **Slide 6: O Custo da Inação**
            - **custo_6_meses:** Calcule o custo da inação em 6 meses, multiplicando o 'Custo Estimado do Problema por Mês' por 6. Formate como moeda BRL (Ex: "R$ 120.000,00").
            - **custo_1_ano:** Calcule o custo da inação em 1 ano, multiplicando o 'Custo Estimado do Problema por Mês' por 12. Formate como moeda BRL (Ex: "R$ 240.000,00").
            - **cenario_inercia:** Crie um parágrafo de alto impacto sobre o que acontecerá em 1 ano se nada for feito (faturamento estagnado, concorrência dominando, frustração aumentando).

            ---
            **Slide 7: A Estratégia**
            - **pilarAquisicao:** Para 'Aquisição', conecte o texto à resolução do 'gargalo de geração'.
            - **pilarConversao:** Para 'Conversão', conecte o texto à falha da experiência anterior (leads desqualificados).
            - **pilarAutoridade:** Para 'Autoridade', conecte o texto ao fato de que a maioria dos clientes vem de 'indicação', mostrando como vamos escalar essa confiança.

            ---
            **Slide 9: Métricas de Sucesso**
            - **crescimentoPercentual:** Calcule a porcentagem de crescimento necessária para ir do faturamento médio para a meta. Formate como string (Ex: '140%').
            - **metaLeadsQualificados:** Com base na meta de faturamento e no ticket médio, calcule uma meta realista de leads qualificados por mês. Retorne como string (Ex: "88").
            - **metaTaxaConversao:** Defina uma meta de taxa de conversão realista para atingir o objetivo. Retorne como string (Ex: "20%").

            ---
            **Slide 10: O Investimento**
            - **ancoragemPreco:** Gere a pergunta de 'Ancoragem de Preço', comparando o custo mensal do problema com o investimento na solução.
            - **ganchoDecisao:** Gere o 'Gancho da Decisão', contrastando a 'Visão de Futuro' com o 'Cenário da Inércia' e terminando com a pergunta: 'Qual desses dois futuros você escolherá construir a partir de hoje?'.
            - **gatilhoEscassez:** Crie uma frase de urgência sobre o número limitado de vagas para novos clientes (use "3 novas vagas").
            - **gatilhoBonus:** Crie uma frase sobre o bônus de ação rápida (produção de um episódio de podcast).
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
    }
    
    return output!;
  }
);

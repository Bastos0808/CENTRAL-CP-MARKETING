
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
    const { faturamentoMedio, metaFaturamento, ticketMedio, ...restOfInput } = input;
    const inputForAI = {
        ...restOfInput,
        faturamentoMedio: faturamentoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        metaFaturamento: metaFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        ticketMedio: ticketMedio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A',
        custoProblema: input.custoProblema?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A',
    };

    const llmResponse = await ai.generate({
        model: googleAI.model('gemini-1.5-pro-latest'),
        output: { schema: GeneratePresentationOutputSchema },
        prompt: `
            Você é um Estrategista de Vendas Sênior e um especialista em criar narrativas comerciais persuasivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico em conteúdo textual para uma apresentação interativa, seguindo rigorosamente as instruções para cada slide.

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

            **Agora, gere o conteúdo para cada slide da apresentação, preenchendo todos os campos do objeto de saída.**

            ---
            **Slide 3: O Diagnóstico**
            - **resumoEmpatico:** Crie um parágrafo que conecte a meta de faturamento (${inputForAI.metaFaturamento}) ao gargalo principal (${inputForAI.principalGargalo}) e ao sentimento de frustração/estar perdido do cliente (${inputForAI.sentimentoPessoal}).
            - **analiseReflexiva:** Crie um parágrafo que comece com 'Uma empresa com ${inputForAI.tempoEmpresa} de história decide agir agora porque...' e conecte com as respostas sobre 'aumento da concorrência' ou 'chegamos num platô' (${inputForAI.motivacaoMarketing}). O objetivo é reforçar a criticidade do momento.

            ---
            **Slide 4: A Dor e Suas Consequências**
            - **consequencia_1:** Gere um bullet point sobre o impacto operacional do gargalo, usando a resposta de '${inputForAI.impactoGargalo}'.
            - **consequencia_2:** Gere um bullet point destacando a frustração de já ter tentado resolver isso sem sucesso ('${inputForAI.tentativasAnteriores}'), mostrando que o problema é a falta da estratégia correta.
            - **consequencia_3:** Gere um bullet point mostrando como a inação fortalece a concorrência, que já está investindo em marketing.

            ---
            **Slide 5: A Visualização do Futuro**
            - **cenario_6_meses:** Descreva a conquista da meta de faturamento de ${inputForAI.metaFaturamento}, a previsibilidade e a agenda cheia, baseado em '${inputForAI.visaoFuturo}'.
            - **cenario_1_ano:** Projete os resultados para 1 ano. Use as respostas sobre 'o que faria com mais clientes' ('${inputForAI.potencialResolucao}') e o 'impacto pessoal' ('${inputForAI.visaoFuturoPessoal}') para descrever a transformação completa do negócio e da vida do gestor.

            ---
            **Slide 6: O Custo da Inação**
            - **custo_6_meses:** Calcule o custo da inação em 6 meses, multiplicando '${input.custoProblema || 0}' por 6. Formate como moeda BRL.
            - **custo_1_ano:** Calcule o custo da inação em 1 ano, multiplicando '${input.custoProblema || 0}' por 12. Formate como moeda BRL.
            - **cenario_inercia:** Gere um parágrafo de alto impacto sobre o que acontecerá em 1 ano se nada for feito, focando na estagnação do faturamento, domínio da concorrência e aumento da frustração do gestor.

            ---
            **Slide 7: A Estratégia**
            - **pilarAquisicao:** Gere um texto para o pilar 'Aquisição' que o conecte diretamente ao '${inputForAI.principalGargalo}'.
            - **pilarConversao:** Gere um texto para o pilar 'Conversão' que use a resposta sobre 'leads desqualificados' e a falha do '${inputForAI.tentativasAnteriores}'.
            - **pilarAutoridade:** Gere um texto para o pilar 'Autoridade' que conecte com o fato de que a maioria dos clientes vem de '${inputForAI.origemClientes}', mostrando como vamos escalar essa confiança.

            ---
            **Slide 9: Métricas de Sucesso**
            - **crescimentoPercentual:** Calcule a porcentagem de crescimento necessária para ir de ${input.faturamentoMedio} para ${input.metaFaturamento} em 6 meses. Formate como 'XX%'.
            - **metaLeadsQualificados:** Com base na meta de faturamento e no ticket médio de ${inputForAI.ticketMedio}, calcule uma meta realista de leads qualificados por mês.
            - **metaTaxaConversao:** Defina uma meta de taxa de conversão realista para atingir o objetivo.

            ---
            **Slide 10: O Investimento**
            - **ancoragemPreco:** Gere um parágrafo que compare o 'Custo da Inação' (${inputForAI.custoProblema} por mês) com o valor do investimento, posicionando a proposta como uma decisão inteligente.
            - **ganchoDecisao:** Gere um parágrafo final que contraste a 'Visão de Futuro' com o 'Cenário da Inércia' e termine com a pergunta: 'Qual desses dois futuros você escolherá construir a partir de hoje?'.
            - **gatilhoEscassez:** Crie uma frase de urgência sobre o número limitado de vagas para novos clientes este mês. Ex: 'Para garantir a dedicação que você viu, só abrimos 3 novas vagas este mês.'.
            - **gatilhoBonus:** Crie uma frase sobre o bônus de um episódio de podcast para fechamento na semana. Ex: 'Fechando nesta semana, você garante a produção de um episódio de podcast em nosso estúdio para lançar sua nova fase de autoridade.'.
        `,
    });
    
    // Manually add the date fields which don't require AI generation
    if (llmResponse.output) {
      llmResponse.output.proposalDate = proposalDate;
      llmResponse.output.proposalValidityDate = proposalValidityDate;
    }
    
    return llmResponse.output!;
  }
);

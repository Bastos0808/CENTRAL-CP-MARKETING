
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
        system: `Você é um Estrategista de Vendas Sênior e um especialista em criar narrativas comerciais persuasivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico em conteúdo textual para uma apresentação interativa, seguindo rigorosamente as instruções para cada slide. O tom deve ser provocativo e focado em perguntas reflexivas.`,
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

            **Instrução:** Agora, gere o conteúdo para cada slide da apresentação, preenchendo todos os campos do objeto de saída com textos curtos, diretos e provocativos, usando os dados acima.

            ---
            **Slide 3: O Diagnóstico**
            - **resumoEmpatico:** Crie uma pergunta que valide o sentimento do cliente, conectando a meta de faturamento, o gargalo principal e o sentimento pessoal dele.
            - **analiseReflexiva:** Crie uma pergunta sobre o timing da decisão do cliente, mencionando o tempo de empresa e a origem atual dos clientes, e questionando o porquê de agir agora.

            ---
            **Slide 4: A Dor e Suas Consequências**
            - **consequencia_1:** Descreva o impacto operacional do gargalo como um sintoma claro e pergunte se o cliente concorda.
            - **consequencia_2:** Transforme a experiência anterior com marketing que falhou em um aprendizado, questionando se o problema não era a ferramenta, mas a falta de uma estratégia correta.
            - **consequencia_3:** Crie uma pergunta provocativa sobre o custo de oportunidade, mencionando a concorrência que já anuncia online.

            ---
            **Slide 5: A Visualização do Futuro**
            - **cenario_6_meses:** Descreva a visão de futuro do negócio (meta de faturamento, agenda cheia) como uma realidade próxima e pergunte se ele consegue visualizar isso.
            - **cenario_1_ano:** Projete a transformação completa do negócio e a visão de futuro pessoal como uma pergunta que conecta os dois.

            ---
            **Slide 6: O Custo da Inação**
            - **custo_6_meses:** Calcule o custo da inação em 6 meses, multiplicando o 'Custo Estimado do Problema por Mês' por 6. Formate como moeda BRL (Ex: "R$ 120.000,00").
            - **custo_1_ano:** Calcule o custo da inação em 1 ano, multiplicando o 'Custo Estimado do Problema por Mês' por 12. Formate como moeda BRL (Ex: "R$ 240.000,00").
            - **cenario_inercia:** Crie uma pergunta forte sobre o futuro da empresa se nada for feito, questionando se ele aceita esse futuro de estagnação.

            ---
            **Slide 7: A Estratégia**
            - **pilarAquisicao:** Crie uma frase que conecte o pilar de Aquisição diretamente à resolução do principal gargalo do cliente.
            - **pilarConversao:** Crie uma frase que conecte o pilar de Conversão à falha da experiência anterior, mostrando como nosso método evita aquele problema.
            - **pilarAutoridade:** Crie uma frase que conecte o pilar de Autoridade à força atual do cliente (origem dos clientes), mostrando como vamos amplificar isso.

            ---
            **Slide 9: Métricas de Sucesso**
            - **crescimentoPercentual:** Calcule a porcentagem de crescimento necessária para ir do faturamento médio para a meta. Formate como string (Ex: '140%').
            - **metaLeadsQualificados:** Com base na meta de faturamento e no ticket médio, calcule uma meta realista de leads qualificados por mês. Retorne como string (Ex: "88").
            - **metaTaxaConversao:** Defina uma meta de taxa de conversão realista para atingir o objetivo. Retorne como string (Ex: "20%").

            ---
            **Slide 10: O Investimento**
            - **ancoragemPreco:** Crie uma pergunta de ancoragem que compare o custo mensal do problema com o investimento em nossa solução.
            - **ganchoDecisao:** Crie a pergunta final para a tomada de decisão, colocando os dois futuros (crescimento vs. estagnação) em perspectiva.
            - **gatilhoEscassez:** Crie uma frase de urgência sobre o número limitado de vagas para novos clientes.
            - **gatilhoBonus:** Crie uma frase sobre um bônus por fechamento rápido (Ex: episódio de podcast).
        `,
    });
    
    // Manually add the date and client name fields which don't require AI generation
    if (output) {
      output.clientName = input.clientName;
      output.proposalDate = proposalDate;
      output.proposalValidityDate = proposalValidityDate;
    }
    
    return output!;
  }
);


'use server';
/**
 * @fileOverview A Genkit flow to generate a strategic summary for a client.
 *
 * - generateSummary: Generates a concise analysis based on the client's full data.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateSummaryInput,
  GenerateSummaryInputSchema,
  GenerateSummaryOutput,
  GenerateSummaryOutputSchema,
} from '@/ai/schemas/summary-generator-schemas';

// Exported function that the frontend will call
export async function generateSummary(
  input: GenerateSummaryInput
): Promise<GenerateSummaryOutput> {
  return summaryGeneratorFlow(input);
}

// Define the prompt the AI will use
const summaryGeneratorPrompt = ai.definePrompt({
  name: 'summaryGeneratorPrompt',
  input: { schema: GenerateSummaryInputSchema },
  output: { schema: GenerateSummaryOutputSchema },
  prompt: `
    Você é um Estrategista de Contas Sênior e seu trabalho é analisar rapidamente os dados de um cliente e fornecer um resumo estratégico e acionável.

    Você receberá todos os dados do cliente, incluindo o briefing inicial e o histórico de relatórios, em formato JSON.

    Sua tarefa é analisar TODAS as informações e gerar uma "Análise Rápida" em 4 pontos-chave. Seja direto, conciso e estratégico.

    **Estrutura da Análise (use este formato exato em Markdown):**
    - **## 🎯 Objetivo Principal:** Identifique e resuma o objetivo mais importante do cliente neste momento.
    - **## ⚠️ Maior Desafio:** Qual é o principal obstáculo ou dificuldade que o cliente enfrenta, com base nos dados?
    - **## ✨ Oportunidade-Chave:** Aponte uma oportunidade clara e pouco explorada que pode trazer resultados.
    - **## 🚀 Ação Imediata:** Sugira UMA ação prática e de alto impacto que a equipe pode executar agora.

    **Dados Completos do Cliente (JSON):**
    \`\`\`json
    {{{clientData}}}
    \`\`\`

    **Agora, gere o campo "summary" com o texto da análise, seguindo rigorosamente a estrutura e as instruções.**
  `,
});

// Define the flow that orchestrates the call to the AI
const summaryGeneratorFlow = ai.defineFlow(
  {
    name: 'summaryGeneratorFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summaryGeneratorPrompt(input);
    return output!;
  }
);

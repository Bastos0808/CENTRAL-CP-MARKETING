
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
    Você atua como um Diretor(a) de Estratégia e sua função é analisar os dados completos de um cliente para fornecer um resumo estratégico e de alto impacto.

    Você receberá todos os dados do cliente, incluindo o briefing inicial e o histórico de relatórios, em formato JSON.

    Sua tarefa é analisar TODAS as informações e gerar um "Diagnóstico Estratégico" em 4 pontos-chave. Seja direto, conciso e use uma linguagem profissional.

    **Estrutura da Análise (use este formato exato em Markdown):**
    - **## Objetivo Principal:** Identifique e resuma o objetivo mais importante do cliente neste momento.
    - **## Diagnóstico:** Qual é o principal problema, desafio ou obstáculo que o cliente enfrenta?
    - **## Oportunidade:** Aponte a oportunidade mais clara e de maior potencial que pode trazer os melhores resultados.
    - **## Recomendação Estratégica:** Sugira UMA ação prática e de alto impacto que a equipe deve priorizar.

    **Dados Completos do Cliente (JSON):**
    \`\`\`json
    {{{clientData}}}
    \`\`\`

    **Agora, gere o campo "summary" com o texto da análise, seguindo rigorosamente a estrutura e as instruções fornecidas.**
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

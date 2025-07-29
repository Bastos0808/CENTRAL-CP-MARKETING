
'use server';
/**
 * @fileOverview A Genkit flow to generate a strategic summary for a client.
 *
 * - generateSummary: Generates a concise analysis based on the client's full data.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
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
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: GenerateSummaryInputSchema },
  output: { schema: GenerateSummaryOutputSchema },
  prompt: `
    Você atua como um Diretor(a) de Estratégia e sua função é analisar os dados completos de um cliente para fornecer um resumo estratégico e de alto impacto.

    Você receberá todos os dados do cliente, incluindo o briefing inicial e o histórico de relatórios.

    Sua tarefa é analisar TODAS as informações e gerar um "Diagnóstico Estratégico" em 4 pontos-chave. Seja direto, conciso e use uma linguagem profissional. Foque nos pontos mais críticos para o negócio: o desafio principal, a dor da persona e o objetivo.

    **Estrutura da Análise (use este formato exato em Markdown):**
    - **## Objetivo Principal:** Identifique e resuma o objetivo mais importante do cliente neste momento. Baseie-se em '{{client.briefing.metasObjetivos.objetivoPrincipal}}'.
    - **## Diagnóstico:** Qual é o principal problema ou desafio que o cliente enfrenta? Baseie-se em '{{client.briefing.negociosPosicionamento.maiorDesafio}}'.
    - **## Oportunidade:** Aponte a oportunidade mais clara e de maior potencial que pode trazer os melhores resultados, considerando as dores da persona ('{{client.briefing.publicoPersona.dores}}') e os relatórios passados.
    - **## Recomendação Estratégica:** Sugira UMA ação prática e de alto impacto que a equipe deve priorizar para atacar a oportunidade e alcançar o objetivo.

    **Dados Completos do Cliente:**
    - **Nome:** {{client.name}}
    - **Briefing:**
      - **Descrição do Negócio:** {{client.briefing.negociosPosicionamento.descricao}}
      - **Diferencial:** {{client.briefing.negociosPosicionamento.diferencial}}
      - **Maior Desafio:** {{client.briefing.negociosPosicionamento.maiorDesafio}}
      - **Público Alvo:** {{client.briefing.publicoPersona.publicoAlvo}}
      - **Persona:** {{client.briefing.publicoPersona.persona}}
      - **Dores da Persona:** {{client.briefing.publicoPersona.dores}}
      - **Objetivo Principal:** {{client.briefing.metasObjetivos.objetivoPrincipal}}
    - **Histórico de Relatórios:**
      {{#if client.reports}}
        {{#each client.reports}}
        - **Relatório de {{createdAt}}:** {{analysis}}
        {{/each}}
      {{else}}
        Nenhum relatório anterior.
      {{/if}}

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

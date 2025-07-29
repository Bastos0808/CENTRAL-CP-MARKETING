
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
    Você atua como um(a) Estrategista de Marketing Sênior da agência "CP Marketing Digital". Sua tarefa é criar um "Diagnóstico Estratégico" para um cliente, com base em seu briefing e histórico de relatórios. A análise deve ser rica, profunda e oferecer insights valiosos.

    **Instruções de Formato e Tom:**
    - **Formato:** Gere a resposta como um texto corrido. Use **negrito** para os títulos das seções. NÃO use cabeçalhos de markdown (como # ou ##).
    - **Tom:** Profissional, analítico e direto. Vá além do óbvio, conectando as informações para revelar o cenário real.
    - **Profundidade:** Elabore cada seção com 2-3 frases, criando parágrafos coesos e informativos.

    **Estrutura da Análise (Siga esta ordem):**

    **Diagnóstico Estratégico:** Comece com uma visão geral do desafio principal do cliente. Conecte o 'maior desafio' com o 'objetivo principal' para definir o problema central a ser resolvido.
    *   Baseie-se em: '{{client.briefing.negociosPosicionamento.maiorDesafio}}' e '{{client.briefing.metasObjetivos.objetivoPrincipal}}'.

    **Público e Posicionamento:** Analise como o posicionamento atual da empresa se conecta (ou não) com as dores da persona. Avalie se o 'diferencial' da empresa é uma solução clara para as 'dores' do público.
    *   Baseie-se em: '{{client.briefing.negociosPosicionamento.diferencial}}' e '{{client.briefing.publicoPersona.dores}}'.

    **Oportunidade Central:** Com base no diagnóstico e na análise do público, identifique a oportunidade mais significativa. Onde está o maior potencial de crescimento? Que ângulo ou tema ainda não foi explorado e que dialoga diretamente com a persona? Considere os relatórios passados para identificar o que já ressoou com o público.

    **Recomendação Estratégica:** Finalize com UMA recomendação clara e acionável. A sugestão deve ser uma ação de marketing ou conteúdo de alto impacto que ataque a 'Oportunidade Central' e impulsione o 'Objetivo Principal'. Seja específico.

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

    **Agora, gere o campo "summary" com o texto da análise, seguindo rigorosamente a estrutura, o formato e as instruções fornecidas.**
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

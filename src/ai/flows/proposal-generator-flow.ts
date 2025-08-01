
'use server';
/**
 * @fileOverview A Genkit flow to generate a marketing proposal.
 *
 * - generateProposalContent: Creates proposal content based on a client brief.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GenerateProposalInput,
  GenerateProposalInputSchema,
  GenerateProposalOutput,
  GenerateProposalOutputSchema,
} from '@/ai/schemas/proposal-generator-schemas';

// Exported function that the frontend will call
export async function generateProposalContent(
  input: GenerateProposalInput
): Promise<GenerateProposalOutput> {
  return proposalGeneratorFlow(input);
}

const proposalGeneratorPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: GenerateProposalInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e Copywriter na agência "CP Marketing Digital".
    Sua tarefa é criar o conteúdo textual para uma proposta comercial para um novo cliente, com base em um breve resumo.

    **Instruções:**
    1.  **Seja Estratégico e Persuasivo:** Use uma linguagem profissional, clara e convincente. O objetivo é mostrar o valor da parceria.
    2.  **Descrição da Parceria:** Crie um parágrafo que resuma o objetivo principal da colaboração, conectando a expertise da CP Marketing com a necessidade do cliente.
    3.  **Objetivos:** Liste 3 a 4 objetivos claros e mensuráveis que a parceria buscará atingir.
    4.  **Diferenciais:** Liste 4 diferenciais ou ações específicas que a CP Marketing fará para atingir os objetivos.
    5.  **Plano Ideal:** Liste 5 benefícios ou resultados que o cliente alcançará ao escolher o plano ideal, reforçando o valor da solução completa.

    **Resumo do Cliente:**
    - Nome do Cliente: {{clientName}}
    - Briefing Rápido: {{clientBrief}}

    Agora, gere os campos de texto para a proposta.
  `,
});

const proposalGeneratorFlow = ai.defineFlow(
  {
    name: 'proposalGeneratorFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    const { output } = await proposalGeneratorPrompt(input);
    return output!;
  }
);

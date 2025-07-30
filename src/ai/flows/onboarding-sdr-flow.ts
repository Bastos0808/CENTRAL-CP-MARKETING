
'use server';
/**
 * @fileOverview A Genkit flow to generate a prospecting message for a new SDR.
 *
 * - generateSdrMessage: Creates a personalized message based on prospect data.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  SdrMessageInput,
  SdrMessageInputSchema,
  SdrMessageOutput,
  SdrMessageOutputSchema,
} from '@/ai/schemas/onboarding-sdr-schemas';

// Exported function that the frontend will call
export async function generateSdrMessage(
  input: SdrMessageInput
): Promise<SdrMessageOutput> {
  return sdrMessageGeneratorFlow(input);
}

const sdrMessageGeneratorPrompt = ai.definePrompt({
  name: 'sdrMessageGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: SdrMessageInputSchema },
  output: { schema: SdrMessageOutputSchema },
  prompt: `
    Você é um Sales Development Representative (SDR) Sênior na "CP Marketing Digital" e sua tarefa é criar um modelo de mensagem de prospecção curta, direta e personalizada para um novo SDR usar como inspiração.

    **Contexto:** O objetivo não é vender na primeira mensagem, mas sim despertar curiosidade suficiente para conseguir uma resposta e iniciar uma conversa. A mensagem deve ser focada na dor do cliente.

    **Instruções:**
    1.  **Seja Pessoal e Direto:** Comece a mensagem de forma pessoal, citando o nome da empresa.
    2.  **Foco na Dor:** Use o campo "Problema ou Oportunidade Observada" para criar o gancho principal da mensagem. Mostre que você fez a lição de casa.
    3.  **Conecte com a Solução (sutilmente):** Conecte o problema a um resultado que a CP Marketing entrega, sem parecer um vendedor de catálogo. Use a estrutura: "Percebi [Problema]. Ajudamos empresas de [Setor] a alcançar [Resultado positivo]".
    4.  **Call to Action (CTA) Leve:** Termine com uma pergunta de baixo compromisso para facilitar a resposta. Evite "agendar uma reunião" diretamente. Prefira algo como "Faz sentido explorarmos isso?" ou "Há interesse em saber mais?".
    5.  **Tom de Voz:** Profissional, mas humano e direto. Evite jargões de marketing.

    **Dados do Prospect:**
    - **Nome da Empresa:** {{companyName}}
    - **Setor:** {{companySector}}
    - **Problema Observado:** {{observedProblem}}

    Agora, gere o campo "message" com o texto da mensagem de prospecção, seguindo rigorosamente as instruções.
  `,
});

const sdrMessageGeneratorFlow = ai.defineFlow(
  {
    name: 'sdrMessageGeneratorFlow',
    inputSchema: SdrMessageInputSchema,
    outputSchema: SdrMessageOutputSchema,
  },
  async (input) => {
    const { output } = await sdrMessageGeneratorPrompt(input);
    return output!;
  }
);

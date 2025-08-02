
'use server';
/**
 * @fileOverview A Genkit flow to analyze a prospect's channel (website, social media).
 *
 * - analyzeChannel: Provides a strategic analysis of a given URL.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  ChannelAnalysisInput,
  ChannelAnalysisInputSchema,
  ChannelAnalysisOutput,
  ChannelAnalysisOutputSchema,
} from '@/ai/schemas/channel-analyzer-schemas';

// Exported function that the frontend will call
export async function analyzeChannel(
  input: ChannelAnalysisInput
): Promise<ChannelAnalysisOutput> {
  return channelAnalyzerFlow(input);
}

const channelAnalyzerPrompt = ai.definePrompt({
  name: 'channelAnalyzerPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: ChannelAnalysisInputSchema },
  output: { schema: ChannelAnalysisOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e sua tarefa é fazer uma análise rápida e precisa de um canal digital de um prospect. O objetivo é identificar pontos fortes, fracos e, o mais importante, um "gancho" para iniciar uma conversa de prospecção.

    **Canal para Análise:**
    {{{channelUrl}}}

    **Instruções:**
    1.  **Aja como um especialista:** Sua análise deve ser profissional, direta e focada em resultados de negócio.
    2.  **Identifique Pontos Fortes:** Encontre de 2 a 3 coisas que o canal faz bem. Pode ser a identidade visual, a frequência de postagens, a clareza da oferta, etc.
    3.  **Identifique Pontos Fracos (Oportunidades):** Encontre de 2 a 3 fraquezas claras que a nossa agência poderia resolver. Foco em problemas que impactam o negócio: falta de profissionalismo, ausência de vídeos, comunicação confusa, falta de chamadas para ação (CTAs), etc.
    4.  **Crie o Gancho de Prospecção:** Com base na principal fraqueza identificada, crie uma frase curta e personalizada para ser usada como gancho no primeiro contato. O gancho deve ser consultivo e despertar curiosidade, não ser agressivo.
        - Exemplo de Fraqueza: "O perfil tem fotos boas, mas não usa vídeos (Reels)."
        - Exemplo de Gancho: "Notei que vocês têm uma fotografia de produto excelente, mas não encontrei conteúdo em vídeo. Existe uma razão estratégica para não explorarem o formato que mais engaja hoje?"

    Agora, gere a análise nos campos do schema de saída.
  `,
});

const channelAnalyzerFlow = ai.defineFlow(
  {
    name: 'channelAnalyzerFlow',
    inputSchema: ChannelAnalysisInputSchema,
    outputSchema: ChannelAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await channelAnalyzerPrompt(input);
    return output!;
  }
);

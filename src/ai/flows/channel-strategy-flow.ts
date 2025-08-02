
'use server';
/**
 * @fileOverview A Genkit flow to analyze a prospect's channel (website, social media) based on a structured framework.
 *
 * - analyzeChannelStrategy: Provides a strategic analysis of a given URL and channel type, answering specific questions.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  ChannelStrategyInput,
  ChannelStrategyInputSchema,
  ChannelStrategyOutput,
  ChannelStrategyOutputSchema,
} from '@/ai/schemas/channel-strategy-schemas';

// Exported function that the frontend will call
export async function analyzeChannelStrategy(
  input: ChannelStrategyInput
): Promise<ChannelStrategyOutput> {
  return channelStrategyFlow(input);
}

// Define the prompt the AI will use, dynamically changing based on channel type
const channelStrategyPrompt = ai.definePrompt({
  name: 'channelStrategyPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: ChannelStrategyInputSchema },
  output: { schema: ChannelStrategyOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e sua tarefa é fazer um diagnóstico preciso de um canal digital de um prospect. Aja como um detetive de negócios, buscando insights acionáveis.

    O canal a ser analisado é um **{{channelType}}**.
    A URL é: **{{{channelUrl}}}**

    Responda CADA uma das seguintes perguntas de forma clara e objetiva, preenchendo o objeto 'analysis' no formato de saída.

    **Framework de Análise para {{channelType}}:**

    1.  **Pontos Fortes:**
        - Pergunta: Quais são os pontos fortes mais evidentes deste canal?
        - Para {{channelType}} como 'Instagram', considere: Identidade visual coesa, frequência de postagens, qualidade das fotos/vídeos, bom engajamento, bio otimizada.
        - Para {{channelType}} como 'Website', considere: Design moderno, clareza na proposta de valor, velocidade de carregamento, SEO básico (títulos, meta descrições), blog ativo, chamadas para ação (CTAs) claras.
        - Para {{channelType}} como 'LinkedIn', considere: Perfil do decisor bem preenchido, conteúdo de autoridade, frequência de posts, engajamento na rede, Company Page ativa.

    2.  **Pontos Fracos / Dores:**
        - Pergunta: Quais são as fraquezas e oportunidades de melhoria mais gritantes que nossa agência poderia resolver?
        - Para {{channelType}} como 'Instagram', procure por: Falta de conteúdo em vídeo (Reels), bio confusa, feed desorganizado, ausência de CTAs, legendas fracas, engajamento baixo ou falso.
        - Para {{channelType}} como 'Website', procure por: Layout datado, site não responsivo (quebra no celular), ausência de formulários de contato, falta de prova social (depoimentos), comunicação confusa.
        - Para {{channelType}} como 'LinkedIn', procure por: Perfil do decisor ou Company Page abandonados, falta de posts que demonstrem expertise, rede de contatos pequena ou pouco qualificada, ausência de artigos.

    3.  **Gancho de Prospecção:**
        - Pergunta: Com base na principal fraqueza identificada, crie uma frase curta e personalizada para ser usada como gancho no primeiro contato. A abordagem deve ser consultiva, não agressiva.
        - Exemplo (fraqueza: perfil sem vídeos): "Notei que vocês têm uma fotografia de produto excelente, mas não encontrei conteúdo em vídeo. Existe uma razão estratégica para não explorarem o formato que mais engaja hoje?"
        - Exemplo (fraqueza: site antigo): "Vi que a [Nome da Empresa] tem uma história incrível, mas senti que o design atual do site talvez não faça jus à qualidade do trabalho de vocês. Já pensaram em modernizá-lo?"

    Agora, gere a análise nos campos do schema de saída, respondendo a cada um dos 3 pontos.
  `,
});

// Define the flow that orchestrates the call to the AI
const channelStrategyFlow = ai.defineFlow(
  {
    name: 'channelStrategyFlow',
    inputSchema: ChannelStrategyInputSchema,
    outputSchema: ChannelStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await channelStrategyPrompt(input);
    return output!;
  }
);

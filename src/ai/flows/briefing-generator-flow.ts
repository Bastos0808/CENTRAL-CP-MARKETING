
'use server';
/**
 * @fileOverview A Genkit flow to generate a complete briefing form from a meeting transcript.
 *
 * - generateBriefingFromTranscript: Analyzes a transcript and fills out a structured briefing form.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GenerateBriefingInput,
  GenerateBriefingInputSchema,
  GenerateBriefingOutput,
  GenerateBriefingOutputSchema,
} from '@/ai/schemas/briefing-generator-schemas';

// Exported function that the frontend will call
export async function generateBriefingFromTranscript(
  input: GenerateBriefingInput
): Promise<GenerateBriefingOutput> {
  return briefingGeneratorFlow(input);
}

// Define the prompt the AI will use
const briefingGeneratorPrompt = ai.definePrompt({
  name: 'briefingGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: GenerateBriefingInputSchema },
  output: { schema: GenerateBriefingOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e sua tarefa é preencher um formulário de briefing detalhado com base na transcrição de uma reunião com um novo cliente. Sua análise deve ser profunda e profissional.

    **Instruções Críticas:**
    1.  **Não Altere o Nome e Plano:** Você NÃO deve alterar o nome do negócio nem o plano contratado. Esses dados são fixos e já foram pré-cadastrados.
    2.  **Não Preencha Links de Perfil:** Para concorrentes e inspirações, preencha apenas os campos 'name' e 'detalhes'. Deixe o campo 'perfil' (onde vai o @ ou link) como uma string vazia (""). O usuário preencherá isso manualmente.
    3.  **Análise Profunda:** Leia toda a transcrição, identifique as informações mais relevantes e organize-as nos campos corretos do formulário. Seja claro, conciso e use uma linguagem profissional.
    4.  **Inferência Inteligente:** Se uma informação não estiver explícita na transcrição, use sua expertise para inferir a resposta com base no contexto geral da reunião. O objetivo é preencher o máximo de campos de análise e descrição possíveis, evitando deixar campos em branco, exceto os de perfil.
    5.  **Análise de Concorrentes:** No campo "detalhes" dos concorrentes e inspirações, forneça uma análise sobre os pontos fortes, fracos e a estratégia geral observada.
    6.  **Mapeamento de Campos:** Preste muita atenção em qual campo está preenchendo. Por exemplo, o campo "O que a empresa faz?" deve descrever produtos/serviços, enquanto o campo "Missão, Visão e Valores" deve conter os princípios e propósito da marca. Não confunda os campos.


    **Transcrição da Reunião:**
    ---
    {{{transcript}}}
    ---

    Agora, preencha o objeto de saída 'briefing' com base na análise da transcrição, seguindo rigorosamente as instruções. Lembre-se: não altere 'nomeNegocio' e 'planoContratado' e não preencha o campo 'perfil' de concorrentes e inspirações.
  `,
});

// Define the flow that orchestrates the call to the AI
const briefingGeneratorFlow = ai.defineFlow(
  {
    name: 'briefingGeneratorFlow',
    inputSchema: GenerateBriefingInputSchema,
    outputSchema: GenerateBriefingOutputSchema,
  },
  async (input) => {
    const { output } = await briefingGeneratorPrompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview A Genkit flow to generate a complete briefing form from a meeting transcript.
 *
 * - generateBriefingFromTranscript: Analyzes a transcript and fills out a structured briefing form.
 */

import { ai } from '@/ai/genkit';
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
  input: { schema: GenerateBriefingInputSchema },
  output: { schema: GenerateBriefingOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e sua tarefa é preencher um formulário de briefing detalhado com base na transcrição de uma reunião com um novo cliente.

    Sua análise deve ser profunda e profissional. Leia toda a transcrição, identifique as informações mais relevantes e organize-as nos campos corretos do formulário. Seja claro, conciso e use uma linguagem profissional. Se uma informação não estiver explícita na transcrição, deixe o campo correspondente vazio.

    **Instruções Detalhadas:**
    1.  **Analise a Transcrição:** Leia atentamente a transcrição da reunião fornecida.
    2.  **Extraia as Informações:** Identifique os pontos-chave que correspondem a cada seção e campo do briefing. Preste atenção aos detalhes sobre o negócio, público-alvo, dores, objetivos, concorrentes e expectativas.
    3.  **Preencha a Estrutura:** Preencha o objeto de saída com as informações extraídas. Siga rigorosamente a estrutura e os nomes dos campos.
    4.  **Seja Profissional:** Resuma as informações de forma clara e profissional. Evite gírias ou linguagem informal da transcrição, a menos que seja para descrever o tom de voz da marca.
    5.  **Campos Vazios:** Se uma informação específica não for mencionada na transcrição, deixe o campo como uma string vazia (""). Não invente dados.

    **Transcrição da Reunião:**
    ---
    {{transcript}}
    ---

    Agora, preencha o objeto de saída 'briefing' com base na análise da transcrição.
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

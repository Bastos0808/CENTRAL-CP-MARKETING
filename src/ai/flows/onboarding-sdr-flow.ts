
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: SdrMessageInputSchema },
  output: { schema: SdrMessageOutputSchema },
  prompt: `
    Você é um Copywriter Sênior e Estrategista de Prospecção B2B para a agência "CP Marketing Digital". Sua missão é criar uma SEQUÊNCIA de 3 mensagens curtas, para serem enviadas uma após a outra no mesmo instante, como se fossem 3 balões de diálogo em um chat.

    **Instruções Críticas:**

    1.  **Gere 3 Mensagens Curtas em Sequência:** Crie três blocos de texto distintos e concisos.
        *   **Mensagem 1 (Abertura):** A primeira mensagem. Deve ser super direta, personalizada, e usar o 'gancho' para provar que a pesquisa foi feita.
        *   **Mensagem 2 (Desenvolvimento):** A segunda mensagem. Deve conectar o gancho a uma dor de negócio ou oportunidade, elaborando sobre o 'problema observado'.
        *   **Mensagem 3 (Ação):** A terceira e última mensagem. Deve ser uma pergunta clara e de fácil resposta, que convida para o próximo passo (uma conversa, diagnóstico, etc.).

    2.  **Adapte a Cadência à Oferta de Valor ({{valueOffer}}):**
        *   **Se a oferta for 'podcast':** O tom é de reconhecimento e oportunidade. O CTA na Mensagem 3 deve ser focado em "gravar um episódio piloto".
        *   **Se a oferta for 'consultoria' ou 'ambos':** O tom é de resolução de problemas. O CTA na Mensagem 3 deve focar em "agendar um diagnóstico rápido".

    3.  **Desenvolva o Problema Observado (Não Copie):**
        *   Na Mensagem 2, se o campo 'observedProblem' for preenchido (ex: "blog desatualizado"), elabore sobre a consequência de negócio disso. Ex: "Vi que o blog não é atualizado desde 2022. Geralmente, isso resulta na perda de posições no Google para concorrentes mais ativos."

    4.  **Inteligência Proativa (Se Faltar Informação):**
        *   Se os campos 'hook' e 'observedProblem' estiverem VAZIOS, use o 'companySector' para inferir uma dor comum e relevante que justifique sua abordagem.

    **Dados Fornecidos pelo SDR:**
    - **Canal de Comunicação:** {{communicationChannel}}
    - **Nome do Decisor:** {{decisionMakerName}}
    - **Nome da Empresa:** {{companyName}}
    - **Setor da Empresa:** {{companySector}}
    - **Gancho Personalizado (Opcional):** {{hook}}
    - **Problema Observado (Opcional):** {{observedProblem}}
    - **Oferta de Valor Principal:** {{valueOffer}}

    **Agora, gere o campo "messages" com um array contendo os 3 textos da sequência de mensagens instantâneas, seguindo rigorosamente as instruções.**
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

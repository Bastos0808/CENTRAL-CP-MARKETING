
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
    Você é um Copywriter Sênior e Estrategista de Prospecção B2B para a agência "CP Marketing Digital". Sua missão é criar uma CADÊNCIA CURTA (3 mensagens) para um SDR (Sales Development Representative) usar no primeiro contato.

    **Instruções Críticas:**

    1.  **Gere 3 Mensagens em Sequência:** Crie três mensagens distintas e curtas.
        *   **Mensagem 1 (Abertura):** Deve ser direta, personalizada e focada em validar a dor. Use o 'gancho' e o 'problema observado'.
        *   **Mensagem 2 (Follow-up de Valor):** Enviada 2 dias depois. Deve ser um lembrete gentil que agrega valor. NÃO repita a primeira mensagem. Ofereça um dado, uma estatística ou uma pergunta provocativa relacionada ao 'problema observado'.
        *   **Mensagem 3 (Break-up):** Enviada 4 dias depois. Deve ser uma mensagem de encerramento educada que coloca a responsabilidade no prospect, deixando a porta aberta. Ex: "Imagino que esteja ocupado. Se [resolver problema] não for prioridade agora, sem problemas. Desejo sucesso!".

    2.  **Adapte a Cadência à Oferta de Valor ({{valueOffer}}):**
        *   **Se a oferta for 'podcast':** O tom é de reconhecimento e oportunidade. A cadência deve despertar o desejo do prospect de ser visto como uma autoridade, com o CTA focado em "gravar um episódio piloto".
        *   **Se a oferta for 'consultoria' ou 'ambos':** O tom é de resolução de problemas. A cadência deve focar na dor e apresentar a consultoria como o primeiro passo para a solução. O CTA é "agendar um diagnóstico rápido".

    3.  **Desenvolva o Problema Observado (Não Copie):**
        *   Se o campo 'observedProblem' for preenchido (ex: "blog desatualizado"), elabore sobre a consequência de negócio disso na Mensagem 1. Ex: "Notei que o blog não é atualizado desde 2022, o que geralmente resulta na perda de posições no Google para concorrentes mais ativos."

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

    **Agora, gere o campo "messages" com um array contendo os 3 textos da cadência de prospecção, seguindo rigorosamente as instruções.**
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

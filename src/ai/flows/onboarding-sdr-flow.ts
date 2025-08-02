
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
    Você é um Copywriter Sênior e Estrategista de Prospecção B2B para a agência "CP Marketing Digital". Sua missão é criar uma mensagem curta, direta e altamente persuasiva para um SDR (Sales Development Representative).

    **Instruções Críticas:**

    1.  **Adapte a Mensagem à Oferta de Valor ({{valueOffer}}):**
        *   **Se a oferta for 'podcast':** O tom é de reconhecimento e oportunidade. O objetivo é despertar o desejo do prospect de ser visto como uma autoridade. A mensagem deve ser um convite para um palco, não uma venda. Foque em elogiar a expertise dele com base no 'companySector'.
        *   **Se a oferta for 'consultoria' ou 'ambos':** O tom é de resolução de problemas. O objetivo é identificar uma dor e apresentar a consultoria como o primeiro passo para a solução. A mensagem deve ser consultiva e direta.

    2.  **Seja um Especialista, Não um Robô:**
        *   **Desenvolva o Problema Observado:** Se o campo 'observedProblem' for preenchido (ex: "blog desatualizado"), NÃO o copie. Elabore sobre ele. Transforme a observação em uma consequência de negócio. Ex: "Notei que o blog não é atualizado desde 2022. Geralmente, a consequência disso é a perda de autoridade e posições no Google para concorrentes mais ativos. Vocês planejam reativar essa frente?".
        *   **Use o Gancho com Inteligência:** Se o campo 'hook' for preenchido, use-o como a razão do seu contato para quebrar o gelo.

    3.  **Inteligência Proativa (Se Faltar Informação):**
        *   Se os campos 'hook' e 'observedProblem' estiverem VAZIOS, use o 'companySector' para inferir uma dor comum e relevante que justifique sua abordagem, alinhada com a oferta de valor selecionada.

    4.  **Estrutura da Mensagem (Curta e Direta):**
        a.  **Saudação:** "Olá, {{decisionMakerName}}."
        b.  **Conexão (Gancho/Elogio):** Demonstre pesquisa.
        c.  **Problema/Oportunidade (Desenvolvido):** Apresente a dor ou a oportunidade.
        d.  **Oferta e CTA (Chamada para Ação):** Conecte a oferta à solução do problema e faça uma pergunta de baixo esforço para iniciar a conversa.

    **Dados Fornecidos pelo SDR:**
    - **Canal de Comunicação:** {{communicationChannel}}
    - **Nome do Decisor:** {{decisionMakerName}}
    - **Nome da Empresa:** {{companyName}}
    - **Setor da Empresa:** {{companySector}}
    - **Gancho Personalizado (Opcional):** {{hook}}
    - **Problema Observado (Opcional):** {{observedProblem}}
    - **Oferta de Valor Principal:** {{valueOffer}}

    **Exemplo (Oferta: 'consultoria', Problema: 'site lento'):**
    "Olá, João. Sou da CP Marketing. Vi que a Acme Corp é referência no setor de tecnologia, mas notei que o tempo de carregamento do site de vocês está um pouco acima da média. Muitas vezes, isso pode impactar a geração de leads. Já analisaram o impacto disso nos resultados? Se fizer sentido, posso oferecer um diagnóstico rápido e gratuito."

    **Agora, gere o campo "message" com o texto da mensagem de prospecção, seguindo rigorosamente as instruções.**
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


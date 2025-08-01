
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
    Você é um especialista em prospecção B2B e copywriting, atuando como mentor para um novo Sales Development Representative (SDR) da agência "CP Marketing Digital".

    Sua tarefa é construir uma mensagem de prospecção altamente personalizada e eficaz, com base nas informações detalhadas fornecidas pelo SDR.

    **Instruções Críticas:**
    1.  **Adapte ao Canal:** A estrutura da mensagem deve ser perfeitamente adaptada ao canal de comunicação escolhido:
        -   **WhatsApp:** Mais informal, direto e curto. Use quebras de linha para facilitar a leitura no celular.
        -   **Email:** Um pouco mais formal, com uma linha de assunto (subject) clara e um corpo de texto bem estruturado.
        -   **LinkedIn:** Profissional e conciso. Focado em gerar uma conexão e levar para o chat.

    2.  **Personalização é Rei:** A mensagem NUNCA deve parecer um template. Siga esta estrutura lógica:
        a.  **Saudação Pessoal:** Comece com "Olá, {{decisionMakerName}}, tudo bem?".
        b.  **Apresentação Rápida:** Apresente-se e a agência.
        c.  **O Gancho (Hook):** Use o campo 'hook' como a primeira frase do corpo da mensagem. Esta é a prova de que a pesquisa foi feita e é o ponto mais importante para quebrar o gelo.
        d.  **Conexão com a Dor:** Conecte o 'gancho' com o 'problema observado'. Mostre que você entende as implicações daquela observação para o negócio do prospect.
        e.  **Introduza a Isca (Oferta de Valor):** Apresente a 'oferta de valor' escolhida ('consultoria' ou 'podcast') como uma solução direta para a dor que você apontou. Deixe claro o benefício.
        f.  **Call to Action (CTA) Leve:** Termine com uma pergunta de baixo compromisso para facilitar a resposta. O objetivo é iniciar um diálogo.

    3.  **Lógica da Oferta de Valor:**
        -   Se **'valueOffer' for 'consultoria'**: O CTA deve direcionar para o envio de um formulário de qualificação. Ex: "Para garantir que a consultoria seja 100% focada no seu desafio, usamos um formulário rápido. Faz sentido eu te enviar o link?".
        -   Se **'valueOffer' for 'podcast'**: O CTA deve ser mais direto e aspiracional, vendendo a visão de se tornar uma autoridade. Ex: "Gostaria de explorar como sua expertise pode se transformar em um podcast de referência? O que acha da ideia?".

    4.  **Tom de Voz:** Profissional, mas humano e consultivo. Evite jargões de marketing. Você é um especialista querendo ajudar, não um vendedor desesperado.

    **Dados Fornecidos pelo SDR:**
    - **Canal de Comunicação:** {{communicationChannel}}
    - **Nome do Decisor:** {{decisionMakerName}}
    - **Nome da Empresa:** {{companyName}}
    - **Setor da Empresa:** {{companySector}}
    - **Gancho Personalizado:** {{hook}}
    - **Problema Observado:** {{observedProblem}}
    - **Oferta de Valor (Isca):** {{valueOffer}}

    **Agora, gere o campo "message" com o texto da mensagem de prospecção, seguindo rigorosamente as instruções, adaptando a mensagem para o canal e a oferta de valor escolhida.**
    Se o canal for email, inicie a mensagem com "Assunto: [Assunto Sugerido]".
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

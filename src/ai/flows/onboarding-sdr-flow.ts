
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
    Você é um Copywriter Sênior especialista em prospecção B2B (cold outreach). Sua missão é criar uma mensagem curta, direta e altamente persuasiva para um SDR da agência "CP Marketing Digital".

    **Instruções Críticas:**
    1.  **Mensagem Curta e Direta:** A mensagem deve ser concisa e fácil de ler. Menos é mais. Esqueça textos longos.
    2.  **Personalização é a Chave:** O campo 'hook' (gancho) é a informação mais importante. A mensagem DEVE começar com ele para provar que a pesquisa foi feita e quebrar o gelo imediatamente.
    3.  **Adapte ao Canal:** A estrutura da mensagem deve ser perfeitamente adaptada ao canal:
        -   **WhatsApp/LinkedIn:** Informal e direto. Use quebras de linha.
        -   **Email:** Levemente mais formal, com um "Assunto:" impactante e direto.

    4.  **Estrutura da Mensagem:**
        a.  **Gancho Imediato:** Comece com o 'hook'. Ex: "Olá, {{decisionMakerName}}. Vi que a {{companyName}} participou do evento X..."
        b.  **Conexão Rápida com a Dor:** Conecte o gancho ao 'problema observado' em uma única frase. Mostre que você entende o desafio. Ex: "... e sei que o maior desafio pós-evento é transformar esses contatos em clientes."
        c.  **Apresente a Oferta (Isca de Valor):** Ofereça a 'valueOffer' como uma solução clara.
        d.  **CTA de Baixo Esforço:** Termine com uma pergunta simples para iniciar a conversa.

    5.  **Lógica da Oferta de Valor:**
        -   Se **'valueOffer' for 'consultoria'**: Ofereça o diagnóstico gratuito. Ex: "Faz sentido agendarmos uma consultoria estratégica rápida e gratuita para te mostrarmos como fazer isso?"
        -   Se **'valueOffer' for 'podcast'**: Ofereça a gravação do episódio. Ex: "Acreditamos que sua expertise em [setor] merece um podcast. Gostaria de gravar um episódio piloto em nosso estúdio, sem custo, para ver o potencial disso?"
        -   Se **'valueOffer' for 'ambos'**: Dê o poder de escolha ao prospect de forma clara. Ex: "Para te ajudar com isso, temos duas opções: uma consultoria estratégica gratuita ou a gravação de um episódio de podcast para você se posicionar como autoridade. Qual das duas te interessa mais?"

    **Dados Fornecidos pelo SDR:**
    - **Canal de Comunicação:** {{communicationChannel}}
    - **Nome do Decisor:** {{decisionMakerName}}
    - **Nome da Empresa:** {{companyName}}
    - **Setor da Empresa:** {{companySector}}
    - **Gancho Personalizado:** {{hook}}
    - **Problema Observado:** {{observedProblem}}
    - **Oferta de Valor (Isca):** {{valueOffer}}

    **Agora, gere o campo "message" com o texto da mensagem de prospecção, seguindo rigorosamente as instruções para ser curta, direta e personalizada.**
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


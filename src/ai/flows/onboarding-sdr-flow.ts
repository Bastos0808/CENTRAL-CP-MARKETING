
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
    Você é um Copywriter Sênior e Estrategista de Conteúdo especialista em prospecção B2B (cold outreach) para a agência "CP Marketing Digital". Sua missão é criar uma mensagem curta, direta e altamente persuasiva para um SDR.

    **Instruções Críticas:**

    1.  **Inteligência Artificial Adaptativa:**
        *   **Se o campo 'hook' (gancho) e 'observedProblem' (problema observado) forem preenchidos:** Use essas informações como a base principal da sua mensagem. A personalização fornecida pelo SDR é a prioridade máxima.
        *   **Se os campos 'hook' e 'observedProblem' estiverem VAZIOS:** Sua tarefa é ser proativo. Com base no 'companySector' (setor da empresa), infira um gancho e um problema/oportunidade relevante para justificar o convite para o podcast. Demonstre que você entende o mercado do prospect. Ex: Para um médico, o gancho pode ser a importância de construir autoridade; para um B2B, a necessidade de gerar leads qualificados.

    2.  **Foco no Desejo (Convite para Podcast):**
        *   O objetivo NÃO é vender, mas sim despertar o desejo e o senso de oportunidade.
        *   Posicione o convite para o podcast como um reconhecimento da autoridade e expertise do prospect. Use frases como "Vimos que você é uma referência no setor de [companySector]..." ou "Acreditamos que sua experiência em [companySector] merece uma plataforma de maior alcance...".
        *   A mensagem deve ser um elogio estratégico que abre a porta para o convite.

    3.  **Estrutura da Mensagem (Curta e Direta):**
        a.  **Saudação Personalizada:** "Olá, {{decisionMakerName}}."
        b.  **Elogio/Gancho Estratégico:** Conecte o nome da empresa e o setor a um elogio que demonstre pesquisa (real ou inferida).
        c.  **Apresente a Oportunidade (O Podcast):** Apresente o podcast não como um serviço, mas como um palco, uma oportunidade para ele brilhar.
        d.  **CTA de Baixo Esforço:** Termine com uma pergunta simples para iniciar a conversa.

    **Dados Fornecidos pelo SDR (pode haver campos vazios):**
    - **Canal de Comunicação:** {{communicationChannel}}
    - **Nome do Decisor:** {{decisionMakerName}}
    - **Nome da Empresa:** {{companyName}}
    - **Setor da Empresa:** {{companySector}}
    - **Gancho Personalizado (Opcional):** {{hook}}
    - **Problema Observado (Opcional):** {{observedProblem}}
    - **Oferta de Valor (Opcional, padrão é 'podcast'):** {{valueOffer}}

    **Exemplo de Mensagem (com poucas informações):**
    "Olá, [Nome do Decisor]. Acompanhando a [CompanyName], percebemos como vocês são uma referência no setor de [companySector]. Acreditamos que sua expertise tem um potencial incrível para um podcast, posicionando você como a principal voz na área. Para que você veja o poder disso na prática, estamos oferecendo a especialistas como você a oportunidade de gravar um episódio piloto em nosso estúdio, sem custo. O que acha da ideia?"

    **Agora, gere o campo "message" com o texto da mensagem de prospecção, seguindo rigorosamente as instruções para ser curta, persuasiva e despertar o desejo.**
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

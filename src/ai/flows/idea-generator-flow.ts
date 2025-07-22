
'use server';
/**
 * @fileOverview A Genkit flow to generate content post ideas for a client.
 *
 * - generateIdeas: Generates a list of post ideas based on the client's briefing.
 */

import { ai } from '@/ai/genkit';
import {
  IdeaGeneratorInput,
  IdeaGeneratorInputSchema,
  IdeaGeneratorOutput,
  IdeaGeneratorOutputSchema,
} from '@/ai/schemas/idea-generator-schemas';

// Exported function that the frontend will call
export async function generateIdeas(
  input: IdeaGeneratorInput
): Promise<IdeaGeneratorOutput> {
  return ideaGeneratorFlow(input);
}

// Define the prompt the AI will use
const ideaGeneratorPrompt = ai.definePrompt({
  name: 'ideaGeneratorPrompt',
  input: { schema: IdeaGeneratorInputSchema },
  output: { schema: IdeaGeneratorOutputSchema },
  prompt: `
    Você é um(a) Estrategista de Conteúdo Sênior na agência "CP Marketing Digital". Sua especialidade é criar ideias de posts que geram engajamento e resultados para os clientes.

    Sua tarefa é gerar 3 ideias de posts para as redes sociais de um cliente. Você receberá o dossiê completo do cliente (briefing). Use essas informações para criar sugestões relevantes e criativas.

    **Instruções Detalhadas:**
    1.  **Baseie-se no Briefing:** Analise profundamente o briefing do cliente. Preste atenção especial em:
        - **Público-alvo e Persona:** Quem são? Quais suas dores e necessidades?
        - **Negócio e Diferencial:** O que o cliente vende? O que o torna único?
        - **Tom de Voz:** A comunicação é formal, divertida, técnica?
        - **Objetivos:** O que o cliente quer alcançar (vendas, leads, reconhecimento de marca)?
    2.  **Seja Criativo e Estratégico:** Não sugira ideias genéricas. Proponha posts que:
        - Resolvam um problema da persona.
        - Destaquem um diferencial do cliente.
        - Eduquem o público sobre um tema relacionado ao negócio.
        - Contem uma história ou mostrem os bastidores.
    3.  **Formato de Saída:** Para cada ideia, forneça um título claro e uma breve descrição (1-2 frases) explicando o conceito do post.

    **Dados para Análise:**

    **Dossiê do Cliente (Briefing completo em JSON):**
    \`\`\`json
    {{{clientBriefing}}}
    \`\`\`

    **Agora, gere o campo "ideas" com um array de 3 objetos, cada um contendo um "title" e uma "description" para um post, seguindo rigorosamente as instruções.**
  `,
});

// Define the flow that orchestrates the call to the AI
const ideaGeneratorFlow = ai.defineFlow(
  {
    name: 'ideaGeneratorFlow',
    inputSchema: IdeaGeneratorInputSchema,
    outputSchema: IdeaGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await ideaGeneratorPrompt(input);
    return output!;
  }
);

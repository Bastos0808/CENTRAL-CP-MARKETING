
'use server';
/**
 * @fileOverview A Genkit flow to generate a single content post idea for a client.
 *
 * - generateIdeas: Generates one post idea based on the client's briefing, past reports and desired post type.
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

    Sua tarefa é gerar UMA ÚNICA ideia de post para as redes sociais de um cliente. Você receberá o dossiê do cliente (briefing), o histórico de relatórios de desempenho e o tipo de post desejado. Use TODAS essas informações para criar uma sugestão relevante, criativa e alinhada à estratégia.

    **Instruções Detalhadas:**
    1.  **Analise o Contexto Completo:**
        - **Briefing do Cliente:** Analise profundamente o briefing. Preste atenção especial em: público-alvo, persona (dores e necessidades), diferencial do negócio, tom de voz e objetivos.
        - **Histórico de Relatórios:** Analise os relatórios de desempenho anteriores. Identifique padrões: que tipo de conteúdo gerou mais engajamento? Quais temas ressoaram melhor com a audiência? Use esses insights como base para sua nova ideia. Evite sugerir algo que já teve baixo desempenho, a menos que você proponha uma abordagem completamente nova.
        - **Tipo de Post:** A sua ideia DEVE ser perfeitamente adequada ao formato solicitado:
            - **arte:** Uma imagem única e impactante. A ideia deve ser concisa e direta.
            - **reels:** Um vídeo curto e dinâmico. Pense em trends, tutoriais rápidos, ou cenas de bastidores.
            - **carrossel:** Uma sequência de imagens ou vídeos. Ideal para listas, passo-a-passo, ou para contar uma história.

    2.  **Seja Criativo e Estratégico:** Não sugira ideias genéricas. Proponha um post que:
        - Resolva um problema da persona.
        - Destaque um diferencial do cliente.
        - Eduque o público sobre um tema relevante, aproveitando o que já funcionou no passado.
        - Seja adequado ao formato ({{postType}}).

    3.  **Formato de Saída:** Forneça um título claro e uma breve descrição (1-2 frases) explicando o conceito do post.

    **Dados para Análise:**

    **1. Dossiê do Cliente (Briefing):**
    - **O que a empresa faz?** {{briefing.negociosPosicionamento.descricao}}
    - **Diferencial:** {{briefing.negociosPosicionamento.diferencial}}
    - **Público-alvo:** {{briefing.publicoPersona.publicoAlvo}}
    - **Persona:** {{briefing.publicoPersona.persona}}
    - **Dores da Persona:** {{briefing.publicoPersona.dores}}
    - **Objetivo Principal:** {{briefing.metasObjetivos.objetivoPrincipal}}

    **2. Histórico de Relatórios (Análises passadas):**
    {{#if reports}}
      {{#each reports}}
      - Relatório de {{createdAt}}: {{analysis}}
      {{/each}}
    {{else}}
      Nenhum relatório anterior.
    {{/if}}

    **3. Tipo de Post Desejado:**
    {{postType}}

    **Agora, gere o campo "idea" com um objeto contendo um "title" e uma "description" para um post, seguindo rigorosamente as instruções.**
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

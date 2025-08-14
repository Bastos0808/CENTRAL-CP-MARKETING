
'use server';
/**
 * @fileOverview A Genkit flow to generate marketing proposal content.
 *
 * - generateProposalContent: Creates proposal content based on selected service packages.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateProposalInput,
  GenerateProposalInputSchema,
  GenerateProposalOutput,
  GenerateProposalOutputSchema,
} from '@/ai/schemas/proposal-generator-schemas';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Exported function that the frontend will call
export async function generateProposalContent(
  input: GenerateProposalInput
): Promise<GenerateProposalOutput> {
  return proposalGeneratorFlow(input);
}

// Internal schema to add the processed packages string to the prompt input
const InternalPromptInputSchema = GenerateProposalInputSchema.extend({
    packagesString: z.string(),
});

const proposalGeneratorPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: InternalPromptInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar o conteúdo de uma proposta comercial altamente personalizada para o cliente "{{clientName}}".

    **Contexto Estratégico do Cliente:**
    - **Setor da Empresa:** {{clientSector}}
    - **Principal Objetivo:** {{clientObjective}}
    - **Maior Desafio Atual:** {{clientChallenge}}
    - **Público-Alvo:** {{clientAudience}}

    **Serviços Selecionados para a Proposta:**
    ---
    {{packagesString}}
    ---

    **Instruções Críticas:**
    1.  **Conecte Tudo ao Contexto:** Sua principal missão é conectar CADA item da proposta (objetivos, diferenciais, etc.) com o **objetivo**, **desafio**, **setor** e **público-alvo** do cliente. Não gere textos genéricos. A proposta deve soar como se tivesse sido escrita exclusivamente para o cliente "{{clientName}}", que atua no setor de "{{clientSector}}".
    2.  **Seja Persuasivo e Focado em Valor:** Use uma linguagem que vende o resultado e a transformação. Em vez de "Fazer 3 posts por semana", use "Construir autoridade e engajamento contínuo com 3 posts semanais estratégicos para alcançar [Público-Alvo]".
    3.  **Personalize com o Nome e Setor:** Use o nome do cliente, "{{clientName}}", e seu setor, "{{clientSector}}", para criar uma conexão pessoal e demonstrar expertise.
    4.  **Use Listas (Bullet Points):** Para as seções 'objectiveItems', 'differentialItems' e 'idealPlanItems', gere uma lista de 4 a 5 itens curtos e de alto impacto. **Não crie um texto corrido.** Cada item da lista deve ser um ponto claro e persuasivo.

    **Instruções por Seção:**
    -   **partnershipDescription:** Crie um parágrafo inspirador para a seção "Sobre a Parceria". Comece abordando diretamente o **desafio** de "{{clientChallenge}}" no contexto do setor de "{{clientSector}}", e posicione a parceria como a solução para alcançar o **objetivo** de "{{clientObjective}}".
    -   **objectiveItems:** Gere uma **lista** de 4 a 5 objetivos claros e impactantes. Cada item da lista deve ser uma consequência direta da implementação dos serviços selecionados para resolver o desafio do cliente. Ex: "Gerar um fluxo previsível de leads qualificados do setor de {{clientSector}} prontos para a compra".
    -   **differentialItems:** Gere uma **lista** de 4 a 5 diferenciais da sua agência. Conecte cada diferencial a como ele ajuda a mitigar riscos ou acelerar o objetivo do cliente. Ex: "Relatórios transparentes focados em ROI, para que você veja exatamente como seu investimento está se convertendo em [Objetivo do Cliente]".
    -   **idealPlanItems:** Elabore uma **lista** de 3 a 4 argumentos para a seção "Por que este plano é ideal?". Justifique por que a combinação dos serviços escolhidos é a estratégia perfeita para o cenário ATUAL do cliente, atacando seu desafio e mirando seu objetivo no setor de "{{clientSector}}". Ex: "A combinação do Tráfego Pago com a Gestão de Mídias Sociais ataca seu desafio de [Desafio do Cliente] em duas frentes: alcance imediato e construção de confiança a longo prazo."

    Agora, gere o conteúdo para todos os campos do schema de saída, seguindo rigorosamente as instruções de personalização e formatação.
  `,
});

const proposalGeneratorFlow = ai.defineFlow(
  {
    name: 'proposalGeneratorFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    try {
      // Process the packages into a simple string for the prompt
      const packagesString = input.packages && input.packages.length > 0 
        ? input.packages.map(pkg => `- ${pkg}`).join('\n')
        : "Nenhum pacote selecionado. Foco em uma abordagem de consultoria geral.";

      // Call the prompt with the extended input
      const { output } = await proposalGeneratorPrompt({
        ...input,
        packagesString: packagesString,
      });
      
      // Ensure the output is not null and that the fields are valid
      if (!output) {
        throw new Error("A IA retornou uma resposta vazia.");
      }

      return {
        partnershipDescription: output.partnershipDescription || 'Não foi possível gerar a descrição. Tente novamente.',
        objectiveItems: output.objectiveItems || [],
        differentialItems: output.differentialItems || [],
        idealPlanItems: output.idealPlanItems || [],
      };

    } catch (error) {
      console.error('Erro detalhado no fluxo proposalGeneratorFlow:', error);
      // Retorna uma estrutura válida em caso de erro para não quebrar o frontend
      return {
        partnershipDescription: 'Ocorreu um erro ao gerar o conteúdo. Por favor, verifique os dados de entrada e tente novamente.',
        objectiveItems: [],
        differentialItems: [],
        idealPlanItems: [],
      };
    }
  }
);

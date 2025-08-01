
'use server';
/**
 * @fileOverview A Genkit flow to generate marketing proposal content options.
 *
 * - generateProposalContent: Creates proposal content based on selected service packages.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GenerateProposalInput,
  GenerateProposalInputSchema,
  GenerateProposalOutput,
  GenerateProposalOutputSchema,
} from '@/ai/schemas/proposal-generator-schemas';

// Exported function that the frontend will call
export async function generateProposalContent(
  input: GenerateProposalInput
): Promise<GenerateProposalOutput> {
  return proposalGeneratorFlow(input);
}

const proposalGeneratorPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: GenerateProposalInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar o conteúdo de uma proposta comercial para o cliente "{{clientName}}", com base nos pacotes de serviços selecionados: {{packages}}.

    **Instruções Gerais:**
    1.  **Seja Persuasivo:** Use uma linguagem que vende o valor e o resultado, não apenas descreve o serviço.
    2.  **Personalize com o Nome:** Use o nome do cliente, "{{clientName}}", para criar uma conexão pessoal, principalmente na descrição da parceria.
    3.  **Foco no Valor:** Conecte cada item a um benefício ou resultado que o cliente deseja alcançar.

    **Instruções por Seção:**
    -   **partnershipDescriptionOptions:** Crie 3 opções de texto para a seção "Sobre a Parceria". Deve ser um texto inspirador e que estabeleça um tom de colaboração.
    -   **objectiveItemsOptions:** Com base nos pacotes selecionados ({{packages}}), gere 3 opções de listas de objetivos. Cada lista deve conter itens que a parceria irá alcançar. Ex: "Aumentar a autoridade da marca", "Gerar leads qualificados", etc.
    -   **differentialItemsOptions:** Com base nos pacotes, gere 3 opções de listas de diferenciais. Cada lista deve destacar o que torna nossa abordagem única. Ex: "Planejamento estratégico focado em resultados", "Equipe multidisciplinar", "Relatórios transparentes".
    -   **idealPlanItemsOptions:** Com base nos pacotes, gere 3 opções de listas de argumentos para "Por que este plano é ideal?". Cada lista deve justificar a escolha dos serviços para o sucesso do cliente. Ex: "Combina alcance (Tráfego Pago) com autoridade (Podcast)", "Solução completa que ataca o problema de ponta a ponta".

    Agora, gere as opções para todos os campos do schema de saída.
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
      const { output } = await proposalGeneratorPrompt(input);
      
      // Garante que o output não é nulo e que os campos opcionais sejam arrays vazios se não forem gerados
      return {
        partnershipDescriptionOptions: output?.partnershipDescriptionOptions || [],
        objectiveItemsOptions: output?.objectiveItemsOptions || [],
        differentialItemsOptions: output?.differentialItemsOptions || [],
        idealPlanItemsOptions: output?.idealPlanItemsOptions || [],
      };

    } catch (error) {
      console.error('Error generating proposal content:', error);
      // Retorna uma estrutura válida em caso de erro para não quebrar o frontend
      return {
        partnershipDescriptionOptions: ['Não foi possível gerar a descrição. Tente novamente.'],
        objectiveItemsOptions: [],
        differentialItemsOptions: [],
        idealPlanItemsOptions: [],
      };
    }
  }
);

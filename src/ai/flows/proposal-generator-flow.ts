
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateProposalInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar 3 OPÇÕES de texto para a seção "Sobre a Parceria" de uma proposta comercial destinada ao cliente "{{clientName}}".

    **Instruções:**
    1.  **Personalize com o Nome:** Use o nome do cliente, "{{clientName}}", para criar uma conexão pessoal.
    2.  **Foco no Valor:** Os textos devem ser claros, persuasivos e focados em vender o valor da solução, não apenas descrever os serviços. Conecte a parceria a resultados que o cliente deseja.
    3.  **Tom de Voz:** Mantenha um tom profissional, confiante e parceiro.
    
    Agora, gere as 3 opções para o campo "partnershipDescriptionOptions". Os outros campos no schema de saída não precisam ser preenchidos.
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

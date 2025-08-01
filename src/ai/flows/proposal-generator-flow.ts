
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
    Sua tarefa é criar OPÇÕES de textos persuasivos para uma proposta comercial, com base nos pacotes de serviço que o cliente está contratando.

    **Instruções:**
    1.  **Seja um Vendedor:** Seus textos devem ser claros, persuasivos e focados em vender o valor da solução, não apenas descrever os serviços. Conecte os serviços aos resultados que o cliente deseja.
    2.  **Gere 3 Opções para Cada Campo:** Para cada campo de texto da proposta (partnershipDescriptionOptions, objectiveItemsOptions, differentialItemsOptions, idealPlanItemsOptions), você deve gerar 3 opções distintas para o usuário escolher.
    3.  **Analise os Pacotes:** Use a lista de pacotes contratados para entender o escopo do trabalho e personalizar os textos.
        -   Se tiver "Social Media", foque em autoridade, engajamento e comunidade.
        -   Se tiver "Tráfego Pago", foque em leads, vendas rápidas e ROI.
        -   Se tiver "Podcast", foque em autoridade de marca e conexão profunda.
        -   Se tiver "Identidade Visual" ou "Website", foque em profissionalismo e percepção de valor.
    4.  **Objetivos Claros:** Os objetivos devem ser claros, mensuráveis e diretamente ligados aos serviços contratados.
    5.  **Diferenciais Reais:** Os diferenciais devem destacar o "jeito CP de fazer" e o que nos torna únicos.
    6.  **Plano Ideal Convincente:** Os benefícios do plano ideal devem ser aspiracionais e mostrar o valor da solução completa.

    **Cliente:**
    - Nome do Cliente: {{clientName}}
    
    **Pacotes Contratados:**
    {{#if packages}}
      {{#each packages}}
      - {{this}}
      {{/each}}
    {{else}}
      Nenhum pacote selecionado. Crie opções genéricas de alto valor.
    {{/if}}


    Agora, gere as opções para cada campo da proposta.
  `,
});

const proposalGeneratorFlow = ai.defineFlow(
  {
    name: 'proposalGeneratorFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    const { output } = await proposalGeneratorPrompt(input);
    return output!;
  }
);

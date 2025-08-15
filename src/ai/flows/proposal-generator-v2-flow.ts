
'use server';
/**
 * @fileOverview Um fluxo de IA para orquestrar a geração de conteúdo de propostas de marketing em partes.
 * 
 * - generateProposalContentV2: Orquestra a chamada de múltiplos fluxos para gerar cada seção da proposta.
 */

import {
  GenerateProposalV2Input,
  GenerateProposalV2InputSchema,
  GenerateProposalV2Output,
  GenerateProposalV2OutputSchema,
} from '@/ai/schemas/proposal-v2-schemas';

import { generatePartnershipContent } from './proposal-v2/partnership-flow';
import { generateObjectivesContent } from './proposal-v2/objectives-flow';
import { generateDifferentialsContent } from './proposal-v2/differentials-flow';
import { generateIdealPlanContent } from './proposal-v2/ideal-plan-flow';
import { ai } from '../genkit';
import { z } from 'zod';

export async function generateProposalContentV2(
  input: GenerateProposalV2Input
): Promise<GenerateProposalV2Output> {
  return proposalGeneratorV2Flow(input);
}

const proposalGeneratorV2Flow = ai.defineFlow(
  {
    name: 'proposalGeneratorV2Flow',
    inputSchema: GenerateProposalV2InputSchema,
    outputSchema: GenerateProposalV2OutputSchema,
  },
  async (input) => {
    
    // Process the packages into a simple string for the sub-flows
    const packagesString = input.packages && input.packages.length > 0 
      ? input.packages.map(pkg => `- ${pkg}`).join('\n')
      : "Nenhum pacote selecionado. Foco em uma abordagem de consultoria geral.";

    const commonInput = { ...input, packagesString };

    try {
        // Run all content generation flows in parallel
        const [
            partnershipResult,
            objectivesResult,
            differentialsResult,
            idealPlanResult
        ] = await Promise.all([
            generatePartnershipContent(commonInput),
            generateObjectivesContent(commonInput),
            generateDifferentialsContent(commonInput),
            generateIdealPlanContent(commonInput),
        ]);

        // Combine the results
        return {
            partnershipDescription: partnershipResult.partnershipDescription,
            objectiveItems: objectivesResult.objectiveItems,
            differentialItems: differentialsResult.differentialItems,
            idealPlanItems: idealPlanResult.idealPlanItems,
        };
    } catch (error) {
        console.error('Erro detalhado no fluxo proposalGeneratorV2Flow:', error);
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


/**
 * @fileoverview Schemas and types for the NEW modular proposal generator flow (V2).
 */
import { z } from 'zod';

// Base input from the frontend
export const GenerateProposalV2InputSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  clientSector: z.string().min(1, 'O segmento do cliente é obrigatório.'),
  clientObjective: z.string().min(1, 'O objetivo do cliente é obrigatório.'),
  clientChallenge: z.string().min(1, 'O desafio do cliente é obrigatório.'),
  clientAudience: z.string().min(1, 'O público-alvo é obrigatório.'),
  packages: z.array(z.string()).optional().describe('Uma lista dos nomes dos pacotes de serviços selecionados.'),
});
export type GenerateProposalV2Input = z.infer<typeof GenerateProposalV2InputSchema>;

// Internal schema used by sub-flows, with packages processed into a string
export const GenerateProposalSubFlowInputSchema = GenerateProposalV2InputSchema.extend({
    packagesString: z.string(),
});

// Output schema for the partnership description flow
export const GeneratePartnershipOutputSchema = z.object({
  partnershipDescription: z.string().describe('O texto gerado para a seção "Sobre a Parceria".'),
});
export type GeneratePartnershipOutput = z.infer<typeof GeneratePartnershipOutputSchema>;

// Output schema for the objectives flow
export const GenerateObjectivesOutputSchema = z.object({
  objectiveItems: z.array(z.string()).describe('Uma lista de objetivos da parceria.'),
});
export type GenerateObjectivesOutput = z.infer<typeof GenerateObjectivesOutputSchema>;

// Output schema for the differentials flow
export const GenerateDifferentialsOutputSchema = z.object({
  differentialItems: z.array(z.string()).describe('Uma lista de diferenciais.'),
});
export type GenerateDifferentialsOutput = z.infer<typeof GenerateDifferentialsOutputSchema>;

// Output schema for the ideal plan flow
export const GenerateIdealPlanOutputSchema = z.object({
  idealPlanItems: z.array(z.string()).describe('Uma lista de argumentos para "Por que este plano é ideal?".'),
});
export type GenerateIdealPlanOutput = z.infer<typeof GenerateIdealPlanOutputSchema>;


// Final combined output schema for the main orchestrator flow
export const GenerateProposalV2OutputSchema = z.object({
  partnershipDescription: z.string(),
  objectiveItems: z.array(z.string()),
  differentialItems: z.array(z.string()),
  idealPlanItems: z.array(z.string()),
});
export type GenerateProposalV2Output = z.infer<typeof GenerateProposalV2OutputSchema>;

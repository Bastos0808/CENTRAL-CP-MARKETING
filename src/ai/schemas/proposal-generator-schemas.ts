
/**
 * @fileoverview Schemas and types for the proposal generator flow.
 */
import { z } from 'zod';

const serviceItemSchema = z.object({ value: z.string() });

// Define the input schema for the flow
export const GenerateProposalInputSchema = z.object({
  clientName: z.string().describe('O nome do cliente para quem a proposta se destina.'),
  packages: z.array(z.string()).describe('Uma lista das chaves dos pacotes de serviços selecionados. Ex: ["social_media_prata", "trafego_pago_bronze"]').optional(),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

// Define the output schema for the flow
export const GenerateProposalOutputSchema = z.object({
  partnershipDescriptionOptions: z.array(z.string()).describe('Uma lista de 3 opções para a descrição da parceria.'),
  objectiveItemsOptions: z.array(serviceItemSchema).describe('Uma lista de 3 opções para os objetivos da parceria.'),
  differentialItemsOptions: z.array(serviceItemSchema).describe('Uma lista de 3 opções para os diferenciais.'),
  idealPlanItemsOptions: z.array(serviceItemSchema).describe('Uma lista de 3 opções para os benefícios do plano ideal.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

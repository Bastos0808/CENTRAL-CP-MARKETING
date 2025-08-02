
/**
 * @fileoverview Schemas and types for the proposal generator flow.
 */
import { z } from 'zod';

const serviceItemSchema = z.object({ value: z.string().min(1, "O item não pode ser vazio.") });

// Define the input schema for the flow
export const GenerateProposalInputSchema = z.object({
  clientName: z.string().describe('O nome do cliente para quem a proposta se destina.'),
  packages: z.array(z.string()).describe('Uma lista dos nomes dos pacotes de serviços selecionados. Ex: ["Plano de Marketing - Essencial", "Podcast - Bronze"]').optional(),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

// Define the output schema for the flow
export const GenerateProposalOutputSchema = z.object({
  partnershipDescription: z.string().describe('O texto gerado para a seção "Sobre a Parceria".'),
  objectiveItems: z.array(serviceItemSchema).describe('Uma lista de objetivos da parceria.'),
  differentialItems: z.array(serviceItemSchema).describe('Uma lista de diferenciais.'),
  idealPlanItems: z.array(serviceItemSchema).describe('Uma lista de argumentos para "Por que este plano é ideal?".'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

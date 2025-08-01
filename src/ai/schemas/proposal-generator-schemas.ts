
/**
 * @fileoverview Schemas and types for the proposal generator flow.
 */
import { z } from 'zod';

const serviceItemSchema = z.object({ value: z.string() });

// Define the input schema for the flow
export const GenerateProposalInputSchema = z.object({
  clientName: z.string().describe('O nome do cliente para quem a proposta se destina.'),
  clientBrief: z.string().describe('Um breve resumo sobre o cliente e seus desafios ou objetivos.'),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

// Define the output schema for the flow
export const GenerateProposalOutputSchema = z.object({
  partnershipDescription: z.string().describe('Um parágrafo descrevendo o objetivo e o escopo da parceria.'),
  objectiveItems: z.array(serviceItemSchema).describe('Uma lista de 3 a 4 objetivos chave para a parceria.'),
  differentialItems: z.array(serviceItemSchema).describe('Uma lista de 4 diferenciais ou ações estratégicas a serem implementadas.'),
  idealPlanItems: z.array(serviceItemSchema).describe('Uma lista de 5 benefícios ou resultados que o cliente terá com o plano ideal.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

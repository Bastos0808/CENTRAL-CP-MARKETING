
/**
 * @fileoverview Schemas and types for the proposal generator flow.
 */
import { z } from 'zod';

const packageSchema = z.object({
  name: z.string().describe("Nome do pacote. Ex: Plano de Marketing - Essencial"),
  description: z.string().describe("Descrição detalhada do que o pacote inclui.")
});

// Define the input schema for the flow
export const GenerateProposalInputSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  clientObjective: z.string().min(1, 'O objetivo do cliente é obrigatório.'),
  clientChallenge: z.string().min(1, 'O desafio do cliente é obrigatório.'),
  clientAudience: z.string().min(1, 'O público-alvo é obrigatório.'),
  packages: z.array(packageSchema).optional().describe('Uma lista dos pacotes de serviços selecionados com nome e descrição.'),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

// Define the output schema for the flow
export const GenerateProposalOutputSchema = z.object({
  partnershipDescription: z.string().describe('O texto gerado para a seção "Sobre a Parceria".'),
  objectiveItems: z.array(z.string()).describe('Uma lista de objetivos da parceria.'),
  differentialItems: z.array(z.string()).describe('Uma lista de diferenciais.'),
  idealPlanItems: z.array(z.string()).describe('Uma lista de argumentos para "Por que este plano é ideal?".'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

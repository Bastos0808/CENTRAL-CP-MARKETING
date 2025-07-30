
/**
 * @fileoverview Schemas and types for the SDR onboarding message generator flow.
 */
import { z } from 'zod';

// Define the input schema for the flow
export const SdrMessageInputSchema = z.object({
  companyName: z.string().describe('O nome da empresa do prospect.'),
  companySector: z.string().describe('O setor de atuação da empresa do prospect.'),
  observedProblem: z.string().describe('Uma breve descrição do problema ou oportunidade identificada na pesquisa sobre o prospect.'),
});
export type SdrMessageInput = z.infer<typeof SdrMessageInputSchema>;

// Define the output schema for the flow
export const SdrMessageOutputSchema = z.object({
  message: z.string().describe(
    'A mensagem de prospecção personalizada gerada pela IA.'
  ),
});
export type SdrMessageOutput = z.infer<typeof SdrMessageOutputSchema>;

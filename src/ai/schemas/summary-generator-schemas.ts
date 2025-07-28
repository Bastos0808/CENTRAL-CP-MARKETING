/**
 * @fileoverview Schemas and types for the summary generator flow.
 */
import { z } from 'zod';

// Define the input schema for the flow
export const GenerateSummaryInputSchema = z.object({
  clientData: z
    .string()
    .describe(
      'Todos os dados do cliente, incluindo briefing, relatórios, etc., em formato JSON.'
    ),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

// Define the output schema for the flow
export const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe(
    'O resumo estratégico conciso gerado pela IA em formato Markdown.'
  ),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

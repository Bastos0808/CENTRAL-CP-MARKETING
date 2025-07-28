/**
 * @fileoverview Schemas and types for the summary generator flow.
 */
import { z } from 'zod';

const briefingSchema = z.object({
  negociosPosicionamento: z.object({
    descricao: z.string().optional(),
    diferencial: z.string().optional(),
    maiorDesafio: z.string().optional(),
  }).optional(),
  publicoPersona: z.object({
    publicoAlvo: z.string().optional(),
    persona: z.string().optional(),
    dores: z.string().optional(),
  }).optional(),
  metasObjetivos: z.object({
    objetivoPrincipal: z.string().optional(),
  }).optional(),
}).describe('O conteúdo do briefing do cliente.');

const reportSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    analysis: z.string(),
}).describe('Um relatório de desempenho passado.');

const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  briefing: briefingSchema.optional(),
  reports: z.array(reportSchema).optional(),
}).describe('Os dados completos do cliente');


// Define the input schema for the flow
export const GenerateSummaryInputSchema = z.object({
  client: clientSchema,
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

// Define the output schema for the flow
export const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe(
    'O resumo estratégico conciso gerado pela IA em formato Markdown.'
  ),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

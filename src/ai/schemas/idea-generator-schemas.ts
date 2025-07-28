/**
 * @fileoverview Schemas and types for the idea generator flow.
 */
import { z } from 'zod';

const briefingSchema = z.object({
  negociosPosicionamento: z.object({
    descricao: z.string().optional(),
    diferencial: z.string().optional(),
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


// Define the schema for a single idea
export const IdeaSchema = z.object({
  title: z.string().describe('O título do post.'),
  description: z.string().describe('Uma breve descrição do conteúdo do post.'),
});

// Define the input schema for the flow
export const IdeaGeneratorInputSchema = z.object({
  briefing: briefingSchema.optional(),
  reports: z.array(reportSchema).optional().describe('O histórico de relatórios de desempenho do cliente.'),
  postType: z.enum(['arte', 'reels', 'carrossel']).describe('O tipo de post a ser criado.'),
});
export type IdeaGeneratorInput = z.infer<typeof IdeaGeneratorInputSchema>;

// Define the output schema for the flow
export const IdeaGeneratorOutputSchema = z.object({
  idea: IdeaSchema.describe(
    'Uma ideia de post gerada pela IA, contendo título e descrição.'
  ),
});
export type IdeaGeneratorOutput = z.infer<typeof IdeaGeneratorOutputSchema>;

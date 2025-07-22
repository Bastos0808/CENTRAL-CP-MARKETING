/**
 * @fileoverview Schemas and types for the idea generator flow.
 */
import { z } from 'zod';

// Define the schema for a single idea
export const IdeaSchema = z.object({
  title: z.string().describe('O título do post.'),
  description: z.string().describe('Uma breve descrição do conteúdo do post.'),
});

// Define the input schema for the flow
export const IdeaGeneratorInputSchema = z.object({
  clientBriefing: z
    .string()
    .describe(
      'O conteúdo completo do briefing do cliente em formato JSON.'
    ),
});
export type IdeaGeneratorInput = z.infer<typeof IdeaGeneratorInputSchema>;

// Define the output schema for the flow
export const IdeaGeneratorOutputSchema = z.object({
  idea: IdeaSchema.describe(
    'Uma ideia de post gerada pela IA, contendo título e descrição.'
  ),
});
export type IdeaGeneratorOutput = z.infer<typeof IdeaGeneratorOutputSchema>;

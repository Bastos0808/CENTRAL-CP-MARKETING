
/**
 * @fileoverview Schemas for the structured Channel Strategy Analyzer flow.
 */
import { z } from 'zod';

export const ChannelStrategyInputSchema = z.object({
  channelUrl: z.string().url().describe('The URL of the channel to be analyzed (e.g., Instagram, Website, LinkedIn).'),
  channelType: z.enum(['instagram', 'website', 'linkedin']).describe('The type of the channel being analyzed.'),
});
export type ChannelStrategyInput = z.infer<typeof ChannelStrategyInputSchema>;

export const ChannelStrategyAnalysisSchema = z.object({
  strengths: z.string().describe('A detailed analysis of the channel\'s strengths.'),
  weaknesses: z.string().describe('A detailed analysis of the channel\'s weaknesses and opportunities.'),
  hook: z.string().describe('A suggested prospecting hook based on the analysis.'),
});

export const ChannelStrategyOutputSchema = z.object({
  analysis: ChannelStrategyAnalysisSchema.describe('The structured analysis containing answers to the framework questions.'),
});
export type ChannelStrategyOutput = z.infer<typeof ChannelStrategyOutputSchema>;

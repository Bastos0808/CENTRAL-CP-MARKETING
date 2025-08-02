
/**
 * @fileoverview Schemas for the Channel Analyzer flow.
 */
import { z } from 'zod';

export const ChannelAnalysisInputSchema = z.object({
  channelUrl: z.string().url().describe('The URL of the channel to be analyzed (e.g., Instagram, Website).'),
});
export type ChannelAnalysisInput = z.infer<typeof ChannelAnalysisInputSchema>;

export const ChannelAnalysisOutputSchema = z.object({
  strengths: z.array(z.string()).describe('A list of identified strengths of the channel.'),
  weaknesses: z.array(z.string()).describe('A list of identified weaknesses or areas for improvement.'),
  hook: z.string().describe('A suggested prospecting hook based on the analysis.'),
});
export type ChannelAnalysisOutput = z.infer<typeof ChannelAnalysisOutputSchema>;

/**
 * @fileoverview Schemas and types for the report generator flow.
 */
import { z } from 'zod';

// Define o schema de entrada para o fluxo
export const GenerateReportInputSchema = z.object({
  clientBriefing: z.string().describe('O conteúdo completo do briefing do cliente em formato JSON.'),
  reportPeriod: z.string().describe('O período ao qual o relatório se refere (ex: "01/07/2024 - 31/07/2024").'),
  reportGoals: z.string().describe('Os principais objetivos de marketing para este período.'),
  performanceData: z.string().describe('Os dados brutos de desempenho, copiados de um relatório (ex: de um PDF). Contém métricas como seguidores, curtidas, comentários, etc.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

// Define o schema de saída para o fluxo
export const GenerateReportOutputSchema = z.object({
  analysis: z.string().describe('A análise detalhada e o texto do relatório gerado pela IA em formato Markdown.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

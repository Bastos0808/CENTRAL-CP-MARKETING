/**
 * @fileoverview Schemas and types for the report generator flow.
 */
import { z } from 'zod';

const PerformanceDataSchema = z.object({
  seguidores: z.string().optional().describe('Número total de seguidores.'),
  visualizacoesPerfil: z.string().optional().describe('Número de visualizações no perfil.'),
  alcance: z.string().optional().describe('Número de contas únicas alcançadas.'),
  impressoes: z.string().optional().describe('Número total de vezes que o conteúdo foi exibido.'),
  cliquesSite: z.string().optional().describe('Número de cliques no link do site na bio ou em posts.'),
  publicacoes: z.string().optional().describe('Número de publicações no feed.'),
  stories: z.string().optional().describe('Número de stories publicados.'),
  reels: z.string().optional().describe('Número de reels publicados.'),
  curtidas: z.string().optional().describe('Número total de curtidas.'),
  comentarios: z.string().optional().describe('Número total de comentários.'),
  compartilhamentos: z.string().optional().describe('Número total de compartilhamentos.'),
  salvos: z.string().optional().describe('Número total de posts salvos.'),
}).describe('Os dados de desempenho do período.');


// Define o schema de entrada para o fluxo
export const GenerateReportInputSchema = z.object({
  clientBriefing: z.string().describe('O conteúdo completo do briefing do cliente em formato JSON.'),
  performanceData: PerformanceDataSchema,
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

// Define o schema de saída para o fluxo
export const GenerateReportOutputSchema = z.object({
  analysis: z.string().describe('A análise detalhada e o texto do relatório gerado pela IA em formato Markdown.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;
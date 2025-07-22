/**
 * @fileoverview Schemas and types for the report generator flow.
 */
import { z } from 'zod';

export const performanceSchema = z.object({
  seguidores: z.string().optional().describe('Número total de seguidores.'),
  seguidoresVariacao: z.string().optional().describe('Variação percentual de seguidores.'),

  comecaramSeguir: z.string().optional().describe('Número de novas pessoas que começaram a seguir.'),
  comecaramSeguirVariacao: z.string().optional().describe('Variação percentual de novas pessoas que começaram a seguir.'),

  visualizacoes: z.string().optional().describe('Número de visualizações no perfil.'),
  visualizacoesVariacao: z.string().optional().describe('Variação percentual de visualizações no perfil.'),
  
  curtidas: z.string().optional().describe('Número total de curtidas.'),
  curtidasVariacao: z.string().optional().describe('Variação percentual de curtidas.'),

  comentarios: z.string().optional().describe('Número total de comentários.'),
  comentariosVariacao: z.string().optional().describe('Variação percentual de comentários.'),

  taxaEngajamento: z.string().optional().describe('Taxa de engajamento.'),
  taxaEngajamentoVariacao: z.string().optional().describe('Variação percentual da taxa de engajamento.'),

  // Mantendo campos antigos para não quebrar outras partes, mas podem ser removidos se não forem mais usados
  visualizacoesPerfil: z.string().optional(),
  alcance: z.string().optional(),
  impressoes: z.string().optional(),
  cliquesSite: z.string().optional(),
  publicacoes: z.string().optional(),
  stories: z.string().optional(),
  reels: z.string().optional(),
  compartilhamentos: z.string().optional(),
  salvos: z.string().optional(),
}).describe('Os dados de desempenho do período.');


// Define o schema de entrada para o fluxo
export const GenerateReportInputSchema = z.object({
  clientBriefing: z.string().describe('O conteúdo completo do briefing do cliente em formato JSON.'),
  performanceData: performanceSchema,
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

// Define o schema de saída para o fluxo
export const GenerateReportOutputSchema = z.object({
  analysis: z.string().describe('A análise detalhada e o texto do relatório gerado pela IA em formato Markdown.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

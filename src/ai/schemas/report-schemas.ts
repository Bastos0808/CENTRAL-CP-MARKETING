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

  // Demographics
  generoFeminino: z.string().optional().describe('Porcentagem do gênero feminino.'),
  generoMasculino: z.string().optional().describe('Porcentagem do gênero masculino.'),
  generoNaoEspecificado: z.string().optional().describe('Porcentagem do gênero não especificado.'),
  
  faixaEtaria13a17: z.string().optional().describe('Número de seguidores na faixa etária de 13 a 17 anos.'),
  faixaEtaria18a24: z.string().optional().describe('Número de seguidores na faixa etária de 18 a 24 anos.'),
  faixaEtaria25a34: z.string().optional().describe('Número de seguidores na faixa etária de 25 a 34 anos.'),
  faixaEtaria35a44: z.string().optional().describe('Número de seguidores na faixa etária de 35 a 44 anos.'),
  faixaEtaria45a54: z.string().optional().describe('Número de seguidores na faixa etária de 45 a 54 anos.'),
  faixaEtaria55a64: z.string().optional().describe('Número de seguidores na faixa etária de 55 a 64 anos.'),
  faixaEtaria65mais: z.string().optional().describe('Número de seguidores na faixa etária de 65+ anos.'),

  // Location and Hashtags
  cidadesSeguidores: z.string().optional().describe('Dados de seguidores por cidade, em formato de texto.'),
  melhoresHashtags: z.string().optional().describe('Dados de melhores hashtags por interações, em formato de texto.'),

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

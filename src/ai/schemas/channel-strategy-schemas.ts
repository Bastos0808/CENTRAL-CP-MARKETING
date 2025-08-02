
/**
 * @fileoverview Schemas for the structured Channel Strategy Analyzer flow.
 */
import { z } from 'zod';

export const ChannelStrategyInputSchema = z.object({
  channelUrl: z.string().url().describe('The URL of the channel to be analyzed (e.g., Instagram, Website, LinkedIn).'),
  channelType: z.enum(['instagram', 'website', 'linkedin']).describe('The type of the channel being analyzed.'),
});
export type ChannelStrategyInput = z.infer<typeof ChannelStrategyInputSchema>;

export const InstagramAnalysisSchema = z.object({
  analiseBio: z.string().optional().describe("Análise da bio (proposta de valor, CTA, link)."),
  analiseDestaques: z.string().optional().describe("Análise do uso estratégico dos destaques."),
  qualidadeFeed: z.string().optional().describe("Análise da coesão e qualidade visual do feed."),
  estrategiaConteudo: z.string().optional().describe("Análise dos formatos de conteúdo e consistência."),
  usoDeReels: z.string().optional().describe("Análise da qualidade e frequência do uso de Reels."),
  copywritingLegendas: z.string().optional().describe("Análise da qualidade dos textos e CTAs nas legendas."),
  engajamentoComunidade: z.string().optional().describe("Análise da interação da marca com a comunidade."),
  pontosFortes: z.string().optional().describe("Resumo dos principais pontos fortes."),
  pontosFracos: z.string().optional().describe("Resumo das principais fraquezas e oportunidades."),
  ganchoDeAbordagem: z.string().optional().describe("Sugestão de gancho de prospecção baseado na análise."),
});

export const WebsiteAnalysisSchema = z.object({
  primeiraDobra: z.string().optional().describe("Análise da primeira impressão, proposta de valor e CTA principal."),
  propostaDeValor: z.string().optional().describe("Análise da clareza da proposta de valor."),
  chamadasParaAcao: z.string().optional().describe("Análise da qualidade e visibilidade dos CTAs."),
  clarezaNavegacao: z.string().optional().describe("Análise da intuição e simplicidade do menu de navegação."),
  otimizacaoSEO: z.string().optional().describe("Análise básica de SEO (títulos, blog, etc.)."),
  designResponsividade: z.string().optional().describe("Análise do design (moderno vs. datado) e da responsividade mobile."),
  provaSocial: z.string().optional().describe("Análise do uso de depoimentos, cases, etc."),
  pontosFortes: z.string().optional().describe("Resumo dos principais pontos fortes."),
  pontosFracos: z.string().optional().describe("Resumo das principais fraquezas."),
  ganchoDeAbordagem: z.string().optional().describe("Sugestão de gancho de prospecção."),
});

export const LinkedInAnalysisSchema = z.object({
    perfilDoDecisor: z.string().optional().describe("Análise do perfil do tomador de decisão (headline, sobre, etc)."),
    companyPage: z.string().optional().describe("Análise da Company Page da empresa."),
    estrategiaConteudo: z.string().optional().describe("Análise do tipo e frequência do conteúdo postado."),
    engajamentoRede: z.string().optional().describe("Análise da interação com a rede."),
    networking: z.string().optional().describe("Análise da estratégia de conexões."),
    pontosFortes: z.string().optional().describe("Resumo dos principais acertos na estratégia."),
    pontosFracos: z.string().optional().describe("Resumo das principais oportunidades perdidas."),
    ganchoDeAbordagem: z.string().optional().describe("Sugestão de gancho de prospecção B2B."),
});

export const ChannelStrategyAnalysisSchema = z.union([
    InstagramAnalysisSchema,
    WebsiteAnalysisSchema,
    LinkedInAnalysisSchema,
]);

export const ChannelStrategyOutputSchema = z.object({
  analysis: ChannelStrategyAnalysisSchema.describe('The structured analysis containing answers to the framework questions.'),
});
export type ChannelStrategyOutput = z.infer<typeof ChannelStrategyOutputSchema>;


/**
 * @fileoverview Schemas for the structured Channel Strategy Analyzer flow.
 */
import { z } from 'zod';

export const ChannelStrategyInputSchema = z.object({
  channelUrl: z.string().url().describe('The URL of the channel to be analyzed (e.g., Instagram, Website, YouTube).'),
  channelType: z.enum(['instagram', 'website', 'youtube']).describe('The type of the channel being analyzed.'),
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

export const YouTubeAnalysisSchema = z.object({
    identidadeVisualCanal: z.string().optional().describe("Análise do banner e ícone do canal."),
    qualidadeThumbnails: z.string().optional().describe("Análise da atratividade e padrão visual das thumbnails."),
    titulosVideos: z.string().optional().describe("Análise da otimização de SEO e curiosidade dos títulos."),
    qualidadeEdicao: z.string().optional().describe("Análise da edição, áudio e ritmo dos vídeos."),
    usoDeShorts: z.string().optional().describe("Análise do uso estratégico de Shorts para atração."),
    seoVideo: z.string().optional().describe("Análise de descrições, palavras-chave e tags dos vídeos."),
    engajamentoComentarios: z.string().optional().describe("Análise da interação com a comunidade nos comentários."),
    pontosFortes: z.string().optional().describe("Resumo dos principais pontos fortes do canal."),
    pontosFracos: z.string().optional().describe("Resumo das principais oportunidades de melhoria."),
    ganchoDeAbordagem: z.string().optional().describe("Sugestão de gancho de prospecção focada em vídeo."),
});

export const ChannelStrategyAnalysisSchema = z.union([
    InstagramAnalysisSchema,
    WebsiteAnalysisSchema,
    YouTubeAnalysisSchema,
]);

export const ChannelStrategyOutputSchema = z.object({
  analysis: ChannelStrategyAnalysisSchema.describe('The structured analysis containing answers to the framework questions.'),
});
export type ChannelStrategyOutput = z.infer<typeof ChannelStrategyOutputSchema>;

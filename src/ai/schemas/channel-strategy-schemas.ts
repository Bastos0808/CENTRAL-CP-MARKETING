
/**
 * @fileoverview Schemas for the structured Channel Strategy Analyzer flow.
 */
import { z } from 'zod';

const dataUriSchema = z.string().describe(
    "Uma imagem como data URI. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
);

export const InstagramStrategyInputSchema = z.object({
  channelType: z.literal('instagram'),
  htmlContent: z.string().optional(),
  bioScreenshot: dataUriSchema.optional().describe('Print da tela mostrando a bio, a foto de perfil e o link.'),
  highlightsScreenshot: dataUriSchema.optional().describe('Print da tela mostrando os destaques do perfil.'),
  feedScreenshot: dataUriSchema.optional().describe('Print da tela mostrando a visão geral do feed.'),
  reelsScreenshot: dataUriSchema.optional().describe('Print da tela mostrando a aba de Reels.'),
});

export const WebsiteStrategyInputSchema = z.object({
  channelType: z.literal('website'),
  htmlContent: z.string().optional().describe('O conteúdo HTML do código-fonte de um site, para uma análise mais profunda de SEO e estrutura.'),
});

export const YouTubeStrategyInputSchema = z.object({
  channelType: z.literal('youtube'),
  htmlContent: z.string().optional(),
  bannerScreenshot: dataUriSchema.optional().describe('Print da tela mostrando o banner do canal e a foto de perfil.'),
  videosScreenshot: dataUriSchema.optional().describe('Print da tela mostrando a aba de vídeos com as thumbnails.'),
  shortsScreenshot: dataUriSchema.optional().describe('Print da tela mostrando a aba de Shorts.'),
  descriptionScreenshot: dataUriSchema.optional().describe('Print da tela de um vídeo aberto, mostrando sua descrição.'),
});


export const ChannelStrategyInputSchema = z.discriminatedUnion("channelType", [
  InstagramStrategyInputSchema,
  WebsiteStrategyInputSchema,
  YouTubeStrategyInputSchema
]);

export type ChannelStrategyInput = z.infer<typeof ChannelStrategyInputSchema>;

export const InstagramAnalysisSchema = z.object({
  analiseBio: z.string().optional().describe("Análise da bio (proposta de valor, CTA, link)."),
  analiseDestaques: z.string().optional().describe("Análise do uso estratégico dos destaques."),
  qualidadeFeed: z.string().optional().describe("Análise da coesão e qualidade visual do feed."),
  estrategiaConteudo: z.string().optional().describe("Análise dos formatos de conteúdo e consistência."),
  usoDeReels: z.string().optional().describe("Análise da qualidade e frequência do uso de Reels."),
  copywritingLegendas: z.string().optional().describe("Análise da qualidade dos textos e CTAs nas legendas."),
  engajamentoComunidade: z.string().optional().describe("Análise da interação da marca com a comunidade."),
  oportunidades: z.array(z.string()).describe("Lista de oportunidades de melhoria identificadas."),
  gancho: z.string().describe("Gancho de prospecção curto e direto baseado nas oportunidades."),
});

export const WebsiteAnalysisSchema = z.object({
  primeiraDobra: z.string().optional().describe("Análise da primeira impressão, proposta de valor e CTA principal."),
  propostaDeValor: z.string().optional().describe("Análise da clareza da proposta de valor."),
  chamadasParaAcao: z.string().optional().describe("Análise da qualidade e visibilidade dos CTAs."),
  clarezaNavegacao: z.string().optional().describe("Análise da intuição e simplicidade do menu de navegação."),
  otimizacaoSEO: z.string().optional().describe("Análise básica de SEO (títulos, blog, etc.)."),
  designResponsividade: z.string().optional().describe("Análise do design (moderno vs. datado) e da responsividade mobile."),
  provaSocial: z.string().optional().describe("Análise do uso de depoimentos, cases, etc."),
  oportunidades: z.array(z.string()).describe("Lista de oportunidades de melhoria identificadas."),
  gancho: z.string().describe("Gancho de prospecção curto e direto baseado nas oportunidades."),
});

export const YouTubeAnalysisSchema = z.object({
    identidadeVisualCanal: z.string().optional().describe("Análise do banner e ícone do canal."),
    qualidadeThumbnails: z.string().optional().describe("Análise da atratividade e padrão visual das thumbnails."),
    titulosVideos: z.string().optional().describe("Análise da otimização de SEO e curiosidade dos títulos."),
    qualidadeEdicao: z.string().optional().describe("Análise da edição, áudio e ritmo dos vídeos."),
    usoDeShorts: z.string().optional().describe("Análise do uso estratégico de Shorts para atração."),
    seoVideo: z.string().optional().describe("Análise de descrições, palavras-chave e tags dos vídeos."),
    engajamentoComentarios: z.string().optional().describe("Análise da interação com a comunidade nos comentários."),
    oportunidades: z.array(z.string()).describe("Lista de oportunidades de melhoria identificadas."),
    gancho: z.string().describe("Gancho de prospecção curto e direto baseado nas oportunidades."),
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

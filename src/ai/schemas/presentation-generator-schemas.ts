
/**
 * @fileoverview Schemas for the Presentation Generator flow.
 */
import { z } from 'zod';

export const packageOptions = {
    "marketing_vendas": { name: "Plano de Marketing - Vendas", price: 1799, contract: "6 meses" },
    "marketing_essencial": { name: "Plano de Marketing - Essencial", price: 2999, contract: "6 meses" },
    "marketing_premium": { name: "Plano de Marketing - Premium", price: 3999, contract: "6 meses" },
    "marketing_master": { name: "Plano de Marketing - Master", price: 4999, contract: "6 meses" },
    "trafego_pago": { name: "Tráfego Pago - Avulso", price: 1999, contract: "6 meses" },
    "captacao_estudio_contrato": { name: "Captação em Estúdio (Contrato 6 meses)", price: 799 },
    "captacao_estudio_avulso": { name: "Captação em Estúdio (Avulso)", price: 1100 },
    "captacao_externa": { name: "Captação Externa (Goiânia)", price: 999 },
    "gestao_youtube_podcast": { name: "Gestão de YouTube para Podcast", price: 999, contract: "6 meses" },
    "identidade_visual": { name: "Identidade Visual", price: 999 },
    "website": { name: "Website Institucional", price: 1999 },
    "landing_page": { name: "Landing Page de Alta Conversão", price: 999 },
    "rd_station": { name: "Implementação RD Station (Marketing & CRM)", price: 999 },
    "podcast_bronze_3m": { name: "Podcast Bronze (Contrato 3 meses)", price: 899 },
    "podcast_bronze_6m": { name: "Podcast Bronze (Contrato 6 meses)", price: 699 },
    "podcast_prata_3m": { name: "Podcast Prata (Contrato 3 meses)", price: 1399 },
    "podcast_prata_6m": { name: "Podcast Prata (Contrato 6 meses)", price: 1199 },
    "podcast_safira_3m": { name: "Podcast Safira (Contrato 3 meses)", price: 1099 },
    "podcast_safira_6m": { name: "Podcast Safira (Contrato 6 meses)", price: 899 },
    "podcast_diamante_3m": { name: "Podcast Diamante (Contrato 3 meses)", price: 2199 },
    "podcast_diamante_6m": { name: "Podcast Diamante (Contrato 6 meses)", price: 1999 },
    "edicao_episodio": { name: "Edição de Episódio (Avulso)", price: 299 },
    "podcast_avulso_seg_sex_8_17": { name: "Podcast Avulso (Seg-Sex, 8h-17h)", price: 249 },
    "podcast_avulso_seg_sex_17_22": { name: "Podcast Avulso (Seg-Sex, 17h-22h)", price: 399 },
    "podcast_avulso_sab_8_12": { name: "Podcast Avulso (Sáb, 8h-12h)", price: 349 },
    "podcast_avulso_sab_12_22": { name: "Podcast Avulso (Sáb, 12h-22h)", price: 449 },
    "podcast_avulso_dom_feriado": { name: "Podcast Avulso (Dom/Feriado)", price: 599 },
    "corte_1": { name: "1 Corte de Podcast", price: 50 },
    "corte_5": { name: "5 Cortes de Podcast", price: 200 },
    "corte_10": { name: "10 Cortes de Podcast", price: 350 },
    "podcast_entrevista": { name: "Podcast Entrevista (Avulso)", price: 599 },
};
const packageKeys = Object.keys(packageOptions) as [keyof typeof packageOptions, ...(keyof typeof packageOptions)[]];

export const DiagnosticFormSchema = z.object({
  clientName: z.string().describe("Nome do cliente."),
  faturamentoMedio: z.string().describe("Faturamento médio atual do cliente."),
  metaFaturamento: z.string().describe("Meta de faturamento desejada."),
  ticketMedio: z.string().optional().describe("Ticket médio do principal produto/serviço."),
  origemClientes: z.string().optional().describe("De onde vêm os clientes atualmente."),
  tempoEmpresa: z.string().optional().describe("Há quanto tempo a empresa existe."),
  motivacaoMarketing: z.string().describe("Principal motivação para investir em marketing agora."),
  investimentoAnterior: z.string().optional().describe("Experiências passadas com investimento em marketing."),
  tentativasAnteriores: z.string().optional().describe("O que já foi tentado para resolver o problema."),
  principalGargalo: z.string().describe("O maior gargalo de crescimento identificado."),
  custoProblema: z.string().optional().describe("Custo estimado do problema (impacto financeiro)."),
  envolvidosDecisao: z.string().optional().describe("Quem mais participa da decisão de compra."),
  orcamentoPrevisto: z.string().optional().describe("Faixa de investimento disponível ou prevista."),
  prazoDecisao: z.string().optional().describe("Prazo para tomar a decisão de contratar."),
  packages: z.array(z.enum(packageKeys)).optional().describe("Lista de pacotes de serviços selecionados."),
  discount: z.number().optional().describe("Valor do desconto a ser aplicado sobre o total."),
});

const SlideSchema = z.object({
  title: z.string().describe("O título do slide."),
  content: z.array(z.string()).describe("O conteúdo do slide, em formato de bullet points ou parágrafos curtos."),
});

const InvestmentPlanSchema = z.object({
  planTitle: z.string().describe("O nome do plano de investimento (ex: Plano Essencial)."),
  description: z.string().describe("A descrição do que está incluído no plano."),
  price: z.string().describe("O valor do investimento para este plano."),
});

export const GeneratePresentationInputSchema = DiagnosticFormSchema;
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

export const GeneratePresentationOutputSchema = z.object({
  presentationTitle: z.string().describe("O título geral da apresentação (Ex: Plano de Crescimento para [Nome do Cliente])."),
  diagnosticSlide: SlideSchema.describe("Conteúdo para o slide de Diagnóstico."),
  actionPlanSlide: SlideSchema.describe("Conteúdo para o slide do Plano de Ação."),
  timelineSlide: SlideSchema.describe("Conteúdo para o slide de Cronograma."),
  kpiSlide: SlideSchema.describe("Conteúdo para o slide de KPIs."),
  whyCpSlide: SlideSchema.describe("Conteúdo para o slide 'Por que a CP Marketing?'."),
  investmentSlide: z.object({
    title: z.string().describe("Título do slide de investimento."),
    items: z.array(z.object({ name: z.string(), price: z.string() })).describe("Itens do plano com nome e preço."),
    total: z.string().describe("Valor total."),
    discount: z.string().optional().describe("Valor do desconto."),
    finalTotal: z.string().describe("Valor final após o desconto."),
  }).describe("Conteúdo detalhado para o slide de investimento."),
  nextStepsSlide: SlideSchema.describe("Conteúdo para o slide de Próximos Passos."),
  justificationSlide: SlideSchema.describe("Conteúdo para o slide 'Por que este plano?'. Justificativa estratégica para os serviços selecionados."),
});

export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;

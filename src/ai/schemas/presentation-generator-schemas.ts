
/**
 * @fileoverview Schemas for the Presentation Generator flow.
 */
import { z } from 'zod';

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
  essentialPlan: InvestmentPlanSchema.describe("O plano de investimento básico."),
  recommendedPlan: InvestmentPlanSchema.describe("O plano de investimento completo e recomendado."),
  nextStepsSlide: SlideSchema.describe("Conteúdo para o slide de Próximos Passos."),
});
export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;

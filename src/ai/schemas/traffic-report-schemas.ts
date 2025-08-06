
/**
 * @fileoverview Schemas and types for the traffic report generator flow.
 */
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().describe('O nome da campanha ou anúncio.'),
  metric: z.string().describe('A principal métrica de sucesso (Ex: CPL, Cliques, ROAS).'),
  value: z.string().describe('O valor da métrica principal.'),
});

export const trafficPerformanceSchema = z.object({
  investment: z.string().optional().describe('Valor total gasto nas campanhas.'),
  impressions: z.string().optional().describe('Número total de impressões.'),
  clicks: z.string().optional().describe('Número total de cliques.'),
  ctr: z.string().optional().describe('Taxa de cliques (CTR) percentual.'),
  cpc: z.string().optional().describe('Custo por clique (CPC) médio.'),
  conversions: z.string().optional().describe('Número de conversões ou leads gerados.'),
  cpl: z.string().optional().describe('Custo por Lead (CPL) médio.'),
  roas: z.string().optional().describe('Retorno sobre o Investimento em Anúncios (ROAS).'),
  bestCampaigns: z.array(campaignSchema).optional().describe('Uma lista das campanhas ou anúncios de melhor desempenho.'),
}).describe('Os dados de desempenho das campanhas de tráfego pago.');

const briefingSchema = z.object({
    negociosPosicionamento: z.object({
        descricao: z.string().optional(),
        diferencial: z.string().optional(),
    }).optional(),
    publicoPersona: z.object({
        publicoAlvo: z.string().optional(),
        persona: z.string().optional(),
    }).optional(),
    metasObjetivos: z.object({
        objetivoPrincipal: z.string().optional(),
    }).optional(),
}).describe('O conteúdo do briefing do cliente.');


// Define o schema de entrada para o fluxo
export const GenerateTrafficReportInputSchema = z.object({
  briefing: briefingSchema.optional(),
  campaignObjective: z.string().describe('O objetivo principal das campanhas analisadas.'),
  period: z.object({
    from: z.string().describe('Data de início do período de análise (YYYY-MM-DD).'),
    to: z.string().describe('Data de fim do período de análise (YYYY-MM-DD).'),
  }).describe('O período de tempo ao qual os dados se referem.'),
  performanceData: trafficPerformanceSchema,
});
export type GenerateTrafficReportInput = z.infer<typeof GenerateTrafficReportInputSchema>;

// Define o schema de saída para o fluxo
export const GenerateTrafficReportOutputSchema = z.object({
  analysis: z.string().describe('A análise detalhada e o texto do relatório de tráfego pago gerado pela IA em formato Markdown.'),
});
export type GenerateTrafficReportOutput = z.infer<typeof GenerateTrafficReportOutputSchema>;

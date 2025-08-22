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
  clientName: z.string().min(1, "O nome do cliente é obrigatório."),
  
  // Bloco 1: Cenário e Metas
  tempoEmpresa: z.string().optional(),
  faturamentoMedio: z.number({ required_error: "Campo obrigatório." }).min(1, "Campo obrigatório."),
  metaFaturamento: z.number({ required_error: "Campo obrigatório." }).min(1, "Campo obrigatório."),
  ticketMedio: z.number().optional(),
  origemClientes: z.string().optional(),

  // Bloco 2: O Desafio Atual
  motivacaoMarketing: z.string().optional(),
  experienciaMarketing: z.string().optional(),
  tentativasAnteriores: z.string().optional(),
  principalGargalo: z.string().optional(),
  impactoGargalo: z.string().optional(),
  impactoAreas: z.string().optional(),
  sentimentoPessoal: z.string().optional(),
  
  // Bloco 3: O Custo do Problema
  clientesPerdidos: z.string().optional(),
  custoProblema: z.number().optional(),
  potencialResolucao: z.string().optional(),

  // Bloco 4: A Visão de Futuro
  visaoFuturo: z.string().optional(),
  visaoFuturoPessoal: z.string().optional(),
  prioridadeResolucao: z.string().optional(),
  
  // Bloco 5: Próximos Passos
  envolvidosDecisao: z.string().optional(),
  orcamentoPrevisto: z.string().optional(), // Mantido como string para flexibilidade (Ex: "entre 3k e 5k")
  prazoDecisao: z.string().optional(),

  // Pacotes
  packages: z.array(z.enum(packageKeys)).optional().describe("Lista de pacotes de serviços selecionados."),
  discount: z.number().optional().describe("Valor do desconto a ser aplicado sobre o total."),
});


export const GeneratePresentationInputSchema = DiagnosticFormSchema;
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

export const GeneratePresentationOutputSchema = z.object({
  clientName: z.string().describe("Nome do cliente para a capa."),
  proposalDate: z.string().describe("Data de hoje, formatada."),
  proposalValidityDate: z.string().describe("Data de validade da proposta, formatada."),
  
  diagnosticSlide: z.object({
    resumoEmpatico: z.string().describe("Parágrafo que conecta meta, gargalo e sentimento."),
    analiseReflexiva: z.string().describe("Parágrafo que conecta o tempo de empresa com a urgência de agir agora."),
  }),

  painSlide: z.object({
    consequencia_1: z.string().describe("Primeira consequência do gargalo (operacional)."),
    consequencia_2: z.string().describe("Segunda consequência (frustração com tentativas passadas)."),
    consequencia_3: z.string().describe("Terceira consequência (concorrência)."),
  }),
  
  futureSlide: z.object({
    cenario_6_meses: z.string().describe("Descrição do sucesso em 6 meses."),
    cenario_1_ano: z.string().describe("Descrição da transformação em 1 ano."),
  }),

  inactionCostSlide: z.object({
    custo_6_meses: z.string().describe("Valor formatado do custo da inação em 6 meses."),
    custo_1_ano: z.string().describe("Valor formatado do custo da inação em 1 ano."),
    cenario_inercia: z.string().describe("Parágrafo sobre o que acontece se nada for feito."),
  }),
  
  strategySlide: z.object({
    pilarAquisicao: z.string().describe("Texto para o pilar de Aquisição."),
    pilarConversao: z.string().describe("Texto para o pilar de Conversão."),
    pilarAutoridade: z.string().describe("Texto para o pilar de Autoridade."),
  }),
  
  metricsSlide: z.object({
    crescimentoPercentual: z.string().describe("Porcentagem de crescimento, ex: '140%'."),
    metaLeadsQualificados: z.string().describe("Meta numérica de leads qualificados por mês."),
    metaTaxaConversao: z.string().describe("Meta percentual da taxa de conversão."),
  }),
  
  investmentSlide: z.object({
    ancoragemPreco: z.string().describe("Parágrafo de ancoragem de preço (Custo da Inação vs. Investimento)."),
    ganchoDecisao: z.string().describe("Pergunta final para a tomada de decisão."),
    gatilhoEscassez: z.string().describe("Gatilho de urgência baseado em escassez de vagas."),
    gatilhoBonus: z.string().describe("Bônus por tempo limitado para fechamento rápido."),
  }),
});

export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;

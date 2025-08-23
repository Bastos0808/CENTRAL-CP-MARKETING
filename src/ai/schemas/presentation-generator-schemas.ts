
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
  clientName: z.string(),
  proposalDate: z.string(),
  proposalValidityDate: z.string(),
  presentationTitle: z.string(),
  
  diagnosticSlide: z.object({
    title: z.string(),
    question: z.string(),
    meta: z.string(),
    custo: z.string(),
    gargalo: z.string(),
    comoAlcancaremos: z.string(),
    porqueCustoExiste: z.string(),
  }),

  painSlide: z.object({
    title: z.string(),
    question: z.string(),
    content: z.array(z.string()),
  }),
  
  futureSlide: z.object({
    title: z.string(),
    question: z.string(),
    content: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })),
  }),

  inactionCostSlide: z.object({
    title: z.string(),
    custo_6_meses: z.string(),
    custo_1_ano: z.string(),
    cenario_inercia: z.string(),
  }),
  
  strategySlide: z.object({
    title: z.string(),
    content: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  }),
  
  metricsSlide: z.object({
    title: z.string(),
    subtitle: z.string(),
    metrics: z.array(z.object({
        title: z.string(),
        value: z.string(),
        description: z.string(),
    })).length(3),
    comoAlcancaremos: z.string().describe("Um parágrafo detalhado explicando como a CP Marketing alcançará as metas apresentadas."),
  }),
  
  investmentSlide: z.object({
    title: z.string(),
    ancoragemPreco: z.string(),
    ganchoDecisao: z.string(),
    gatilhoEscassez: z.string(),
    gatilhoBonus: z.string(),
  }),
  
  investmentValue: z.string(),
  packages: z.array(z.object({
      name: z.string(),
      price: z.number(),
      contract: z.string().optional()
  }))
});

export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;


'use server';
/**
 * @fileOverview Um fluxo de IA para gerar relatórios de desempenho de tráfego pago.
 * 
 * - generateTrafficReport: Gera uma análise textual baseada no briefing do cliente e nos dados de performance das campanhas.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GenerateTrafficReportInput, GenerateTrafficReportInputSchema, GenerateTrafficReportOutput, GenerateTrafficReportOutputSchema } from '@/ai/schemas/traffic-report-schemas';


// Função exportada que o front-end chamará
export async function generateTrafficReport(input: GenerateTrafficReportInput): Promise<GenerateTrafficReportOutput> {
  return trafficReportGeneratorFlow(input);
}


// Define o prompt que a IA usará
const trafficReportGeneratorPrompt = ai.definePrompt({
  name: 'trafficReportGeneratorPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateTrafficReportInputSchema },
  output: { schema: GenerateTrafficReportOutputSchema },
  prompt: `
    Você é um(a) Gestor(a) de Tráfego Sênior e Estrategista de Marketing na agência "CP Marketing Digital". Sua análise deve ser clara, focada em resultados de negócio e traduzir os números em insights acionáveis.

    Sua tarefa é criar um relatório de desempenho de tráfego pago para um cliente. Você receberá o dossiê do cliente (briefing) e os dados de performance das campanhas do período.

    **Instruções Críticas:**
    1.  **Tom de Voz:** Mantenha um tom profissional, consultivo e focado em ROI. Você é o especialista que guia o cliente através dos dados para tomar as melhores decisões.
    2.  **Conexão com o Negócio:** Não analise os dados de forma isolada. Conecte as métricas de tráfego (CPL, ROAS, Cliques) com o objetivo principal da campanha e com os objetivos de negócio do cliente, descritos no briefing. O que esses números significam para o faturamento e crescimento da empresa?
    3.  **Análise Causa e Efeito:** Vá além de descrever os números. Se o CPL (Custo por Lead) está alto, por que isso pode ter acontecido? (Ex: criativos com baixa performance, segmentação muito ampla). Se o ROAS está bom, o que funcionou bem? (Ex: público específico, oferta irresistível).
    4.  **Recomendações Estratégicas e Próximos Passos:** Na seção de conclusão, forneça uma lista (bullet points) de ações claras e objetivas. Sugira otimizações nas campanhas, testes A/B para criativos, novos públicos para explorar ou ajustes na verba. As recomendações devem ser baseadas diretamente na análise dos dados.
    
    **Estrutura do Relatório (Siga esta ordem):**
    -   **Visão Geral e Objetivo da Campanha:** Comece resumindo o principal objetivo das campanhas no período (Ex: Geração de Leads, Vendas, etc.) e os resultados gerais mais importantes.
    -   **Análise de Métricas Principais:** Comente sobre as métricas chave (Investimento, Impressões, Cliques, CTR, CPC). O que elas nos dizem sobre a saúde e o alcance das campanhas?
    -   **Análise de Conversão e Custo:** Foque nas métricas de fundo de funil (Conversões/Leads, CPL, ROAS). Os resultados estão alinhados com as metas? O custo por resultado é sustentável para o negócio do cliente?
    -   **Análise de Destaques:** Comente sobre as campanhas ou anúncios de melhor desempenho. O que podemos aprender com eles para replicar o sucesso?
    -   **Conclusão e Próximos Passos:** Resuma os principais aprendizados e forneça uma lista de recomendações estratégicas para otimizar os resultados no próximo período.

    **Dados para Análise:**

    **1. Dossiê do Cliente (Briefing):**
    - **O que a empresa faz?** {{briefing.negociosPosicionamento.descricao}}
    - **Diferencial:** {{briefing.negociosPosicionamento.diferencial}}
    - **Público-alvo:** {{briefing.publicoPersona.publicoAlvo}}
    - **Objetivo Principal do Negócio:** {{briefing.metasObjetivos.objetivoPrincipal}}

    **2. Dados da Campanha:**
    - **Período de Análise:** De {{period.from}} a {{period.to}}
    - **Objetivo Principal da Campanha:** {{campaignObjective}}
    
    **3. Dados de Desempenho (Geral):**
    - **Valor Gasto:** {{performanceData.investment}}
    - **Impressões:** {{performanceData.impressões}}
    - **Cliques:** {{performanceData.clicks}}
    - **CTR (Taxa de Cliques):** {{performanceData.ctr}}
    - **CPC (Custo por Clique):** {{performanceData.cpc}}
    - **Conversões / Leads:** {{performanceData.conversions}}
    - **CPL (Custo por Lead):** {{performanceData.cpl}}
    - **ROAS (Retorno sobre Investimento):** {{performanceData.roas}}
    
    **4. Campanhas de Destaque:**
    {{#each performanceData.bestCampaigns}}
    - **Campanha:** "{{this.name}}" | **Métrica:** {{this.metric}} | **Valor:** {{this.value}}
    {{/each}}
    
    **Agora, gere o campo "analysis" com o texto completo do relatório em Markdown, seguindo rigorosamente as instruções e a estrutura fornecida.**
  `,
});

// Define o fluxo que orquestra a chamada para a IA
const trafficReportGeneratorFlow = ai.defineFlow(
  {
    name: 'trafficReportGeneratorFlow',
    inputSchema: GenerateTrafficReportInputSchema,
    outputSchema: GenerateTrafficReportOutputSchema,
  },
  async (input) => {
    const { output } = await trafficReportGeneratorPrompt(input);
    return output!;
  }
);

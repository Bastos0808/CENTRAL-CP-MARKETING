'use server';
/**
 * @fileOverview Um fluxo de IA para gerar relatórios de desempenho de marketing.
 * 
 * - generateReport: Gera uma análise textual baseada no briefing do cliente e nos dados de desempenho.
 */

import { ai } from '@/ai/genkit';
import { GenerateReportInput, GenerateReportInputSchema, GenerateReportOutput, GenerateReportOutputSchema } from '@/ai/schemas/report-schemas';


// Função exportada que o front-end chamará
export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return reportGeneratorFlow(input);
}


// Define o prompt que a IA usará
const reportGeneratorPrompt = ai.definePrompt({
  name: 'reportGeneratorPrompt',
  input: { schema: GenerateReportInputSchema },
  output: { schema: GenerateReportOutputSchema },
  prompt: `
    Você é um especialista em análise de marketing digital e redator de relatórios para a agência "CP Marketing Digital".

    Sua tarefa é criar um relatório de desempenho para um cliente. Você receberá o briefing do cliente, os dados de desempenho do período, o período do relatório e os objetivos definidos.

    **Instruções:**
    1.  **Analise o Briefing:** Entenda o negócio do cliente, seu público-alvo e seus objetivos gerais a partir do JSON do briefing.
    2.  **Analise os Dados de Desempenho:** Interprete as métricas fornecidas nos dados de desempenho. Calcule as variações percentuais se os dados anteriores forem fornecidos.
    3.  **Conecte com os Objetivos:** Relacione o desempenho observado com os objetivos definidos para o período. O desempenho ajudou a alcançar as metas?
    4.  **Escreva o Relatório:** Redija uma análise coesa e clara em formato Markdown. Organize o relatório em seções (ex: Visão Geral, Análise de Crescimento, Análise de Engajamento, Próximos Passos).
    5.  **Forneça Insights e Recomendações:** Não apenas liste os números. Explique o que eles significam. Destaque os pontos positivos e os pontos de melhoria. Ofereça recomendações claras e acionáveis para o próximo período.
    6.  **Mantenha o Tom de Voz:** Use um tom profissional, didático e parceiro, característico da CP Marketing Digital.

    **Dados para Análise:**

    **1. Período do Relatório:**
    {{{reportPeriod}}}

    **2. Objetivos para o Período:**
    {{{reportGoals}}}

    **3. Briefing do Cliente (em JSON):**
    \`\`\`json
    {{{clientBriefing}}}
    \`\`\`

    **4. Dados de Desempenho Brutos:**
    {{{performanceData}}}

    **Agora, gere o campo "analysis" com o texto completo do relatório em Markdown.**
  `,
});

// Define o fluxo que orquestra a chamada para a IA
const reportGeneratorFlow = ai.defineFlow(
  {
    name: 'reportGeneratorFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    const { output } = await reportGeneratorPrompt(input);
    return output!;
  }
);

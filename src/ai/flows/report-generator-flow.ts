
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

    Sua tarefa é criar um relatório de desempenho para um cliente. Você receberá o briefing do cliente e os dados de desempenho do período, incluindo dados demográficos, de localização, de hashtags e de publicações.

    **Instruções:**
    1.  **Analise o Briefing:** Entenda o negócio do cliente, seu público-alvo e seus objetivos gerais a partir do JSON do briefing.
    2.  **Analise os Dados de Desempenho:** Interprete as métricas fornecidas. Para cada métrica de visão geral, você receberá o valor principal e a variação percentual em relação ao período anterior. Use essa variação para comentar sobre crescimento ou queda.
    3.  **Analise os Dados Demográficos:** Comente sobre a distribuição de gênero e faixa etária do público.
    4.  **Analise os Dados de Localização:** Com base nos dados de seguidores por cidade, comente sobre a distribuição geográfica da audiência. Destaque as principais cidades.
    5.  **Analise o Desempenho das Hashtags:** Com base nos dados de melhores hashtags, comente sobre quais trouxeram mais interações e o que isso pode significar.
    6.  **Analise as Principais Publicações:** Com base nos dados das publicações com melhor taxa de engajamento, comente sobre o que esses posts têm em comum e por que performaram bem.
    7.  **Escreva o Relatório:** Redija uma análise coesa e clara em formato Markdown. Organize o relatório em seções (ex: Visão Geral, Análise de Crescimento, Perfil do Público, Desempenho Geográfico, Análise de Hashtags, Análise das Publicações, Conclusão e Próximos Passos).
    8.  **Forneça Insights e Recomendações:** Não apenas liste os números. Explique o que eles significam. Destaque os pontos positivos (crescimentos) e os pontos de melhoria (quedas). Ofereça recomendações claras e acionáveis para o próximo período com base em todos os dados.
    9.  **Mantenha o Tom de Voz:** Use um tom profissional, didático e parceiro, característico da CP Marketing Digital.

    **Dados para Análise:**

    **1. Briefing do Cliente (em JSON):**
    \`\`\`json
    {{{clientBriefing}}}
    \`\`\`

    **2. Dados de Desempenho (Visão Geral):**
    - Seguidores: {{performanceData.seguidores}} (Variação: {{performanceData.seguidoresVariacao}})
    - Novos Seguidores: {{performanceData.comecaramSeguir}} (Variação: {{performanceData.comecaramSeguirVariacao}})
    - Visualizações: {{performanceData.visualizacoes}} (Variação: {{performanceData.visualizacoesVariacao}})
    - Curtidas: {{performanceData.curtidas}} (Variação: {{performanceData.curtidasVariacao}})
    - Comentários: {{performanceData.comentarios}} (Variação: {{performanceData.comentariosVariacao}})
    - Taxa de Engajamento: {{performanceData.taxaEngajamento}} (Variação: {{performanceData.taxaEngajamentoVariacao}})

    **3. Dados Demográficos:**
    - **Gênero:**
      - Feminino: {{performanceData.generoFeminino}}%
      - Masculino: {{performanceData.generoMasculino}}%
      - Não Especificado: {{performanceData.generoNaoEspecificado}}%
    - **Faixa Etária (Seguidores):**
      - 13-17: {{performanceData.faixaEtaria13a17}}
      - 18-24: {{performanceData.faixaEtaria18a24}}
      - 25-34: {{performanceData.faixaEtaria25a34}}
      - 35-44: {{performanceData.faixaEtaria35a44}}
      - 45-54: {{performanceData.faixaEtaria45a54}}
      - 55-64: {{performanceData.faixaEtaria55a64}}
      - 65+: {{performanceData.faixaEtaria65mais}}
    
    **4. Seguidores por Cidade:**
    {{#each performanceData.cidadesSeguidores}}
    - {{this.key}}: {{this.value}}
    {{/each}}
    

    **5. Melhores Hashtags (por interações):**
    {{#each performanceData.melhoresHashtags}}
    - {{this.key}}: {{this.value}}
    {{/each}}

    **6. Principais Publicações (por taxa de engajamento):**
    {{#each performanceData.principaisPublicacoes}}
    - "{{this.key}}": {{this.value}}%
    {{/each}}
    
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

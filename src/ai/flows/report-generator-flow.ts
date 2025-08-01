
'use server';
/**
 * @fileOverview Um fluxo de IA para gerar relatórios de desempenho de marketing.
 * 
 * - generateReport: Gera uma análise textual baseada no briefing do cliente e nos dados de desempenho.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GenerateReportInput, GenerateReportInputSchema, GenerateReportOutput, GenerateReportOutputSchema } from '@/ai/schemas/report-schemas';


// Função exportada que o front-end chamará
export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return reportGeneratorFlow(input);
}


// Define o prompt que a IA usará
const reportGeneratorPrompt = ai.definePrompt({
  name: 'reportGeneratorPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateReportInputSchema },
  output: { schema: GenerateReportOutputSchema },
  prompt: `
    Você é um(a) Estrategista de Marketing Sênior e redator(a) de relatórios para a agência "CP Marketing Digital". Sua análise deve ser profunda, estratégica e criativa, indo além do óbvio.

    Sua tarefa é criar um relatório de desempenho para um cliente. Você receberá o dossiê completo do cliente (briefing) e os dados de desempenho do período.

    **Instruções Detalhadas:**
    1.  **Tom de Voz:** Mantenha um tom profissional, didático e parceiro, característico da CP Marketing Digital. Você é um especialista trazendo clareza e direção.
    2.  **Análise Holística:** Não analise os dados isoladamente. Conecte as informações entre as seções. Por exemplo: o desempenho dos posts (seção 6) faz sentido com o público-alvo e as dores da persona (seção 3)? As hashtags (seção 5) estão atraindo o público da localização desejada (seção 4)? A performance está acima ou abaixo dos concorrentes mencionados no briefing?
    3.  **Insights Profundos, Não Repetição:** Não se limite a descrever os números. Vá fundo. Se houve uma queda, formule hipóteses sobre o motivo, baseando-se no briefing. Se houve um crescimento, identifique o que provavelmente o causou. Sua análise é o principal valor aqui.
    4.  **Recomendações Criativas e Acionáveis:** Na seção "Conclusão e Próximos Passos", forneça uma lista clara (bullet points) de ações. Sugira ideias de conteúdo, formatos a serem explorados, testes A/B para publicações, ou novas abordagens de hashtags, sempre levando em conta os objetivos, a persona e os concorrentes do cliente. Seja criativo(a).
    
    **Estrutura do Relatório (Siga esta ordem):**
    -   **Visão Geral do Desempenho:** Comente sobre as principais métricas e suas variações.
    -   **Análise do Perfil de Público:** Analise os dados demográficos (gênero e idade) e o que eles revelam sobre a audiência atual em comparação com a persona ideal descrita no briefing.
    -   **Análise Geográfica:** Comente sobre a distribuição geográfica e se ela está alinhada com os objetivos do cliente.
    -   **Análise de Conteúdo e Hashtags:** Avalie o que as publicações e hashtags de melhor desempenho nos dizem. Qual tipo de conteúdo ressoa mais? Por quê? Conecte isso com a análise de concorrentes do briefing.
    -   **Conclusão e Próximos Passos:** Resuma os principais aprendizados e forneça uma lista de recomendações estratégicas e criativas para o próximo período.

    **Dados para Análise:**

    **1. Dossiê do Cliente (Briefing):**
    - **O que a empresa faz?** {{briefing.negociosPosicionamento.descricao}}
    - **Diferencial:** {{briefing.negociosPosicionamento.diferencial}}
    - **Público-alvo:** {{briefing.publicoPersona.publicoAlvo}}
    - **Persona:** {{briefing.publicoPersona.persona}}
    - **Dores da Persona:** {{briefing.publicoPersona.dores}}
    - **Objetivo Principal:** {{briefing.metasObjetivos.objetivoPrincipal}}

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
    

    **5. Melhores Hashtags (por taxa média de engajamento):**
    {{#each performanceData.melhoresHashtags}}
    - #{{this.key}}: {{this.value}}
    {{/each}}

    **6. Principais Publicações (por taxa de engajamento):**
    {{#each performanceData.principaisPublicacoes}}
    - [{{this.type}}] "{{this.key}}": {{this.value}}%
    {{/each}}
    
    **Agora, gere o campo "analysis" com o texto completo do relatório em Markdown, seguindo rigorosamente as instruções e a estrutura fornecida.**
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

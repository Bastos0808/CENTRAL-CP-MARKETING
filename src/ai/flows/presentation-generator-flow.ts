
'use server';
/**
 * @fileOverview A Genkit flow to generate a sales presentation from diagnostic data.
 *
 * - generatePresentation: Creates slide content based on a client diagnostic form.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GeneratePresentationInputSchema,
  GeneratePresentationInput,
  GeneratePresentationOutputSchema,
  GeneratePresentationOutput,
} from '@/ai/schemas/presentation-generator-schemas';

// Exported function that the frontend will call
export async function generatePresentation(
  input: GeneratePresentationInput
): Promise<GeneratePresentationOutput> {
  return presentationGeneratorFlow(input);
}

// Define the prompt the AI will use
const presentationGeneratorPrompt = ai.definePrompt({
  name: 'presentationGeneratorPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GeneratePresentationInputSchema },
  output: { schema: GeneratePresentationOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas Sênior e um especialista em criar apresentações comerciais consultivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico (R1) em uma narrativa de vendas poderosa e persuasiva para a Reunião de Solução (R2).

    **Instruções Críticas:**
    1.  **Siga a Estrutura de Slides:** Gere o conteúdo para cada slide exatamente na ordem e com o propósito definido abaixo.
    2.  **Conecte Dor e Solução:** Sua principal tarefa é conectar a dor do cliente (identificada na R1) com o plano de ação que você vai propor. Cada slide deve reforçar essa ponte.
    3.  **Seja Conciso e Impactante:** Use linguagem de negócios. Crie títulos fortes e textos curtos e diretos. Use bullet points para facilitar a leitura.
    4.  **Crie Dois Planos de Investimento:** Com base no diagnóstico, você DEVE criar dois planos de investimento distintos:
        - **Plano Essencial:** Uma solução mais enxuta. Deixe claro que este plano é um bom começo, mas que ele só deve ajudar a atingir cerca de 40% da meta de faturamento do cliente, pois não ataca todos os gargalos.
        - **Plano Recomendado (Premium/Master):** A solução completa e ideal, que ataca todos os gargalos identificados e tem a maior probabilidade de atingir a meta de faturamento. Justifique por que este é o plano recomendado.
    5.  **Adapte o Tom:** O tom deve ser de um especialista confiante, apresentando um plano de tratamento. É consultivo, não vendedor.

    **Dados do Diagnóstico (R1):**
    ---
    - **Nome do Cliente:** {{clientName}}
    - **Faturamento Médio Atual:** {{faturamentoMedio}}
    - **Meta de Faturamento (Próximos 6 meses):** {{metaFaturamento}}
    - **Ticket Médio:** {{ticketMedio}}
    - **Origem dos Clientes Hoje:** {{origemClientes}}
    - **Tempo de Empresa:** {{tempoEmpresa}}
    - **Motivação para Investir em Marketing:** {{motivacaoMarketing}}
    - **Experiência Anterior com Marketing:** {{investimentoAnterior}}
    - **Tentativas Anteriores que Falharam:** {{tentativasAnteriores}}
    - **Principal Gargalo Identificado:** {{principalGargalo}}
    - **Custo Mensal Estimado do Problema:** {{custoProblema}}
    - **Envolvidos na Decisão:** {{envolvidosDecisao}}
    - **Orçamento Previsto/Disponibilidade de Investimento:** {{orcamentoPrevisto}}
    - **Prazo para Decisão:** {{prazoDecisao}}
    ---

    **Agora, gere o conteúdo para a apresentação seguindo a estrutura abaixo. Preencha todos os campos do objeto de saída.**

    ---
    **Estrutura da Apresentação (Slides)**

    1.  **Capa:**
        -   **Título Principal:** Plano de Crescimento Estratégico
        -   **Nome do Cliente:** {{clientName}}

    2.  **Diagnóstico:**
        -   **Título:** O Ponto de Partida: Meta vs. Realidade
        -   **Conteúdo (em 3 bullet points):**
            -   **Meta:** Resuma o objetivo principal (Ex: "A meta é escalar o faturamento de {{faturamentoMedio}} para {{metaFaturamento}}.").
            -   **Gargalo:** Identifique o principal obstáculo (Ex: "O principal gargalo que impede esse crescimento é [sua análise sobre o '{{principalGargalo}}']").
            -   **Impacto:** Descreva o custo da inação (Ex: "Este gargalo representa um custo de oportunidade estimado em {{custoProblema}} por mês.").

    3.  **Plano de Ação (180 Dias):**
        -   **Título:** Nosso Plano de Ação para os Próximos 180 Dias
        -   **Conteúdo (descreva brevemente os 3 pilares):**
            -   **Aquisição:** Como vamos atrair leads qualificados (sugira táticas como Tráfego no Meta/Google, Conteúdo focado em SEO, etc.).
            -   **Conversão:** Como vamos transformar leads em clientes (sugira táticas como otimização de Landing Pages, criação de ofertas, automação de e-mails).
            -   **Autoridade:** Como vamos fortalecer a marca (sugira táticas como Gestão de Google Meu Negócio, produção de Prova Social, etc.).

    4.  **Cronograma:**
        -   **Título:** Roadmap de Execução
        -   **Conteúdo (descreva as fases):**
            -   **Semanas 1-2 (Setup e Estratégia):** O que será feito no início (configuração de ferramentas, planejamento de conteúdo/campanhas, briefing aprofundado).
            -   **Semanas 3-12 (Execução e Otimização):** O que acontece no dia a dia (lançamento de campanhas, produção de conteúdo, análise de métricas e otimizações).
            -   **Revisões Estratégicas:** Mencione as reuniões mensais de alinhamento e análise de resultados.

    5.  **KPIs (Métricas de Sucesso):**
        -   **Título:** Como Mediremos o Sucesso
        -   **Conteúdo (liste as métricas mais importantes):** Leads Gerados, Custo por Lead (CPL), Taxa de Conversão, Custo de Aquisição de Cliente (CAC) e Retorno sobre o Investimento (ROAS).

    6.  **Nossos Diferenciais:**
        -   **Título:** Por que a CP Marketing?
        -   **Conteúdo (em 2 bullet points, conectando os diferenciais à dor do cliente):**
            -   **Mentoria e Agilidade:** "Para garantir alinhamento e agilidade, entregamos o projeto estratégico em 10 dias com uma mentoria de apresentação."
            -   **Produção Própria:** "Para produzir conteúdo de alta qualidade sem depender da sua agenda, temos time presencial e estúdios próprios."

    7.  **Investimento (Plano Essencial):**
        -   **Título do Plano:** Plano Essencial
        -   **Descrição:** Crie uma descrição para um plano básico. Deixe claro que ele ataca parte do problema, mas não tudo. Informe que a expectativa é que ele ajude a atingir cerca de 40% da meta de faturamento.
        -   **Preço:** Defina um preço realista, porém mais baixo, para este plano, com base nos dados do diagnóstico.

    8.  **Investimento (Plano Recomendado):**
        -   **Título do Plano:** Plano Premium (Recomendado)
        -   **Descrição:** Descreva a solução completa que você recomenda, atacando todos os pontos do diagnóstico. Justifique por que esta é a melhor opção para atingir 100% da meta de faturamento.
        -   **Preço:** Defina o preço para a solução completa, que deve ser superior ao do Plano Essencial e condizente com a entrega de valor.

    9.  **Próximos Passos:**
        -   **Título:** Próximos Passos
        -   **Conteúdo (em 3 bullet points):** Contrato, Pagamento e Reunião de Onboarding.
  `,
});

// Define the flow that orchestrates the call to the AI
const presentationGeneratorFlow = ai.defineFlow(
  {
    name: 'presentationGeneratorFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async (input) => {
    const { output } = await presentationGeneratorPrompt(input);
    return output!;
  }
);

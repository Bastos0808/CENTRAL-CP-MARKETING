
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
  packageOptions
} from '@/ai/schemas/presentation-generator-schemas';
import { z } from 'zod';

// Exported function that the frontend will call
export async function generatePresentation(
  input: GeneratePresentationInput
): Promise<GeneratePresentationOutput> {
  return presentationGeneratorFlow(input);
}

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


// Define the flow that orchestrates the call to the AI
const presentationGeneratorFlow = ai.defineFlow(
  {
    name: 'presentationGeneratorFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async (input) => {

    const { packages = [], discount = 0 } = input;
    const selectedPackageDetails = packages.map(key => ({
        key,
        ...packageOptions[key]
    }));
    
    const totalValue = selectedPackageDetails.reduce((acc, pkg) => acc + pkg.price, 0);
    const finalTotal = totalValue - discount;

    const inputForAI = {
      ...input,
      selectedPackages: selectedPackageDetails.map(p => p.name).join(', '),
      totalValue: formatCurrency(totalValue),
      finalTotal: formatCurrency(finalTotal),
      discount: discount > 0 ? formatCurrency(discount) : undefined,
    }
    
    const llmResponse = await ai.generate({
        model: googleAI.model('gemini-1.5-pro-latest'),
        output: { schema: GeneratePresentationOutputSchema },
        prompt: `
            Você é um Estrategista de Vendas Sênior e um especialista em criar apresentações comerciais consultivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico (R1) em uma narrativa de vendas poderosa e persuasiva para a Reunião de Solução (R2).

            **Instruções Críticas:**
            1.  **Siga a Estrutura de Slides:** Gere o conteúdo para cada slide exatamente na ordem e com o propósito definido abaixo.
            2.  **Conecte Dor e Solução:** Sua principal tarefa é conectar a dor do cliente (identificada na R1) com o plano de ação que você vai propor. Cada slide deve reforçar essa ponte.
            3.  **Seja Conciso e Impactante:** Use linguagem de negócios. Crie títulos fortes e textos curtos e diretos. Use bullet points para facilitar a leitura.
            4.  **Justificativa Estratégica:** No slide "Por que este plano?", você DEVE criar uma justificativa estratégica convincente, explicando como a combinação dos serviços selecionados ({{selectedPackages}}) ataca diretamente os gargalos e dores do cliente para atingir a meta de faturamento.
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
            - **Serviços Selecionados:** {{selectedPackages}}
            - **Valor Total:** {{totalValue}}
            - **Desconto Aplicado:** {{discount}}
            - **Valor Final:** {{finalTotal}}
            ---

            **Agora, gere o conteúdo para a apresentação seguindo a estrutura abaixo. Preencha todos os campos do objeto de saída.**

            ---
            **Estrutura da Apresentação (Slides)**

            1.  **presentationTitle:** "Plano de Crescimento para ${input.clientName}"

            2.  **diagnosticSlide:**
                -   **Título:** O Ponto de Partida: Meta vs. Realidade
                -   **Conteúdo (em 3 bullet points):**
                    -   "**Meta:** A meta é escalar o faturamento de ${input.faturamentoMedio} para ${input.metaFaturamento}."
                    -   "**Gargalo:** O principal obstáculo que impede esse crescimento é ${input.principalGargalo}."
                    -   "**Impacto:** Este gargalo representa um custo de oportunidade estimado em ${input.custoProblema} por mês."

            3.  **actionPlanSlide:**
                -   **Título:** Nosso Plano de Ação para os Próximos 180 Dias
                -   **Conteúdo (descreva brevemente os 3 pilares):**
                    -   "**Aquisição:** Como vamos atrair leads qualificados (sugira táticas como Tráfego no Meta/Google, Conteúdo focado em SEO, etc.)."
                    -   "**Conversão:** Como vamos transformar leads em clientes (sugira táticas como otimização de Landing Pages, criação de ofertas, automação de e-mails)."
                    -   "**Autoridade:** Como vamos fortalecer a marca (sugira táticas como Gestão de Google Meu Negócio, produção de Prova Social, etc.)."

            4.  **timelineSlide:**
                -   **Título:** Roadmap de Execução
                -   **Conteúdo (descreva as fases):**
                    -   "**Semanas 1-2 (Setup e Estratégia):** O que será feito no início (configuração de ferramentas, planejamento de conteúdo/campanhas, briefing aprofundado)."
                    -   "**Semanas 3-12 (Execução e Otimização):** O que acontece no dia a dia (lançamento de campanhas, produção de conteúdo, análise de métricas e otimizações)."
                    -   "**Revisões Estratégicas:** Mencione as reuniões mensais de alinhamento e análise de resultados."

            5.  **kpiSlide:**
                -   **Título:** Como Mediremos o Sucesso
                -   **Conteúdo (liste as métricas mais importantes):** "Leads Gerados", "Custo por Lead (CPL)", "Taxa de Conversão", "Custo de Aquisição de Cliente (CAC)", "Retorno sobre o Investimento (ROAS)".

            6.  **whyCpSlide:**
                -   **Título:** Por que a CP Marketing?
                -   **Conteúdo (em 2 bullet points, conectando os diferenciais à dor do cliente):**
                    -   "**Mentoria e Agilidade:** Para garantir alinhamento e agilidade, entregamos o projeto estratégico em 10 dias com uma mentoria de apresentação."
                    -   "**Produção Própria:** Para produzir conteúdo de alta qualidade sem depender da sua agenda, temos time presencial e estúdios próprios."
            
            7.  **justificationSlide:**
                -   **Título:** Por que este plano é ideal para você?
                -   **Conteúdo:** Crie um texto persuasivo que justifique a escolha dos serviços ({{selectedPackages}}), conectando-os aos gargalos e metas do cliente.

            8.  **investmentSlide:**
                -   **Título:** Proposta de Investimento
                -   **Itens:** Preencha com os detalhes dos pacotes selecionados.
                -   **Total:** ${inputForAI.totalValue}
                -   **Desconto:** ${inputForAI.discount || 'N/A'}
                -   **FinalTotal:** ${inputForAI.finalTotal}
            
            9.  **nextStepsSlide:**
                -   **Título:** Próximos Passos
                -   **Conteúdo (em 3 bullet points):** "Alinhamento e assinatura da proposta.", "Pagamento da primeira parcela.", "Reunião de Onboarding e Kick-off estratégico."
      `,
    });
    
    // Manually construct the investment slide data from the original input
    llmResponse.output!.investmentSlide = {
        title: "Proposta de Investimento",
        items: selectedPackageDetails.map(p => ({ name: p.name, price: formatCurrency(p.price) })),
        total: formatCurrency(totalValue),
        discount: discount > 0 ? `- ${formatCurrency(discount)}` : undefined,
        finalTotal: formatCurrency(finalTotal)
    };
    
    return llmResponse.output!;
  }
);

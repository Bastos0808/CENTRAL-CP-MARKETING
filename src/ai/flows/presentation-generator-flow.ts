
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

    let dataToSubmit: GeneratePresentationInput = input;
    if (!input.clientName) {
        dataToSubmit = {
            clientName: "Clínica Vitalize",
            faturamentoMedio: "R$ 50.000",
            metaFaturamento: "R$ 120.000",
            ticketMedio: "R$ 800",
            origemClientes: "Indicação e pesquisa no Google.",
            tempoEmpresa: "5 anos",
            motivacaoMarketing: "Estagnação no crescimento e desejo de se tornar referência na região.",
            investimentoAnterior: "Já impulsionaram posts no Instagram, sem estratégia clara e com pouco retorno.",
            tentativasAnteriores: "Contrataram um sobrinho para cuidar das redes sociais, mas a comunicação era amadora.",
            principalGargalo: "Geração de leads qualificados. O telefone toca pouco e os contatos que chegam não têm perfil para fechar.",
            custoProblema: "R$ 20.000 por mês em oportunidades perdidas.",
            envolvidosDecisao: "Apenas o sócio principal.",
            orcamentoPrevisto: "Entre R$ 4.000 e R$ 6.000 por mês.",
            prazoDecisao: "30 dias.",
            packages: ['marketing_premium', 'captacao_estudio_contrato'],
            discount: 500,
        };
    }

    const { packages = [], discount = 0 } = dataToSubmit;
    const selectedPackageDetails = packages.map(key => ({
        key,
        ...packageOptions[key as keyof typeof packageOptions]
    }));
    
    const totalValue = selectedPackageDetails.reduce((acc, pkg) => acc + pkg.price, 0);
    const finalTotal = totalValue - discount;

    const inputForAI = {
      ...dataToSubmit,
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
            2.  **Seja Persuasivo e Provocativo:** Não se limite a repetir os dados. Use-os para construir um argumento. Use uma linguagem simples mas com termos técnicos pontuais. Crie títulos em formato de pergunta e adicione "pílulas de conteúdo" (dados de mercado, insights rápidos) para tornar a apresentação mais rica e engajante.
            3.  **Conecte Dor e Solução:** Sua principal tarefa é conectar a dor do cliente (identificada na R1) com o plano de ação que você vai propor. Cada slide deve reforçar essa ponte.
            4.  **Seja Conciso e Impactante:** Use linguagem de negócios. Crie títulos fortes e textos curtos e diretos (no máximo 2-3 linhas por tópico). Use bullet points para facilitar a leitura.
            5.  **Justificativa Estratégica:** No slide "Por que este plano?", você DEVE criar uma justificativa convincente, explicando como a combinação dos serviços selecionados ataca diretamente os gargalos e dores do cliente para atingir a meta.
            6.  **KPIs com Estimativas e Análise Detalhada:** Para o slide de KPIs, não apenas liste as métricas. Para cada uma, forneça uma **estimativa de meta** realista e, no campo 'importance', uma **análise detalhada** explicando como aquela métrica específica contribui para resolver o 'principalGargalo' e alcançar a 'metaFaturamento'.

            **Dados do Diagnóstico (R1):**
            ---
            - **Nome do Cliente:** ${inputForAI.clientName}
            - **Faturamento Médio Atual:** ${inputForAI.faturamentoMedio}
            - **Meta de Faturamento (Próximos 6 meses):** ${inputForAI.metaFaturamento}
            - **Ticket Médio:** ${inputForAI.ticketMedio}
            - **Origem dos Clientes Hoje:** ${inputForAI.origemClientes}
            - **Tempo de Empresa:** ${inputForAI.tempoEmpresa}
            - **Motivação para Investir em Marketing:** ${inputForAI.motivacaoMarketing}
            - **Experiência Anterior com Marketing:** ${inputForAI.investimentoAnterior}
            - **Tentativas Anteriores que Falharam:** ${inputForAI.tentativasAnteriores}
            - **Principal Gargalo Identificado:** ${inputForAI.principalGargalo}
            - **Custo Mensal Estimado do Problema:** ${inputForAI.custoProblema}
            - **Envolvidos na Decisão:** ${inputForAI.envolvidosDecisao}
            - **Orçamento Previsto/Disponibilidade de Investimento:** ${inputForAI.orcamentoPrevisto}
            - **Prazo para Decisão:** ${inputForAI.prazoDecisao}
            - **Serviços Selecionados:** ${inputForAI.selectedPackages}
            - **Valor Total:** ${inputForAI.totalValue}
            - **Desconto Aplicado:** ${inputForAI.discount || 'N/A'}
            - **Valor Final:** ${inputForAI.finalTotal}
            ---

            **Agora, gere o conteúdo para a apresentação seguindo a estrutura abaixo. Preencha todos os campos do objeto de saída.**

            ---
            **Estrutura da Apresentação (Slides)**

            1.  **presentationTitle:** "Plano de Crescimento para ${inputForAI.clientName}"

            2.  **diagnosticSlide:**
                -   **title:** "Onde estamos e para onde vamos?"
                -   **content (em 3 bullet points, curtos e diretos):**
                    -   "**Meta:** Acelerar de ${inputForAI.faturamentoMedio} para ${inputForAI.metaFaturamento}."
                    -   "**Gargalo:** O obstáculo principal é ${inputForAI.principalGargalo}."
                    -   "**Custo da Inação:** O gargalo atual gera um custo de oportunidade estimado em ${inputForAI.custoProblema} mensais."
                -   **question:** Crie uma pergunta de reflexão curta e provocativa baseada no gargalo. Ex: "Quantos clientes deixaram de entrar em contato este mês por não encontrarem vocês da forma certa?"

            3.  **actionPlanSlide:**
                -   **title:** "Como vamos virar o jogo?"
                -   **content (descreva os 3 pilares, cada um com um título forte e um insight):**
                    -   "**Pilar 1 - Aquisição:** Como vamos atrair um fluxo constante de leads qualificados. **Insight:** Adicione um dado de mercado ou frase de impacto sobre aquisição."
                    -   "**Pilar 2 - Conversão:** Como vamos transformar curiosos em clientes pagantes. **Insight:** Adicione um dado de mercado ou frase de impacto sobre funil de vendas."
                    -   "**Pilar 3 - Autoridade:** Como vamos posicionar sua marca como líder no setor. **Insight:** Adicione um dado de mercado ou frase de impacto sobre branding."

            4.  **timelineSlide:**
                -   **title:** "Qual o cronograma de execução?"
                -   **content (descreva as fases de forma concisa):**
                    -   "**Semanas 1-2 (Setup e Imersão):** Alinhamento estratégico, configuração de ferramentas e planejamento de campanhas/conteúdo."
                    -   "**Semanas 3-12 (Execução e Otimização):** Lançamento de campanhas, produção de conteúdo e otimizações semanais baseadas em dados."
                    -   "**Revisões Estratégicas:** Reuniões mensais para análise de resultados, ROI e próximos passos."

            5.  **kpiSlide:**
                -   **title:** "Como vamos medir o sucesso (e o ROI)?"
                -   **kpis (gere de 3 a 5 kpis):**
                    -   **metric:** (Ex: "Custo por Lead (CPL)")
                    -   **estimate:** (Ex: "Abaixo de R$25,00")
                    -   **importance:** (Ex: "Essencial para escalar o investimento em anúncios de forma lucrativa, atacando diretamente o gargalo de '${inputForAI.principalGargalo}' e buscando a meta de ${inputForAI.metaFaturamento}.")

            6.  **whyCpSlide:**
                -   **title:** "Por que a CP é a escolha certa?"
                -   **content (em 3 bullet points, conectando os diferenciais à dor do cliente):**
                    -   "**Mentoria e Agilidade:** Projeto estratégico entregue em 10 dias com mentoria de apresentação, garantindo que a execução comece rápido para atacar o gargalo de ${inputForAI.principalGargalo}."
                    -   "**Produção Própria:** Time presencial e estúdios próprios para produzir conteúdo de alta qualidade sem depender da sua agenda, garantindo consistência e padrão profissional."
                    -   "**Foco em Business Performance:** Enquanto o mercado foca em métricas de vaidade, nossa obsessão é o crescimento do seu faturamento e o ROI do seu investimento."
                
            7.  **justificationSlide:**
                -   **title:** "Por que este plano é ideal para você?"
                -   **content:** Crie um texto persuasivo (2-3 linhas) que justifique a escolha dos serviços, conectando-os aos gargalos e metas do cliente. Se não houver serviços, explique a importância de um plano estratégico.

            8.  **investmentSlide:**
                -   **title:** "Proposta de Investimento"
                -   **items:** Baseado nos pacotes selecionados, descreva os itens de forma atraente.
                -   **total:** ${inputForAI.totalValue}
                -   **discount:** ${inputForAI.discount || 'N/A'}
                -   **finalTotal:** ${inputForAI.finalTotal}
                
            9.  **nextStepsSlide:**
                -   **title:** "Quais os próximos passos?"
                -   **content (em 3 bullet points):** "Alinhamento e assinatura da proposta.", "Pagamento da primeira parcela para reserva de agenda.", "Reunião de Onboarding e Kick-off estratégico."
            `,
    });
    
    // Manually construct the investment slide data from the original input
    // to ensure correct formatting and data integrity.
    if (llmResponse.output) {
        const investmentItems = dataToSubmit.packages && dataToSubmit.packages.length > 0 ? selectedPackageDetails.map(p => ({ name: p.name, price: formatCurrency(p.price) })) : [];
        llmResponse.output.investmentSlide = {
            title: llmResponse.output.investmentSlide.title || "Proposta de Investimento",
            items: investmentItems,
            total: formatCurrency(totalValue),
            discount: discount > 0 ? `- ${formatCurrency(discount)}` : undefined,
            finalTotal: formatCurrency(finalTotal)
        };
    }
    
    return llmResponse.output!;
  }
);

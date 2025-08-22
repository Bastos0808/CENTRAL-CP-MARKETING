
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
  GeneratePresentationOutput
} from '@/ai/schemas/presentation-generator-schemas';
import { format, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Exported function that the frontend will call
export async function generatePresentation(
  input: GeneratePresentationInput
): Promise<GeneratePresentationOutput> {
  return presentationGeneratorFlow(input);
}

// Define the flow that orchestrates the call to the AI
const presentationGeneratorFlow = ai.defineFlow(
  {
    name: 'presentationGeneratorFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async (input) => {
    
    // Format dates
    const today = new Date();
    const proposalDate = format(today, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    const proposalValidityDate = format(add(today, { days: 7 }), "dd/MM/yyyy");

    // Prepare data for the AI prompt
    const { faturamentoMedio, metaFaturamento, ...restOfInput } = input;
    const inputForAI = {
        ...restOfInput,
        faturamentoMedio: faturamentoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        metaFaturamento: metaFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        ticketMedio: input.ticketMedio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A',
        custoProblema: input.custoProblema?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A',
    };

    const { output } = await ai.generate({
        model: googleAI.model('gemini-1.5-pro-latest'),
        output: { schema: GeneratePresentationOutputSchema },
        prompt: `
            Você é um Estrategista de Vendas Sênior e um especialista em criar narrativas comerciais persuasivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico em conteúdo textual para uma apresentação interativa, seguindo rigorosamente as instruções para cada slide. O tom deve ser provocativo e focado em perguntas reflexivas.

            **Dados do Diagnóstico:**
            ---
            - **Nome do Cliente:** ${inputForAI.clientName}
            - **Tempo de Empresa:** ${inputForAI.tempoEmpresa}
            - **Faturamento Médio Atual:** ${inputForAI.faturamentoMedio}
            - **Meta de Faturamento (6 meses):** ${inputForAI.metaFaturamento}
            - **Ticket Médio:** ${inputForAI.ticketMedio}
            - **Origem dos Clientes:** ${inputForAI.origemClientes}
            - **Motivação para Investir:** ${inputForAI.motivacaoMarketing}
            - **Experiência Anterior com Marketing:** ${inputForAI.experienciaMarketing}
            - **Tentativas Anteriores que Falharam:** ${inputForAI.tentativasAnteriores}
            - **Principal Gargalo:** ${inputForAI.principalGargalo}
            - **Impacto do Gargalo:** ${inputForAI.impactoGargalo}
            - **Sentimento Pessoal do Gestor:** ${inputForAI.sentimentoPessoal}
            - **Custo Estimado do Problema por Mês:** ${inputForAI.custoProblema}
            - **Visão de Futuro (Negócio):** ${inputForAI.visaoFuturo}
            - **Visão de Futuro (Pessoal):** ${inputForAI.visaoFuturoPessoal}
            - **O que faria com mais clientes:** ${inputForAI.potencialResolucao}
            ---

            **Agora, gere o conteúdo para cada slide da apresentação, preenchendo todos os campos do objeto de saída com textos curtos, diretos e provocativos.**

            ---
            **Slide 3: O Diagnóstico**
            - **resumoEmpatico:** Gere uma pergunta que valide o sentimento do cliente. Ex: "Você sente que o negócio tem potencial para chegar a ${inputForAI.metaFaturamento}, mas o gargalo em '${inputForAI.principalGargalo}' tem gerado uma frustração de '${inputForAI.sentimentoPessoal}'?"
            - **analiseReflexiva:** Gere uma pergunta sobre o timing da decisão. Ex: "Uma empresa com ${inputForAI.tempoEmpresa} de história, que sempre cresceu com base em '${inputForAI.origemClientes}', decide agir agora. Isso acontece porque a concorrência se tornou mais forte ou porque o modelo atual simplesmente chegou ao seu limite?"

            ---
            **Slide 4: A Dor e Suas Consequências**
            - **consequencia_1:** Descreva o impacto operacional como um sintoma em forma de pergunta. Ex: "A agenda com buracos ('${inputForAI.impactoGargalo}') é o sintoma mais claro de que o motor de aquisição de clientes da sua empresa está desligado. Concorda?"
            - **consequencia_2:** Questione a tentativa anterior, transformando-a em aprendizado. Ex: "A experiência passada com '${inputForAI.tentativasAnteriores}' não falhou por falta de esforço, mas talvez por focar na ferramenta errada. Será que o problema não era o carro, mas a falta de um mapa?"
            - **consequencia_3:** Provoque sobre a concorrência e o custo de oportunidade. Ex: "Enquanto discutimos, quantos clientes que buscavam uma solução como a sua acabaram de fechar com seu concorrente que anuncia online?"

            ---
            **Slide 5: A Visualização do Futuro**
            - **cenario_6_meses:** Descreva a visão de futuro como uma realidade próxima em forma de pergunta. Ex: "Consegue se imaginar daqui a 6 meses com a agenda cheia com semanas de antecedência e a tranquilidade de saber que sua meta de ${inputForAI.metaFaturamento} não é mais um sonho, mas uma previsão?"
            - **cenario_1_ano:** Projete a transformação completa como uma pergunta. Ex: "E em 1 ano, com essa previsibilidade, você finalmente poderá '${inputForAI.potencialResolucao}'. Isso não muda apenas a empresa, mas traz a paz ('${inputForAI.visaoFuturoPessoal}') que você merece como gestor, certo?"

            ---
            **Slide 6: O Custo da Inação**
            - **custo_6_meses:** Calcule o custo da inação em 6 meses, multiplicando '${input.custoProblema || 0}' por 6. Formate como moeda BRL, por exemplo, "R$ 120.000,00".
            - **custo_1_ano:** Calcule o custo da inação em 1 ano, multiplicando '${input.custoProblema || 0}' por 12. Formate como moeda BRL, por exemplo, "R$ 240.000,00".
            - **cenario_inercia:** Crie uma pergunta sobre o futuro da inércia. Ex: "Se nada for feito, onde a sua empresa estará em 1 ano? Com o mesmo faturamento, vendo a concorrência crescer e com sua frustração ainda maior? É esse o futuro que você aceita?"

            ---
            **Slide 7: A Estratégia**
            - **pilarAquisicao:** Conecte o pilar ao gargalo. Ex: "Para resolver seu principal gargalo ('${inputForAI.principalGargalo}'), nosso pilar de Aquisição foca em criar um sistema que atrai clientes qualificados de forma consistente."
            - **pilarConversao:** Conecte o pilar à falha anterior. Ex: "Para evitar o problema de '${inputForAI.tentativasAnteriores}', nosso pilar de Conversão qualifica os leads para que seu time comercial converse apenas com quem tem real potencial de compra."
            - **pilarAutoridade:** Conecte o pilar à força atual. Ex: "Seu negócio já é validado por '${inputForAI.origemClientes}'. Nosso pilar de Autoridade irá amplificar essa confiança, transformando sua marca na referência número 1 do seu mercado."

            ---
            **Slide 9: Métricas de Sucesso**
            - **crescimentoPercentual:** Calcule a porcentagem de crescimento necessária para ir de ${input.faturamentoMedio} para ${input.metaFaturamento}. Formate como 'XX%'. Ex: '140%'.
            - **metaLeadsQualificados:** Com base na meta de faturamento e no ticket médio de ${inputForAI.ticketMedio}, calcule uma meta realista de leads qualificados por mês. Ex: "88".
            - **metaTaxaConversao:** Defina uma meta de taxa de conversão realista para atingir o objetivo. Ex: "20%".

            ---
            **Slide 10: O Investimento**
            - **ancoragemPreco:** Gere uma pergunta de ancoragem. Ex: "Manter o problema atual custa à sua empresa ${inputForAI.custoProblema} por mês. Nosso plano é um investimento para transformar esse custo em lucro. Faz sentido?"
            - **ganchoDecisao:** Gere a pergunta final de decisão. Ex: "Existem dois futuros à sua frente: o da tranquilidade e crescimento, ou o da estagnação e frustração. Qual deles você começa a construir hoje?"
            - **gatilhoEscassez:** Crie uma frase de urgência sobre o número limitado de vagas. Ex: "Para garantir a dedicação que você merece, só temos mais 2 vagas para novos clientes este mês."
            - **gatilhoBonus:** Crie uma frase sobre o bônus de fechamento rápido. Ex: "Além disso, fechando nesta semana, garantimos a produção de um episódio de podcast para lançar sua nova fase de autoridade."
        `,
    });
    
    // Manually add the date and client name fields which don't require AI generation
    if (output) {
      output.clientName = input.clientName;
      output.proposalDate = proposalDate;
      output.proposalValidityDate = proposalValidityDate;
    }
    
    return output!;
  }
);

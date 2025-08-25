
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
import { format, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { packageOptions } from '@/ai/schemas/presentation-generator-schemas';

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
        custoProblema: (input.custoProblema || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    };

    const { output } = await ai.generate({
        model: googleAI.model('gemini-1.5-pro-latest'),
        output: { schema: GeneratePresentationOutputSchema },
        system: `Você é um Estrategista de Vendas Sênior e um especialista em criar narrativas comerciais persuasivas para a agência "CP Marketing Digital". Sua missão é transformar os dados brutos de uma reunião de diagnóstico em conteúdo textual para uma apresentação interativa, seguindo rigorosamente as instruções para cada slide.`,
        prompt: `
            **Dados do Diagnóstico:**
            ---
            - **Nome do Cliente:** ${inputForAI.clientName}
            - **Setor do Cliente:** ${inputForAI.companySector || 'Não informado'}
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

            **Instrução:** Agora, gere o conteúdo para cada slide da apresentação, preenchendo todos os campos do objeto de saída com textos curtos, diretos e persuasivos, usando os dados acima.

            **Histórias de Alerta por Setor (Use estas como base para o 'diagnosticSlide.story' e 'painSlide.historia_alerta'):**
            - **Saúde/Estética:** "Conhecíamos uma clínica de dermatologia que era a maior referência da cidade, com uma reputação construída em 20 anos de serviço. Por acreditarem que 'cliente bom vem por indicação', ignoraram o marketing digital. Em 3 anos, viram a agenda encolher 70%. Novos médicos, mesmo com menos experiência, dominaram a primeira página do Google e o Instagram, atraindo todos os novos pacientes com alto poder aquisitivo. Hoje, a clínica referência luta para pagar as contas, uma sombra do que já foi. É uma história que se repete com quem acredita que apenas a qualidade do serviço é suficiente."
            - **B2B/Serviços:** "Uma consultoria de engenharia, líder em projetos industriais, viu seus contratos milionários desaparecerem. O motivo? Seus concorrentes criaram uma forte presença de autoridade no LinkedIn, publicando artigos e estudos de caso, enquanto eles dependiam apenas de uma rede de contatos antiga. Quando os diretores que os indicavam se aposentaram, o fluxo de novos projetos secou completamente. Tarde demais, perceberam que o mercado não busca mais no networking, busca no Google."
            - **Varejo Premium:** "Lembramos de uma boutique de moda com peças exclusivas e um atendimento impecável que fechou as portas. O erro fatal foi não construir uma comunidade online e não investir em tráfego pago para atrair o público certo. Enquanto isso, novas marcas, com produtos talvez de menor qualidade, mas com uma forte presença digital e campanhas de anúncios agressivas, conquistaram o coração e a carteira de seus antigos clientes. Eles vendiam produtos, os concorrentes vendiam um estilo de vida online."
            - **Genérico:** "Uma empresa líder em seu mercado local, confiante em sua reputação de décadas, subestimou a velocidade da mudança digital. Em apenas dois anos, viu concorrentes menores e mais ágeis capturarem 40% de sua base de clientes, usando anúncios direcionados e conteúdo relevante nas redes sociais. O custo para tentar recuperar o terreno perdido foi três vezes maior do que teria sido para inovar e se adaptar no tempo certo. A reputação os tornou conhecidos, mas a falta de marketing os tornou invisíveis."
            ---

            **Slide 1: Título da Proposta**
            - **presentationTitle:** Crie um título inspirador e direto para a apresentação. Algo como "A Estratégia para a [Nome do Cliente] Dobrar o Faturamento" ou "O Plano para Transformar a [Nome do Cliente] em Referência de Mercado".

            ---
            **Slide 2: O Diagnóstico**
            - **diagnosticSlide.title:** Gere o título do slide: "Entendemos o seu Desafio".
            - **diagnosticSlide.question:** Gere a pergunta reflexiva: "Você sente que seu negócio tem potencial para muito mais, mas algo está travando esse crescimento?".
            - **diagnosticSlide.story:** Com base no setor do cliente ('${inputForAI.companySector}'), escolha a **História de Alerta** mais apropriada da lista acima e adapte-a levemente para o campo, mantendo o tom emocional. Substitua "[Setor]" pelo setor do cliente.
            - **diagnosticSlide.faturamentoAtual:** Extraia o Faturamento Médio Atual. Ex: "${inputForAI.faturamentoMedio}".
            - **diagnosticSlide.meta:** Extraia a Meta de Faturamento. Ex: "${inputForAI.metaFaturamento} em 6 meses".
            - **diagnosticSlide.custo:** Extraia o Custo do Problema. Ex: "${inputForAI.custoProblema} deixados na mesa todo mês".
            - **diagnosticSlide.gargalo:** Com base nos campos 'principalGargalo' e 'impactoGargalo', escreva um parágrafo que humaniza o problema. Em vez de apenas citar o gargalo, explique como ele se manifesta no dia a dia da empresa de forma empática. Por exemplo, se o gargalo é 'geração de leads' e o impacto é 'equipe ociosa', você pode escrever: "O principal desafio que identificamos não é apenas a falta de novos contatos, mas o que isso representa: uma equipe talentosa com tempo ocioso e um potencial de faturamento que não está sendo realizado. É a sensação de ter um motor potente, mas que não consegue tracionar como deveria."
            - **diagnosticSlide.comoAlcancaremos:** Descreva em um parágrafo como o plano macro irá atingir a meta. Ex: "Para atingir essa meta, implementaremos um sistema de aquisição de clientes focado em tráfego pago, direcionado para o seu público ideal, combinado com uma comunicação estratégica no Instagram para construir autoridade e converter seguidores em pacientes."
            - **diagnosticSlide.porqueCustoExiste:** Explique por que o custo da inação existe, conectando-o à ausência de marketing eficaz. Ex: "Esse valor é o reflexo direto de potenciais clientes que, hoje, não encontram sua clínica online e acabam fechando com concorrentes que investem em visibilidade. Cada mês sem uma estratégia ativa é um mês permitindo que seus concorrentes capturem uma fatia maior do mercado."


            ---
            **Slide 3: A Dor e Suas Consequências**
            - **painSlide.title:** Gere o título do slide: "O Custo Real de Adiar a Decisão".
            - **painSlide.question:** Gere a pergunta: "Adiamos decisões por medo de errar, mas qual o custo de não decidir?".
            - **painSlide.impacto_operacional:** Gere um parágrafo curto sobre o impacto operacional do gargalo no dia a dia.
            - **painSlide.impacto_frustracao:** Gere um parágrafo curto destacando a frustração das tentativas passadas que falharam, usando o campo 'sentimentoPessoal'.
            - **painSlide.historia_alerta:** Reutilize a mesma história gerada para o 'diagnosticSlide.story'.

            ---
            **Slide 4: A Visualização do Futuro**
            - **futureSlide.title:** Gere o título do slide: "O Futuro que Vamos Construir Juntos".
            - **futureSlide.question:** Gere a pergunta: "Como seria se, em vez de se preocupar com o gargalo, sua única preocupação fosse em como gerenciar o crescimento?".
            - **futureSlide.content:** Gere um array com 3 ou 4 objetos, cada um com um "title" e uma "description". Use as respostas sobre 'o que faria com mais clientes' e o 'impacto pessoal' para criar transformações vívidas e persuasivas. Foque em benefícios, não em ações.
                - Exemplo de objeto: { title: "Agenda Previsível", description: "Tenha a clareza de saber como sua agenda estará nas próximas semanas, permitindo investimentos e contratações estratégicas." }.
                - Outro exemplo: { title: "Foco na Sua Paixão", description: "Gaste seu tempo atendendo bem seus clientes, em vez de se preocupar em como atrair novos." }.

            ---
            **Slide 6: A Estratégia**
            - **strategySlide.title:** Gere o título do slide: "Nosso Plano para Virar o Jogo".
            - **strategySlide.content:** Para cada um dos três pilares, gere um objeto com "title" e "description".
              - Para o primeiro pilar (Aquisição), o título deve ser 'Aquisição'. A descrição deve focar em resolver o 'gargalo de geração'.
              - Para o segundo pilar (Conversão), o título deve ser 'Conversão'. A descrição deve focar em resolver a falha da 'experiência anterior com leads desqualificados'.
              - Para o terceiro pilar (Autoridade), o título deve ser 'Autoridade'. A descrição deve focar em escalar a 'confiança da indicação'.
              NÃO use markdown (como **) nos títulos.

            ---
            **Slide 8: Métricas de Sucesso**
            - **metricsSlide.title:** Gere o título do slide: "Seu Crescimento em Números".
            - **metricsSlide.subtitle:** Gere um subtítulo motivacional como: "O sucesso será medido com dados claros. Nossas metas mensais são:"
            - **metricsSlide.metrics:** Para cada uma das 3 métricas abaixo, gere um objeto com 'title', 'value' e 'description'.
              - **Métrica 1: Crescimento Percentual:** Calcule a porcentagem de crescimento necessária para ir do faturamento médio para a meta. O título deve ser "Crescimento de Faturamento". O valor deve ser a porcentagem (Ex: "140%"). A descrição deve ser um parágrafo persuasivo explicando que este número representa mais do que dinheiro, significa **a consolidação da marca como referência** e a capacidade de realizar investimentos estratégicos.
              - **Métrica 2: Leads Qualificados:** Com base na meta de faturamento e no ticket médio, calcule uma meta realista de leads qualificados por mês. O título deve ser "Leads Qualificados por Mês". O valor deve ser o número de leads (Ex: "88"). A descrição deve explicar que não se trata de curiosos, mas de **potenciais clientes com real intenção de compra**, que chegam educados e prontos para a conversão.
              - **Métrica 3: Taxa de Conversão:** Defina uma meta de taxa de conversão realista. O título deve ser "Taxa de Conversão". O valor deve ser a porcentagem (Ex: "20%"). A descrição deve enfatizar que este número reflete a eficiência do processo, onde o marketing e as vendas trabalham em perfeita sintonia, transformando **investimento em lucro de forma previsível**.
            - **metricsSlide.comoAlcancaremos:** Crie um parágrafo detalhado e persuasivo explicando COMO a CP Marketing alcançará essas métricas. Conecte os pilares da estratégia (Aquisição, Conversão, Autoridade) com os números. Por exemplo, explique que a meta de leads será atingida através de campanhas de tráfego pago altamente segmentadas, a taxa de conversão virá de uma comunicação estratégica que qualifica o lead, e o crescimento geral será sustentado pela construção de autoridade da marca.
        `,
    });
    
    // Manually add the date and client name fields which don't require AI generation
    if (output) {
      output.clientName = input.clientName;
      output.proposalDate = proposalDate;
      output.proposalValidityDate = proposalValidityDate;
      
      const totalPackages = input.packages?.reduce((acc, pkgKey) => acc + (packageOptions[pkgKey as keyof typeof packageOptions]?.price || 0), 0) || 0;
      const finalInvestment = totalPackages - (input.discount || 0);
      output.investmentValue = finalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      output.packages = input.packages?.map(key => packageOptions[key as keyof typeof packageOptions]) || [];
      
      // Manually populate fields for slide 5, which are direct calculations
      const custoMensal = input.custoProblema || 0;
      output.inactionCostSlide = {
          title: "O Custo da Inação",
          custo_6_meses: (custoMensal * 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          custo_1_ano: (custoMensal * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          cenario_inercia: "Enquanto a decisão é adiada, o faturamento pode continuar estagnado e a concorrência, que investe em marketing, pode abocanhar uma fatia maior do seu mercado, tornando a recuperação futura ainda mais difícil e cara."
      };
      
       // Manually populate fields for slide 9, which are also more direct
       output.investmentSlide = {
           title: "O Investimento no seu Crescimento",
           ancoragemPreco: `Considerando que o problema atual custa ${inputForAI.custoProblema} por mês, o investimento para resolver a causa raiz desse problema é significativamente menor.`,
           ganchoDecisao: "Diante de tudo que conversamos, existem dois futuros possíveis: um de crescimento previsível e outro de estagnação. Qual deles você escolherá construir a partir de hoje?",
           gatilhoEscassez: "Para garantir a dedicação e a qualidade que você viu, só temos capacidade para iniciar com 3 novos clientes este mês.",
           gatilhoBonus: "Além disso, fechando a parceria nesta semana, você garante como bônus a produção de um episódio de podcast em nosso estúdio para lançar sua nova fase de autoridade no mercado."
       };
    }
    
    return output!;
  }
);
    

    
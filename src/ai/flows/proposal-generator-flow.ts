
'use server';
/**
 * @fileOverview A Genkit flow to generate marketing proposal content.
 *
 * - generateProposalContent: Creates proposal content based on selected service packages.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateProposalInput,
  GenerateProposalInputSchema,
  GenerateProposalOutput,
  GenerateProposalOutputSchema,
} from '@/ai/schemas/proposal-generator-schemas';

// Exported function that the frontend will call
export async function generateProposalContent(
  input: GenerateProposalInput
): Promise<GenerateProposalOutput> {
  return proposalGeneratorFlow(input);
}

const proposalGeneratorPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
<<<<<<< HEAD
  model: googleAI.model('gemini-1.5-pro-latest'),
=======
>>>>>>> 1563a8413bb64b129ef02de1aa4e47c11ec12c05
  input: { schema: GenerateProposalInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar o conteúdo de uma proposta comercial para o cliente "{{clientName}}", com base nos pacotes de serviços selecionados: {{packages}}.

    **Instruções Gerais:**
    1.  **Seja Persuasivo:** Use uma linguagem que vende o valor e o resultado, não apenas descreve o serviço.
    2.  **Personalize com o Nome:** Use o nome do cliente, "{{clientName}}", para criar uma conexão pessoal, principalmente na descrição da parceria.
    3.  **Foco no Valor:** Conecte cada item a um benefício ou resultado que o cliente deseja alcançar.

    **Instruções por Seção:**
    -   **partnershipDescription:** Crie um texto inspirador para a seção "Sobre a Parceria", estabelecendo um tom de colaboração e sucesso conjunto com {{clientName}}.
    -   **objectiveItems:** Com base nos pacotes selecionados ({{packages}}), gere uma lista grande e persuasiva de objetivos que a parceria irá alcançar. Ex: "Aumentar a autoridade da marca no setor para atrair clientes de maior valor", "Gerar um fluxo consistente de leads qualificados", etc.
    -   **differentialItems:** Gere uma lista grande e persuasiva de diferenciais. Destaque o que torna nossa abordagem única e valiosa. Ex: "Planejamento estratégico 100% focado em resultados de negócio", "Equipe multidisciplinar com especialistas em cada etapa do funil", "Relatórios transparentes que mostram o ROI real".
    -   **idealPlanItems:** Elabore uma lista grande e persuasiva de argumentos para "Por que este plano é ideal?". Justifique a combinação dos serviços escolhidos como a solução perfeita para o sucesso do cliente. Ex: "Combina o alcance imediato do Tráfego Pago com a construção de autoridade a longo prazo do Podcast", "Oferece uma solução completa que ataca o problema do cliente de ponta a ponta, da atração à conversão".

    Agora, gere o conteúdo para todos os campos do schema de saída.
  `,
});

const proposalGeneratorFlow = ai.defineFlow(
  {
    name: 'proposalGeneratorFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await proposalGeneratorPrompt(input);
      
      // Garante que o output não é nulo e que os campos sejam válidos
      return {
        partnershipDescription: output?.partnershipDescription || 'Não foi possível gerar a descrição. Tente novamente.',
        objectiveItems: output?.objectiveItems || [],
        differentialItems: output?.differentialItems || [],
        idealPlanItems: output?.idealPlanItems || [],
      };

    } catch (error) {
      console.error('Error generating proposal content:', error);
      // Retorna uma estrutura válida em caso de erro para não quebrar o frontend
      return {
        partnershipDescription: 'Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente ou preencha manualmente.',
        objectiveItems: [],
        differentialItems: [],
        idealPlanItems: [],
      };
    }
  }
);

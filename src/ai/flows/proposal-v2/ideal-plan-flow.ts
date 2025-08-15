
'use server';
/**
 * @fileOverview A Genkit flow to generate the "why this plan is ideal" section of a marketing proposal.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { 
    GenerateProposalSubFlowInputSchema,
    GenerateIdealPlanOutput,
    GenerateIdealPlanOutputSchema
} from '@/ai/schemas/proposal-v2-schemas';
import { z } from 'zod';

export async function generateIdealPlanContent(
  input: z.infer<typeof GenerateProposalSubFlowInputSchema>
): Promise<GenerateIdealPlanOutput> {
  return idealPlanFlow(input);
}

const idealPlanPrompt = ai.definePrompt({
  name: 'idealPlanPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateProposalSubFlowInputSchema },
  output: { schema: GenerateIdealPlanOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar a seção "Por que este plano é ideal?" de uma proposta comercial para o cliente "{{clientName}}".

    **Contexto Estratégico do Cliente:**
    - **Setor da Empresa:** {{clientSector}}
    - **Principal Objetivo:** {{clientObjective}}
    - **Maior Desafio Atual:** {{clientChallenge}}

    **Serviços Selecionados para a Proposta:**
    ---
    {{packagesString}}
    ---

    **Instruções Críticas:**
    1.  **Foco em Justificativa:** Elabore uma **lista** de 3 a 4 argumentos.
    2.  **Conexão Estratégica:** Justifique por que a combinação dos serviços escolhidos é a estratégia perfeita para o cenário ATUAL do cliente.
    3.  **Resolver Desafios:** Cada argumento deve mostrar como o plano ataca o desafio de "{{clientChallenge}}" e mira o objetivo de "{{clientObjective}}" no setor de "{{clientSector}}".
    4.  **Exemplo:** "A combinação do Tráfego Pago com a Gestão de Mídias Sociais ataca seu desafio de [Desafio do Cliente] em duas frentes: alcance imediato e construção de confiança a longo prazo."
    5.  **Formato:** A saída deve ser uma lista de strings. Não crie um texto corrido.

    Agora, gere a lista para o campo 'idealPlanItems'.
  `,
});

const idealPlanFlow = ai.defineFlow(
  {
    name: 'idealPlanFlow',
    inputSchema: GenerateProposalSubFlowInputSchema,
    outputSchema: GenerateIdealPlanOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await idealPlanPrompt(input);
        return output || { idealPlanItems: [] };
    } catch(error) {
        console.error(`Error in idealPlanFlow for client ${input.clientName}:`, error);
        return { idealPlanItems: ['Erro ao gerar argumentos do plano.'] };
    }
  }
);

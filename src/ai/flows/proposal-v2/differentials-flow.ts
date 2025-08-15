
'use server';
/**
 * @fileOverview A Genkit flow to generate the "differentials" section of a marketing proposal.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { 
    GenerateProposalSubFlowInputSchema,
    GenerateDifferentialsOutput,
    GenerateDifferentialsOutputSchema
} from '@/ai/schemas/proposal-v2-schemas';
import { z } from 'zod';


export async function generateDifferentialsContent(
  input: z.infer<typeof GenerateProposalSubFlowInputSchema>
): Promise<GenerateDifferentialsOutput> {
  return differentialsFlow(input);
}

const differentialsPrompt = ai.definePrompt({
  name: 'differentialsPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateProposalSubFlowInputSchema },
  output: { schema: GenerateDifferentialsOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar a seção "Nossos Diferenciais" de uma proposta comercial para o cliente "{{clientName}}".

    **Contexto Estratégico do Cliente:**
    - **Setor da Empresa:** {{clientSector}}
    - **Principal Objetivo:** {{clientObjective}}
    - **Maior Desafio Atual:** {{clientChallenge}}
    - **Público-Alvo:** {{clientAudience}}

    **Instruções Críticas:**
    1.  **Foco em Diferenciais:** Gere uma **lista** de 4 a 5 diferenciais da sua agência.
    2.  **Conexão Direta:** Conecte cada diferencial a como ele ajuda a mitigar riscos ou acelerar o **objetivo** do cliente "{{clientObjective}}".
    3.  **Linguagem de Valor:** Use uma linguagem que vende o resultado e a transformação, não apenas a característica.
    4.  **Exemplo:** Em vez de "Relatórios mensais", use "Relatórios transparentes focados em ROI, para que você veja exatamente como seu investimento está se convertendo em [Objetivo do Cliente]".
    5.  **Formato:** A saída deve ser uma lista de strings. Não crie um texto corrido.

    Agora, gere a lista para o campo 'differentialItems'.
  `,
});

const differentialsFlow = ai.defineFlow(
  {
    name: 'differentialsFlow',
    inputSchema: GenerateProposalSubFlowInputSchema,
    outputSchema: GenerateDifferentialsOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await differentialsPrompt(input);
        return output || { differentialItems: [] };
    } catch(error) {
        console.error(`Error in differentialsFlow for client ${input.clientName}:`, error);
        return { differentialItems: ['Erro ao gerar diferenciais.'] };
    }
  }
);

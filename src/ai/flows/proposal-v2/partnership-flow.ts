
'use server';
/**
 * @fileOverview A Genkit flow to generate the "partnership description" section of a marketing proposal.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { 
    GenerateProposalSubFlowInputSchema,
    GeneratePartnershipOutput,
    GeneratePartnershipOutputSchema
} from '@/ai/schemas/proposal-v2-schemas';
import { z } from 'zod';

export async function generatePartnershipContent(
  input: z.infer<typeof GenerateProposalSubFlowInputSchema>
): Promise<GeneratePartnershipOutput> {
  return partnershipFlow(input);
}

const partnershipPrompt = ai.definePrompt({
  name: 'partnershipPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateProposalSubFlowInputSchema },
  output: { schema: GeneratePartnershipOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar o parágrafo introdutório "Sobre a Parceria" de uma proposta comercial para o cliente "{{clientName}}".

    **Contexto Estratégico do Cliente:**
    - **Setor da Empresa:** {{clientSector}}
    - **Principal Objetivo:** {{clientObjective}}
    - **Maior Desafio Atual:** {{clientChallenge}}

    **Instruções Críticas:**
    1.  **Parágrafo Inspirador:** Crie um parágrafo único e inspirador para a seção "Sobre a Parceria".
    2.  **Conexão Direta:** Comece abordando diretamente o **desafio** de "{{clientChallenge}}" no contexto do setor de "{{clientSector}}".
    3.  **Posicionamento:** Posicione a parceria com a CP Marketing como a solução estratégica para superar esse desafio e alcançar o **objetivo** de "{{clientObjective}}".
    4.  **Linguagem de Valor:** Use uma linguagem que inspire confiança e demonstre entendimento do negócio do cliente.

    Agora, gere o texto para o campo 'partnershipDescription'.
  `,
});

const partnershipFlow = ai.defineFlow(
  {
    name: 'partnershipFlow',
    inputSchema: GenerateProposalSubFlowInputSchema,
    outputSchema: GeneratePartnershipOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await partnershipPrompt(input);
        return output || { partnershipDescription: '' };
    } catch(error) {
        console.error(`Error in partnershipFlow for client ${input.clientName}:`, error);
        return { partnershipDescription: 'Erro ao gerar descrição da parceria.' };
    }
  }
);

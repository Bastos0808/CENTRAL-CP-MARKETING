
'use server';
/**
 * @fileOverview A Genkit flow to generate the "objectives" section of a marketing proposal.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { 
    GenerateProposalSubFlowInputSchema,
    GenerateObjectivesOutput,
    GenerateObjectivesOutputSchema
} from '@/ai/schemas/proposal-v2-schemas';

export async function generateObjectivesContent(
  input: z.infer<typeof GenerateProposalSubFlowInputSchema>
): Promise<GenerateObjectivesOutput> {
  return objectivesFlow(input);
}

const objectivesPrompt = ai.definePrompt({
  name: 'objectivesPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateProposalSubFlowInputSchema },
  output: { schema: GenerateObjectivesOutputSchema },
  prompt: `
    Você é um Estrategista de Vendas e Copywriter Sênior na agência "CP Marketing Digital".
    Sua tarefa é criar a seção "Nossos Objetivos" de uma proposta comercial para o cliente "{{clientName}}".

    **Contexto Estratégico do Cliente:**
    - **Setor da Empresa:** {{clientSector}}
    - **Maior Desafio Atual:** {{clientChallenge}}
    - **Público-Alvo:** {{clientAudience}}

    **Serviços Selecionados para a Proposta:**
    ---
    {{packagesString}}
    ---

    **Instruções Críticas:**
    1.  **Foco em Objetivos:** Gere uma **lista** de 4 a 5 objetivos claros e impactantes.
    2.  **Consequência Direta:** Cada item da lista deve ser uma consequência direta da implementação dos serviços selecionados para resolver o desafio do cliente.
    3.  **Linguagem de Valor:** Use uma linguagem que vende o resultado, não a tarefa.
    4.  **Exemplo:** Em vez de "Aumentar o número de seguidores", use "Construir uma comunidade engajada e qualificada que se identifica com a marca e se torna cliente fiel.".
    5.  **Formato:** A saída deve ser uma lista de strings. Não crie um texto corrido.

    Agora, gere a lista para o campo 'objectiveItems'.
  `,
});

const objectivesFlow = ai.defineFlow(
  {
    name: 'objectivesFlow',
    inputSchema: GenerateProposalSubFlowInputSchema,
    outputSchema: GenerateObjectivesOutputSchema,
  },
  async (input) => {
    const { output } = await objectivesPrompt(input);
    return output || { objectiveItems: [] };
  }
);

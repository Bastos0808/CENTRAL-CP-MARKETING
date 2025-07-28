
'use server';
/**
 * @fileOverview A conversational flow for discussing a client's data.
 *
 * - chatWithClientData: Handles the conversational interaction.
 */
import { ai } from '@/ai/genkit';
import {
  ClientChatInput,
  ClientChatInputSchema,
  ClientChatOutput,
  ClientChatOutputSchema,
} from '@/ai/schemas/client-chat-schemas';

export async function chatWithClientData(
  input: ClientChatInput
): Promise<ClientChatOutput> {
  return clientChatFlow(input);
}

const systemPrompt = `Você é um Estrategista de Marketing e assistente de IA da agência "CP Marketing Digital". Sua função é conversar com o usuário sobre os dados de um cliente específico, fornecendo insights, gerando ideias e respondendo a perguntas com base estritamente nas informações fornecidas.

Você receberá os dados completos do cliente (briefing e relatórios) e o histórico da conversa atual. Use este contexto para manter uma conversa útil e focada.

**Instruções:**
1.  **Seja um Assistente:** Aja como um parceiro de brainstorming. Seja proativo, mas sempre baseie suas respostas nos dados fornecidos.
2.  **Use o Contexto:** Refira-se ao briefing e aos relatórios do cliente para embasar suas respostas.
3.  **Mantenha o Foco:** Não invente informações. Se o usuário perguntar algo que não está nos dados, informe que a informação não está disponível no dossiê.
4.  **Seja Conversacional:** Mantenha um tom profissional, mas acessível e colaborativo.
5.  **Responda em Markdown:** Formate suas respostas usando Markdown para facilitar a leitura (listas, negrito, etc.).

**Dados do Cliente:**
- **Nome:** {{client.name}}
- **Briefing:**
  - **Descrição do Negócio:** {{client.briefing.negociosPosicionamento.descricao}}
  - **Diferencial:** {{client.briefing.negociosPosicionamento.diferencial}}
  - **Maior Desafio:** {{client.briefing.negociosPosicionamento.maiorDesafio}}
  - **Público Alvo:** {{client.briefing.publicoPersona.publicoAlvo}}
  - **Persona:** {{client.briefing.publicoPersona.persona}}
  - **Dores da Persona:** {{client.briefing.publicoPersona.dores}}
  - **Objetivo Principal:** {{client.briefing.metasObjetivos.objetivoPrincipal}}
- **Histórico de Relatórios:**
  {{#if client.reports}}
    {{#each client.reports}}
    - **Relatório de {{createdAt}}:** {{analysis}}
    {{/each}}
  {{else}}
    Nenhum relatório anterior.
  {{/if}}
`;

const clientChatFlow = ai.defineFlow(
  {
    name: 'clientChatFlow',
    inputSchema: ClientChatInputSchema,
    outputSchema: ClientChatOutputSchema,
  },
  async (input) => {
    const { history, client } = input;
    const userMessage = history.pop();

    if (!userMessage || userMessage.role !== 'user') {
      throw new Error('A última mensagem do histórico deve ser do usuário.');
    }
    
    const finalSystemPrompt = systemPrompt.replace('{{client.name}}', client.name)
        .replace('{{client.briefing.negociosPosicionamento.descricao}}', client.briefing?.negociosPosicionamento?.descricao || 'N/A')
        .replace('{{client.briefing.negociosPosicionamento.diferencial}}', client.briefing?.negociosPosicionamento?.diferencial || 'N/A')
        .replace('{{client.briefing.negociosPosicionamento.maiorDesafio}}', client.briefing?.negociosPosicionamento?.maiorDesafio || 'N/A')
        .replace('{{client.briefing.publicoPersona.publicoAlvo}}', client.briefing?.publicoPersona?.publicoAlvo || 'N/A')
        .replace('{{client.briefing.publicoPersona.persona}}', client.briefing?.publicoPersona?.persona || 'N/A')
        .replace('{{client.briefing.publicoPersona.dores}}', client.briefing?.publicoPersona?.dores || 'N/A')
        .replace('{{client.briefing.metasObjetivos.objetivoPrincipal}}', client.briefing?.metasObjetivos?.objetivoPrincipal || 'N/A')
        .replace('{{#if client.reports}}...{{/if}}', client.reports ? client.reports.map(r => `- Relatório de ${r.createdAt}: ${r.analysis}`).join('\n') : 'Nenhum relatório anterior.');


    const llmResponse = await ai.generate({
      prompt: userMessage.content,
      system: finalSystemPrompt,
      history,
    });

    return { response: llmResponse.text };
  }
);

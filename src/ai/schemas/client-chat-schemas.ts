
/**
 * @fileoverview Schemas and types for the client chat flow.
 */
import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const briefingSchema = z.object({
  negociosPosicionamento: z.object({
    descricao: z.string().optional(),
    diferencial: z.string().optional(),
    maiorDesafio: z.string().optional(),
  }).optional(),
  publicoPersona: z.object({
    publicoAlvo: z.string().optional(),
    persona: z.string().optional(),
    dores: z.string().optional(),
  }).optional(),
  metasObjetivos: z.object({
    objetivoPrincipal: z.string().optional(),
  }).optional(),
}).describe('O conteúdo do briefing do cliente.').optional();

const reportSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    analysis: z.string(),
}).describe('Um relatório de desempenho passado.');

const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  briefing: briefingSchema,
  reports: z.array(reportSchema).optional(),
}).describe('Os dados completos do cliente');


export const ClientChatInputSchema = z.object({
  client: clientSchema,
  history: z.array(messageSchema).describe('O histórico da conversa atual.'),
});
export type ClientChatInput = z.infer<typeof ClientChatInputSchema>;


export const ClientChatOutputSchema = z.object({
  response: z.string().describe('A resposta da IA para a mensagem do usuário.'),
});
export type ClientChatOutput = z.infer<typeof ClientChatOutputSchema>;

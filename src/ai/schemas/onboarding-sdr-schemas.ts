
/**
 * @fileoverview Schemas and types for the SDR onboarding message generator flow.
 */
import { z } from 'zod';

// Define the input schema for the flow
export const SdrMessageInputSchema = z.object({
  communicationChannel: z.enum(['whatsapp', 'email', 'linkedin']).describe('O canal que será usado para a comunicação.').optional(),
  decisionMakerName: z.string().min(1, 'O nome do decisor é obrigatório.').describe('O nome do tomador de decisão a quem a mensagem é dirigida.'),
  companyName: z.string().min(1, 'O nome da empresa é obrigatório.').describe('O nome da empresa do prospect.'),
  companySector: z.string().min(1, 'O setor da empresa é obrigatório.').describe('O setor de atuação da empresa do prospect.'),
  hook: z.string().describe('O "gancho" ou motivo personalizado para o contato. Ex: "Vi que participaram do evento X", "Notei que seu blog não é atualizado desde 2022".').optional(),
  valueOffer: z.enum(['consultoria', 'podcast', 'ambos']).describe('A oferta de valor que será utilizada como isca (consultoria gratuita, episódio de podcast, ou ambos).').optional(),
  observedProblem: z.string().describe('Uma breve descrição do problema ou oportunidade identificada na pesquisa sobre o prospect.').optional(),
});
export type SdrMessageInput = z.infer<typeof SdrMessageInputSchema>;

// Define the output schema for the flow
export const SdrMessageOutputSchema = z.object({
  messages: z.array(z.string()).describe(
    'Uma sequência de mensagens de prospecção (cadência) gerada pela IA.'
  ),
});
export type SdrMessageOutput = z.infer<typeof SdrMessageOutputSchema>;

/**
 * @fileoverview Schemas and types for the briefing generator flow.
 */
import { z } from 'zod';

const formSchema = z.object({
  informacoesOperacionais: z.object({
    nomeNegocio: z.string().optional(),
    planoContratado: z.string().optional(),
    observacoesPlano: z.string().optional(),
    redesSociaisAcesso: z.array(z.object({
        plataforma: z.string(),
        login: z.string(),
        senha: z.string(),
    })).optional(),
    possuiIdentidadeVisual: z.enum(['sim', 'nao']).optional(),
    possuiBancoImagens: z.enum(['sim', 'nao']).optional(),
    linksRelevantes: z.string().optional(),
  }),
  negociosPosicionamento: z.object({
    descricao: z.string().optional(),
    diferencial: z.string().optional(),
    missaoValores: z.string().optional(),
    ticketMedio: z.string().optional(),
    maiorDesafio: z.string().optional(),
    erroMercado: z.string().optional(),
  }),
  publicoPersona: z.object({
    publicoAlvo: z.string().optional(),
    persona: z.string().optional(),
    dores: z.string().optional(),
    duvidasObjecoes: z.string().optional(),
    impedimentoCompra: z.string().optional(),
    canaisUtilizados: z.string().optional(),
  }),
  concorrenciaMercado: z.object({
    principaisConcorrentes: z.array(z.object({
        name: z.string(),
        perfil: z.string(),
    })).optional(),
    inspiracoesPerfis: z.array(z.object({
        nome: z.string(),
        perfil: z.string(),
    })).optional(),
  }),
  comunicacaoExpectativas: z.object({
    investimentoAnterior: z.string().optional(),
    conteudosPreferidos: z.string().optional(),
    naoFazer: z.string().optional(),
    tomDeVoz: z.string().optional(),
  }),
  metasObjetivos: z.object({
    objetivoPrincipal: z.string().optional(),
    metasEspecificas: z.string().optional(),
    sazonalidade: z.string().optional(),
    verbaTrafego: z.string().optional(),
  }),
  equipeMidiaSocial: z.object({
    formatoConteudo: z.string().optional(),
    temasObrigatorios: z.string().optional(),
    disponibilidadeGravacao: z.string().optional(),
    responsavelGravacao: z.string().optional(),
    principaisGatilhos: z.string().optional(),
  }),
  equipeTrafegoPago: z.object({
    principalProdutoAnunciar: z.string().optional(),
    objetivoCampanhas: z.string().optional(),
    promocaoCondicao: z.string().optional(),
    localVeiculacao: z.string().optional(),
    limiteVerba: z.string().optional(),
  }),
}).describe('A estrutura completa do formulário de briefing.');


// Define the input schema for the flow
export const GenerateBriefingInputSchema = z.object({
  transcript: z.string().describe('A transcrição completa da reunião com o cliente.'),
});
export type GenerateBriefingInput = z.infer<typeof GenerateBriefingInputSchema>;

// Define the output schema for the flow
export const GenerateBriefingOutputSchema = z.object({
  briefing: formSchema.describe(
    'O objeto do briefing preenchido pela IA com base na transcrição.'
  ),
});
export type GenerateBriefingOutput = z.infer<typeof GenerateBriefingOutputSchema>;

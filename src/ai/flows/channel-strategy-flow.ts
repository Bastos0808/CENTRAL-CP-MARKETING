
'use server';
/**
 * @fileOverview A Genkit flow to analyze a prospect's channel (website, social media) based on a structured framework.
 *
 * - analyzeChannelStrategy: Provides a strategic analysis of a given URL and channel type, answering specific questions.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  ChannelStrategyInput,
  ChannelStrategyInputSchema,
  ChannelStrategyOutput,
  ChannelStrategyOutputSchema,
} from '@/ai/schemas/channel-strategy-schemas';

// Exported function that the frontend will call
export async function analyzeChannelStrategy(
  input: ChannelStrategyInput
): Promise<ChannelStrategyOutput> {
  return channelStrategyFlow(input);
}

// Define the prompt the AI will use, dynamically changing based on channel type
const channelStrategyPrompt = ai.definePrompt({
  name: 'channelStrategyPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: ChannelStrategyInputSchema },
  output: { schema: ChannelStrategyOutputSchema },
  prompt: `
    Você é um Estrategista de Marketing Sênior e um detetive de negócios. Sua missão é fazer um diagnóstico profundo e detalhado de um canal digital de um prospect, preenchendo um formulário de análise completo.

    A fonte primária de análise deve ser a imagem fornecida. Use-a para extrair o máximo de informações visuais possíveis.

    **Imagem para Análise:**
    {{#if screenshotDataUri}}
      {{media url=screenshotDataUri}}
    {{else}}
      Nenhuma imagem fornecida. Baseie sua análise nas melhores práticas para um canal do tipo **{{channelType}}**.
    {{/if}}

    O canal a ser analisado é um **{{channelType}}**.
    A URL (contexto adicional) é: **{{{channelUrl}}}**

    Preencha CADA CAMPO do objeto de saída 'analysis' com uma análise clara, objetiva e profissional. Baseie-se no framework abaixo correspondente ao tipo de canal.

    ---
    **Framework de Análise para {{channelType}} como 'Instagram'**

    1.  **analiseBio:** A bio está clara e otimizada? Ela comunica a proposta de valor em segundos? Possui uma chamada para ação (CTA) e um link relevante?
    2.  **analiseDestaques:** Os destaques são usados de forma estratégica? Eles funcionam como um menu, apresentando produtos, depoimentos, e informações importantes de forma organizada?
    3.  **qualidadeFeed:** A identidade visual do feed é coesa e profissional? As imagens e vídeos têm alta qualidade ou parecem amadores?
    4.  **estrategiaConteudo:** Qual é a estratégia de conteúdo aparente? Eles postam mais Reels, Carrosséis, posts estáticos? O conteúdo foca em educar, entreter ou vender? A frequência é consistente?
    5.  **usoDeReels:** Eles estão utilizando o formato que mais entrega alcance (Reels)? Os vídeos são bem editados, com legendas e áudio em alta, ou parecem improvisados?
    6.  **copywritingLegendas:** As legendas são bem escritas? Elas contam uma história, geram conexão e incluem CTAs claros, ou são apenas descritivas?
    7.  **engajamentoComunidade:** Como está o engajamento? Os posts têm curtidas e comentários? A empresa responde aos comentários, criando uma comunidade?
    8.  **pontosFortes:** Resuma os 2-3 principais pontos em que o canal se destaca.
    9.  **pontosFracos:** Resuma as 2-3 principais fraquezas ou oportunidades de melhoria que nossa agência poderia resolver.
    10. **ganchoDeAbordagem:** Com base na fraqueza mais crítica, crie uma frase de abordagem consultiva para o primeiro contato. Ex: "Notei que vocês têm uma fotografia de produto excelente, mas não encontrei conteúdo em vídeo. Existe uma razão estratégica para não explorarem o formato que mais engaja hoje?".

    ---
    **Framework de Análise para {{channelType}} como 'Website'**

    1.  **primeiraDobra:** A primeira impressão (o que se vê sem rolar a página) é impactante? A proposta de valor é imediatamente clara? O CTA principal é visível?
    2.  **propostaDeValor:** A mensagem principal do site responde claramente "O que você faz?", "Para quem?" e "Qual o diferencial?"?
    3.  **chamadasParaAcao:** Os botões (CTAs) são claros, visíveis e persuasivos? (Ex: "Fale com um especialista" vs "Clique aqui"). Existem CTAs em todas as seções importantes?
    4.  **clarezaNavegacao:** O menu é simples e intuitivo? É fácil para o usuário encontrar as informações que procura?
    5.  **otimizacaoSEO:** O site parece otimizado para o Google? Os títulos das páginas (title tags) são claros? As imagens têm texto alternativo? Existe um blog com conteúdo relevante?
    6.  **designResponsividade:** O layout é moderno e profissional ou parece datado? O site funciona bem e se adapta a telas de celular?
    7.  **provaSocial:** O site utiliza depoimentos, estudos de caso, logos de clientes ou outros elementos para gerar confiança e provar que a solução funciona?
    8.  **pontosFortes:** Resuma os 2-3 principais pontos em que o site se destaca.
    9.  **pontosFracos:** Resuma as 2-3 principais fraquezas que impactam a geração de leads ou a credibilidade do negócio.
    10. **ganchoDeAbordagem:** Com base no problema mais evidente (ex: design datado, falta de prova social), crie uma frase de abordagem. Ex: "Vi que a [Nome da Empresa] tem uma história incrível, mas senti que o design atual do site talvez não faça jus à qualidade do trabalho de vocês. Já pensaram em modernizá-lo?".

    ---
    **Framework de Análise para {{channelType}} como 'youtube'**
    
    1.  **identidadeVisualCanal:** O banner e o ícone do canal são profissionais e comunicam sobre o que é o canal? A identidade visual é consistente?
    2.  **qualidadeThumbnails:** As miniaturas (thumbnails) dos vídeos são atraentes, legíveis e chamam a atenção? Elas seguem um padrão visual, criando uma marca?
    3.  **titulosVideos:** Os títulos são otimizados para busca (SEO) e para a curiosidade? Eles usam palavras-chave que a audiência procuraria?
    4.  **qualidadeEdicao:** A edição dos vídeos é profissional? O áudio é claro? O ritmo é bom? Existem elementos visuais de apoio (gráficos, textos)?
    5.  **usoDeShorts:** O canal utiliza vídeos curtos (Shorts) para atrair novos inscritos? Os Shorts são cortes de vídeos longos ou conteúdo original?
    6.  **seoVideo:** As descrições dos vídeos são bem-feitas, com links relevantes e palavras-chave? As tags são usadas de forma estratégica?
    7.  **engajamentoComentarios:** O criador responde aos comentários? Existe uma comunidade se formando em torno do conteúdo?
    8.  **pontosFortes:** Resuma os 2-3 principais acertos na estratégia do YouTube.
    9.  **pontosFracos:** Resuma as 2-3 principais oportunidades perdidas (ex: thumbnails ruins, falta de SEO, áudio de baixa qualidade).
    10. **ganchoDeAbordagem:** Crie uma abordagem consultiva focada em vídeo. Ex: "Adorei o conteúdo do seu vídeo sobre [Tópico], mas sinto que as thumbnails atuais não estão no mesmo nível de qualidade, o que pode estar limitando seu alcance. Já pensaram em profissionalizar essa parte?".

    Agora, preencha o formulário de análise para o **{{channelType}}** em **{{{channelUrl}}}**.
  `
});

// Define the flow that orchestrates the call to the AI
const channelStrategyFlow = ai.defineFlow(
  {
    name: 'channelStrategyFlow',
    inputSchema: ChannelStrategyInputSchema,
    outputSchema: ChannelStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await channelStrategyPrompt(input);
    return output!;
  }
);

    
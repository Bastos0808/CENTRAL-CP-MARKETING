
'use server';
/**
 * @fileOverview A Genkit flow to analyze a prospect's channel (website, social media) based on a structured framework from an image.
 *
 * - analyzeChannelStrategy: Provides a strategic analysis of a given screenshot and channel type, answering specific questions.
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

    Sua fonte de informação são as IMAGENS e, se fornecido, o CÓDIGO HTML do site. Aja como se você estivesse vendo a tela e inspecionando o código. Analise cada detalhe visual, textual e estrutural para extrair o máximo de informações possíveis.

    **Instruções Críticas:**
    1.  **Preenchimento Obrigatório:** PREENCHA TODOS OS CAMPOS SOLICITADOS no framework de análise. Não deixe nenhum campo em branco.
    2.  **Inferência Inteligente:** Se uma informação para um campo específico não estiver 100% clara, use sua expertise para inferir a resposta mais provável com base no contexto.
    3.  **Aviso de Dados Insuficientes:** Se for impossível inferir uma resposta para um campo (por exemplo, a imagem não mostra os destaques do Instagram), preencha o campo com um aviso claro, como: "Não foi possível analisar este ponto devido à falta de informações visuais adequadas."
    4.  **Prioridade Máxima para Gancho e Oportunidades:** Independentemente dos avisos nos campos anteriores, você DEVE SEMPRE preencher os campos finais "oportunidades" e "gancho". Baseie-se na análise que foi possível realizar para gerar os insights mais valiosos.

    **Insumos para Análise:**
    {{#if (eq channelType "instagram")}}
        {{#if bioScreenshot}} - Print da Bio: {{media url=bioScreenshot}}{{/if}}
        {{#if highlightsScreenshot}} - Print dos Destaques: {{media url=highlightsScreenshot}}{{/if}}
        {{#if feedScreenshot}} - Print do Feed: {{media url=feedScreenshot}}{{/if}}
        {{#if reelsScreenshot}} - Print dos Reels: {{media url=reelsScreenshot}}{{/if}}
    {{/if}}
    {{#if (eq channelType "youtube")}}
        {{#if bannerScreenshot}} - Print do Banner: {{media url=bannerScreenshot}}{{/if}}
        {{#if videosScreenshot}} - Print dos Vídeos (Thumbnails): {{media url=videosScreenshot}}{{/if}}
        {{#if shortsScreenshot}} - Print dos Shorts: {{media url=shortsScreenshot}}{{/if}}
        {{#if descriptionScreenshot}} - Print da Descrição: {{media url=descriptionScreenshot}}{{/if}}
    {{/if}}
    
    {{#if (eq channelType "website")}}
      {{#if htmlContent}}
      **Código-Fonte HTML para Análise Estrutural e de SEO:**
      \`\`\`html
      {{{htmlContent}}}
      \`\`\`
      {{/if}}
    {{/if}}
    
    O canal a ser analisado é um **{{channelType}}**.

    Preencha CADA CAMPO do objeto de saída 'analysis' com uma análise clara, objetiva e profissional. Baseie-se no framework abaixo correspondente ao tipo de canal.

    **Após analisar todos os pontos, preencha os campos finais:**
    -   **oportunidades:** Liste de 2 a 4 oportunidades claras de melhoria, que nossa agência poderia resolver. Seja específico.
    -   **gancho:** Com base na oportunidade mais crítica, crie UMA frase de abordagem consultiva para o primeiro contato.

    ---
    **Framework de Análise para {{channelType}} como 'instagram'**

    1.  **analiseBio:** A bio está clara e otimizada? Ela comunica a proposta de valor em segundos? Possui uma chamada para ação (CTA) e um link relevante?
    2.  **analiseDestaques:** Os destaques são usados de forma estratégica? Eles funcionam como um menu, apresentando produtos, depoimentos, e informações importantes de forma organizada?
    3.  **qualidadeFeed:** A identidade visual do feed é coesa e profissional? As imagens e vídeos têm alta qualidade ou parecem amadores?
    4.  **estrategiaConteudo:** Qual é a estratégia de conteúdo aparente? Eles postam mais Reels, Carrosséis, posts estáticos? O conteúdo foca em educar, entreter ou vender? A frequência é consistente?
    5.  **usoDeReels:** Eles estão utilizando o formato que mais entrega alcance (Reels)? Os vídeos são bem editados, com legendas e áudio em alta, ou parecem improvisados?
    6.  **copywritingLegendas:** As legendas são bem escritas? Elas contam uma história, geram conexão e incluem CTAs claros, ou são apenas descritivas?
    7.  **engajamentoComunidade:** Como está o engajamento? Os posts têm curtidas e comentários? A empresa responde aos comentários, criando uma comunidade?

    ---
    **Framework de Análise para {{channelType}} como 'website'**

    1.  **primeiraDobra:** A primeira impressão (o que se vê sem rolar a página) é impactante? A proposta de valor é imediatamente clara? O CTA principal é visível?
    2.  **propostaDeValor:** A mensagem principal do site responde claramente "O que você faz?", "Para quem?" e "Qual o diferencial?"?
    3.  **chamadasParaAcao:** Os botões (CTAs) são claros, visíveis e persuasivos? (Ex: "Fale com um especialista" vs "Clique aqui"). Existem CTAs em todas as seções importantes?
    4.  **clarezaNavegacao:** O menu é simples e intuitivo? É fácil para o usuário encontrar as informações que procura?
    5.  **otimizacaoSEO:** Analisando o HTML, o site parece otimizado para o Google? Os títulos das páginas (title tags), meta descriptions e as imagens (alt tags) estão bem configurados? Existe um blog com conteúdo relevante?
    6.  **designResponsividade:** O layout é moderno e profissional ou parece datado? O site funciona bem e se adapta a telas de celular?
    7.  **provaSocial:** O site utiliza depoimentos, estudos de caso, logos de clientes ou outros elementos para gerar confiança e provar que a solução funciona?

    ---
    **Framework de Análise para {{channelType}} como 'youtube'**
    
    1.  **identidadeVisualCanal:** O banner e o ícone do canal são profissionais e comunicam sobre o que é o canal? A identidade visual é consistente?
    2.  **qualidadeThumbnails:** As miniaturas (thumbnails) dos vídeos são atraentes, legíveis e chamam a atenção? Elas seguem um padrão visual, criando uma marca?
    3.  **titulosVideos:** Os títulos são otimizados para busca (SEO) e para a curiosidade? Eles usam palavras-chave que a audiência procuraria?
    4.  **qualidadeEdicao:** A edição dos vídeos é profissional? O áudio é claro? O ritmo é bom? Existem elementos visuais de apoio (gráficos, textos)?
    5.  **usoDeShorts:** O canal utiliza vídeos curtos (Shorts) para atrair novos inscritos? Os Shorts são cortes de vídeos longos ou conteúdo original?
    6.  **seoVideo:** As descrições dos vídeos são bem-feitas, com links relevantes e palavras-chave? As tags são usadas de forma estratégica?
    7.  **engajamentoComentarios:** O criador responde aos comentários? Existe uma comunidade se formando em torno do conteúdo?

    Agora, preencha o formulário de análise para o canal do tipo **{{channelType}}**.
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

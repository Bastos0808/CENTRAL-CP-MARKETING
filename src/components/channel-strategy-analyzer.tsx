
"use client";

import { useState, useRef } from "react";
import Image from 'next/image';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeChannelStrategy } from "@/ai/flows/channel-strategy-flow";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
    Instagram, Youtube, Search, Globe, Loader2, Wand2, Copy, 
    Lightbulb, Target, BookOpen, Diamond, Tv, BarChart, 
    Video, MessageSquare, Users, Milestone, Megaphone, CheckCircle, 
    Eye, Image as ImageIcon, PenTool, Edit, SquarePlay, Paperclip, X, Info,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstagramAnalysisSchema, WebsiteAnalysisSchema, YouTubeAnalysisSchema } from "@/ai/schemas/channel-strategy-schemas";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";


type ChannelType = "instagram" | "website" | "youtube";

const formSchema = z.object({
  channelType: z.enum(["instagram", "website", "youtube"]),
  screenshotDataUri: z.string().min(1, 'O print da tela é obrigatório.'),
  analysis: z.union([InstagramAnalysisSchema, WebsiteAnalysisSchema, YouTubeAnalysisSchema]).optional(),
});


type FormValues = z.infer<typeof formSchema>;

const channelConfig = {
  instagram: {
    icon: Instagram,
    name: "Instagram",
    formSections: [
      { key: "analiseBio", label: "Análise da Bio", icon: BookOpen, prompt: "A bio comunica a proposta de valor? Tem CTA e link?", hint: "Verifique se a primeira linha deixa claro o que a empresa faz. Procure por uma chamada para ação (ex: 'Fale conosco') e se o link na bio é relevante e funcional (ex: link para o site, WhatsApp ou Linktree)." },
      { key: "analiseDestaques", label: "Análise dos Destaques", icon: Diamond, prompt: "São usados de forma estratégica? Funcionam como menu?", hint: "Analise se os destaques estão organizados, com capas padronizadas e se apresentam informações importantes como 'Quem Somos', 'Serviços', 'Depoimentos' e 'Contato'." },
      { key: "qualidadeFeed", label: "Qualidade do Feed", icon: Tv, prompt: "A identidade visual é coesa e profissional? A qualidade é alta?", hint: "Observe a paleta de cores, fontes e a qualidade geral das imagens e vídeos. O feed parece harmonioso e profissional ou uma colagem de posts aleatórios e amadores?" },
      { key: "estrategiaConteudo", label: "Estratégia de Conteúdo", icon: BarChart, prompt: "Qual o foco (educar, vender)? A frequência é boa?", hint: "Identifique os tipos de conteúdo mais comuns (dicas, bastidores, memes, ofertas). Eles postam com consistência ou o perfil parece abandonado?" },
      { key: "usoDeReels", label: "Uso de Reels", icon: Video, prompt: "Estão usando o formato? Os vídeos são bem editados?", hint: "Verifique se a empresa aproveita o formato de maior alcance do Instagram. Analise a qualidade da edição, se há legendas, boa iluminação e se o conteúdo é engajante." },
      { key: "copywritingLegendas", label: "Copywriting das Legendas", icon: MessageSquare, prompt: "As legendas geram conexão e têm CTAs claros?", hint: "As legendas são apenas descritivas ou contam uma história, fazem perguntas e incentivam a interação? Procure por chamadas para ação claras como 'Comente aqui' ou 'Clique no link da bio'." },
      { key: "engajamentoComunidade", label: "Engajamento", icon: Users, prompt: "A empresa responde aos comentários? Cria comunidade?", hint: "Veja se os posts têm curtidas e comentários. Mais importante: a empresa responde a esses comentários? Uma marca que dialoga cria uma comunidade fiel." },
      { key: "oportunidades", label: "Oportunidades de Melhoria", icon: Lightbulb, prompt: "Liste os principais pontos que a agência pode melhorar.", hint: "Com base em toda a análise, liste de 2 a 4 pontos de ação claros e específicos que nossa agência pode resolver para o cliente (ex: 'Profissionalizar a identidade visual do feed', 'Implementar uma estratégia de Reels focada em tutoriais', 'Otimizar a bio com um CTA mais direto')." },
      { key: "gancho", label: "Gancho de Prospecção", icon: Target, prompt: "Com base na principal oportunidade, crie uma frase de abordagem.", hint: "Transforme a oportunidade mais crítica em uma pergunta consultiva. Ex: 'Notei que seus Reels têm um ótimo conteúdo, mas a falta de legendas pode estar diminuindo o alcance. Já pensaram em otimizar isso?'" },
    ]
  },
  website: {
    icon: Globe,
    name: "Website",
    formSections: [
      { key: "primeiraDobra", label: "Primeira Dobra (Acima da dobra)", icon: Milestone, prompt: "A primeira impressão é impactante? A proposta de valor e o CTA são claros?", hint: "O que você vê sem rolar a página? A frase principal deixa claro o que a empresa faz? O botão principal (CTA) é óbvio e convidativo?" },
      { key: "propostaDeValor", label: "Proposta de Valor", icon: Megaphone, prompt: "O site responde claramente 'O que faz?', 'Para quem?' e 'Qual o diferencial?'", hint: "A mensagem central é fácil de entender em menos de 5 segundos? Um visitante novo consegue entender rapidamente o valor oferecido?" },
      { key: "chamadasParaAcao", label: "Chamadas para Ação (CTAs)", icon: CheckCircle, prompt: "Os botões são visíveis, persuasivos e estão em locais estratégicos?", hint: "Analise o texto dos botões (ex: 'Saiba Mais' vs 'Receber Diagnóstico Gratuito'). Eles estão presentes em todas as seções importantes da página?" },
      { key: "clarezaNavegacao", label: "Navegação e Usabilidade", icon: Eye, prompt: "O menu é simples e intuitivo? É fácil encontrar as informações?", hint: "O menu principal é claro e conciso? Um usuário consegue encontrar informações de contato ou sobre os serviços facilmente?" },
      { key: "otimizacaoSEO", label: "Otimização para SEO", icon: Search, prompt: "O site parece otimizado? (Títulos, blog, etc.)", hint: "Verifique os títulos das páginas na aba do navegador. Existe um blog com conteúdo relevante para o público-alvo? As imagens parecem otimizadas?" },
      { key: "designResponsividade", label: "Design e Responsividade", icon: Tv, prompt: "O layout é moderno? Funciona bem em celulares?", hint: "O site parece atual ou datado? Abra o site em um celular (ou use a ferramenta de desenvolvedor do navegador) para verificar se a experiência é boa." },
      { key: "provaSocial", label: "Prova Social", icon: Users, prompt: "O site usa depoimentos, cases ou logos de clientes para gerar confiança?", hint: "Procure por seções de depoimentos, estudos de caso, logos de clientes atendidos ou números que comprovem a eficácia da empresa. A ausência disso é uma grande fraqueza." },
      { key: "oportunidades", label: "Oportunidades de Melhoria", icon: Lightbulb, prompt: "Liste os principais pontos que a agência pode melhorar.", hint: "Com base em toda a análise, liste de 2 a 4 pontos de ação claros e específicos que nossa agência pode resolver para o cliente (ex: 'Modernizar o design para refletir a qualidade da marca', 'Adicionar uma seção de prova social com depoimentos', 'Melhorar os CTAs para focar na geração de leads')." },
      { key: "gancho", label: "Gancho de Prospecção", icon: Target, prompt: "Crie uma abordagem focada em como a melhoria do site pode impactar os negócios.", hint: "Transforme a oportunidade mais crítica em uma pergunta de negócio. Ex: 'Vi que o site de vocês tem um conteúdo excelente, mas o design parece não refletir a qualidade da marca. Já pensaram em como um site moderno poderia aumentar a conversão?'" },
    ]
  },
  youtube: {
    icon: Youtube,
    name: "YouTube",
    formSections: [
        { key: "identidadeVisualCanal", label: "Identidade Visual do Canal", icon: PenTool, prompt: "O banner e o ícone do canal são profissionais e alinhados?", hint: "O banner do canal comunica claramente sobre o que são os vídeos? A foto de perfil (ícone) é profissional e de alta qualidade?" },
        { key: "qualidadeThumbnails", label: "Qualidade das Thumbnails", icon: ImageIcon, prompt: "As miniaturas são atraentes, legíveis e seguem um padrão?", hint: "As miniaturas (capas dos vídeos) são o principal fator para o clique. Elas são chamativas, usam fontes grandes e legíveis, e têm um estilo consistente que cria uma identidade para o canal?" },
        { key: "titulosVideos", label: "Títulos dos Vídeos", icon: Edit, prompt: "Os títulos são otimizados para SEO e geram curiosidade?", hint: "Os títulos usam palavras-chave que o público-alvo buscaria? Eles são escritos para despertar a curiosidade ou são apenas descritivos e sem graça?" },
        { key: "qualidadeEdicao", label: "Qualidade da Edição", icon: Video, prompt: "O ritmo, áudio e elementos visuais dos vídeos são profissionais?", hint: "A qualidade do som é boa (sem ruídos)? A edição é dinâmica, com cortes, zoom e talvez alguns gráficos (motion graphics)? Ou os vídeos são longos e monótonos?" },
        { key: "usoDeShorts", label: "Uso de Shorts", icon: SquarePlay, prompt: "O canal utiliza vídeos curtos para atrair novos inscritos?", hint: "Verifique se o canal posta 'Shorts' (vídeos curtos na vertical). É a principal ferramenta do YouTube para alcançar um público novo que ainda não conhece o canal." },
        { key: "seoVideo", label: "SEO dos Vídeos", icon: Search, prompt: "As descrições e tags são usadas de forma estratégica?", hint: "Abra a descrição de alguns vídeos. Ela é bem-feita, com um resumo, links importantes e uso de palavras-chave? Isso é crucial para o YouTube entender e recomendar o vídeo." },
        { key: "engajamentoComentarios", label: "Engajamento nos Comentários", icon: MessageSquare, prompt: "O criador interage com a comunidade nos comentários?", hint: "O dono do canal responde aos comentários, dá 'coração' e cria uma conversa? Isso mostra que ele se importa com a comunidade e incentiva mais interações." },
        { key: "oportunidades", label: "Oportunidades de Melhoria", icon: Lightbulb, prompt: "Liste os principais pontos que a agência pode melhorar.", hint: "Com base em toda a análise, liste de 2 a 4 pontos de ação claros e específicos que nossa agência pode resolver para o cliente (ex: 'Profissionalizar as thumbnails para aumentar a taxa de cliques', 'Otimizar o SEO dos vídeos para ser encontrado pelo público certo', 'Melhorar a qualidade de áudio das gravações')." },
        { key: "gancho", label: "Gancho de Prospecção", icon: Target, prompt: "Crie uma abordagem consultiva focada em vídeo.", hint: "Transforme o ponto fraco mais crítico em uma pergunta consultiva. Ex: 'Adorei seu conteúdo sobre X, mas sinto que as thumbnails não fazem jus à qualidade do vídeo. Já pensaram em como profissionalizar isso para aumentar os cliques?'" },
    ]
  },
};


export default function ChannelStrategyAnalyzer() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelType: 'instagram',
      screenshotDataUri: undefined,
      analysis: undefined
    }
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            toast({
                title: "Arquivo muito grande",
                description: "Por favor, selecione uma imagem com menos de 4MB.",
                variant: "destructive"
            });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            form.setValue('screenshotDataUri', dataUri);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
      form.setValue('screenshotDataUri', undefined, { shouldValidate: true });
      form.setValue('analysis', undefined);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }


  const handleAnalyze = async (values: FormValues) => {
    setLoading(true);
    form.setValue('analysis', undefined);

    try {
      const result = await analyzeChannelStrategy({ 
          channelType: values.channelType,
          screenshotDataUri: values.screenshotDataUri,
      });
      form.setValue(`analysis`, result.analysis, { shouldValidate: true });
      toast({
        title: "Análise Concluída!",
        description: `A IA analisou o canal e preencheu o formulário.`,
      });
    } catch (error) {
      console.error(`Error analyzing channel:`, error);
      toast({
        title: "Erro na Análise",
        description: `Não foi possível analisar o canal. Verifique os dados e tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const analysis = form.getValues(`analysis`);
    const channelType = form.getValues('channelType');
    const config = channelConfig[channelType];

    if (!analysis) return;
    
    const analysisText = config.formSections.map(section => {
        const value = analysis[section.key as keyof typeof analysis];
        if (Array.isArray(value)) {
             return `**${section.label.toUpperCase()}**\n${value.map(v => `- ${v}`).join('\n') || 'Não preenchido'}`;
        }
        return `**${section.label.toUpperCase()}**\n${value || 'Não preenchido'}`;
    }).join('\n\n---\n');

    const text = `
**Diagnóstico Estratégico de Canal: ${config.name}**
---
${analysisText}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      title: "Análise Copiada!",
      description: `O diagnóstico de ${config.name} foi copiado.`,
    });
  }
  
  const watchedChannelType = form.watch('channelType');
  const watchedScreenshot = form.watch('screenshotDataUri');
  const analysis = form.watch('analysis');
  const currentConfig = channelConfig[watchedChannelType];

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuração da Análise</CardTitle>
                    <CardDescription>Escolha o tipo de canal e anexe um print (screenshot) da tela para a IA analisar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="channelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Canal</FormLabel>
                                <FormControl>
                                    <Tabs
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value as ChannelType)}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="instagram"><Instagram className="mr-2"/> Instagram</TabsTrigger>
                                            <TabsTrigger value="website"><Globe className="mr-2"/> Website</TabsTrigger>
                                            <TabsTrigger value="youtube"><Youtube className="mr-2"/> YouTube</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="screenshotDataUri"
                        render={({ field }) => (
                            <FormItem>
                               <FormLabel>Print da Tela do Canal</FormLabel>
                               {watchedScreenshot ? (
                                  <div className="relative group w-fit">
                                      <Image src={watchedScreenshot} alt="Preview do print" width={300} height={200} className="rounded-md object-contain max-h-48 w-full border" />
                                      <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={handleRemoveScreenshot}
                                      >
                                          <X className="h-3 w-3" />
                                      </Button>
                                  </div>
                              ) : (
                                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto">
                                      <Paperclip className="mr-2 h-4 w-4" />
                                      Anexar Print
                                  </Button>
                              )}
                               <FormControl>
                                  <input
                                      type="file"
                                      ref={fileInputRef}
                                      className="hidden"
                                      accept="image/png, image/jpeg, image/webp"
                                      onChange={handleFileChange}
                                  />
                               </FormControl>
                               <FormMessage />
                           </FormItem>
                        )}
                    />

                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                 <Button type="submit" disabled={loading || !watchedScreenshot}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Analisar com IA
                 </Button>
                 {analysis && (
                    <Button type="button" variant="outline" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4"/>
                    </Button>
                 )}
            </div>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Análise - {currentConfig.name}</CardTitle>
                  <CardDescription>Respostas geradas pela IA com base na imagem. Você pode editar os campos antes de copiar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TooltipProvider>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-4">
                        {currentConfig.formSections.map(({ key, label, icon: Icon, prompt, hint }) => {
                          const isOpportunityField = key === 'oportunidades';
                          const isHookField = key === 'gancho';
                          const isRegularField = !isOpportunityField && !isHookField;
                          
                          const fieldClassName = cn({
                            "md:col-span-2": isOpportunityField || isHookField
                          });
                          
                          return (
                            <div key={key} className={fieldClassName}>
                                <Label className="flex items-center gap-2 mb-2 font-semibold text-primary/90">
                                    <Icon className="h-5 w-5" />
                                    {label}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="cursor-help text-muted-foreground hover:text-primary">
                                                <Info className="h-4 w-4" />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs" side="top">
                                            <p>{hint}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </Label>

                                {isRegularField && <Controller
                                    name={`analysis.${key as keyof typeof analysis}`}
                                    control={form.control}
                                    render={({ field }) => <Textarea id={`analysis-${key}`} {...field} placeholder={prompt} className="min-h-[100px] text-sm" value={field.value || ''} />}
                                />}

                                {isOpportunityField && (
                                  <div className="space-y-2">
                                     {Array.isArray(analysis.oportunidades) && analysis.oportunidades.length > 0 ? (
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                           {(analysis.oportunidades as string[]).map((opp, index) => (
                                                <li key={index}>{opp}</li>
                                            ))}
                                        </ul>
                                     ) : (
                                        <p className="text-sm text-muted-foreground">Nenhuma oportunidade identificada pela IA.</p>
                                     )}
                                  </div>
                                )}

                                {isHookField && (
                                    <div className="p-3 rounded-md bg-muted/50 border">
                                        <p className="text-sm text-foreground">{analysis.gancho || 'Nenhum gancho gerado.'}</p>
                                    </div>
                                )}
                            </div>
                        )})}
                      </div>
                    </TooltipProvider>
                </CardContent>
              </Card>
            )}

        </form>
      </Form>
  );
}

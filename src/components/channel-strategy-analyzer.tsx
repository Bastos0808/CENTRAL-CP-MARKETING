
"use client";

import { useState, useRef } from "react";
import Image from 'next/image';
import { useForm, Controller } from "react-hook-form";
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
    ThumbsUp, ThumbsDown, Target, BookOpen, Diamond, Tv, BarChart, 
    Video, MessageSquare, Users, Milestone, Megaphone, CheckCircle, 
    Eye, Image as ImageIcon, PenTool, Edit, SquarePlay, Paperclip, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstagramAnalysisSchema, WebsiteAnalysisSchema, YouTubeAnalysisSchema } from "@/ai/schemas/channel-strategy-schemas";


type ChannelType = "instagram" | "website" | "youtube";

const formSchema = z.object({
  instagram: z.object({
    url: z.string().optional(),
    screenshotDataUri: z.string().optional(),
    analysis: InstagramAnalysisSchema.optional(),
  }).optional(),
  website: z.object({
    url: z.string().optional(),
    screenshotDataUri: z.string().optional(),
    analysis: WebsiteAnalysisSchema.optional(),
  }).optional(),
  youtube: z.object({
    url: z.string().optional(),
    screenshotDataUri: z.string().optional(),
    analysis: YouTubeAnalysisSchema.optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const channelConfig = {
  instagram: {
    icon: Instagram,
    name: "Instagram",
    formSections: [
      { key: "analiseBio", label: "Análise da Bio", icon: BookOpen, prompt: "A bio comunica a proposta de valor? Tem CTA e link?" },
      { key: "analiseDestaques", label: "Análise dos Destaques", icon: Diamond, prompt: "São usados de forma estratégica? Funcionam como menu?" },
      { key: "qualidadeFeed", label: "Qualidade do Feed", icon: Tv, prompt: "A identidade visual é coesa e profissional? A qualidade é alta?" },
      { key: "estrategiaConteudo", label: "Estratégia de Conteúdo", icon: BarChart, prompt: "Qual o foco (educar, vender)? A frequência é boa?" },
      { key: "usoDeReels", label: "Uso de Reels", icon: Video, prompt: "Estão usando o formato? Os vídeos são bem editados?" },
      { key: "copywritingLegendas", label: "Copywriting das Legendas", icon: MessageSquare, prompt: "As legendas geram conexão e têm CTAs claros?" },
      { key: "engajamentoComunidade", label: "Engajamento", icon: Users, prompt: "A empresa responde aos comentários? Cria comunidade?" },
      { key: "pontosFortes", label: "Pontos Fortes (Resumo)", icon: ThumbsUp, prompt: "Resuma os 2-3 principais acertos do canal." },
      { key: "pontosFracos", label: "Pontos Fracos (Oportunidades)", icon: ThumbsDown, prompt: "Resuma as 2-3 principais fraquezas que podemos resolver." },
      { key: "ganchoDeAbordagem", label: "Gancho de Prospecção", icon: Target, prompt: "Com base na principal fraqueza, crie uma frase de abordagem." },
    ]
  },
  website: {
    icon: Globe,
    name: "Website",
    formSections: [
      { key: "primeiraDobra", label: "Primeira Dobra (Acima da dobra)", icon: Milestone, prompt: "A primeira impressão é impactante? A proposta de valor e o CTA são claros?" },
      { key: "propostaDeValor", label: "Proposta de Valor", icon: Megaphone, prompt: "O site responde claramente 'O que faz?', 'Para quem?' e 'Qual o diferencial?'" },
      { key: "chamadasParaAcao", label: "Chamadas para Ação (CTAs)", icon: CheckCircle, prompt: "Os botões são visíveis, persuasivos e estão em locais estratégicos?" },
      { key: "clarezaNavegacao", label: "Navegação e Usabilidade", icon: Eye, prompt: "O menu é simples e intuitivo? É fácil encontrar as informações?" },
      { key: "otimizacaoSEO", label: "Otimização para SEO", icon: Search, prompt: "O site parece otimizado? (Títulos, blog, etc.)" },
      { key: "designResponsividade", label: "Design e Responsividade", icon: Tv, prompt: "O layout é moderno? Funciona bem em celulares?" },
      { key: "provaSocial", label: "Prova Social", icon: Users, prompt: "O site usa depoimentos, cases ou logos de clientes para gerar confiança?" },
      { key: "pontosFortes", label: "Pontos Fortes (Resumo)", icon: ThumbsUp, prompt: "Resuma os 2-3 principais acertos do site." },
      { key: "pontosFracos", label: "Pontos Fracos (Oportunidades)", icon: ThumbsDown, prompt: "Resuma as 2-3 principais fraquezas que impactam o negócio." },
      { key: "ganchoDeAbordagem", label: "Gancho de Prospecção", icon: Target, prompt: "Crie uma abordagem focada em como a melhoria do site pode impactar os negócios." },
    ]
  },
  youtube: {
    icon: Youtube,
    name: "YouTube",
    formSections: [
        { key: "identidadeVisualCanal", label: "Identidade Visual do Canal", icon: PenTool, prompt: "O banner e o ícone do canal são profissionais e alinhados?" },
        { key: "qualidadeThumbnails", label: "Qualidade das Thumbnails", icon: ImageIcon, prompt: "As miniaturas são atraentes, legíveis e seguem um padrão?" },
        { key: "titulosVideos", label: "Títulos dos Vídeos", icon: Edit, prompt: "Os títulos são otimizados para SEO e geram curiosidade?" },
        { key: "qualidadeEdicao", label: "Qualidade da Edição", icon: Video, prompt: "O ritmo, áudio e elementos visuais dos vídeos são profissionais?" },
        { key: "usoDeShorts", label: "Uso de Shorts", icon: SquarePlay, prompt: "O canal utiliza vídeos curtos para atrair novos inscritos?" },
        { key: "seoVideo", label: "SEO dos Vídeos", icon: Search, prompt: "As descrições e tags são usadas de forma estratégica?" },
        { key: "engajamentoComentarios", label: "Engajamento nos Comentários", icon: MessageSquare, prompt: "O criador interage com a comunidade nos comentários?" },
        { key: "pontosFortes", label: "Pontos Fortes (Resumo)", icon: ThumbsUp, prompt: "Resuma os 2-3 principais acertos na estratégia do YouTube." },
        { key: "pontosFracos", label: "Pontos Fracos (Oportunidades)", icon: ThumbsDown, prompt: "Resuma as principais oportunidades perdidas." },
        { key: "ganchoDeAbordagem", label: "Gancho de Prospecção", icon: Target, prompt: "Crie uma abordagem consultiva focada em vídeo." },
    ]
  },
};


export default function ChannelStrategyAnalyzer() {
  const [loadingChannel, setLoadingChannel] = useState<ChannelType | null>(null);
  const { toast } = useToast();
  const fileInputRefs = {
    instagram: useRef<HTMLInputElement>(null),
    website: useRef<HTMLInputElement>(null),
    youtube: useRef<HTMLInputElement>(null),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: { url: '', analysis: {}, screenshotDataUri: undefined },
      website: { url: '', analysis: {}, screenshotDataUri: undefined },
      youtube: { url: '', analysis: {}, screenshotDataUri: undefined },
    }
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, channel: ChannelType) => {
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
            form.setValue(`${channel}.screenshotDataUri`, dataUri);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = (channel: ChannelType) => {
      form.setValue(`${channel}.screenshotDataUri`, undefined);
      const ref = fileInputRefs[channel];
      if (ref.current) {
          ref.current.value = '';
      }
  }


  const handleAnalyze = async (channel: ChannelType) => {
    const url = form.getValues(`${channel}.url`);
    const screenshot = form.getValues(`${channel}.screenshotDataUri`);
    
    if (!url || !url.startsWith('http')) {
      toast({
        title: "URL Inválida",
        description: `Por favor, insira uma URL válida para ${channelConfig[channel].name}.`,
        variant: "destructive",
      });
      return;
    }
    
     if (!screenshot) {
      toast({
        title: "Print da Tela Faltando",
        description: `Por favor, anexe um print da tela do canal para a IA analisar.`,
        variant: "destructive",
      });
      return;
    }

    setLoadingChannel(channel);

    try {
      const result = await analyzeChannelStrategy({ 
          channelUrl: url, 
          channelType: channel,
          screenshotDataUri: screenshot,
      });
      form.setValue(`${channel}.analysis`, result.analysis, { shouldValidate: true });
      toast({
        title: "Análise Concluída!",
        description: `A IA analisou o canal e preencheu o formulário.`,
      });
    } catch (error) {
      console.error(`Error analyzing ${channel}:`, error);
      toast({
        title: "Erro na Análise",
        description: `Não foi possível analisar o canal. Verifique os dados e tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setLoadingChannel(null);
    }
  };

  const copyToClipboard = (channel: ChannelType) => {
    const analysis = form.getValues(`${channel}.analysis`);
    const url = form.getValues(`${channel}.url`);
    const config = channelConfig[channel];

    if (!analysis) return;
    
    const analysisText = config.formSections.map(section => {
        const value = analysis[section.key as keyof typeof analysis];
        return `**${section.label.toUpperCase()}**\n${value || 'Não preenchido'}`;
    }).join('\n\n---\n');

    const text = `
**Diagnóstico Estratégico de Canal: ${config.name}**
**URL:** ${url}

---
${analysisText}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      title: "Análise Copiada!",
      description: `O diagnóstico de ${config.name} foi copiado.`,
    });
  }


  const renderChannelTab = (channel: ChannelType) => {
    const config = channelConfig[channel];
    const isLoading = loadingChannel === channel;
    const analysisExists = !!form.watch(`${channel}.analysis`);
    const screenshotPreview = form.watch(`${channel}.screenshotDataUri`);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <config.icon className="h-6 w-6 text-primary" />
            <CardTitle>{config.name}</CardTitle>
          </div>
          <CardDescription>Insira a URL, anexe um print da tela e gere uma análise com IA ou preencha o formulário manualmente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor={`${channel}-url`} className="mb-2 block">URL do Canal</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Controller
                  name={`${channel}.url`}
                  control={form.control}
                  render={({ field }) => (
                      <Input id={`${channel}-url`} placeholder={`https://www.${channel}.com/prospect`} {...field} className="pl-10" />
                  )}
                />
              </div>
            </div>
             <div className="flex-1 w-full">
                <Label className="mb-2 block">Print da Tela</Label>
                {screenshotPreview ? (
                    <div className="relative group">
                        <Image src={screenshotPreview} alt="Preview do print" width={200} height={150} className="rounded-md object-contain max-h-24 w-full border" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveScreenshot(channel)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <Button type="button" variant="outline" onClick={() => fileInputRefs[channel].current?.click()} className="w-full">
                        <Paperclip className="mr-2 h-4 w-4" />
                        Anexar Print
                    </Button>
                )}
                <input
                    type="file"
                    ref={fileInputRefs[channel]}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => handleFileChange(e, channel)}
                />
            </div>
            <div className="flex w-full md:w-auto items-end h-full gap-2 pt-2 md:pt-0">
                <Button onClick={() => handleAnalyze(channel)} disabled={isLoading} className="w-full md:w-auto self-end">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {isLoading ? "Analisando..." : "Analisar com IA"}
                </Button>
                {analysisExists && (
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(channel)} className="self-end">
                        <Copy className="h-4 w-4"/>
                    </Button>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-4 border-t">
            {config.formSections.map(({ key, label, icon: Icon, prompt }) => {
              const isSummaryField = key.includes('pontos') || key.includes('gancho');
              return (
                <div key={key} className={cn(isSummaryField ? "md:col-span-2" : "")}>
                  <Label htmlFor={`${channel}-${key}`} className="flex items-center gap-2 mb-2 font-semibold text-primary/90">
                      <Icon className="h-5 w-5" />
                      {label}
                  </Label>
                  <Controller
                    name={`${channel}.analysis.${key as keyof typeof analysisExists}`}
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        id={`${channel}-${key}`}
                        {...field}
                        placeholder={prompt}
                        className="min-h-[100px] text-sm"
                      />
                    )}
                  />
                </div>
            )})}
          </div>

        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="instagram" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="instagram"><Instagram className="mr-2"/> Instagram</TabsTrigger>
        <TabsTrigger value="website"><Globe className="mr-2"/> Website</TabsTrigger>
        <TabsTrigger value="youtube"><Youtube className="mr-2"/> YouTube</TabsTrigger>
      </TabsList>
      <TabsContent value="instagram" className="mt-4">
        {renderChannelTab("instagram")}
      </TabsContent>
      <TabsContent value="website" className="mt-4">
        {renderChannelTab("website")}
      </TabsContent>
      <TabsContent value="youtube" className="mt-4">
        {renderChannelTab("youtube")}
      </TabsContent>
    </Tabs>
  );
}

    
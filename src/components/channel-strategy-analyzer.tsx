
"use client";

import { useState } from "react";
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
    Instagram, Linkedin, Search, Globe, Loader2, Wand2, Copy, 
    ThumbsUp, ThumbsDown, Target, BookOpen, Diamond, Tv, BarChart, 
    Video, MessageSquare, Users, Milestone, Megaphone, CheckCircle, 
    Eye, User, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstagramAnalysisSchema, WebsiteAnalysisSchema, LinkedInAnalysisSchema } from "@/ai/schemas/channel-strategy-schemas";


type ChannelType = "instagram" | "website" | "linkedin";

const formSchema = z.object({
  instagram: z.object({
    url: z.string().optional(),
    analysis: InstagramAnalysisSchema.optional(),
  }).optional(),
  website: z.object({
    url: z.string().optional(),
    analysis: WebsiteAnalysisSchema.optional(),
  }).optional(),
  linkedin: z.object({
    url: z.string().optional(),
    analysis: LinkedInAnalysisSchema.optional(),
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
  linkedin: {
    icon: Linkedin,
    name: "LinkedIn",
    formSections: [
        { key: "perfilDoDecisor", label: "Perfil do Decisor", icon: User, prompt: "O perfil do decisor está otimizado? (Foto, título, sobre)" },
        { key: "companyPage", label: "Company Page", icon: Building, prompt: "A página da empresa está completa e ativa? Compartilha conteúdo relevante?" },
        { key: "estrategiaConteudo", label: "Estratégia de Conteúdo", icon: BarChart, prompt: "Postam conteúdo de autoridade? A frequência é consistente?" },
        { key: "engajamentoRede", label: "Engajamento na Rede", icon: MessageSquare, prompt: "Interagem com outros, participam de discussões ou são passivos?" },
        { key: "networking", label: "Networking Estratégico", icon: Users, prompt: "A rede de conexões do decisor parece estratégica e alinhada ao público-alvo?" },
        { key: "pontosFortes", label: "Pontos Fortes (Resumo)", icon: ThumbsUp, prompt: "Resuma os 2-3 principais acertos na estratégia do LinkedIn." },
        { key: "pontosFracos", label: "Pontos Fracos (Oportunidades)", icon: ThumbsDown, prompt: "Resuma as principais oportunidades perdidas (ex: perfil abandonado)." },
        { key: "ganchoDeAbordagem", label: "Gancho de Prospecção", icon: Target, prompt: "Crie uma abordagem B2B consultiva focada em autoridade ou geração de leads." },
    ]
  },
};


export default function ChannelStrategyAnalyzer() {
  const [loadingChannel, setLoadingChannel] = useState<ChannelType | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: { url: '', analysis: {} },
      website: { url: '', analysis: {} },
      linkedin: { url: '', analysis: {} },
    }
  });

  const handleAnalyze = async (channel: ChannelType) => {
    const url = form.getValues(`${channel}.url`);
    if (!url || !url.startsWith('http')) {
      toast({
        title: "URL Inválida",
        description: `Por favor, insira uma URL válida para ${channelConfig[channel].name}.`,
        variant: "destructive",
      });
      return;
    }

    setLoadingChannel(channel);

    try {
      const result = await analyzeChannelStrategy({ channelUrl: url, channelType: channel });
      form.setValue(`${channel}.analysis`, result.analysis, { shouldValidate: true });
      toast({
        title: "Análise Concluída!",
        description: `A IA analisou o canal e preencheu o formulário.`,
      });
    } catch (error) {
      console.error(`Error analyzing ${channel}:`, error);
      toast({
        title: "Erro na Análise",
        description: `Não foi possível analisar o canal. Verifique a URL e tente novamente.`,
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

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <config.icon className="h-6 w-6 text-primary" />
            <CardTitle>{config.name}</CardTitle>
          </div>
          <CardDescription>Insira a URL do canal, gere uma análise com IA ou preencha o formulário manualmente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Controller
                name={`${channel}.url`}
                control={form.control}
                render={({ field }) => (
                    <Input placeholder={`https://www.${channel}.com/prospect`} {...field} className="pl-10" />
                )}
              />
            </div>
            <Button onClick={() => handleAnalyze(channel)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isLoading ? "Analisando..." : "Analisar com IA"}
            </Button>
            {analysisExists && (
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(channel)}>
                    <Copy className="h-4 w-4"/>
                </Button>
            )}
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
        <TabsTrigger value="linkedin"><Linkedin className="mr-2"/> LinkedIn</TabsTrigger>
      </TabsList>
      <TabsContent value="instagram" className="mt-4">
        {renderChannelTab("instagram")}
      </TabsContent>
      <TabsContent value="website" className="mt-4">
        {renderChannelTab("website")}
      </TabsContent>
      <TabsContent value="linkedin" className="mt-4">
        {renderChannelTab("linkedin")}
      </TabsContent>
    </Tabs>
  );
}

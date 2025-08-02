
"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Instagram, Linkedin, Search, Globe, Loader2, Wand2, Copy, ThumbsUp, ThumbsDown, Target } from "lucide-react";
import { ChannelStrategyOutput } from "@/ai/schemas/channel-strategy-schemas";
import { cn } from "@/lib/utils";


type ChannelType = "instagram" | "website" | "linkedin";

const analysisSchema = z.object({
  strengths: z.string(),
  weaknesses: z.string(),
  hook: z.string(),
});

const formSchema = z.object({
  instagram: z.object({
    url: z.string().optional(),
    analysis: analysisSchema.optional(),
  }).optional(),
  website: z.object({
    url: z.string().optional(),
    analysis: analysisSchema.optional(),
  }).optional(),
  linkedin: z.object({
    url: z.string().optional(),
    analysis: analysisSchema.optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const channelConfig = {
  instagram: {
    icon: Instagram,
    name: "Instagram",
    questions: [
      { key: "strengths", label: "Pontos Fortes", icon: ThumbsUp, color: "green", prompt: "Quais são os pontos fortes mais evidentes deste perfil? (Ex: Identidade visual, frequência, qualidade das fotos)" },
      { key: "weaknesses", label: "Pontos Fracos / Dores", icon: ThumbsDown, color: "red", prompt: "Quais são as fraquezas e oportunidades de melhoria mais claras? (Ex: Falta de vídeos, bio confusa, sem CTA, engajamento baixo)" },
      { key: "hook", label: "Gancho de Prospecção", icon: Target, color: "blue", prompt: "Com base nas fraquezas, crie uma frase de abordagem consultiva para iniciar a conversa." },
    ]
  },
  website: {
    icon: Globe,
    name: "Website",
    questions: [
      { key: "strengths", label: "Pontos Fortes", icon: ThumbsUp, color: "green", prompt: "O que o site faz bem? (Ex: Design moderno, carregamento rápido, mensagem clara, bom SEO)" },
      { key: "weaknesses", label: "Pontos Fracos / Dores", icon: ThumbsDown, color: "red", prompt: "Quais são os principais problemas do site? (Ex: Layout antigo, não responsivo, falta de blog, CTAs inexistentes, difícil navegação)" },
      { key: "hook", label: "Gancho de Prospecção", icon: Target, color: "blue", prompt: "Crie uma abordagem focada em como a melhoria do site pode impactar os negócios do prospect." },
    ]
  },
  linkedin: {
    icon: Linkedin,
    name: "LinkedIn",
    questions: [
      { key: "strengths", label: "Pontos Fortes", icon: ThumbsUp, color: "green", prompt: "Quais os pontos fortes do perfil do decisor ou da company page? (Ex: Perfil completo, posta com frequência, bom networking)" },
      { key: "weaknesses", label: "Pontos Fracos / Dores", icon: ThumbsDown, color: "red", prompt: "Onde estão as oportunidades? (Ex: Perfil desatualizado, sem conteúdo de autoridade, não engaja com a rede, company page abandonada)" },
      { key: "hook", label: "Gancho de Prospecção", icon: Target, color: "blue", prompt: "Crie uma abordagem B2B focada em geração de leads ou autoridade através do LinkedIn." },
    ]
  },
};


export default function ChannelStrategyAnalyzer() {
  const [loadingChannel, setLoadingChannel] = useState<ChannelType | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: { url: '', analysis: { strengths: '', weaknesses: '', hook: '' } },
      website: { url: '', analysis: { strengths: '', weaknesses: '', hook: '' } },
      linkedin: { url: '', analysis: { strengths: '', weaknesses: '', hook: '' } },
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
        description: `A IA analisou o canal e preencheu as respostas.`,
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

    if (!analysis) return;

    const text = `
**Diagnóstico Estratégico de Canal: ${channelConfig[channel].name}**
**URL:** ${url}

---
**PONTOS FORTES**
${analysis.strengths}

---
**PONTOS FRACOS (OPORTUNIDADES)**
${analysis.weaknesses}

---
**GANCHO DE PROSPECÇÃO**
${analysis.hook}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      title: "Análise Copiada!",
      description: `O diagnóstico de ${channelConfig[channel].name} foi copiado.`,
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
          <CardDescription>Insira a URL do canal e gere uma análise ou preencha manualmente.</CardDescription>
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

          <div className="space-y-4 pt-4 border-t">
            {config.questions.map(({ key, label, icon: Icon, color, prompt }) => {
               const colorClasses = {
                green: "text-green-700 dark:text-green-400 focus:border-green-500/50 bg-green-500/5 border-green-500/20",
                red: "text-red-700 dark:text-red-400 focus:border-red-500/50 bg-red-500/5 border-red-500/20",
                blue: "text-blue-700 dark:text-blue-400 focus:border-blue-500/50 bg-blue-500/5 border-blue-500/20",
              }[color] || "";

              return (
              <div key={key}>
                <Label htmlFor={`${channel}-${key}`} className={cn("flex items-center gap-2 mb-2 font-semibold", colorClasses.split(' ')[0], colorClasses.split(' ')[1])}>
                    <Icon className="h-5 w-5" />
                    {label}
                </Label>
                <Controller
                  name={`${channel}.analysis.${key as 'strengths' | 'weaknesses' | 'hook'}`}
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      id={`${channel}-${key}`}
                      {...field}
                      placeholder={prompt}
                      className={cn("min-h-[120px]", colorClasses)}
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

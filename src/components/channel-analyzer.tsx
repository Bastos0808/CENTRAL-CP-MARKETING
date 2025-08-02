
"use client";

import { analyzeChannel } from "@/ai/flows/channel-analyzer-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2, Bot, Link as LinkIcon, ThumbsUp, ThumbsDown, Target, Search, Copy, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChannelAnalysisOutput } from "@/ai/schemas/channel-analyzer-schemas";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  channelUrl: z.string().url("Por favor, insira uma URL válida."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChannelAnalyzer() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ChannelAnalysisOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelUrl: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeChannel(values);
            setAnalysisResult(result);
            toast({
                title: "Análise Concluída!",
                description: "A IA analisou o canal e gerou o diagnóstico.",
            });
        } catch (error) {
            console.error("Error analyzing channel:", error);
            toast({
                title: "Erro na Análise",
                description: "Não foi possível analisar o canal. Verifique a URL e tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCopyAnalysis = () => {
        if (!analysisResult) return;
        const textToCopy = `
Análise Estratégica de Canal
URL: ${form.getValues('channelUrl')}

--- PONTOS FORTES ---
${analysisResult.strengths.map(s => `- ${s}`).join('\n')}

--- PONTOS FRACOS (Oportunidades) ---
${analysisResult.weaknesses.map(w => `- ${w}`).join('\n')}

--- GANCHO DE PROSPECÇÃO ---
${analysisResult.hook}
        `.trim();

        navigator.clipboard.writeText(textToCopy);
        toast({
            title: "Análise Copiada!",
            description: "O diagnóstico completo foi copiado para a área de transferência."
        })
    };
    
    const handleFieldChange = <K extends keyof ChannelAnalysisOutput>(
      field: K,
      index: number,
      value: string
    ) => {
        if (!analysisResult) return;
        
        const updatedValues = [...(analysisResult[field] as string[])];
        updatedValues[index] = value;
        setAnalysisResult({
            ...analysisResult,
            [field]: updatedValues,
        });
    };

    const handleAddField = <K extends keyof ChannelAnalysisOutput>(field: K) => {
        if (!analysisResult) return;
        setAnalysisResult({
            ...analysisResult,
            [field]: [...(analysisResult[field] as string[]), '']
        });
    };
    
    const handleRemoveField = <K extends keyof ChannelAnalysisOutput>(field: K, index: number) => {
        if (!analysisResult) return;
        const currentValues = [...(analysisResult[field] as string[])];
        currentValues.splice(index, 1);
        setAnalysisResult({
            ...analysisResult,
            [field]: currentValues,
        });
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Analisador de Canal</CardTitle>
                    <CardDescription>Insira a URL do prospect para que a IA gere uma análise de pontos fortes, fracos e um gancho para prospecção.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="channelUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL do Canal (Site, Instagram, etc.)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="https://www.instagram.com/prospect" {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                {isLoading ? "Analisando..." : "Analisar Canal com IA"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col sticky top-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Diagnóstico Estratégico</CardTitle>
                            <CardDescription>Análise da IA. Você pode editar os campos abaixo.</CardDescription>
                        </div>
                         {analysisResult && (
                            <Button variant="outline" size="sm" onClick={handleCopyAnalysis}>
                                <Copy className="mr-2 h-4 w-4"/>
                                Copiar Análise
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                            <p>A IA está visitando o canal...</p>
                        </div>
                    ) : analysisResult ? (
                       <div className="w-full space-y-6 text-sm">
                           <div className="space-y-2">
                                <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2 mb-2"><ThumbsUp /> Pontos Fortes</h3>
                                <div className="space-y-2">
                                {analysisResult.strengths.map((item, i) => (
                                     <div key={i} className="flex items-center gap-2">
                                        <Input value={item} onChange={e => handleFieldChange('strengths', i, e.target.value)} className="bg-green-500/10 border-green-500/20"/>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleRemoveField('strengths', i)}><Trash2 className="h-4 w-4"/></Button>
                                     </div>
                                ))}
                                </div>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddField('strengths')}><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Ponto Forte</Button>
                           </div>
                           <div className="space-y-2">
                                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2"><ThumbsDown /> Pontos Fracos (Dores)</h3>
                                 <div className="space-y-2">
                                    {analysisResult.weaknesses.map((item, i) => (
                                         <div key={i} className="flex items-center gap-2">
                                            <Input value={item} onChange={e => handleFieldChange('weaknesses', i, e.target.value)} className="bg-red-500/10 border-red-500/20"/>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleRemoveField('weaknesses', i)}><Trash2 className="h-4 w-4"/></Button>
                                         </div>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddField('weaknesses')}><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Ponto Fraco</Button>
                           </div>
                           <div className="space-y-2">
                                <h3 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2"><Target /> Gancho de Prospecção</h3>
                                <Textarea 
                                    value={analysisResult.hook} 
                                    onChange={e => setAnalysisResult({...analysisResult, hook: e.target.value})} 
                                    className="bg-blue-500/10 border-blue-500/20 min-h-[100px]"
                                />
                           </div>
                       </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <Bot className="h-10 w-10 mx-auto mb-4"/>
                            <p>A análise do canal aparecerá aqui.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

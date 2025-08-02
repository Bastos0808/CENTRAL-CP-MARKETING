
"use client";

import { analyzeChannel } from "@/ai/flows/channel-analyzer-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2, Bot, Link as LinkIcon, ThumbsUp, ThumbsDown, Target, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChannelAnalysisOutput } from "@/ai/schemas/channel-analyzer-schemas";

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
                                        <FormLabel>URL do Canal</FormLabel>
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
                    <CardTitle>Diagnóstico Estratégico</CardTitle>
                    <CardDescription>Resultado da análise da IA. Use estes insights na sua prospecção.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                            <p>A IA está visitando o canal...</p>
                        </div>
                    ) : analysisResult ? (
                       <div className="w-full space-y-6 text-sm">
                           <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2 mb-2"><ThumbsUp /> Pontos Fortes</h3>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    {analysisResult.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                           </div>
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2"><ThumbsDown /> Pontos Fracos</h3>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    {analysisResult.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                           </div>
                           <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <h3 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2"><Target /> Gancho de Prospecção</h3>
                                <p className="text-muted-foreground">{analysisResult.hook}</p>
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

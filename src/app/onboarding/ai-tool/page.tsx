
"use client";

import { generateSdrMessage } from "@/ai/flows/onboarding-sdr-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2, Bot } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    companyName: z.string().min(1, "O nome da empresa é obrigatório."),
    companySector: z.string().min(1, "O setor é obrigatório."),
    observedProblem: z.string().min(10, "Descreva o problema com mais detalhes."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AiToolPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            companySector: "",
            observedProblem: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setGeneratedMessage("");
        try {
            const result = await generateSdrMessage(values);
            setGeneratedMessage(result.message);
        } catch (error) {
            console.error("Error generating message:", error);
            toast({
                title: "Erro ao Gerar Mensagem",
                description: "Não foi possível contatar a IA. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Vamos praticar! A etapa final é treinar sua habilidade de escrita. Insira as informações sobre um cliente em potencial e a IA irá gerar um modelo de mensagem de prospecção personalizada para você se inspirar.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Gerador de Mensagem de Prospecção</CardTitle>
                        <CardDescription>Preencha os dados do prospect para a IA criar a mensagem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Clínica Sorriso Perfeito" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companySector"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Setor da Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Odontologia" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="observedProblem"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Problema ou Oportunidade Observada</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Ex: O Instagram da clínica não posta há 2 meses e os concorrentes estão fazendo muitos anúncios."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    {isLoading ? "Gerando..." : "Gerar Mensagem com IA"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Mensagem Gerada</CardTitle>
                        <CardDescription>Use esta mensagem como inspiração. Adapte-a com sua própria voz.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-center text-muted-foreground">
                                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                                <p>A IA está escrevendo...</p>
                            </div>
                        ) : generatedMessage ? (
                            <div className="p-4 bg-muted/50 rounded-lg w-full">
                                <p className="whitespace-pre-wrap text-foreground">{generatedMessage}</p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Bot className="h-10 w-10 mx-auto mb-4"/>
                                <p>A mensagem da IA aparecerá aqui.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

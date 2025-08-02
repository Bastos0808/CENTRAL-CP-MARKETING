
"use client";

import { generateSdrMessage } from "@/ai/flows/onboarding-sdr-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2, Bot, Mail, MessageSquare, Linkedin, Podcast, FileText, Handshake } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SdrMessageInputSchema } from "@/ai/schemas/onboarding-sdr-schemas";

const formSchema = SdrMessageInputSchema;

type FormValues = z.infer<typeof formSchema>;

export default function SdrAiTool() {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            communicationChannel: "whatsapp",
            decisionMakerName: "",
            companyName: "",
            companySector: "",
            hook: "",
            valueOffer: "podcast",
            observedProblem: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setGeneratedMessage("");
        try {
            const result = await generateSdrMessage(values);
            setGeneratedMessage(result.message);
            toast({
                title: "Mensagem Gerada!",
                description: "Sua mensagem personalizada está pronta.",
            });
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Assistente de Prospecção com IA</CardTitle>
                    <CardDescription>Preencha o máximo de informações para a IA criar uma mensagem altamente personalizada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="decisionMakerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Decisor</FormLabel>
                                            <FormControl><Input placeholder="Ex: João Silva" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Empresa</FormLabel>
                                            <FormControl><Input placeholder="Ex: Clínica Sorriso Perfeito" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="companySector"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Setor da Empresa</FormLabel>
                                        <FormControl><Input placeholder="Ex: Odontologia Estética" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="hook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gancho (Opcional)</FormLabel>
                                        <FormControl><Input placeholder="Ex: Vi que participaram da Dental Week" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="observedProblem"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Problema Observado (Opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: O Instagram da clínica não posta há 2 meses."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <FormField
                                    control={form.control}
                                    name="communicationChannel"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Canal (Opcional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o canal" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="whatsapp"><div className="flex items-center gap-2"><MessageSquare/> WhatsApp</div></SelectItem>
                                            <SelectItem value="email"><div className="flex items-center gap-2"><Mail/> E-mail</div></SelectItem>
                                            <SelectItem value="linkedin"><div className="flex items-center gap-2"><Linkedin/> LinkedIn</div></SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="valueOffer"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Oferta de Valor (Opcional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a oferta" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="consultoria"><div className="flex items-center gap-2"><FileText/> Consultoria Estratégica</div></SelectItem>
                                            <SelectItem value="podcast"><div className="flex items-center gap-2"><Podcast/> Episódio de Podcast</div></SelectItem>
                                            <SelectItem value="ambos"><div className="flex items-center gap-2"><Handshake/> Ambos (Consultoria e Podcast)</div></SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                {isLoading ? "Gerando..." : "Gerar Mensagem com IA"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col sticky top-8">
                <CardHeader>
                    <CardTitle>Mensagem Gerada</CardTitle>
                    <CardDescription>Use esta mensagem como inspiração. Adapte-a com sua própria voz antes de enviar.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
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
                        <div className="text-center text-muted-foreground p-8">
                            <Bot className="h-10 w-10 mx-auto mb-4"/>
                            <p>Sua mensagem personalizada pela IA aparecerá aqui após preencher os campos e clicar em "Gerar".</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

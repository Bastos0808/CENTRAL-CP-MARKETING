
"use client";

import { generateSdrMessage } from "@/ai/flows/onboarding-sdr-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2, Bot, Mail, MessageSquare, Linkedin, Podcast, FileText, Handshake, Copy, Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SdrMessageInputSchema } from "@/ai/schemas/onboarding-sdr-schemas";
import Image from "next/image";

const formSchema = SdrMessageInputSchema;

type FormValues = z.infer<typeof formSchema>;

export default function SdrAiTool() {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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
            screenshotDataUri: undefined,
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({
                    title: "Arquivo muito grande",
                    description: "Por favor, selecione uma imagem com menos de 2MB.",
                    variant: "destructive"
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                form.setValue('screenshotDataUri', dataUri);
                setScreenshotPreview(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveScreenshot = () => {
        form.setValue('screenshotDataUri', undefined);
        setScreenshotPreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setGeneratedMessages([]);
        try {
            const result = await generateSdrMessage(values);
            setGeneratedMessages(result.messages);
            toast({
                title: "Cadência Gerada!",
                description: "Sua sequência de mensagens está pronta.",
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
    
    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        toast({ title: `Mensagem ${index + 1} Copiada!`, description: "A mensagem foi copiada para a área de transferência." });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Assistente de Prospecção com IA</CardTitle>
                    <CardDescription>Preencha o máximo de informações para a IA criar uma cadência de mensagens altamente personalizada.</CardDescription>
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

                             <div className="p-4 border rounded-md space-y-3 bg-muted/30">
                                <FormLabel className="font-semibold">Contexto (Opcional)</FormLabel>
                                <FormDescription>Forneça um print ou descreva o gancho e o problema manualmente para uma mensagem mais precisa.</FormDescription>
                                
                                {screenshotPreview ? (
                                    <div className="relative group mt-2">
                                        <Image src={screenshotPreview} alt="Preview do print" width={500} height={300} className="rounded-md object-contain max-h-48 w-full border" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={handleRemoveScreenshot}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        Anexar Print do Perfil/Site
                                    </Button>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="hook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Gancho Manual</FormLabel>
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
                                            <FormLabel className="text-xs">Problema Observado</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Ex: O Instagram da clínica não posta há 2 meses."
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>

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
                                {isLoading ? "Gerando..." : "Gerar Cadência com IA"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col sticky top-8">
                <CardHeader>
                    <CardTitle>Cadência Gerada</CardTitle>
                    <CardDescription>Use esta sequência de mensagens na sua prospecção. Adapte-a com sua própria voz antes de enviar.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                            <p>A IA está escrevendo a sequência...</p>
                        </div>
                    ) : generatedMessages.length > 0 ? (
                       <div className="w-full space-y-4">
                           {generatedMessages.map((message, index) => (
                               <div key={index} className="p-4 bg-muted/50 rounded-lg w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-sm">Mensagem {index + 1}</h3>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(message, index)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="whitespace-pre-wrap text-foreground text-sm">{message}</p>
                               </div>
                           ))}
                       </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <Bot className="h-10 w-10 mx-auto mb-4"/>
                            <p>Sua cadência de mensagens aparecerá aqui após preencher os campos e clicar em "Gerar".</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

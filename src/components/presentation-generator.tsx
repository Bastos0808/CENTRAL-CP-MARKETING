
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Loader2, Wand2, FileText, FileDown, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const diagnosticSchema = z.object({
  clientName: z.string().min(1, "O nome do cliente é obrigatório."),
  mainPain: z.string().min(1, "A dor principal é obrigatória."),
  mainGoal: z.string().min(1, "O objetivo principal é obrigatório."),
  differentials: z.string().optional(),
  currentActions: z.string().optional(),
  observations: z.string().optional(),
});

type DiagnosticFormValues = z.infer<typeof diagnosticSchema>;

export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: {
      clientName: "",
      mainPain: "",
      mainGoal: "",
      differentials: "",
      currentActions: "",
      observations: "",
    },
  });

  const onSubmit = async (values: DiagnosticFormValues) => {
    setIsLoading(true);
    setPresentationContent(null);
    toast({ title: "Gerando Apresentação...", description: "Aguarde enquanto a IA cria os slides." });
    
    // Simulating AI call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mocked response
    setPresentationContent({
      title: `Plano de Ação Estratégico: ${values.clientName}`,
      slides: [
        { title: "Diagnóstico Atual", content: `Análise da dor principal: ${values.mainPain}.` },
        { title: "Objetivo Central", content: `Onde queremos chegar: ${values.mainGoal}.` },
        { title: "Plano de Ação", content: `Estratégias propostas baseadas nas observações: ${values.observations}` },
      ],
    });

    setIsLoading(false);
    toast({ title: "Apresentação Gerada!", description: "Revise os slides abaixo e faça o download." });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Etapa 1: Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Etapa 1: Diagnóstico Inicial</CardTitle>
          <CardDescription>Reúna as informações da primeira reunião com o cliente. Estes dados serão a base para a IA gerar a apresentação.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl><Input placeholder="Ex: Clínica TopMed" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainPain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual a principal dor/problema do cliente hoje?</FormLabel>
                    <FormControl><Textarea placeholder="Ex: 'Não consigo atrair pacientes qualificados, só chegam curiosos.'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual o principal objetivo que ele quer alcançar?</FormLabel>
                    <FormControl><Textarea placeholder="Ex: 'Aumentar o faturamento em 30% nos próximos 6 meses.'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="differentials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diferenciais da empresa (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Ex: 'Tecnologia de ponta, atendimento humanizado, mais de 10 anos de experiência.'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentActions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O que ele já faz hoje em marketing? (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Ex: 'Posta no Instagram sem frequência, já tentou impulsionar um post mas não teve resultado.'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outras observações relevantes (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Qualquer outra informação que possa ser útil para a IA." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Gerar Apresentação com IA
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Etapa 2: Apresentação */}
      <Card className="lg:sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 /> Etapa 2: Apresentação Gerada</CardTitle>
          <CardDescription>A IA gerou uma estrutura de apresentação. Revise o conteúdo e, se estiver tudo certo, faça o download.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Gerando slides...</p>
            </div>
          )}
          {!isLoading && presentationContent && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle className="font-bold">{presentationContent.title}</AlertTitle>
                <AlertDescription>
                  Apresentação com {presentationContent.slides.length} slides gerada.
                </AlertDescription>
              </Alert>
              <div className="space-y-3 p-4 border rounded-md max-h-96 overflow-y-auto">
                {presentationContent.slides.map((slide: any, index: number) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <h4 className="font-semibold text-primary">{`Slide ${index + 1}: ${slide.title}`}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{slide.content}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Apresentação (PDF)
              </Button>
            </div>
          )}
           {!isLoading && !presentationContent && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
              <p>A prévia da sua apresentação aparecerá aqui.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

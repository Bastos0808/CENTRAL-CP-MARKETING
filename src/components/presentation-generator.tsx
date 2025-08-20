
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Wand2, FileText, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const diagnosticSchema = z.object({
  clientName: z.string().min(1, "O nome do cliente é obrigatório."),
  // Bloco 1
  faturamentoMedio: z.string().min(1, "O faturamento médio é obrigatório."),
  metaFaturamento: z.string().min(1, "A meta de faturamento é obrigatória."),
  ticketMedio: z.string().optional(),
  origemClientes: z.string().optional(),
  tempoEmpresa: z.string().optional(),
  // Bloco 2
  motivacaoMarketing: z.string().min(1, "A motivação é obrigatória."),
  investimentoAnterior: z.string().optional(),
  tentativasAnteriores: z.string().optional(),
  principalGargalo: z.string().min(1, "O principal gargalo é obrigatório."),
  custoProblema: z.string().optional(),
  // Bloco 3
  envolvidosDecisao: z.string().optional(),
  orcamentoPrevisto: z.string().optional(),
  prazoDecisao: z.string().optional(),
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
      faturamentoMedio: "",
      metaFaturamento: "",
      ticketMedio: "",
      origemClientes: "",
      tempoEmpresa: "",
      motivacaoMarketing: "",
      investimentoAnterior: "",
      tentativasAnteriores: "",
      principalGargalo: "",
      custoProblema: "",
      envolvidosDecisao: "",
      orcamentoPrevisto: "",
      prazoDecisao: "",
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
        { title: "Diagnóstico Atual", content: `Análise do principal gargalo: ${values.principalGargalo}.` },
        { title: "Objetivo Central", content: `Onde queremos chegar: Atingir a meta de faturamento de ${values.metaFaturamento}.` },
        { title: "Plano de Ação", content: `Estratégias propostas baseadas na motivação para investir em marketing: ${values.motivacaoMarketing}` },
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
          <CardTitle className="flex items-center gap-2"><FileText /> Etapa 1: Reunião de Diagnóstico (R1)</CardTitle>
          <CardDescription>Preencha os campos com as informações coletadas na primeira reunião. A IA usará esses dados para montar a apresentação da Reunião de Solução (R2).</CardDescription>
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

              <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary"/>Metas e Cenário Atual</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="faturamentoMedio" render={({ field }) => (<FormItem><FormLabel>Qual o faturamento médio hoje?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metaFaturamento" render={({ field }) => (<FormItem><FormLabel>Qual a meta realista de faturamento para os próximos 6 meses?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="ticketMedio" render={({ field }) => (<FormItem><FormLabel>Qual o ticket médio do seu principal serviço/produto?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="origemClientes" render={({ field }) => (<FormItem><FormLabel>Hoje, de onde vêm os clientes?</FormLabel><FormControl><Input placeholder="Indicação, orgânico, anúncios..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tempoEmpresa" render={({ field }) => (<FormItem><FormLabel>Há quanto tempo a empresa existe?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><HandCoins className="h-6 w-6 text-primary"/>Dor e Impacto Financeiro</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="motivacaoMarketing" render={({ field }) => (<FormItem><FormLabel>O que te motivou hoje a investir em marketing?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="investimentoAnterior" render={({ field }) => (<FormItem><FormLabel>Você já investiu em marketing? Quem fez?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tentativasAnteriores" render={({ field }) => (<FormItem><FormLabel>O que você já tentou fazer para resolver isso que não funcionou como esperado?</FormLabel><FormControl><Textarea placeholder="Outras agências, freelancers, time interno..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="principalGargalo" render={({ field }) => (<FormItem><FormLabel>Se você pudesse apontar o maior gargalo hoje, ele estaria na geração, qualificação ou conversão de leads?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="custoProblema" render={({ field }) => (<FormItem><FormLabel>Quanto você estima que esse problema te custa por mês?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><UserCheck className="h-6 w-6 text-primary"/>Processo de Decisão</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="envolvidosDecisao" render={({ field }) => (<FormItem><FormLabel>Além de você, quem mais precisa estar envolvido para aprovar um projeto como este?</FormLabel><FormControl><Input placeholder="Sócio, esposa, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="orcamentoPrevisto" render={({ field }) => (<FormItem><FormLabel>Qual a faixa de investimento confortável para marketing e crescimento?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="prazoDecisao" render={({ field }) => (<FormItem><FormLabel>Se encontrarmos o plano ideal, qual o seu prazo para tomar uma decisão?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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
              <Info className="h-10 w-10 mx-auto mb-4"/>
              <p>A prévia da sua apresentação aparecerá aqui.</p>
              <p className="text-xs mt-1">Preencha o formulário e clique em "Gerar" para começar.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

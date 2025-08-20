
"use client";

import * as React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Wand2, FileText, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, Info, DollarSign, ListChecks, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;

// Internal component to render slides for PDF generation
const GeneratedPresentation = React.forwardRef<HTMLDivElement, { content: GeneratePresentationOutput | null; clientName: string; }>(({ content, clientName }, ref) => {
    if (!content) return null;

    const allSlides = [
        { type: 'cover', title: content.presentationTitle, clientName: clientName },
        { type: 'default', title: 'Diagnóstico', content: content.diagnosticSlide.content },
        { type: 'default', title: 'Plano de Ação (180 Dias)', content: content.actionPlanSlide.content },
        { type: 'default', title: content.justificationSlide.title, content: content.justificationSlide.content },
        { type: 'default', title: 'Cronograma', content: content.timelineSlide.content },
        { type: 'default', title: 'KPIs (Métricas de Sucesso)', content: content.kpiSlide.content },
        { type: 'default', title: 'Nossos Diferenciais', content: content.whyCpSlide.content },
        { type: 'investment', title: content.investmentSlide.title, plan: content.investmentSlide },
        { type: 'default', title: 'Próximos Passos', content: content.nextStepsSlide.content },
    ];
    
    return (
        <div ref={ref} className="presentation-container">
            {allSlides.map((slide, index) => (
                <div key={index} className="pdf-slide">
                    <div className="pdf-slide-content">
                        {slide.type === 'cover' && (
                             <div className="flex flex-col items-center justify-center h-full text-center">
                                 <h1 className="text-6xl font-bold text-primary">{slide.title}</h1>
                                 <p className="text-3xl mt-4">{slide.clientName}</p>
                             </div>
                        )}
                        {slide.type === 'default' && (
                             <div>
                                 <h2 className="text-4xl font-bold text-primary mb-6">{slide.title}</h2>
                                 <ul className="space-y-4 text-xl">
                                     {Array.isArray(slide.content) && slide.content.map((point: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>)}
                                 </ul>
                             </div>
                        )}
                         {slide.type === 'investment' && slide.plan && (
                             <div>
                                 <h2 className="text-4xl font-bold text-primary mb-6">{slide.plan.title}</h2>
                                 <ul className="space-y-2 mb-6">
                                    {slide.plan.items.map((item, i) => (
                                        <li key={i} className="flex justify-between text-lg">
                                            <span>{item.name}</span>
                                            <span>{item.price}</span>
                                        </li>
                                    ))}
                                 </ul>
                                 <div className="border-t pt-4 space-y-2 text-right">
                                    <p className="text-lg">Subtotal: {slide.plan.total}</p>
                                    {slide.plan.discount && <p className="text-lg text-red-500">Desconto: {slide.plan.discount}</p>}
                                    <p className="text-2xl font-bold text-primary">Total: {slide.plan.finalTotal}</p>
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            ))}
            <style jsx global>{`
                .presentation-container { font-family: 'Inter', sans-serif; }
                .pdf-slide { width: 1280px; height: 720px; padding: 40px; background-color: white; border-bottom: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center;}
                .pdf-slide-content { max-width: 100%;}
            `}</style>
        </div>
    );
});
GeneratedPresentation.displayName = 'GeneratedPresentation';


export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();
  const presentationRef = useRef<HTMLDivElement>(null);

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(DiagnosticFormSchema),
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
      packages: [],
      discount: 0,
    },
  });

  const watchedPackages = form.watch('packages') || [];
  const watchedDiscount = form.watch('discount') || 0;

  const investmentValue = useMemo(() => {
    const total = watchedPackages.reduce((acc, pkgKey) => {
      const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
      return acc + (pkg ? pkg.price : 0);
    }, 0);
    return total - watchedDiscount;
  }, [watchedPackages, watchedDiscount]);


  const onSubmit = async (values: DiagnosticFormValues) => {
    setIsLoading(true);
    setPresentationContent(null);
    toast({ title: "Gerando Apresentação...", description: "Aguarde enquanto a IA cria os slides." });
    
    try {
      const result = await generatePresentation(values);
      setPresentationContent(result);
      toast({ title: "Apresentação Gerada!", description: "Revise os slides abaixo e faça o download." });
    } catch(error) {
      console.error("Error generating presentation:", error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar a apresentação. Tente novamente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!presentationRef.current) return;
    setIsDownloading(true);
    toast({ title: 'Gerando PDF...', description: 'Aguarde um momento.' });

    const slides = presentationRef.current.querySelectorAll<HTMLElement>('.pdf-slide');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1280, 720]
    });

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const canvas = await html2canvas(slide, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save(`Apresentacao_${form.getValues('clientName').replace(/\s/g, '_')}.pdf`);
    setIsDownloading(false);
    toast({ title: 'Download Concluído!', description: 'Seu PDF foi baixado com sucesso.' });
  };
  
  const allSlides = presentationContent ? [
    { title: 'Capa', content: [presentationContent.presentationTitle] },
    { title: presentationContent.diagnosticSlide.title, content: presentationContent.diagnosticSlide.content },
    { title: presentationContent.actionPlanSlide.title, content: presentationContent.actionPlanSlide.content },
    { title: presentationContent.justificationSlide.title, content: presentationContent.justificationSlide.content },
    { title: presentationContent.timelineSlide.title, content: presentationContent.timelineSlide.content },
    { title: presentationContent.kpiSlide.title, content: presentationContent.kpiSlide.content },
    { title: presentationContent.whyCpSlide.title, content: presentationContent.whyCpSlide.content },
    { title: presentationContent.investmentSlide.title, content: [`Valor Total: ${presentationContent.investmentSlide.finalTotal}`] },
    { title: presentationContent.nextStepsSlide.title, content: presentationContent.nextStepsSlide.content },
  ] : [];

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
                    <FormField control={form.control} name="prazoDecisao" render={({ field }) => (<FormItem><FormLabel>Se encontrarmos o plano ideal, qual o seu prazo para tomar uma decisão e iniciar o projeto?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><DollarSign className="h-6 w-6 text-primary"/>Serviços e Investimento</div></AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-6">
                        <Controller
                            control={form.control}
                            name="packages"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pacotes de Serviços</FormLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {Object.entries(packageOptions).map(([key, pkg]) => (
                                            <Button
                                                key={key}
                                                type="button"
                                                variant={field.value?.includes(key) ? "default" : "outline"}
                                                onClick={() => {
                                                    const newValue = field.value?.includes(key)
                                                        ? field.value.filter(v => v !== key)
                                                        : [...(field.value || []), key];
                                                    field.onChange(newValue);
                                                }}
                                                className="h-auto justify-start p-3 flex-col items-start whitespace-normal"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {field.value?.includes(key) ? <Check className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                                    <span className="text-left text-xs font-semibold">{pkg.name}</span>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desconto (R$)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            placeholder="0" 
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       <FormItem>
                        <FormLabel>Valor Final do Investimento</FormLabel>
                        <FormControl>
                            <Input value={investmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} readOnly className="font-bold text-lg" />
                        </FormControl>
                       </FormItem>
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
                <AlertTitle className="font-bold">{presentationContent.presentationTitle}</AlertTitle>
                <AlertDescription>
                  Apresentação com {allSlides.length} slides gerada.
                </AlertDescription>
              </Alert>
              <div className="space-y-3 p-4 border rounded-md max-h-96 overflow-y-auto">
                {allSlides.map((slide, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <h4 className="font-semibold text-primary">{`Slide ${index + 1}: ${slide.title}`}</h4>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5">
                       {Array.isArray(slide.content) && slide.content.map((point: string, pIndex: number) => (
                         <li key={pIndex} dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                       ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
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

      {/* Hidden component for PDF generation */}
      <div className="fixed -left-[9999px] top-0">
          <GeneratedPresentation ref={presentationRef} content={presentationContent} clientName={form.getValues('clientName')} />
      </div>
    </div>
  );
}

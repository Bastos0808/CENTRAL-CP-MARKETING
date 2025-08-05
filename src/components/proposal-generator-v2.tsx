
"use client";

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Loader2, Wand2, Target, DollarSign, ListChecks, FileText, Check, Bot, Briefcase, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { generateProposalContent } from '@/ai/flows/proposal-generator-flow';
import { GeneratedProposal, packageOptions } from './generated-proposal';
import { Switch } from './ui/switch';
import { GenerateProposalInputSchema } from '@/ai/schemas/proposal-generator-schemas';

// Schema Definition matching the AI flow input
const proposalSchema = GenerateProposalInputSchema.extend({
    useCustomServices: z.boolean().default(false), // UI state, not for AI
    investmentValue: z.string().optional(), // UI state, not for AI
    // These fields will be populated by the AI
    partnershipDescription: z.string().optional(),
    objectiveItems: z.array(z.object({ value: z.string() })).optional(),
    differentialItems: z.array(z.object({ value: z.string() })).optional(),
    idealPlanItems: z.array(z.object({ value: z.string() })).optional(),
});


export type ProposalFormValues = z.infer<typeof proposalSchema>;

export default function ProposalGeneratorV2() {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const { toast } = useToast();
  
  const proposalRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: '',
      clientObjective: '',
      clientChallenge: '',
      clientAudience: '',
      useCustomServices: false,
      packages: [],
      investmentValue: 'R$ 0,00',
       // AI-generated fields start empty
      partnershipDescription: '',
      objectiveItems: [],
      differentialItems: [],
      idealPlanItems: [],
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();
  const useCustomServices = watchedValues.useCustomServices;

  React.useEffect(() => {
    if (useCustomServices) return;

    const total = watchedValues.packages?.reduce((acc, pkgKey) => {
        const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
        return acc + (pkg ? pkg.price : 0);
    }, 0) || 0;
    
    form.setValue('investmentValue', total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

  }, [watchedValues.packages, useCustomServices, form]);

  const handleDownloadPdf = async () => {
    const { clientName } = form.getValues();
    if (!clientName) {
        toast({ title: "Cliente não definido", description: "Por favor, insira o nome do cliente antes de gerar o PDF.", variant: "destructive" });
        return;
    }
    if (!proposalRef.current) {
        toast({ title: "Erro Interno", description: "Não foi possível encontrar a referência para a proposta.", variant: "destructive"});
        return;
    }

    setIsGeneratingPdf(true);
    toast({ title: "Gerando PDF...", description: "Isso pode levar alguns instantes. Não feche a página." });
    
    const slides = proposalRef.current.querySelectorAll<HTMLElement>('[data-slide]');
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1080, 1920], // Full HD Landscape
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    try {
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            const canvas = await html2canvas(slide, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0A0A0A'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            if (i > 0) pdf.addPage([pdfWidth, pdfHeight], 'landscape');
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`Proposta_${clientName.replace(/\s+/g, '_')}.pdf`);
        toast({ title: "PDF Gerado com Sucesso!", variant: "default" });

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "Erro ao Gerar PDF", variant: "destructive" });
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleGenerateContent = async () => {
      const { clientName, packages, clientObjective, clientChallenge, clientAudience } = form.getValues();
      
      const validation = GenerateProposalInputSchema.safeParse({ clientName, packages, clientObjective, clientChallenge, clientAudience });

       if (!validation.success) {
            validation.error.errors.forEach((err) => {
                toast({
                    title: `Campo Obrigatório: ${err.path.join('.')}`,
                    description: err.message,
                    variant: "destructive",
                });
            });
            return;
        }
      
      setIsGeneratingAi(true);

      const packagesWithDetails = packages?.reduce((acc: {name: string, description: string}[], key: string) => {
        const pkg = packageOptions[key as keyof typeof packageOptions];
        if (pkg) acc.push({ name: pkg.name, description: pkg.description });
        return acc;
      }, []);

      try {
          const result = await generateProposalContent({ 
              clientName, 
              clientObjective,
              clientChallenge,
              clientAudience,
              packages: packagesWithDetails 
            });
          
          form.setValue('partnershipDescription', result.partnershipDescription);
          form.setValue('objectiveItems', result.objectiveItems.map(item => ({value: item})));
          form.setValue('differentialItems', result.differentialItems.map(item => ({value: item})));
          form.setValue('idealPlanItems', result.idealPlanItems.map(item => ({value: item})));

          toast({ title: "Conteúdo Gerado!", description: "A IA preencheu os campos da proposta." });
      } catch (error) {
          console.error("AI Generation Error: ", error);
          toast({ title: "Erro na Geração com IA", variant: "destructive" });
      } finally {
          setIsGeneratingAi(false);
      }
  }


  return (
    <>
        <Card>
            <Form {...form}>
                <form className="space-y-4">
                    <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="px-6 font-semibold"><Target className="mr-2 h-5 w-5 text-primary" />Informações Estratégicas</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-4">
                                <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Nome da empresa do cliente" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="clientObjective" render={({ field }) => <FormItem><FormLabel>Principal Objetivo do Cliente</FormLabel><FormControl><Input placeholder="Ex: Aumentar vendas online, gerar autoridade" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="clientChallenge" render={({ field }) => <FormItem><FormLabel>Maior Desafio de Marketing Atual</FormLabel><FormControl><Input placeholder="Ex: Leads desqualificados, baixo engajamento" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="clientAudience" render={({ field }) => <FormItem><FormLabel>Público-Alvo Principal</FormLabel><FormControl><Input placeholder="Ex: Jovens arquitetos de São Paulo" {...field} /></FormControl><FormMessage /></FormItem>} />
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="px-6 font-semibold"><ListChecks className="mr-2 h-5 w-5 text-primary" />Serviços e Pacotes</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-4">
                                <FormField
                                    control={form.control}
                                    name="useCustomServices"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Personalizar Escopo</FormLabel>
                                                <p className="text-sm text-muted-foreground">Desativa os pacotes e permite a criação de um escopo do zero.</p>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                {!useCustomServices ? (
                                    <FormField
                                        control={form.control}
                                        name="packages"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pacotes de Serviços</FormLabel>
                                                <div className="grid grid-cols-2 gap-2">
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
                                                            className="h-auto justify-start p-3"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {field.value?.includes(key) ? <Check /> : <pkg.icon />}
                                                                <span className="text-left text-xs">{pkg.name}</span>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground p-4 bg-muted/50 rounded-md">A personalização de escopo ainda será implementada.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="px-6 font-semibold"><DollarSign className="mr-2 h-5 w-5 text-primary" />Investimento</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-4">
                                <FormField control={form.control} name="investmentValue" render={({ field }) => <FormItem><FormLabel>Valor do Investimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                     <div className="p-6">
                        <Button type="button" onClick={handleGenerateContent} disabled={isGeneratingAi} className="w-full">
                           {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                           {isGeneratingAi ? 'Gerando Conteúdo...' : 'Gerar Conteúdo da Proposta com IA'}
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
        
        <div className="mt-8 flex justify-end">
            <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} size="lg">
                {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGeneratingPdf ? "Gerando PDF..." : "Baixar Proposta em PDF"}
            </Button>
        </div>
        
        {/* Hidden component for rendering PDF */}
        <div className="fixed -left-[9999px] -top-[9999px]">
            <div ref={proposalRef}>
                <GeneratedProposal {...watchedValues} />
            </div>
        </div>
    </>
  );
}

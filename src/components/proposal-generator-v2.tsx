
"use client";

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Trash2, Download, Loader2, Wand2, Target, DollarSign, ListChecks, FileText, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { generateProposalContent } from '@/ai/flows/proposal-generator-flow';
import { GeneratedProposal, packageOptions } from './generated-proposal';
import { Switch } from './ui/switch';

// Schema Definition
const serviceItemSchema = z.object({ value: z.string().min(1, "O item não pode ser vazio.") });

const proposalSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  useCustomServices: z.boolean().default(false),
  packages: z.array(z.string()).optional(),
  
  customServices: z.object({
      socialMedia: z.array(serviceItemSchema).optional(),
      paidTraffic: z.array(serviceItemSchema).optional(),
      podcast: z.array(serviceItemSchema).optional(),
      branding: z.array(serviceItemSchema).optional(),
      website: z.array(serviceItemSchema).optional(),
      landingPage: z.array(serviceItemSchema).optional(),
  }).optional(),
  
  partnershipDescription: z.string().optional(),
  objectiveItems: z.array(serviceItemSchema).optional(),
  differentialItems: z.array(serviceItemSchema).optional(),
  idealPlanItems: z.array(serviceItemSchema).optional(),
  
  investmentValue: z.string().optional(),
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
      useCustomServices: false,
      packages: [],
      customServices: {
          socialMedia: [],
          paidTraffic: [],
          podcast: [],
          branding: [],
          website: [],
          landingPage: [],
      },
      partnershipDescription: '',
      objectiveItems: [],
      differentialItems: [],
      idealPlanItems: [],
      investmentValue: 'R$ 0,00',
    },
    mode: 'onChange'
  });

  const { fields: smFields, append: appendSm, remove: removeSm } = useFieldArray({ control: form.control, name: "customServices.socialMedia" });
  const { fields: trafficFields, append: appendTraffic, remove: removeTraffic } = useFieldArray({ control: form.control, name: "customServices.paidTraffic" });
  const { fields: podcastFields, append: appendPodcast, remove: removePodcast } = useFieldArray({ control: form.control, name: "customServices.podcast" });
  const { fields: brandingFields, append: appendBranding, remove: removeBranding } = useFieldArray({ control: form.control, name: "customServices.branding" });
  const { fields: websiteFields, append: appendWebsite, remove: removeWebsite } = useFieldArray({ control: form.control, name: "customServices.website" });
  const { fields: lpFields, append: appendLp, remove: removeLp } = useFieldArray({ control: form.control, name: "customServices.landingPage" });

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
      const { clientName, packages, useCustomServices } = form.getValues();
      if (!clientName) {
          toast({ title: "Nome do Cliente Faltando", variant: "destructive" });
          return;
      }
      if (!useCustomServices && (!packages || packages.length === 0)) {
          toast({ title: "Nenhum Pacote Selecionado", variant: "destructive" });
          return;
      }
      
      setIsGeneratingAi(true);

      const packagesWithDetails = packages?.reduce((acc: {name: string, description: string}[], key: string) => {
        const pkg = packageOptions[key as keyof typeof packageOptions];
        if (pkg) acc.push({ name: pkg.name, description: pkg.description });
        return acc;
      }, []);

      try {
          const result = await generateProposalContent({ clientName, packages: packagesWithDetails });
          
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

  const renderFieldArray = (title: string, name: any, fields: any[], append: Function, remove: Function) => (
      <div>
        <FormLabel>{title}</FormLabel>
        <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField
                        control={form.control}
                        name={`${name}.${index}.value`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Textarea {...field} rows={1} placeholder={`Item de ${title}`} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => append({ value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item
            </Button>
        </div>
      </div>
  )

  return (
    <>
        <Card>
            <Form {...form}>
                <form className="space-y-4">
                    <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="px-6 font-semibold"><Target className="mr-2 h-5 w-5 text-primary" />Informações do Cliente</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-2">
                                <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Nome da empresa do cliente" {...field} /></FormControl><FormMessage /></FormItem>} />
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
                                                <FormLabel>Personalizar Serviços</FormLabel>
                                                <p className="text-sm text-muted-foreground">Ative para criar um escopo do zero.</p>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                {!useCustomServices && (
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
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="px-6 font-semibold"><FileText className="mr-2 h-5 w-5 text-primary" />Conteúdo da Proposta</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-4">
                                <Button type="button" onClick={handleGenerateContent} disabled={isGeneratingAi} className="w-full">
                                    {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Gerar Textos com IA
                                </Button>
                                <FormField control={form.control} name="partnershipDescription" render={({ field }) => <FormItem><FormLabel>Sobre a Parceria</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                                {renderFieldArray("Objetivos", "objectiveItems", watchedValues.objectiveItems || [], (v:any) => form.setValue("objectiveItems", [...(watchedValues.objectiveItems || []), v]), (i:number) => form.setValue("objectiveItems", watchedValues.objectiveItems?.filter((_, idx) => idx !== i)))}
                                {renderFieldArray("Diferenciais", "differentialItems", watchedValues.differentialItems || [], (v:any) => form.setValue("differentialItems", [...(watchedValues.differentialItems || []), v]), (i:number) => form.setValue("differentialItems", watchedValues.differentialItems?.filter((_, idx) => idx !== i)))}
                                {renderFieldArray("Por que este plano é ideal?", "idealPlanItems", watchedValues.idealPlanItems || [], (v:any) => form.setValue("idealPlanItems", [...(watchedValues.idealPlanItems || []), v]), (i:number) => form.setValue("idealPlanItems", watchedValues.idealPlanItems?.filter((_, idx) => idx !== i)))}
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="px-6 font-semibold"><DollarSign className="mr-2 h-5 w-5 text-primary" />Investimento</AccordionTrigger>
                            <AccordionContent className="space-y-4 px-6 pt-4">
                                <FormField control={form.control} name="investmentValue" render={({ field }) => <FormItem><FormLabel>Valor do Investimento</FormLabel><FormControl><Input {...field} disabled={!useCustomServices} /></FormControl><FormMessage /></FormItem>} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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

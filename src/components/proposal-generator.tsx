
"use client";

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { PlusCircle, Trash2, Download, Loader2, Check, ArrowRight, Target, AlignLeft, BarChart2, ListChecks, Goal, Sparkles, Megaphone, DollarSign, PackageCheck, X, Wand2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { generateProposalContent } from '@/ai/flows/proposal-generator-flow';

// Schema Definition
const serviceItemSchema = z.object({ value: z.string().min(1, "O item não pode ser vazio.") });

const proposalSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  clientLogoUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
  partnershipDescription: z.string().min(1, 'A descrição da parceria é obrigatória.'),
  
  actionPlanPlatform: z.string().optional(),
  actionPlanFrequency: z.array(serviceItemSchema).optional(),
  actionPlanFormat: z.array(serviceItemSchema).optional(),
  
  objectiveItems: z.array(serviceItemSchema).optional(),
  differentialItems: z.array(serviceItemSchema).optional(),
  
  campaignsIncluded: z.string().optional(),
  campaignsObjective: z.array(serviceItemSchema).optional(),
  campaignsDifferential: z.array(serviceItemSchema).optional(),
  
  investmentPackage: z.string().optional(),
  investmentValue: z.string().optional(),
  idealPlanItems: z.array(serviceItemSchema).optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "aspect-video w-full bg-[#000000] text-gray-50 overflow-hidden shadow-2xl relative flex flex-col justify-center items-center p-12 font-body",
      className
    )}
    {...props}
  >
    {children}
    <div className="absolute bottom-6 left-12 flex items-baseline gap-2">
        <p className="text-xl font-bold text-[#FE5412]">CP</p>
        <p className="text-sm font-light text-gray-400 border-l border-gray-700 pl-2">MARKETING</p>
    </div>
  </div>
));
Page.displayName = 'Page';

export default function ProposalGenerator() {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isGeneratingWithAi, setIsGeneratingWithAi] = React.useState(false);
  const [aiBrief, setAiBrief] = React.useState("");
  const pagesRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: '',
      clientLogoUrl: '',
      partnershipDescription: '',
      actionPlanPlatform: 'INSTAGRAM',
      actionPlanFrequency: [],
      actionPlanFormat: [],
      objectiveItems: [],
      differentialItems: [],
      campaignsIncluded: 'Gestão de campanhas de tráfego pago para Facebook e Instagram.',
      campaignsObjective: [],
      campaignsDifferential: [],
      investmentPackage: 'SOCIAL + TRÁFEGO',
      investmentValue: 'R$ 0,00',
      idealPlanItems: [],
    },
  });

  const { fields: freqFields, append: appendFreq, remove: removeFreq } = useFieldArray({ control: form.control, name: "actionPlanFrequency" });
  const { fields: formatFields, append: appendFormat, remove: removeFormat } = useFieldArray({ control: form.control, name: "actionPlanFormat" });
  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({ control: form.control, name: "objectiveItems" });
  const { fields: differentialFields, append: appendDifferential, remove: removeDifferential } = useFieldArray({ control: form.control, name: "differentialItems" });
  const { fields: idealPlanFields, append: appendIdealPlan, remove: removeIdealPlan } = useFieldArray({ control: form.control, name: "idealPlanItems" });
  const { fields: campObjectiveFields, append: appendCampObjective, remove: removeCampObjective } = useFieldArray({ control: form.control, name: "campaignsObjective" });
  const { fields: campDifferentialFields, append: appendCampDifferential, remove: removeCampDifferential } = useFieldArray({ control: form.control, name: "campaignsDifferential" });

  const watchedValues = form.watch();

  const handleGenerateWithAi = async () => {
    const clientName = form.getValues("clientName");
    if (!clientName.trim() || !aiBrief.trim()) {
      toast({
        title: "Informações Insuficientes",
        description: "Por favor, preencha o nome do cliente e o briefing rápido para usar a IA.",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingWithAi(true);
    try {
      const result = await generateProposalContent({
        clientName,
        clientBrief: aiBrief
      });

      // Populate form fields with AI result
      form.setValue("partnershipDescription", result.partnershipDescription);
      
      // Reset and append for field arrays
      removeObjective();
      result.objectiveItems.forEach(item => appendObjective(item));

      removeDifferential();
      result.differentialItems.forEach(item => appendDifferential(item));
      
      removeIdealPlan();
      result.idealPlanItems.forEach(item => appendIdealPlan(item));

      toast({
        title: "Conteúdo Gerado com Sucesso!",
        description: "A IA preencheu os campos da proposta para você."
      });

    } catch (error) {
      console.error("Error generating with AI:", error);
      toast({
        title: "Erro na Geração",
        description: "Não foi possível gerar o conteúdo com a IA. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingWithAi(false);
    }
  };


  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
    
    const canvasWidth = 1920;
    const canvasHeight = 1080;

    for (let i = 0; i < pagesRef.current.length; i++) {
      const pageElement = pagesRef.current[i];
      if (pageElement) {
        const canvas = await html2canvas(pageElement, { 
            width: canvasWidth,
            height: canvasHeight,
            scale: 2,
            useCORS: true, 
            backgroundColor: '#000000'
        });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage([canvasWidth, canvasHeight], 'landscape');
        pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
      }
    }
    pdf.save(`Proposta_${watchedValues.clientName.replace(/\s+/g, '_')}.pdf`);
    setIsGeneratingPdf(false);
  };
  
  const formSections = [
    { name: "Geração com IA", fields: ['aiBrief'], icon: Wand2 },
    { name: "Capa e Parceria", fields: ['clientName', 'clientLogoUrl', 'partnershipDescription'], icon: Target },
    { name: "Plano de Ação", fields: ['actionPlanPlatform', 'actionPlanFrequency', 'actionPlanFormat'], icon: ListChecks },
    { name: "Objetivos", fields: ['objectiveItems'], icon: Goal },
    { name: "Diferenciais", fields: ['differentialItems'], icon: Sparkles },
    { name: "Campanhas", fields: ['campaignsIncluded', 'campaignsObjective', 'campaignsDifferential'], icon: Megaphone },
    { name: "Investimento", fields: ['investmentPackage', 'investmentValue'], icon: DollarSign },
    { name: "Resumo do Plano Ideal", fields: ['idealPlanItems'], icon: PackageCheck },
  ];

  const renderFieldArray = (fields: any, remove: any, append: any, label: string, name: keyof ProposalFormValues) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field: any, index: number) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`${name}.${index}.value` as const}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl><Input {...field} /></FormControl>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </FormItem>
          )}
        />
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Item</Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-4">
           <Form {...form}>
            <form className="space-y-4">
              <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
                {formSections.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={section.name}>
                    <AccordionTrigger className="font-semibold"><section.icon className="mr-2 h-5 w-5 text-primary" />{section.name}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      {section.fields.includes('aiBrief') && (
                        <div className="space-y-2">
                          <Label htmlFor="ai-brief">Briefing Rápido</Label>
                          <Textarea 
                            id="ai-brief"
                            placeholder="Descreva o cliente e seus desafios. Ex: Restaurante de luxo que precisa aumentar o movimento durante a semana."
                            value={aiBrief}
                            onChange={(e) => setAiBrief(e.target.value)}
                          />
                          <Button type="button" onClick={handleGenerateWithAi} disabled={isGeneratingWithAi} className="w-full">
                            {isGeneratingWithAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
                            {isGeneratingWithAi ? "Gerando..." : "Gerar Conteúdo da Proposta"}
                          </Button>
                        </div>
                      )}
                      {section.fields.includes('clientName') && <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('clientLogoUrl') && <FormField control={form.control} name="clientLogoUrl" render={({ field }) => <FormItem><FormLabel>URL do Logo do Cliente (Opcional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('partnershipDescription') && <FormField control={form.control} name="partnershipDescription" render={({ field }) => <FormItem><FormLabel>Descrição da Parceria</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('actionPlanPlatform') && <FormField control={form.control} name="actionPlanPlatform" render={({ field }) => <FormItem><FormLabel>Plataforma</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('actionPlanFrequency') && renderFieldArray(freqFields, removeFreq, appendFreq, "Frequência", "actionPlanFrequency")}
                      {section.fields.includes('actionPlanFormat') && renderFieldArray(formatFields, removeFormat, appendFormat, "Formato", "actionPlanFormat")}
                      {section.fields.includes('objectiveItems') && renderFieldArray(objectiveFields, removeObjective, appendObjective, "Objetivos", "objectiveItems")}
                      {section.fields.includes('differentialItems') && renderFieldArray(differentialFields, removeDifferential, appendDifferential, "Diferenciais", "differentialItems")}
                      {section.fields.includes('campaignsIncluded') && <FormField control={form.control} name="campaignsIncluded" render={({ field }) => <FormItem><FormLabel>Campanhas Incluídas</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('campaignsObjective') && renderFieldArray(campObjectiveFields, removeCampObjective, appendCampObjective, "Objetivos da Campanha", "campaignsObjective")}
                      {section.fields.includes('campaignsDifferential') && renderFieldArray(campDifferentialFields, removeCampDifferential, appendCampDifferential, "Diferenciais da Campanha", "campaignsDifferential")}
                      {section.fields.includes('investmentPackage') && <FormField control={form.control} name="investmentPackage" render={({ field }) => <FormItem><FormLabel>Pacote de Investimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('investmentValue') && <FormField control={form.control} name="investmentValue" render={({ field }) => <FormItem><FormLabel>Valor do Investimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('idealPlanItems') && renderFieldArray(idealPlanFields, removeIdealPlan, appendIdealPlan, "Itens do Plano Ideal", "idealPlanItems")}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
               <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="w-full mt-6">
                {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGeneratingPdf ? "Gerando PDF..." : "Baixar Proposta em PDF"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="w-full hidden md:block">
         <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
                {/* Page 1: Capa */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[0] = el; }} className="bg-cover bg-center">
                        <Image 
                            src="https://placehold.co/1920x1080/000000/000000.png" 
                            alt="Background" 
                            layout="fill" 
                            objectFit="cover" 
                            className="absolute inset-0 z-0"
                            data-ai-hint="office background"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="z-10 text-center flex flex-col items-center">
                            <p className="text-[#FE5412] font-semibold tracking-widest mb-2">PROPOSTA COMERCIAL</p>
                            <h1 className="text-7xl font-extrabold max-w-4xl">{watchedValues.clientName || '[Cliente]'}</h1>
                            <p className="text-xl font-light text-gray-300 mt-4">Gestão Estratégica de Marketing Digital</p>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 2: Sobre a Parceria */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[1] = el; }} className="p-0 justify-start items-stretch">
                       <div className="w-full h-full flex">
                            <div className="w-1/2 flex flex-col justify-center items-start p-24">
                                <h2 className="text-5xl font-bold uppercase mb-6">Sobre a Parceria</h2>
                                <p className="text-2xl font-light text-gray-300 border-l-4 border-[#FE5412] pl-6">{watchedValues.partnershipDescription}</p>
                                {watchedValues.clientLogoUrl ? (
                                  <div className="mt-12 flex items-center gap-6">
                                    <div className="relative w-24 h-24">
                                       <Image src={watchedValues.clientLogoUrl} layout="fill" objectFit="contain" alt="Client Logo" />
                                    </div>
                                    <X className="h-8 w-8 text-[#FE5412]" />
                                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-transparent">
                                       <Image src="/Ativo 6.svg" layout="fill" objectFit="contain" alt="CP Marketing Logo" />
                                    </div>
                                  </div>
                                ) : null}
                            </div>
                            <div className="w-1/2 h-full relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                                <Image
                                    src="/Ativo 6.svg"
                                    alt="Partnership"
                                    layout="fill"
                                    objectFit="cover"
                                    className="z-0"
                                />
                                <div className="absolute inset-0 bg-black/30"></div>
                            </div>
                       </div>
                    </Page>
                </CarouselItem>

                {/* Page 3: Plano de Ação */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[2] = el; }}>
                        <h2 className="text-5xl font-bold uppercase mb-8 text-center w-full">Plano de Ação</h2>
                        <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
                            <Card className="bg-gray-800/50 border-gray-700 text-center !shadow-none hover:!shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
                                <CardContent className="p-8">
                                    <ListChecks className="h-10 w-10 text-[#FE5412] mx-auto mb-4"/>
                                    <h3 className="font-bold text-xl mb-3">Plataforma</h3>
                                    <p className="text-2xl font-semibold">{watchedValues.actionPlanPlatform}</p>
                                </CardContent>
                            </Card>
                             <Card className="bg-gray-800/50 border-gray-700 !shadow-none hover:!shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
                                <CardContent className="p-8">
                                    <AlignLeft className="h-10 w-10 text-[#FE5412] mx-auto mb-4"/>
                                    <h3 className="font-bold text-xl mb-3 text-center">Frequência</h3>
                                    <ul className="space-y-2">
                                        {watchedValues.actionPlanFrequency?.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> {item.value}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card className="bg-gray-800/50 border-gray-700 !shadow-none hover:!shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
                                <CardContent className="p-8">
                                    <BarChart2 className="h-10 w-10 text-[#FE5412] mx-auto mb-4"/>
                                    <h3 className="font-bold text-xl mb-3 text-center">Formato</h3>
                                    <ul className="space-y-2">
                                         {watchedValues.actionPlanFormat?.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> {item.value}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 4: Objetivo */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[3] = el; }}>
                        <div className="w-full max-w-5xl">
                            <h2 className="text-5xl font-bold uppercase mb-8">Nosso Objetivo</h2>
                             <ul className="space-y-4 text-xl font-light">
                                {watchedValues.objectiveItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4"><Goal className="h-7 w-7 text-[#FE5412] mt-1 flex-shrink-0" />{item.value}</li>
                                ))}
                            </ul>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 5: Diferencial */}
                 <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[4] = el; }}>
                         <div className="w-full max-w-5xl">
                            <h2 className="text-5xl font-bold uppercase mb-8">Nossos Diferenciais</h2>
                            <ul className="space-y-4 text-xl font-light columns-2 gap-x-12">
                                {watchedValues.differentialItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 mb-4 break-inside-avoid"><Sparkles className="h-7 w-7 text-[#FE5412] mt-1 flex-shrink-0" />{item.value}</li>
                                ))}
                            </ul>
                         </div>
                    </Page>
                </CarouselItem>

                {/* Page 6: Campanhas */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[5] = el; }}>
                        <h2 className="text-5xl font-bold uppercase mb-8 text-center w-full">Campanhas e Tráfego Pago</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                           <Card className="bg-gray-800/50 border-gray-700 !shadow-none hover:!shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
                                <CardContent className="p-8">
                                    <h3 className="font-bold text-2xl mb-4 text-[#FE5412]">Objetivo</h3>
                                    <ul className="space-y-2 text-lg">
                                        {watchedValues.campaignsObjective?.map((item, i) => <li className='flex items-center gap-2' key={i}><Check className="h-5 w-5 text-green-400" /> {item.value}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card className="bg-gray-800/50 border-gray-700 !shadow-none hover:!shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
                                <CardContent className="p-8">
                                    <h3 className="font-bold text-2xl mb-4 text-[#FE5412]">Diferencial</h3>
                                    <ul className="space-y-2 text-lg">
                                        {watchedValues.campaignsDifferential?.map((item, i) => <li className='flex items-center gap-2' key={i}><Check className="h-5 w-5 text-green-400" /> {item.value}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 7: Investimento */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[6] = el; }}>
                        <div className="text-center border-4 border-[#FE5412] p-12 rounded-xl">
                            <h2 className="text-4xl font-bold uppercase mb-2">Investimento</h2>
                            <p className="text-lg text-gray-300 mb-4">{watchedValues.investmentPackage}</p>
                            <p className="text-8xl font-extrabold text-[#FE5412] mb-4">{watchedValues.investmentValue}</p>
                            <p className="font-semibold tracking-wider text-gray-400">INCLUI TODOS OS SERVIÇOS ESTRATÉGICOS ACIMA.</p>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 8: Plano Ideal */}
                <CarouselItem>
                     <Page ref={el => { if(el) pagesRef.current[7] = el; }}>
                         <div className="w-full max-w-5xl text-center">
                            <h2 className="text-5xl font-bold uppercase mb-8">Por que este plano é <span className="text-[#FE5412]">ideal</span> para o seu negócio?</h2>
                             <ul className="space-y-4 text-xl font-light text-left max-w-3xl mx-auto">
                                {watchedValues.idealPlanItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4"><Check className="h-7 w-7 text-green-400 mt-1 flex-shrink-0" />{item.value}</li>
                                ))}
                            </ul>
                         </div>
                    </Page>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-16 bg-gray-800 hover:bg-[#FE5412] border-gray-700 text-white" />
            <CarouselNext className="-right-16 bg-gray-800 hover:bg-[#FE5412] border-gray-700 text-white" />
        </Carousel>
      </div>
    </div>
  );
}

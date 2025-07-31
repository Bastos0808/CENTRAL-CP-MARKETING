
"use client";

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { PlusCircle, Trash2, Download, Loader2, Check, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Label } from '@/components/ui/label';

// Schema Definition
const serviceItemSchema = z.object({ value: z.string().min(1, "O item não pode ser vazio.") });

const proposalSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  partnershipDescription: z.string().min(1, 'A descrição da parceria é obrigatória.'),
  
  // Plano de Ação
  actionPlanPlatform: z.string().optional(),
  actionPlanFrequency: z.array(serviceItemSchema).optional(),
  actionPlanFormat: z.array(serviceItemSchema).optional(),
  
  // Objetivo
  objectiveItems: z.array(serviceItemSchema).optional(),

  // Diferencial
  differentialItems: z.array(serviceItemSchema).optional(),
  
  // Campanhas
  campaignsIncluded: z.string().optional(),
  campaignsObjective: z.array(serviceItemSchema).optional(),
  campaignsDifferential: z.array(serviceItemSchema).optional(),
  
  // Investimento
  investmentPackage: z.string().optional(),
  investmentValue: z.string().optional(),

  // Plano Ideal
  idealPlanItems: z.array(serviceItemSchema).optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "aspect-[16/9] w-full bg-[#030860] text-white overflow-hidden shadow-lg relative flex flex-col justify-center items-center p-8 font-body",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Page.displayName = 'Page';


// Main Component
export default function ProposalGenerator() {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const pagesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: 'Bruxelas Grill',
      partnershipDescription: 'Nosso objetivo é transformar o Bruxelas Grill em um ponto de referência gastronômico em Goiânia, conectando-se de forma autêntica com a comunidade local e traduzindo a qualidade excepcional de seus pratos em uma presença digital forte e impactante.',
      actionPlanPlatform: 'INSTAGRAM',
      actionPlanFrequency: [{ value: '12 posts mensais' }, { value: '4 reels por mês' }, { value: 'Captação de conteúdo' }],
      actionPlanFormat: [{ value: 'Artes' }, { value: 'Vídeos' }, { value: 'Fotos' }],
      objectiveItems: [
        { value: 'Engajar o público local que busca experiências gastronômicas de alta qualidade.' },
        { value: 'Valorizar os principais diferenciais: os pratos autorais, o ambiente e o atendimento.' },
        { value: 'Aumentar o fluxo de clientes e o número de reservas através de um funil de marketing digital.' },
      ],
      differentialItems: [
        { value: 'Sessões de fotos e vídeos profissionais para destacar a apresentação dos pratos.' },
        { value: 'Divulgação de eventos e promoções para atrair o público em momentos estratégicos.' },
        { value: 'Estratégias de SEO local e otimização do perfil do Google para buscas na região.' },
        { value: 'Criação de um cardápio digital funcional e atraente.' },
      ],
      campaignsIncluded: 'Gestão de campanhas de tráfego pago para Facebook e Instagram.',
      campaignsObjective: [{ value: 'Geração de leads' }, { value: 'Aumento do movimento' }, { value: 'Otimização do investimento' }],
      campaignsDifferential: [{ value: 'Criativos personalizados' }, { value: 'Segmentação precisa' }, { value: 'Testes A/B' }],
      investmentPackage: 'SOCIAL + TRÁFEGO + CAPTAÇÃO',
      investmentValue: 'R$ 3.500,00',
      idealPlanItems: [
        { value: 'Posicionamento como restaurante referência na cidade' },
        { value: 'Aumento de reservas e movimento com funil completo' },
        { value: 'Campanhas inteligentes com foco em conversão real' },
        { value: 'Conteúdo para Instagram com consistência e impacto' },
        { value: 'Suporte completo em marketing, tráfego, captação e conteúdo' },
      ],
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

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pagesRef.current.length; i++) {
      const pageElement = pagesRef.current[i];
      if (pageElement) {
        const canvas = await html2canvas(pageElement, { scale: 2, useCORS: true, backgroundColor: '#030860' });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
    }
    pdf.save(`Proposta_${watchedValues.clientName.replace(/\s+/g, '_')}.pdf`);
    setIsGeneratingPdf(false);
  };
  
  const formSections = [
    { name: "Capa e Parceria", fields: ['clientName', 'partnershipDescription'] },
    { name: "Plano de Ação", fields: ['actionPlanPlatform', 'actionPlanFrequency', 'actionPlanFormat'] },
    { name: "Objetivos", fields: ['objectiveItems'] },
    { name: "Diferenciais", fields: ['differentialItems'] },
    { name: "Campanhas", fields: ['campaignsIncluded', 'campaignsObjective', 'campaignsDifferential'] },
    { name: "Investimento", fields: ['investmentPackage', 'investmentValue'] },
    { name: "Resumo do Plano Ideal", fields: ['idealPlanItems'] },
  ];

  const renderFieldArray = (fields: any, remove: any, append: any, label: string, name: keyof ProposalFormValues) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field: any, index: number) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`${name}.${index}.value` as any}
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
           <Form {...form}>
            <form className="space-y-4">
              <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
                {formSections.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={section.name}>
                    <AccordionTrigger>{section.name}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {section.fields.includes('clientName') && <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                      {section.fields.includes('partnershipDescription') && <FormField control={form.control} name="partnershipDescription" render={({ field }) => <FormItem><FormLabel>Descrição da Parceria</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />}
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

      <div className="lg:col-span-2">
         <Carousel className="w-full">
            <CarouselContent>
                {/* Page 1: Capa */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[0] = el; }}>
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent"></div>
                       <div className="absolute right-8 top-8 h-24 w-24 border-2 border-[#FE5412] rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                            <p className="text-white text-[10px] absolute font-light">Marketing Digital & Podcast •</p>
                       </div>
                        <div className="absolute -right-8 top-16 h-12 w-12 rounded-full flex items-center justify-center ">
                            <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                       <div className="absolute left-8 right-1/2 h-full border-r border-white/20"></div>
                       <div className="w-full h-full flex flex-col justify-center items-start text-left pl-12 pr-1/2">
                            <h1 className="text-5xl font-extrabold uppercase tracking-wider mb-2">Proposta Comercial</h1>
                            <p className="text-lg font-light">Gestão Estratégica de Marketing Digital para <strong className="font-bold">{watchedValues.clientName || '[Cliente]'}</strong></p>
                       </div>
                    </Page>
                </CarouselItem>
                {/* Page 2: Sobre a Parceria */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[1] = el; }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 via-transparent to-blue-900/50"></div>
                        <div className="w-full h-full flex items-center">
                            <div className="w-1/2 flex flex-col justify-center p-12">
                                <h2 className="text-3xl font-bold uppercase mb-4">Sobre a Parceria</h2>
                                <p className="text-lg font-light">{watchedValues.partnershipDescription}</p>
                            </div>
                            <div className="w-1/2 flex items-center justify-center relative">
                                <div className="absolute -left-1/4 top-0 bottom-0 w-full bg-[#030860] transform -skew-x-12"></div>
                                <p className="text-5xl font-extrabold text-[#FE5412] z-10">{watchedValues.clientName || '[Cliente]'}</p>
                            </div>
                        </div>
                         <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 3: Plano de Ação */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[2] = el; }}>
                        <h2 className="text-3xl font-bold uppercase mb-8 text-center">Plano de Ação e Entregas Mensais</h2>
                        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
                            <div className="bg-black/20 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-4 text-[#FE5412]">Plataforma</h3>
                                <p className="text-2xl font-semibold">{watchedValues.actionPlanPlatform}</p>
                            </div>
                             <div className="bg-black/20 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-4 text-[#FE5412]">Frequência</h3>
                                <ul className="space-y-2">
                                    {watchedValues.actionPlanFrequency?.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-green-400" /> {item.value}</li>
                                    ))}
                                </ul>
                            </div>
                             <div className="col-span-2 bg-black/20 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-4 text-[#FE5412]">Formato</h3>
                                <div className="flex gap-4">
                                     {watchedValues.actionPlanFormat?.map((item, i) => (
                                        <p key={i} className="bg-white/10 px-4 py-2 rounded-full text-sm">{item.value}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 4: Objetivo */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[3] = el; }}>
                        <div className="absolute right-8 top-8 h-24 w-24 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                        <div className="w-full max-w-4xl">
                            <h2 className="text-3xl font-bold uppercase mb-6">Objetivo</h2>
                             <ul className="space-y-3 text-lg font-light">
                                {watchedValues.objectiveItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3"><span className="text-[#FE5412] mt-1.5">•</span>{item.value}</li>
                                ))}
                            </ul>
                        </div>
                         <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 5: Diferencial */}
                 <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[4] = el; }}>
                         <div className="absolute right-8 top-8 h-24 w-24 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                         <div className="w-full max-w-4xl">
                            <h2 className="text-3xl font-bold uppercase mb-6">Diferencial</h2>
                            <ul className="space-y-3 text-lg font-light columns-2">
                                {watchedValues.differentialItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 mb-3 break-inside-avoid"><span className="text-[#FE5412] mt-1.5">•</span>{item.value}</li>
                                ))}
                            </ul>
                         </div>
                         <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 6: Campanhas */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[5] = el; }}>
                         <div className="absolute right-8 top-8 h-24 w-24 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold uppercase mb-4">Campanhas Incluídas</h2>
                                <p className="text-lg font-light">{watchedValues.campaignsIncluded}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold uppercase mb-2 text-[#FE5412]">Objetivo</h3>
                                <ul className="space-y-1 text-md font-light">
                                    {watchedValues.campaignsObjective?.map((item, i) => <li key={i}>• {item.value}</li>)}
                                </ul>
                                <h3 className="text-lg font-bold uppercase mt-4 mb-2 text-[#FE5412]">Diferencial</h3>
                                <ul className="space-y-1 text-md font-light">
                                    {watchedValues.campaignsDifferential?.map((item, i) => <li key={i}>• {item.value}</li>)}
                                </ul>
                            </div>
                        </div>
                        <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 7: Investimento */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[6] = el; }}>
                         <div className="absolute right-8 top-8 h-24 w-24 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold uppercase mb-2">Investimento</h2>
                            <p className="text-lg text-white/70 mb-4">{watchedValues.investmentPackage}</p>
                            <p className="text-7xl font-extrabold text-[#FE5412] mb-4">{watchedValues.investmentValue}</p>
                            <p className="font-semibold tracking-wider">INCLUI TODOS OS SERVIÇOS ESTRATÉGICOS ACIMA.</p>
                        </div>
                        <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
                {/* Page 8: Plano Ideal */}
                <CarouselItem>
                     <Page ref={el => { if(el) pagesRef.current[7] = el; }}>
                         <div className="absolute right-8 top-8 h-24 w-24 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <p className="text-[#FE5412] font-bold text-3xl">CP</p>
                        </div>
                         <div className="w-full max-w-4xl">
                            <h2 className="text-2xl font-bold uppercase mb-6 text-center">Por que esse plano é <span className="text-[#FE5412]">ideal</span> para o {watchedValues.clientName}?</h2>
                             <ul className="space-y-3 text-lg font-light">
                                {watchedValues.idealPlanItems?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3"><span className="text-[#FE5412] mt-1.5">•</span>{item.value}</li>
                                ))}
                            </ul>
                         </div>
                         <p className="absolute bottom-4 left-8 text-xs font-light tracking-widest border-t border-white/20 pt-1">CP MARKETING</p>
                    </Page>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-12 bg-transparent hover:bg-white/10 border-white/50 text-white" />
            <CarouselNext className="-right-12 bg-transparent hover:bg-white/10 border-white/50 text-white" />
        </Carousel>
      </div>
    </div>
  );
}

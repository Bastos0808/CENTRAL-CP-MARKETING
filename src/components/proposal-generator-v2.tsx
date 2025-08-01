
"use client";

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { PlusCircle, Trash2, Download, Loader2, Check, ArrowRight, Target, AlignLeft, BarChart2, ListChecks, Goal, Sparkles, Megaphone, DollarSign, PackageCheck, X, Wand2, Image as ImageIcon, Palette, Percent, Tag, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateProposalContent } from '@/ai/flows/proposal-generator-flow';


// Schema Definition
const serviceItemSchema = z.object({ value: z.string().min(1, "O item não pode ser vazio.") });

const proposalSchema = z.object({
  clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
  clientBrief: z.string().optional(),
  clientLogoUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
  coverImageUrl: z.string().url("Por favor, insira uma URL de imagem válida.").optional().or(z.literal('')),
  partnershipDescription: z.string().min(1, 'A descrição da parceria é obrigatória.'),
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
  
  objectiveItems: z.array(serviceItemSchema).optional(),
  differentialItems: z.array(serviceItemSchema).optional(),
  
  investmentValue: z.string().optional(),
  discount: z.coerce.number().min(0, "Desconto não pode ser negativo").optional(),
  idealPlanItems: z.array(serviceItemSchema).optional(),
});


type ProposalFormValues = z.infer<typeof proposalSchema>;

const packageOptions = {
    "social_media_prata": { name: "Social Media - Prata", price: 1500, description: "Gestão completa de Instagram e Facebook, 12 posts/mês, 1 reunião mensal.", icon: Palette },
    "social_media_ouro": { name: "Social Media - Ouro", price: 2500, description: "Tudo do Prata, com 20 posts/mês, relatórios avançados e gestão de LinkedIn.", icon: Palette },
    "social_media_diamante": { name: "Social Media - Diamante", price: 4000, description: "Tudo do Ouro, com 30 posts/mês, captação de vídeo externa e gestão de blog.", icon: Palette },
    "trafego_pago_bronze": { name: "Tráfego Pago - Bronze", price: 1000, description: "Gestão de até R$2.000 em Meta Ads, 2 campanhas e relatórios mensais.", icon: Megaphone },
    "trafego_pago_prata": { name: "Tráfego Pago - Prata", price: 2000, description: "Gestão de até R$5.000 em Meta & Google Ads, 4 campanhas e otimização semanal.", icon: Megaphone },
    "trafego_pago_ouro": { name: "Tráfego Pago - Ouro", price: 3500, description: "Gestão de até R$10.000, campanhas ilimitadas, funil completo e dashboard em tempo real.", icon: Megaphone },
    "podcast_bronze": { name: "Podcast - Bronze", price: 840, description: "4 episódios/mês (1h cada) gravados em estúdio, edição básica e distribuição.", icon: DollarSign },
    "podcast_prata": { name: "Podcast - Prata", price: 1600, description: "4 episódios/mês (2h cada), edição completa, cortes para redes sociais.", icon: DollarSign },
    "podcast_diamante": { name: "Podcast - Diamante", price: 2500, description: "Tudo do Prata, com gestão do canal do YouTube e thumbnails profissionais.", icon: DollarSign },
    "identidade_visual": { name: "Identidade Visual", price: 2500, description: "Criação de logo, paleta de cores, tipografia e manual de marca completo.", icon: Sparkles },
    "website": { name: "Website Institucional", price: 5000, description: "Criação de site com até 5 páginas, design responsivo e otimizado para SEO.", icon: Sparkles },
    "landing_page": { name: "Landing Page", price: 1800, description: "Página de alta conversão para campanhas específicas, com formulário integrado.", icon: Sparkles }
};

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
    <div className="absolute bottom-6 left-12 w-32 h-10">
      <Image crossOrigin="anonymous" src="/LOGO HORIZONTAL.svg" alt="CP Marketing Logo" layout="fill" objectFit="contain" />
    </div>
  </div>
));
Page.displayName = 'Page';

export default function ProposalGeneratorV2() {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const pagesRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: '',
      clientBrief: '',
      clientLogoUrl: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1707380659093-97e45913a9ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      partnershipDescription: '',
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
      objectiveItems: [],
      differentialItems: [],
      investmentValue: 'R$ 0,00',
      discount: 0,
      idealPlanItems: [],
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
    if (watchedValues.useCustomServices) return;

    const total = watchedValues.packages?.reduce((acc, pkgKey) => {
        const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
        return acc + (pkg ? pkg.price : 0);
    }, 0) || 0;
    
    const discountAmount = watchedValues.discount || 0;
    const finalTotal = total - discountAmount;
    
    form.setValue('investmentValue', finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

  }, [watchedValues.packages, watchedValues.discount, watchedValues.useCustomServices, form]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      const canvasWidth = 1920;
      const canvasHeight = 1080;

      for (let i = 0; i < pagesRef.current.length; i++) {
        const pageElement = pagesRef.current[i];
        if (pageElement) {
          const images = Array.from(pageElement.getElementsByTagName('img'));
          await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }));

          const canvas = await html2canvas(pageElement, {
            width: canvasWidth,
            height: canvasHeight,
            scale: 2,
            useCORS: true,
            backgroundColor: '#000000',
            logging: false,
          });

          const imgData = canvas.toDataURL('image/png');

          if (i > 0) pdf.addPage([canvasWidth, canvasHeight], 'landscape');
          pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight, undefined, 'FAST');
        }
      }
      pdf.save(`Proposta_${watchedValues.clientName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error: ", error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Ocorreu um problema ao exportar a proposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGenerateContent = async () => {
      const { clientName, clientBrief } = form.getValues();
      if (!clientName || !clientBrief) {
          toast({ title: "Informações Faltando", description: "Preencha o nome e o resumo do cliente para a IA gerar o conteúdo.", variant: "destructive" });
          return;
      }

      setIsGeneratingAi(true);
      try {
          const result = await generateProposalContent({ clientName, clientBrief });
          form.setValue('partnershipDescription', result.partnershipDescription);
          form.setValue('objectiveItems', result.objectiveItems);
          form.setValue('differentialItems', result.differentialItems);
          form.setValue('idealPlanItems', result.idealPlanItems);
          toast({ title: "Conteúdo Gerado!", description: "A IA preencheu os campos da proposta." });
      } catch (error) {
          console.error("AI Generation Error: ", error);
          toast({ title: "Erro na Geração", description: "Não foi possível gerar o conteúdo com a IA. Tente novamente.", variant: "destructive" });
      } finally {
          setIsGeneratingAi(false);
      }
  }
  
  const formSections = [
    { name: "Informações do Cliente", fields: ['clientName', 'clientLogoUrl'], icon: Target },
    { name: "Geração com IA", fields: ['clientBrief'], icon: Wand2 },
    { name: "Estilo e Serviços", fields: ['coverImageUrl', 'useCustomServices', 'packages', 'customServices'], icon: ListChecks },
    { name: "Investimento", fields: ['investmentValue', 'discount'], icon: DollarSign },
  ];

  const renderFieldArray = (fields: any, remove: any, append: any, label: string, name: any) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field: any, index: number) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`${name}.${index}.value`}
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
    <div className="flex flex-col gap-8">
      <div className="w-full">
          <Card>
            <CardContent className="p-4">
               <Form {...form}>
                <form className="space-y-4">
                  <Accordion type="multiple" defaultValue={['item-0', 'item-1']} className="w-full">
                    {formSections.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={section.name}>
                        <AccordionTrigger className="font-semibold"><section.icon className="mr-2 h-5 w-5 text-primary" />{section.name}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          {section.fields.includes('clientName') && <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Nome da empresa do cliente" {...field} /></FormControl><FormMessage /></FormItem>} />}
                          {section.fields.includes('clientLogoUrl') && <FormField control={form.control} name="clientLogoUrl" render={({ field }) => <FormItem><FormLabel>URL do Logo do Cliente (Opcional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>} />}
                          
                          {section.fields.includes('clientBrief') && (
                            <div className="p-4 border rounded-md bg-muted/30 space-y-3">
                              <FormField control={form.control} name="clientBrief" render={({ field }) => <FormItem><FormLabel className="flex items-center gap-2"><FileText />Resumo sobre o Cliente</FormLabel><FormDescription>Forneça um breve resumo sobre o cliente e seus desafios. A IA usará isso para gerar os textos da proposta.</FormDescription><FormControl><Textarea className="min-h-[100px]" placeholder="Ex: Clínica de estética focada em alto padrão que precisa se posicionar como autoridade e atrair mais clientes pelo Instagram." {...field} /></FormControl><FormMessage /></FormItem>} />
                               <Button type="button" onClick={handleGenerateContent} disabled={isGeneratingAi}>
                                  {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                  {isGeneratingAi ? 'Gerando...' : 'Gerar Textos com IA'}
                              </Button>
                            </div>
                          )}

                          {section.fields.includes('coverImageUrl') && <FormField control={form.control} name="coverImageUrl" render={({ field }) => <FormItem><FormLabel>URL da Imagem de Capa (Opcional)</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>} />}
                          
                          {section.fields.includes('useCustomServices') && (
                            <FormField
                                control={form.control}
                                name="useCustomServices"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Usar Serviços Personalizados?</FormLabel>
                                            
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                          )}

                          {section.fields.includes('packages') && !useCustomServices && (
                             <Controller
                                control={form.control}
                                name="packages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pacotes de Serviços</FormLabel>
                                        <Select onValueChange={(value) => field.onChange([...(field.value || []), value])} >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Adicionar pacote..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(packageOptions).map(([key, value]) => (
                                                    <SelectItem key={key} value={key} disabled={(field.value || []).includes(key)}>
                                                        {value.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {(field.value || []).map((pkg) => (
                                                <div key={pkg} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                                    {packageOptions[pkg as keyof typeof packageOptions].name}
                                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => field.onChange(field.value?.filter(v => v !== pkg))}>
                                                        <X className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          )}
                          
                          {section.fields.includes('customServices') && useCustomServices && (
                              <div className="space-y-4 pt-4 border-t">
                                  {renderFieldArray(smFields, removeSm, appendSm, "Social Media", "customServices.socialMedia")}
                                  {renderFieldArray(trafficFields, removeTraffic, appendTraffic, "Tráfego Pago", "customServices.paidTraffic")}
                                  {renderFieldArray(podcastFields, removePodcast, appendPodcast, "Podcast", "customServices.podcast")}
                                  {renderFieldArray(brandingFields, removeBranding, appendBranding, "Identidade Visual (Branding)", "customServices.branding")}
                                  {renderFieldArray(websiteFields, removeWebsite, appendWebsite, "Website", "customServices.website")}
                                  {renderFieldArray(lpFields, removeLp, appendLp, "Landing Page", "customServices.landingPage")}
                              </div>
                          )}
                          
                          {section.fields.includes('investmentValue') && useCustomServices && <FormField control={form.control} name="investmentValue" render={({ field }) => <FormItem><FormLabel>Valor do Investimento (Manual)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />}
                          {section.fields.includes('discount') && (
                             <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Desconto (R$)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" placeholder="0.00" {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>

      <div className="w-full">
         <Carousel className="w-full mx-auto">
            <CarouselContent>
                {/* Page 1: Capa */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[0] = el; }} className="bg-cover bg-center">
                        <div className="absolute inset-0 bg-black z-0"></div>
                         {watchedValues.coverImageUrl && (
                            <Image 
                                crossOrigin='anonymous'
                                src={watchedValues.coverImageUrl}
                                alt="Background" 
                                layout="fill" 
                                objectFit="cover" 
                                className="absolute inset-0 z-0 opacity-40"
                                data-ai-hint="technology dark"
                            />
                         )}
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
                       <div className="w-full h-full flex items-center">
                            <div className="w-1/2 flex flex-col justify-center items-start p-24">
                                <h2 className="text-5xl font-bold uppercase mb-6">Sobre a Parceria</h2>
                                <p className="text-2xl font-light text-gray-300 border-l-4 border-[#FE5412] pl-6">{watchedValues.partnershipDescription}</p>
                                {watchedValues.clientLogoUrl && (
                                  <div className="mt-12 flex items-center gap-6">
                                    <div className="relative w-24 h-24">
                                       <Image crossOrigin='anonymous' src={watchedValues.clientLogoUrl} layout="fill" objectFit="contain" alt="Client Logo" />
                                    </div>
                                    <X className="h-8 w-8 text-[#FE5412]" />
                                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-transparent">
                                       <Image crossOrigin='anonymous' src="/Ativo 6.svg" layout="fill" objectFit="contain" alt="CP Marketing Logo" />
                                    </div>
                                  </div>
                                )}
                            </div>
                             <div className="w-1/2 h-full relative flex items-center justify-center">
                                 <div className="absolute inset-0 bg-black/10"></div>
                                 <Image
                                    crossOrigin='anonymous'
                                    src="/Ativo 6.svg"
                                    alt="Partnership"
                                    width={300}
                                    height={300}
                                    objectFit="contain"
                                    className="z-0"
                                />
                            </div>
                       </div>
                    </Page>
                </CarouselItem>

                 {/* Page 3: Objetivo */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[2] = el; }}>
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

                {/* Page 4: Diferencial */}
                 <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[3] = el; }}>
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

                 {/* Page 5: Escopo */}
                 <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[4] = el; }}>
                        <div className="w-full max-w-6xl">
                            <h2 className="text-5xl font-bold uppercase mb-8 text-center">Escopo dos Serviços</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                                {watchedValues.packages?.map(pkgKey => {
                                    const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
                                    if (!pkg) return null;
                                    const Icon = pkg.icon;
                                    return (
                                        <div key={pkgKey} className="bg-gray-900/70 p-6 rounded-lg border border-gray-700">
                                            <Icon className="h-8 w-8 text-[#FE5412] mb-3" />
                                            <h3 className="font-bold text-lg">{pkg.name}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Page>
                </CarouselItem>
                
                {/* Page 6: Plano Ideal */}
                <CarouselItem>
                     <Page ref={el => { if(el) pagesRef.current[5] = el; }}>
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

                {/* Page 7: Investimento */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[6] = el; }}>
                        <div className="text-center border-4 border-[#FE5412] p-12 rounded-xl">
                            <h2 className="text-4xl font-bold uppercase mb-2">Investimento Mensal</h2>
                            <p className="text-8xl font-extrabold text-[#FE5412] mb-4">{watchedValues.investmentValue}</p>
                            <p className="font-semibold tracking-wider text-gray-400">INCLUI TODOS OS SERVIÇOS ESTRATÉGICOS ACIMA.</p>
                        </div>
                    </Page>
                </CarouselItem>

                {/* Page 8: Próximos Passos */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[7] = el; }}>
                        <div className="w-full max-w-5xl text-center">
                            <h2 className="text-5xl font-bold uppercase mb-8">Próximos Passos</h2>
                            <div className="flex justify-center items-stretch gap-8 text-left">
                                <Card className="bg-gray-800/50 border-gray-700 !shadow-none w-1/3">
                                    <CardContent className="p-8">
                                        <div className="text-5xl font-extrabold text-[#FE5412] mb-4">1</div>
                                        <h3 className="font-bold text-xl mb-2">Aprovação</h3>
                                        <p className="text-gray-300">Análise e aprovação da proposta.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-800/50 border-gray-700 !shadow-none w-1/3">
                                    <CardContent className="p-8">
                                        <div className="text-5xl font-extrabold text-[#FE5412] mb-4">2</div>
                                        <h3 className="font-bold text-xl mb-2">Assinatura</h3>
                                        <p className="text-gray-300">Assinatura do contrato de prestação de serviços.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-800/50 border-gray-700 !shadow-none w-1/3">
                                    <CardContent className="p-8">
                                        <div className="text-5xl font-extrabold text-[#FE5412] mb-4">3</div>
                                        <h3 className="font-bold text-xl mb-2">Onboarding</h3>
                                        <p className="text-gray-300">Início da parceria e alinhamento estratégico.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Page>
                </CarouselItem>

                 {/* Page 9: Contato */}
                <CarouselItem>
                    <Page ref={el => { if(el) pagesRef.current[8] = el; }}>
                        <div className="text-center">
                            <h2 className="text-7xl font-bold uppercase">E <span className="text-[#FE5412]">agora?</span></h2>
                            <p className="text-2xl mt-4 text-gray-300 max-w-2xl mx-auto">O próximo passo é simples: basta responder a esta proposta para agendarmos nossa conversa inicial.</p>
                        </div>
                    </Page>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="-left-12 bg-gray-800 hover:bg-[#FE5412] border-gray-700 text-white" />
            <CarouselNext className="-right-12 bg-gray-800 hover:bg-[#FE5412] border-gray-700 text-white" />
        </Carousel>
        <div className="w-full flex justify-center mt-8">
            <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} size="lg">
                {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGeneratingPdf ? "Gerando PDF..." : "Baixar Proposta em PDF"}
            </Button>
        </div>
      </div>
    </div>
  );
}

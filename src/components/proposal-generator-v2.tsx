
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { PlusCircle, Trash2, Download, Loader2, Check, ArrowRight, Target, AlignLeft, BarChart2, ListChecks, Goal, Sparkles, Megaphone, DollarSign, PackageCheck, X, Wand2, Image as ImageIcon, Palette, Percent, Tag, FileText, Bot, Briefcase, Mic } from 'lucide-react';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
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
    "marketing_vendas": { name: "Plano de Marketing - Vendas", price: 999, description: "Análise de perfil com otimização\nCriação de projeto para público alvo\nPlanejamento mensal\nMentoria\nCopywriting\nTráfego pago (Meta e Google)\n3 postagens semanais (1 arte e 2 vídeos)\nRelatório mensal\nArtes profissionais\nGestão completa e suporte via WhatsApp.", icon: Palette },
    "marketing_essencial": { name: "Plano de Marketing - Essencial", price: 1999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_performance": { name: "Plano de Marketing - Performance", price: 2500, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n20 postagens mensais\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\n2 reuniões de pauta\nGestão de LinkedIn\n1 diária de captação de vídeo externa\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_premium": { name: "Plano de Marketing - Premium", price: 2999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\n1 Gravação de podcast de 1H mensal\nMentoria para cliente (Apresentação)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nCaptação de vídeo em nosso estúdio de gravação de vídeos com videomaker mobile\nCaptação de fotos comercias para criação de conteúdo\nGerente de conta", icon: Palette },
    "marketing_master": { name: "Plano de Marketing - Master", price: 3999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta, Google e YouTube)\nGestão do canal do YouTube\nGestão do Spotify para postagem do podcast\n3 postagens semanais (arte ou vídeos)\n4 episódios de 1 hora cada: No caso de meses com 5 semanas completas (de segunda a sexta), oferecemos um episódio adicional sem custo extra.\n2 cortes por episódio: Incluídos no pacote.\nOs episódios podem ser gravados em qualquer horário de segunda a sexta, entre 8h e 17h. (Feriados não estão inclusos.)", icon: Palette },
    "trafego_pago": { name: "Tráfego Pago - Avulso", price: 1200, description: "Planejamento Estratégico de Campanhas\nSegmentação Avançada de Público\nTeste A/B de Anúncios\nMonitoramento de Desempenho\nRelatórios Detalhados e Insights\nOtimização de Campanhas\nAcompanhamento de Leads\nGestão de Campanhas no Google e Meta Ads\n\nContrato de 6 meses. Valor promocional de R$2.000,00 por R$1.200,00.", icon: Megaphone },
    "podcast_bronze": { name: "Podcast - Bronze", price: 840, description: "4 episódios/mês (1h cada) gravados em nosso estúdio profissional, com edição de áudio e vídeo e distribuição nas principais plataformas (Spotify e YouTube).", icon: Mic },
    "podcast_prata": { name: "Podcast - Prata", price: 1600, description: "Tudo do plano Bronze, mais criação de 2 cortes estratégicos (pílulas de conteúdo) por episódio para redes sociais.", icon: Mic },
    "podcast_safira": { name: "Podcast - Safira", price: 2000, description: "Tudo do plano Prata, mais 2 cortes estratégicos por episódio (total de 4), e 1 diária de captação externa para gravações especiais.", icon: Mic },
    "podcast_diamante": { name: "Podcast - Diamante", price: 2500, description: "Tudo do plano Safira, mais gestão completa do canal do YouTube com thumbnails profissionais e otimização de SEO.", icon: Mic },
    "identidade_visual": { name: "Identidade Visual", price: 2500, description: "A cara da sua marca. Criação de logo, paleta de cores, tipografia e um manual de marca completo para garantir consistência.", icon: Sparkles },
    "website": { name: "Website Institucional", price: 5000, description: "Sua casa na internet. Criação de site com até 5 páginas, design responsivo e otimizado para os mecanismos de busca (SEO).", icon: Sparkles },
    "landing_page": { name: "Landing Page de Alta Conversão", price: 1800, description: "Foco total em resultado. Uma página 100% otimizada para campanhas específicas, com formulário integrado para captura de leads.", icon: Sparkles }
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
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()

  const { toast } = useToast();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: '',
      clientLogoUrl: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1707380659093-97e45913a9ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      partnershipDescription: 'Nossa parceria visa transformar o potencial do seu negócio em performance de mercado, construindo uma presença digital sólida e gerando resultados concretos.',
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
      objectiveItems: [{value: "Aumentar a autoridade da marca no setor"}],
      differentialItems: [{value: "Planejamento estratégico focado em resultados"}],
      investmentValue: 'R$ 0,00',
      discount: 0,
      idealPlanItems: [{value: "Construção de uma marca forte e reconhecida"}],
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
  
  const customServicesList = [
    { name: "Mídia Social", fieldName: "customServices.socialMedia", fields: smFields, append: appendSm, remove: removeSm, icon: Palette },
    { name: "Tráfego Pago", fieldName: "customServices.paidTraffic", fields: trafficFields, append: appendTraffic, remove: removeTraffic, icon: Megaphone },
    { name: "Podcast", fieldName: "customServices.podcast", fields: podcastFields, append: appendPodcast, remove: removePodcast, icon: Mic },
    { name: "Branding", fieldName: "customServices.branding", fields: brandingFields, append: appendBranding, remove: removeBranding, icon: ImageIcon },
    { name: "Website", fieldName: "customServices.website", fields: websiteFields, append: appendWebsite, remove: removeWebsite, icon: Sparkles },
    { name: "Landing Page", fieldName: "customServices.landingPage", fields: lpFields, append: appendLp, remove: removeLp, icon: FileText },
  ];
  
  const handleDownloadPdf = async () => {
    //TODO: Implement HTML to PDF generation
    toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A nova geração de PDF está sendo preparada.",
        variant: "default"
    });
  };

  const handleGenerateContent = async () => {
      const { clientName, packages } = form.getValues();
      if (!clientName) {
          toast({ title: "Nome do Cliente Faltando", description: "Preencha o nome do cliente para a IA gerar o conteúdo.", variant: "destructive" });
          return;
      }
       if (!useCustomServices && (!packages || packages.length === 0)) {
          toast({ title: "Nenhum Pacote Selecionado", description: "Selecione pelo menos um pacote de serviço para a IA gerar o conteúdo.", variant: "destructive" });
          return;
      }

      setIsGeneratingAi(true);

      const packagesWithDetails = packages?.reduce((acc: {name: string, description: string}[], key: string) => {
        const pkg = packageOptions[key as keyof typeof packageOptions];
        if (pkg) {
          acc.push({ name: pkg.name, description: pkg.description });
        }
        return acc;
      }, []);

      try {
          const result = await generateProposalContent({ clientName, packages: packagesWithDetails });
          
          form.setValue('partnershipDescription', result.partnershipDescription);
          form.setValue('objectiveItems', result.objectiveItems.map(item => ({value: item})));
          form.setValue('differentialItems', result.differentialItems.map(item => ({value: item})));
          form.setValue('idealPlanItems', result.idealPlanItems.map(item => ({value: item})));

          toast({ title: "Conteúdo Gerado!", description: "A IA preencheu os campos da proposta com textos persuasivos." });
      } catch (error) {
          console.error("AI Generation Error: ", error);
          toast({ title: "Erro na Geração", description: "Não foi possível gerar o conteúdo com a IA. Tente novamente.", variant: "destructive" });
      } finally {
          setIsGeneratingAi(false);
      }
  }

  const formSections = [
    { name: "Informações do Cliente", fields: ['clientName', 'clientLogoUrl'], icon: Target },
    { name: "Estilo e Serviços", fields: ['coverImageUrl', 'useCustomServices', 'packages'], icon: ListChecks },
    { name: "Geração com IA", fields: ['generateButton'], icon: Wand2 },
    { name: "Investimento", fields: ['investmentValue', 'discount'], icon: DollarSign },
  ];
  
   const proposalContent = (
      <>
          <Page className="bg-cover bg-center">
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
          <Page className="justify-center items-start flex-col">
              <h2 className="text-6xl font-bold uppercase mb-10 text-left w-full max-w-5xl mx-auto">Sobre a Parceria</h2>
              <div className="flex items-start gap-6 max-w-5xl mx-auto">
                  <div className="w-1 bg-[#FE5412] self-stretch"></div>
                  <Textarea 
                      {...form.register('partnershipDescription')} 
                      className="text-3xl font-light text-gray-200 text-left bg-transparent border-none p-0 h-auto resize-none focus-visible:ring-0" 
                      rows={4}
                  />
              </div>
          </Page>
          <Page className="">
              <div className="w-full max-w-5xl">
                  <h2 className="text-5xl font-bold uppercase mb-8">Nosso Objetivo</h2>
                  <ul className="space-y-4 text-xl font-light">
                      {watchedValues.objectiveItems?.map((item, i) => (
                          <li key={i} className="flex items-start gap-4"><Goal className="h-7 w-7 text-[#FE5412] mt-1 flex-shrink-0" /><Textarea {...form.register(`objectiveItems.${i}.value`)} className="bg-transparent border-none p-0 h-auto text-xl font-light resize-none focus-visible:ring-0" rows={1}/></li>
                      ))}
                  </ul>
              </div>
          </Page>
          <Page className="">
               <div className="w-full max-w-5xl">
                  <h2 className="text-5xl font-bold uppercase mb-8">Nossos Diferenciais</h2>
                  <ul className="space-y-4 text-xl font-light columns-2 gap-x-12">
                      {watchedValues.differentialItems?.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 mb-4 break-inside-avoid"><Sparkles className="h-7 w-7 text-[#FE5412] mt-1 flex-shrink-0" /><Textarea {...form.register(`differentialItems.${i}.value`)} className="bg-transparent border-none p-0 h-auto text-xl font-light resize-none focus-visible:ring-0" rows={2}/></li>
                      ))}
                  </ul>
               </div>
          </Page>
          <Page className="p-12 items-start justify-start">
              <div className="w-full max-w-full">
                  <h2 className="text-5xl font-bold uppercase mb-8 text-center">Escopo dos Serviços</h2>
                  {useCustomServices ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                          {customServicesList.map(({ name, fields, icon: Icon }) => (
                              fields.length > 0 && (
                                  <div key={name} className="bg-gray-900/70 p-6 rounded-lg border border-gray-700 flex flex-col">
                                      <Icon className="h-8 w-8 text-[#FE5412] mb-3" />
                                      <h3 className="font-bold text-lg">{name}</h3>
                                      <ul className="text-sm text-gray-400 mt-2 list-disc pl-4 space-y-1 flex-grow">
                                          {fields.map((field, index) => <li key={index}>{field.value}</li>)}
                                      </ul>
                                  </div>
                              )
                          ))}
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                          {watchedValues.packages?.map(pkgKey => {
                              const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
                              if (!pkg) return null;
                              const Icon = pkg.icon;
                              return (
                                  <div key={pkgKey} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 flex flex-col">
                                      <div className="flex-grow">
                                          <div className="flex items-center gap-3 mb-3">
                                              <Icon className="h-8 w-8 text-[#FE5412]" />
                                              <h3 className="font-bold text-lg">{pkg.name}</h3>
                                          </div>
                                          <p className="text-[10px] text-gray-400 mt-1 whitespace-pre-line leading-relaxed">{pkg.description}</p>
                                      </div>
                                      <div className="pt-2 mt-auto text-right">
                                          <span className="text-lg font-bold text-[#FE5412]">{pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  )}
              </div>
          </Page>
          <Page className="">
               <div className="w-full max-w-5xl text-center">
                  <h2 className="text-5xl font-bold uppercase mb-8">Por que este plano é <span className="text-[#FE5412]">ideal</span> para o seu negócio?</h2>
                   <ul className="space-y-4 text-xl font-light text-left max-w-3xl mx-auto">
                      {watchedValues.idealPlanItems?.map((item, i) => (
                          <li key={i} className="flex items-start gap-4"><Check className="h-7 w-7 text-green-400 mt-1 flex-shrink-0" /><Textarea {...form.register(`idealPlanItems.${i}.value`)} className="bg-transparent border-none p-0 h-auto text-xl font-light resize-none focus-visible:ring-0" rows={1}/></li>
                      ))}
                  </ul>
               </div>
          </Page>
          <Page className="">
              <div className="text-center border-4 border-[#FE5412] p-12 rounded-xl">
                  <h2 className="text-4xl font-bold uppercase mb-2">Investimento Mensal</h2>
                  <p className="text-8xl font-extrabold text-[#FE5412] mb-4">{watchedValues.investmentValue}</p>
                  <p className="font-semibold tracking-wider text-gray-400">INCLUI TODOS OS SERVIÇOS ESTRATÉGICOS ACIMA.</p>
              </div>
          </Page>
          <Page className="">
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
          <Page className="">
              <div className="text-center">
                  <h2 className="text-7xl font-bold uppercase">E <span className="text-[#FE5412]">agora?</span></h2>
                  <p className="text-2xl mt-4 text-gray-300 max-w-2xl mx-auto">O próximo passo é simples: basta responder a esta proposta para agendarmos nossa conversa inicial.</p>
              </div>
          </Page>
      </>
  );

  return (
    <div className="space-y-8">
      <div className="w-full space-y-4">
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
                          
                          {section.fields.includes('coverImageUrl') && <FormField control={form.control} name="coverImageUrl" render={({ field }) => <FormItem><FormLabel>URL da Imagem de Capa (Opcional)</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>} />}
                          
                          {section.fields.includes('useCustomServices') && (
                            <FormField
                                control={form.control}
                                name="useCustomServices"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Usar Serviços Personalizados?</FormLabel>
                                            <FormDescription>Ative para criar pacotes do zero.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                          )}

                          {section.fields.includes('packages') && (
                             useCustomServices ? (
                                <div className="space-y-4 pt-2">
                                    {customServicesList.map(({ name, fieldName, fields, append, remove, icon: Icon }) => (
                                        <div key={name} className="p-4 border rounded-md">
                                            <Label className="flex items-center gap-2 mb-2 font-semibold"><Icon className="h-5 w-5 text-primary" />{name}</Label>
                                            <div className="space-y-2">
                                                {fields.map((field, index) => (
                                                    <div key={field.id} className="flex items-center gap-2">
                                                        <FormField
                                                            control={form.control}
                                                            name={`${fieldName}.${index}.value` as any}
                                                            render={({ field }) => <FormItem className="flex-1"><FormControl><Input {...field} placeholder={`Item de ${name}`} /></FormControl></FormItem>}
                                                        />
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                                                    </div>
                                                ))}
                                                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => append({ value: '' })}><PlusCircle className="mr-2" />Adicionar Item</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             ) : (
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
                            )
                          )}
                          
                           {section.fields.includes('generateButton') && (
                            <div className="p-4 border rounded-md bg-muted/30 space-y-3">
                                <FormLabel className="flex items-center gap-2"><Bot />Geração de Textos com IA</FormLabel>
                                <FormDescription>Com base no cliente e nos pacotes selecionados, a IA irá gerar textos persuasivos e preencherá os campos da proposta automaticamente.</FormDescription>
                               <Button type="button" onClick={handleGenerateContent} disabled={isGeneratingAi}>
                                  {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                  {isGeneratingAi ? 'Gerando Conteúdo...' : 'Gerar Textos com IA'}
                               </Button>
                               {isGeneratingAi && <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos...</p>}
                            </div>
                          )}

                          
                          {section.fields.includes('investmentValue') && <FormField control={form.control} name="investmentValue" render={({ field }) => <FormItem><FormLabel>Valor do Investimento</FormLabel><FormControl><Input {...field} disabled={!useCustomServices} /></FormControl><FormMessage /></FormItem>} />}
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
         
         <Carousel className="w-full max-w-4xl mx-auto" setApi={setCarouselApi}>
            <CarouselContent>
                {React.Children.map(proposalContent.props.children, (child, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">{child}</div>
                    </CarouselItem>
                ))}
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


"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Wand2, FileText, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, Info, DollarSign, ListChecks, Check, BrainCircuit, Goal, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from "@/lib/utils";


type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;

const slideStyle = {
  background: "radial-gradient(ellipse at center, transparent 20%, #0A0A0A 70%), linear-gradient(rgba(230, 81, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(230, 81, 0, 0.1) 1px, transparent 1px)",
  backgroundSize: "100% 100%, 40px 40px, 40px 40px",
  backgroundColor: "#0A0A0A"
};

const GeneratedPresentation = React.forwardRef<HTMLDivElement, { content: GeneratePresentationOutput; clientName: string }>(({ content, clientName }, ref) => {
    
    return (
        <div ref={ref} className="proposal-container space-y-4">
          {/* Slide 1: Capa */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center items-center p-8 text-center text-white rounded-lg overflow-hidden">
            <h2 className="text-xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
            <h1 className="text-7xl font-extrabold my-4 max-w-5xl">{content.presentationTitle}</h1>
            <p className="text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          {/* Slide 2: Diagnóstico */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
            <p className="text-lg font-bold text-primary uppercase tracking-widest">O Ponto de Partida</p>
            <h1 className="text-6xl font-extrabold my-2">{content.diagnosticSlide.title}</h1>
            <div className="mt-8 flex items-start gap-6 max-w-7xl">
              {content.diagnosticSlide.content.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start h-full">
                    <p className="text-base text-gray-300 break-words flex-grow" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-xl font-bold text-primary mb-3 block">$1</strong>') }}/>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slide 3: Plano de Ação */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</p>
              <h1 className="text-6xl font-extrabold my-2">{content.actionPlanSlide.title}</h1>
              <div className="mt-8 flex items-start gap-6 max-w-7xl">
                {content.actionPlanSlide.content.map((item, index) => (
                   <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start h-full">
                       <p className="text-base text-gray-300 break-words flex-grow" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<strong class="text-xl font-bold text-white mb-2 block">$1</strong>') }} />
                   </div>
                ))}
              </div>
          </div>
          
          {/* Slide 4: Justificativa Estratégica */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <div className="max-w-7xl">
                  <p className="text-lg font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</p>
                  <h1 className="text-6xl font-extrabold my-2">{content.justificationSlide.title}</h1>
                  <p className="mt-6 text-lg text-gray-300 leading-relaxed break-words max-w-7xl">
                    {content.justificationSlide.content.join(' ')}
                  </p>
              </div>
          </div>

          {/* Slide 5: Cronograma */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Roadmap de Execução</p>
              <h1 className="text-6xl font-extrabold my-2">{content.timelineSlide.title}</h1>
              <ul className="mt-8 space-y-4 text-lg text-gray-300 max-w-7xl">
                {content.timelineSlide.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<strong class="text-primary">$1:</strong>') }}/>
                ))}
              </ul>
          </div>

          {/* Slide 6: KPIs */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
             <p className="text-lg font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</p>
             <h1 className="text-6xl font-extrabold my-2">{content.kpiSlide.title}</h1>
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl">
                 {content.kpiSlide.kpis.map((kpi, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                         <h4 className="font-bold text-base text-primary flex items-center gap-2"><TrendingUp/> {kpi.metric}</h4>
                         <p className="text-gray-300 mt-1 text-sm">Estimativa: <strong className="text-white">{kpi.estimate}</strong></p>
                         <p className="text-xs text-gray-400 mt-2 break-words">{kpi.importance}</p>
                    </div>
                 ))}
             </div>
          </div>
          
          {/* Slide 7: Diferenciais */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Por que a CP Marketing?</p>
              <h1 className="text-6xl font-extrabold my-2">{content.whyCpSlide.title}</h1>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl">
                  {content.whyCpSlide.content.map((item, index) => (
                    <div key={index} className="p-6 bg-white/5 border-t-4 border-primary rounded-lg h-full" >
                        <p className="text-base text-gray-300 break-words" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<h3 class="text-xl font-bold text-white mb-2">$1</h3>') }} />
                    </div>
                  ))}
              </div>
          </div>

           {/* Slide 8: Investimento */}
            <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center items-center p-10 text-center text-white rounded-lg overflow-hidden">
            {content.investmentSlide.items.length > 0 ? (
                <div className="flex flex-col items-center">
                    {content.investmentSlide.discount && (
                        <p className="text-5xl font-semibold text-red-500 line-through decoration-red-500/80 mb-2">
                            {content.investmentSlide.total}
                        </p>
                    )}
                    <p className="text-8xl font-bold text-primary tracking-tighter">
                        {content.investmentSlide.finalTotal}
                    </p>
                    <div className="mt-6 text-base text-white">
                         <div className="mt-2 text-center">
                            <p className="text-sm"><strong>Incluso:</strong> {content.investmentSlide.items.map(p => p.name).join(' + ')}</p>
                            {content.investmentSlide.discount && <p className="mt-1 text-sm"><strong>Desconto Aplicado:</strong> {content.investmentSlide.discount}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-7xl">
                    <p className="text-lg font-bold text-primary uppercase tracking-widest">Proposta de Investimento</p>
                    <h1 className="text-6xl font-extrabold my-2">Escolha o plano ideal para você</h1>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col h-full">
                            <h3 className="text-3xl font-bold text-white mb-2">Plano Essencial</h3>
                            <p className="text-gray-400 mb-6 flex-grow">A base para construir sua autoridade e iniciar a geração de resultados.</p>
                            <p className="text-5xl font-bold text-primary mb-6">R$ 2.999,00</p>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Gestão de Mídias Sociais</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Tráfego Pago Básico</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Relatórios Mensais</li>
                            </ul>
                        </div>
                        <div className="bg-white/10 border-2 border-primary rounded-xl p-8 flex flex-col h-full relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">RECOMENDADO</div>
                            <h3 className="text-3xl font-bold text-primary mb-2">Plano Completo</h3>
                            <p className="text-gray-300 mb-6 flex-grow">A solução completa para acelerar seu crescimento e dominar seu mercado.</p>
                            <p className="text-5xl font-bold text-primary mb-6">R$ 3.999,00</p>
                             <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Tudo do Plano Essencial</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> 1 Gravação de Podcast/Mês</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Captação de Vídeo em Estúdio</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Mentoria Estratégica</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            </div>

          {/* Slide 9: Próximos Passos */}
           <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] shadow-2xl flex flex-col justify-center items-center p-10 text-center text-white rounded-lg overflow-hidden">
                <Goal className="h-16 w-16 text-primary mx-auto mb-6"/>
                <h1 className="text-6xl font-extrabold my-2 text-white">Vamos Começar?</h1>
                <p className="text-xl text-gray-400 mt-4 max-w-6xl">Estamos prontos para aplicar nossa metodologia e paixão para transformar os resultados do seu negócio.</p>
                <div className="mt-12 flex items-stretch gap-8 w-full max-w-7xl">
                   {content.nextStepsSlide.content.map((step, index) => (
                     <div key={index} className="bg-white/5 p-6 rounded-lg border border-white/10 text-left flex-1 flex flex-col justify-center">
                        <span className="text-5xl font-bold text-primary">{index + 1}.</span>
                        <p className="mt-2 text-xl font-semibold text-white break-words">{step}</p>
                    </div>
                   ))}
                </div>
          </div>
        </div>
    );
});
GeneratedPresentation.displayName = 'GeneratedPresentation';


export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();

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

  const investmentValue = React.useMemo(() => {
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
    if (!presentationContent) return;
    
    setIsDownloading(true);
    toast({ title: 'Gerando PDF...', description: 'Aguarde um momento.' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const ReactDOM = await import('react-dom/client');
    const root = ReactDOM.createRoot(container);
    
    // Create a new element for each render to avoid conflicts
    const renderContainer = document.createElement('div');
    container.appendChild(renderContainer);

    root.render(<GeneratedPresentation content={presentationContent} clientName={form.getValues('clientName')} />);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay

    const slides = container.querySelectorAll<HTMLElement>('[data-slide]');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080]
    });

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const canvas = await html2canvas(slide, {
          scale: 1, // Use scale 1 to match PDF dimensions
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0A0A0A',
          width: 1920,
          height: 1080
        });
        const imgData = canvas.toDataURL('image/png', 0.95);
        
        if (i > 0) {
          pdf.addPage([1920, 1080], 'landscape');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080, undefined, 'FAST');
      }
      
      pdf.save(`Apresentacao_${form.getValues('clientName').replace(/\s/g, '_')}.pdf`);
      toast({ title: 'Download Concluído!', description: 'Seu PDF foi baixado com sucesso.' });

    } catch(err) {
        console.error("PDF Generation Error: ", err);
        toast({ title: 'Erro ao gerar PDF', description: 'Houve um problema na captura dos slides.', variant: 'destructive'});
    } finally {
        root.unmount();
        document.body.removeChild(container);
        setIsDownloading(false);
    }
  };
  

  return (
    <div className="space-y-8">
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
      
      {presentationContent && (
        <Card className="lg:sticky top-8">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wand2 /> Etapa 2: Apresentação Gerada</CardTitle>
            <CardDescription>A IA gerou a apresentação. Clique no botão abaixo para fazer o download do PDF.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>Apresentação Pronta!</AlertTitle>
                    <AlertDescription>
                        Os slides foram gerados com sucesso.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Baixar Apresentação (PDF)
                </Button>
                </div>
            </CardContent>
        </Card>
      )}

    </div>
  );
}

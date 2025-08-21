

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Wand2, FileText, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, Info, DollarSign, ListChecks, Check, BrainCircuit, Goal, Target, CheckCircle, Diamond, Repeat, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from "next/image";
import { cn } from "@/lib/utils";


type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;

const slideStyles = {
  base: {
    backgroundColor: "#0A0A0A",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
      radial-gradient(ellipse 80% 80% at 50% -20%, rgba(230, 81, 0, 0.20), hsla(0, 0%, 100%, 0))
    `,
    backgroundSize: '30px 30px, 30px 30px, 100% 100%',
  },
  capa: {
    backgroundColor: "#0A0A0A",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, rgba(230, 81, 0, 0.20) 0%, hsla(0, 0%, 100%, 0) 60%)
    `,
    backgroundSize: '30px 30px, 30px 30px, 100% 100%',
  },
  objetivos: {
    backgroundColor: "#0A0A0A",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
      radial-gradient(circle at 20% 100%, rgba(230, 81, 0, 0.20) 0%, hsla(0, 0%, 100%, 0) 60%)
    `,
     backgroundSize: '30px 30px, 30px 30px, 100% 100%',
  },
  investimento: {
     backgroundColor: "#0A0A0A",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
      radial-gradient(circle at 80% 100%, rgba(230, 81, 0, 0.20) 0%, hsla(0, 0%, 100%, 0) 60%)
    `,
     backgroundSize: '30px 30px, 30px 30px, 100% 100%',
  }
};

const kpiIcons = {
    TrendingUp,
    Target,
    DollarSign,
    Repeat,
    Users,
};

export const GeneratedPresentation = React.forwardRef<HTMLDivElement, { content: GeneratePresentationOutput; clientName: string }>(({ content, clientName }, ref) => {
    
    const cpSolutions = {
        'Pilar 1 - Aquisição': '<strong>Nossa Solução:</strong> Criamos campanhas de tráfego pago focadas em ROI e otimizamos a conversão para não desperdiçar seu investimento.',
        'Pilar 2 - Conversão': '<strong>Nossa Solução:</strong> Desenvolvemos funis de vendas e automações que nutrem o lead, qualificam o interesse e entregam oportunidades prontas para o fechamento.',
        'Pilar 3 - Autoridade': '<strong>Nossa Solução:</strong> Com estúdios próprios e uma equipe completa, produzimos conteúdo de alta qualidade em escala para posicionar sua marca como líder de mercado.',
    };
    
    const defaultPackages = [
        { name: 'Plano Essencial', price: 'R$ 2.999,00' },
        { name: 'Plano Premium', price: 'R$ 3.999,00' }
    ];

    const investmentItems = content.investmentSlide.items.length > 0 
        ? content.investmentSlide.items
        : defaultPackages;

    return (
        <div ref={ref} className="proposal-container space-y-4 font-body">
          {/* Slide 1: Capa */}
           <div data-slide style={slideStyles.capa} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center items-center p-8 text-center text-white rounded-lg overflow-hidden">
            <h2 className="text-lg font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
            <h1 className="text-6xl font-extrabold my-4 max-w-4xl">{content.presentationTitle}</h1>
            <p className="text-lg text-gray-400">Proposta elaborada por CP Marketing Digital - {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-md text-gray-500 mt-2 italic">Proposta válida por 7 dias</p>
          </div>
          
           {/* Slide 2: Diferenciais (About Us) */}
            <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
                <div className="flex flex-col justify-center h-full max-w-6xl">
                    <p className="text-md font-bold text-primary uppercase tracking-widest">Sobre Nós</p>
                    <h1 className="text-5xl font-extrabold my-2">{content.whyCpSlide.title}</h1>
                    <div className="mt-6 grid grid-cols-3 gap-6">
                        {content.whyCpSlide.content.map((item, index) => (
                            <div key={index} className="p-4 bg-white/5 border-t-2 border-primary rounded-lg h-full">
                                <p className="text-sm text-gray-300 break-words" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<h3 class="text-lg font-bold text-white mb-2">$1</h3>') }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


          {/* Slide 3: Diagnóstico */}
           <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
            <div className="w-full flex flex-col justify-center h-full">
                <p className="text-md font-bold text-primary uppercase tracking-widest">O Ponto de Partida</p>
                <h1 className="text-5xl font-extrabold my-2">{content.diagnosticSlide.title}</h1>
                 <div className="mt-6 flex justify-center items-stretch gap-4 w-full max-w-5xl mx-auto">
                    {content.diagnosticSlide.content.map((item, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 flex flex-col items-start min-h-[14rem]">
                            <p className="text-sm text-gray-300 break-words flex-grow" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/g, '<strong class="text-lg font-bold text-primary mb-2 block">$1</strong>') }}/>
                        </div>
                    ))}
                </div>
                 <div className="mt-8 w-full max-w-5xl mx-auto bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                    <p className="text-lg text-gray-300 italic">{content.diagnosticSlide.question}</p>
                </div>
            </div>
          </div>
          
          {/* Slide 4: Plano de Ação */}
          <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
            <div className="flex flex-col justify-center h-full text-center">
              <p className="text-md font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</p>
              <h1 className="text-5xl font-extrabold my-2">{content.actionPlanSlide.title}</h1>
              <div className="mt-8 flex justify-center items-start gap-6 w-full">
                  {content.actionPlanSlide.content.map((item, index) => {
                      const pilarTitleMatch = item.match(/\*\*(.*?):\*\*/);
                      const pilarTitle = pilarTitleMatch ? pilarTitleMatch[1] : `Pilar ${index + 1}`;
                      // @ts-ignore
                      const cpSolutionText = cpSolutions[pilarTitle] || '';

                      return (
                          <div key={index} className="flex flex-col gap-4 flex-1 max-w-sm">
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 flex flex-col items-start h-full text-left">
                                  <p className="text-sm text-gray-300 break-words flex-grow" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<strong class="text-lg font-bold text-white mb-2 block">$1</strong>') }} />
                              </div>
                              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex-1 flex flex-col items-start h-full text-left">
                                  <p className="text-sm text-primary/90 break-words flex-grow" dangerouslySetInnerHTML={{ __html: cpSolutionText }} />
                              </div>
                          </div>
                      );
                  })}
              </div>
            </div>
          </div>

          
          {/* Slide 5: Justificativa Estratégica */}
           <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
            <div className="flex flex-col justify-center h-full max-w-5xl">
                  <p className="text-md font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</p>
                  <h1 className="text-5xl font-extrabold my-2">{content.justificationSlide.title}</h1>
                  <p className="mt-4 text-md text-gray-300 leading-relaxed break-words max-w-5xl">
                    {content.justificationSlide.content.join(' ')}
                  </p>
              </div>
          </div>

           {/* Slide 6: Cronograma */}
           <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
                <div className="w-full flex flex-col justify-center h-full">
                    <p className="text-md font-bold text-primary uppercase tracking-widest">Roadmap de Execução</p>
                    <h1 className="text-5xl font-extrabold my-2">{content.timelineSlide.title}</h1>
                    <div className="mt-12 w-full max-w-6xl mx-auto">
                        <div className="grid grid-cols-3 items-start gap-8 relative">
                            {/* Dotted line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-center" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)`, backgroundSize: '10px 2px' }}></div>
                            
                            {content.timelineSlide.content.map((item, index) => {
                                const icons = [CheckCircle, Diamond, Goal];
                                const Icon = icons[index] || Goal;
                                return (
                                    <div key={index} className="flex flex-col items-center text-center relative z-10">
                                        <div className="w-10 h-10 bg-primary rounded-full border-4 border-background flex items-center justify-center mb-4">
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full min-h-[12rem]">
                                            <span className="font-bold text-primary mb-1 block">Fase {index + 1}</span>
                                            <div className="text-sm text-gray-300 break-words" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?):\*\*/, '<strong class="text-md font-bold text-white mb-1 block">$1</strong>') }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

          {/* Slide 7: KPIs */}
           <div data-slide style={slideStyles.base} className="w-[1280px] h-[720px] shadow-2xl flex flex-col p-10 text-white rounded-lg overflow-hidden">
             <div className="w-full flex flex-col justify-center h-full">
                <p className="text-md font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</p>
                <h1 className="text-5xl font-extrabold my-2">{content.kpiSlide.title}</h1>
                <div className="mt-6 flex items-stretch justify-center gap-4 max-w-6xl mx-auto">
                    {content.kpiSlide.kpis.map((kpi, index) => {
                        const Icon = kpiIcons[kpi.icon] || TrendingUp;
                        return (
                            <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex-1 flex flex-col h-full">
                                <div className="flex-grow">
                                    <Icon className="h-6 w-6 text-primary mb-3" />
                                    <h4 className="font-bold text-md text-white">{kpi.metric}</h4>
                                    <p className="text-gray-300 mt-1 text-2xl font-bold">{kpi.estimate}</p>
                                    <p className="text-sm text-gray-400 mt-4 break-words">{kpi.importance}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>
          </div>
          
           {/* Slide 8: Investimento */}
            <div data-slide style={slideStyles.investimento} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center items-center p-10 text-white rounded-lg overflow-hidden">
                <div className="w-full max-w-5xl mx-auto grid grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                         <p className="text-md font-bold text-primary uppercase tracking-widest">Proposta de Investimento</p>
                         <h1 className="text-5xl font-extrabold my-2">{content.investmentSlide.title}</h1>
                         <p className="text-lg text-gray-400 mt-4">Uma proposta transparente para uma parceria de resultados.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                      {investmentItems.length > 0 ? (
                        <>
                          <div className="space-y-3">
                            {investmentItems.map(item => (
                                <div key={item.name} className="flex justify-between items-center text-sm text-gray-300">
                                    <span>{item.name}</span>
                                    <span>{item.price}</span>
                                </div>
                            ))}
                          </div>
                           {content.investmentSlide.items.length > 0 && (
                            <>
                                <div className="my-4 border-t border-dashed border-white/20"></div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center text-sm text-gray-400">
                                       <span>Subtotal</span>
                                       <span>{content.investmentSlide.total}</span>
                                     </div>
                                     {content.investmentSlide.discount && (
                                        <div className="flex justify-between items-center text-sm text-green-400">
                                            <span>Desconto Especial</span>
                                            <span>{content.investmentSlide.discount}</span>
                                        </div>
                                     )}
                                </div>
                                <div className="my-4 border-t border-solid border-white/50"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-white">Total do Investimento</span>
                                    <span className="text-3xl font-bold text-primary">{content.investmentSlide.finalTotal}</span>
                                </div>
                            </>
                           )}
                        </>
                      ) : (
                          <p className="text-center text-gray-400">Nenhum pacote selecionado. Consulte os planos disponíveis.</p>
                      )}
                    </div>
                </div>
            </div>

          {/* Slide 9: Próximos Passos */}
           <div data-slide style={slideStyles.objetivos} className="w-[1280px] h-[720px] shadow-2xl flex flex-col justify-center items-center p-10 text-center text-white rounded-lg overflow-hidden">
                <Goal className="h-12 w-12 text-primary mx-auto mb-4"/>
                <h1 className="text-5xl font-extrabold my-2 text-white">{content.nextStepsSlide.title}</h1>
                <p className="text-lg text-gray-400 mt-2 max-w-4xl">Estamos prontos para aplicar nossa metodologia e paixão para transformar os resultados do seu negócio.</p>
                <div className="mt-8 flex items-stretch gap-6 w-full max-w-5xl">
                   {content.nextStepsSlide.content.map((step, index) => (
                     <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 text-left flex-1 flex flex-col justify-center">
                        <span className="text-4xl font-bold text-primary">{index + 1}.</span>
                        <p className="mt-2 text-lg font-semibold text-white break-words">{step}</p>
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
    
    let dataToSubmit = values;

    if (!values.clientName) {
        toast({
            title: "Usando Dados Fictícios",
            description: "O nome do cliente não foi preenchido. Gerando apresentação de exemplo.",
        });
        dataToSubmit = {
            clientName: "Clínica Vitalize",
            faturamentoMedio: "R$ 50.000",
            metaFaturamento: "R$ 120.000",
            ticketMedio: "R$ 800",
            origemClientes: "Indicação e pesquisa no Google.",
            tempoEmpresa: "5 anos",
            motivacaoMarketing: "Estagnação no crescimento e desejo de se tornar referência na região.",
            investimentoAnterior: "Já impulsionaram posts no Instagram, sem estratégia clara e com pouco retorno.",
            tentativasAnteriores: "Contrataram um sobrinho para cuidar das redes sociais, mas a comunicação era amadora.",
            principalGargalo: "Geração de leads qualificados. O telefone toca pouco e os contatos que chegam não têm perfil para fechar.",
            custoProblema: "R$ 20.000 por mês em oportunidades perdidas.",
            envolvidosDecisao: "Apenas o sócio principal.",
            orcamentoPrevisto: "Entre R$ 4.000 e R$ 6.000 por mês.",
            prazoDecisao: "30 dias.",
            packages: ['marketing_premium', 'captacao_estudio_contrato'],
            discount: 500,
        };
        form.reset(dataToSubmit);
    }
    
    try {
      const result = await generatePresentation(dataToSubmit);
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
    toast({ title: 'Gerando PDF...', description: 'Aguarde um momento. Este processo pode ser lento.' });

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);
    
    const ReactDOM = (await import('react-dom/client')).default;
    const root = ReactDOM.createRoot(container);
    
    const renderContainer = document.createElement('div');
    container.appendChild(renderContainer);

    root.render(<GeneratedPresentation content={presentationContent} clientName={form.getValues('clientName')} />);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const slides = container.querySelectorAll<HTMLElement>('[data-slide]');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [720, 1280]
    });

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const canvas = await html2canvas(slide, {
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0A0A0A',
          width: 1280,
          height: 720
        });
        const imgData = canvas.toDataURL('image/png', 0.95);
        
        if (i > 0) {
          pdf.addPage([720, 1280], 'landscape');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720, undefined, 'FAST');
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
      
      <Card className="lg:sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 /> Etapa 2: Apresentação Gerada</CardTitle>
          <CardDescription>A IA gerou a apresentação. Clique no botão abaixo para fazer o download do PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          {presentationContent ? (
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
          ) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
              <p>A apresentação gerada aparecerá aqui.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    

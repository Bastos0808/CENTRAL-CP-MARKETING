
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
import { Loader2, Wand2, FileText, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, Info, DollarSign, ListChecks, Check, BrainCircuit, Goal, Target, CheckCircle, Diamond, Repeat, Users, Star, Search, Workflow, Palette, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";
import { useRouter } from "next/navigation";


type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;


export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<GeneratePresentationOutput | null>(null);
  const [htmlTemplate, setHtmlTemplate] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

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
  
  useEffect(() => {
    fetch('/slide-template.html')
      .then(response => response.text())
      .then(text => setHtmlTemplate(text))
      .catch(error => console.error("Failed to load HTML template:", error));
  }, []);


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
      toast({ title: "Apresentação Gerada!", description: "Revise os slides abaixo e clique para baixar." });
    } catch(error) {
      console.error("Error generating presentation:", error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar a apresentação. Tente novamente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillWithExample = () => {
    form.reset({
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
    });
    toast({ title: 'Formulário Preenchido!', description: 'Dados de exemplo foram carregados.' });
  }

 const handleDownload = () => {
    if (!presentationContent || !htmlTemplate) {
      toast({ title: 'Erro', description: 'Gere o conteúdo da apresentação primeiro.', variant: 'destructive'});
      return;
    }
    
    const {
        presentationTitle,
        diagnosticSlide,
        actionPlanSlide,
        timelineSlide,
        kpiSlide,
        whyCpSlide,
        justificationSlide,
        investmentSlide,
        nextStepsSlide
    } = presentationContent;

    const escapeHtml = (text: any): string => {
        if (typeof text !== 'string') {
            return '';
        }
        return text.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;")
                   .replace(/\n/g, '<br>');
    };
    

    const listToHtml = (items: string[]) => {
        if (!items || items.length === 0) return '<ul></ul>';
        const listItems = items.map(item => `<li>${escapeHtml(item).replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    };

    const kpiIcons: { [key: string]: string } = {
        TrendingUp: '📈',
        Target: '🎯',
        DollarSign: '💰',
        Repeat: '🔁',
        Users: '👥',
    };

    const kpiItemsHtml = kpiSlide.kpis.map(kpi => `
        <div class="kpi-item">
            <h4>${kpiIcons[kpi.icon] || '-'} ${escapeHtml(kpi.metric)}</h4>
            <p class="kpi-estimate">${escapeHtml(kpi.estimate)}</p>
            <p class="kpi-importance">${escapeHtml(kpi.importance)}</p>
        </div>
    `).join('');

    const investmentItemsHtml = investmentSlide.items.map(item => `
        <tr>
            <td>${escapeHtml(item.name)}</td>
            <td class="price">${escapeHtml(item.price)}</td>
        </tr>
    `).join('');
    
    let investmentHtml = `
      <table>
          <tbody>
              ${investmentItemsHtml}
          </tbody>
          <tfoot>
              <tr>
                  <td>Subtotal</td>
                  <td class="price">${escapeHtml(investmentSlide.total)}</td>
              </tr>
    `;

    if (investmentSlide.discount && investmentSlide.discount.trim() !== 'N/A' && parseFloat(investmentSlide.discount.replace(/[^0-9,-]+/g,"").replace(',','.')) !== 0) {
        investmentHtml += `
              <tr class="discount">
                  <td>Desconto</td>
                  <td class="price">${escapeHtml(investmentSlide.discount)}</td>
              </tr>
        `;
    }

    investmentHtml += `
              <tr class="total">
                  <td>Total</td>
                  <td class="price">${escapeHtml(investmentSlide.finalTotal)}</td>
              </tr>
          </tfoot>
      </table>
    `;

    const replacements = {
        '{{presentationTitle}}': escapeHtml(presentationTitle),
        '{{clientName}}': escapeHtml(form.getValues('clientName')),
        '{{diagnosticTitle}}': escapeHtml(diagnosticSlide.title),
        '{{{diagnosticContent}}}': listToHtml(diagnosticSlide.content),
        '{{diagnosticQuestion}}': escapeHtml(diagnosticSlide.question),
        '{{actionPlanTitle}}': escapeHtml(actionPlanSlide.title),
        '{{{actionPlanPillar1}}}': escapeHtml(actionPlanSlide.content[0]),
        '{{{actionPlanPillar2}}}': escapeHtml(actionPlanSlide.content[1]),
        '{{{actionPlanPillar3}}}': escapeHtml(actionPlanSlide.content[2]),
        '{{timelineTitle}}': escapeHtml(timelineSlide.title),
        '{{{timelineContent}}}': listToHtml(timelineSlide.content),
        '{{kpiTitle}}': escapeHtml(kpiSlide.title),
        '{{{kpiItems}}}': kpiItemsHtml,
        '{{whyCpTitle}}': escapeHtml(whyCpSlide.title),
        '{{{whyCpContent}}}': listToHtml(whyCpSlide.content),
        '{{justificationTitle}}': escapeHtml(justificationSlide.title),
        '{{{justificationContent}}}': escapeHtml(justificationSlide.content),
        '{{investmentTitle}}': escapeHtml(investmentSlide.title),
        '{{{investmentTable}}}': investmentHtml,
        '{{nextStepsTitle}}': escapeHtml(nextStepsSlide.title),
        '{{{nextStepsContent}}}': listToHtml(nextStepsSlide.content)
    };

    let finalHtml = htmlTemplate;
    for (const [key, value] of Object.entries(replacements)) {
      finalHtml = finalHtml.replace(new RegExp(key.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1'), 'g'), value);
    }

    const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apresentacao_${form.getValues('clientName').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <div className="flex items-center gap-4">
                    <Button type="button" variant="secondary" onClick={handleFillWithExample}>Preencher com Exemplo</Button>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        Gerar Conteúdo da Apresentação
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="lg:sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 /> Etapa 2: Apresentação Gerada</CardTitle>
          <CardDescription>A IA gerou o conteúdo. Clique no botão abaixo para baixar o arquivo HTML da apresentação.</CardDescription>
        </CardHeader>
        <CardContent>
          {presentationContent ? (
            <div className="space-y-4">
              <Alert>
                <BrainCircuit className="h-4 w-4" />
                <AlertTitle>Conteúdo Pronto!</AlertTitle>
                <AlertDescription>
                  O conteúdo foi gerado com sucesso.
                </AlertDescription>
              </Alert>
              <Button onClick={handleDownload} className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Apresentação (.html)
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
              <p>O conteúdo da apresentação aparecerá aqui após a geração.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

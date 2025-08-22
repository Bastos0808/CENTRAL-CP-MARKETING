
"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2, Wand2, ArrowRight, TrendingUp, HandCoins, UserCheck, DollarSign, ListChecks, Check, BrainCircuit, Goal, Target, Briefcase, Smile, ChevronsUp, FileText, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";
import { useRouter } from "next/navigation";


type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;

const CurrencyInput = React.forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
        value: number | undefined;
        onValueChange: (value: number | undefined) => void;
    }
>(({ value, onValueChange, ...props }, ref) => {
    
    const formatToCurrency = (num: number | undefined) => {
        if (num === undefined || num === null || isNaN(num)) return '';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };
    
    const [displayValue, setDisplayValue] = useState(formatToCurrency(value));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const numbers = val.replace(/\D/g, '');
        setDisplayValue(val);
        const numericValue = Number(numbers) / 100;
        if (!isNaN(numericValue)) {
          onValueChange(numericValue);
        } else {
          onValueChange(undefined);
        }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
        if (!isNaN(numericValue)) {
             setDisplayValue(formatToCurrency(numericValue));
        } else {
            setDisplayValue('');
        }
    };
    
     const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const plainNumber = e.target.value.replace(/\D/g, '');
        setDisplayValue(plainNumber);
    };

    React.useEffect(() => {
        setDisplayValue(formatToCurrency(value));
    }, [value]);


    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        type="text"
        inputMode="numeric"
        {...props}
      />
    );
});
CurrencyInput.displayName = 'CurrencyInput';


export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(DiagnosticFormSchema),
    defaultValues: {
      clientName: "",
      faturamentoMedio: undefined,
      metaFaturamento: undefined,
      ticketMedio: undefined,
      origemClientes: "",
      tempoEmpresa: "",
      motivacaoMarketing: "",
      experienciaMarketing: "",
      tentativasAnteriores: "",
      principalGargalo: "",
      impactoGargalo: "",
      impactoAreas: "",
      sentimentoPessoal: "",
      clientesPerdidos: "",
      custoProblema: undefined,
      potencialResolucao: "",
      prioridadeResolucao: "",
      visaoFuturo: "",
      visaoFuturoPessoal: "",
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
      toast({ title: "Apresentação Gerada!", description: "O conteúdo dos slides está pronto. Clique em 'Baixar Apresentação'." });
    } catch(error) {
      console.error("Error generating presentation:", error);
      toast({ title: "Erro na Geração", description: "Não foi possível gerar a apresentação. Tente novamente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadInteractive = async () => {
    if (!presentationContent) {
      toast({ title: "Erro", description: "Gere o conteúdo da apresentação primeiro.", variant: "destructive" });
      return;
    }
    
    try {
      const templateResponse = await fetch('/slide-template.html');
      if (!templateResponse.ok) throw new Error("Template não encontrado.");
      
      let htmlContent = await templateResponse.text();

      const escapeHtml = (text: any): string => {
        if (typeof text !== 'string') return '';
        return text
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
      }

      const listToHtml = (items: string[] | undefined): string => {
          if (!items || !Array.isArray(items)) return '';
          return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
      };
      
      const pillarToHtml = (items: {title: string, description: string}[] | undefined): string => {
          if (!items || !Array.isArray(items)) return '';
          return items.map(item => `
              <div class="content-card">
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description)}</p>
              </div>`).join('');
      };

       const kpiToHtml = (kpis: GeneratePresentationOutput['kpiSlide']['kpis'] | undefined): string => {
            if (!kpis || !Array.isArray(kpis)) return '';
            const emojiMap: { [key: string]: string } = {
                'TrendingUp': '📈', 'Target': '🎯', 'DollarSign': '💰', 'Repeat': '🔁', 'Users': '👥'
            };
            return kpis.map(kpi => `
                <div class="kpi-item">
                    <h4>${emojiMap[kpi.icon] || '📊'} ${escapeHtml(kpi.metric)}</h4>
                    <p class="kpi-estimate">${escapeHtml(kpi.estimate)}</p>
                    <p class="kpi-importance">${escapeHtml(kpi.importance)}</p>
                </div>
            `).join('');
        };

      const investmentTableToHtml = (investment: GeneratePresentationOutput['investmentSlide'] | undefined): string => {
          if (!investment) return '';
          
          const itemsHtml = investment.items.map(item => `
              <tr>
                  <td>${escapeHtml(item.name)}</td>
                  <td class="price">${escapeHtml(item.price)}</td>
              </tr>
          `).join('');

          const discountHtml = investment.discount ? `
              <tr class="discount">
                  <td>Desconto Especial</td>
                  <td class="price">${escapeHtml(investment.discount)}</td>
              </tr>
          ` : '';

          return `
              <table>
                  <tbody>${itemsHtml}</tbody>
                  <tfoot>
                      ${discountHtml}
                      <tr class="total">
                          <td>Valor Final</td>
                          <td class="price">${escapeHtml(investment.finalTotal)}</td>
                      </tr>
                  </tfoot>
              </table>
          `;
      };

      const actionPlanPillars = presentationContent.actionPlanSlide.content.map((item, index) => {
          const titles = ["Pilar 1: Aquisição", "Pilar 2: Conversão", "Pilar 3: Autoridade"];
          return {
              title: titles[index],
              description: item
          };
      });

      const timelineItems = presentationContent.timelineSlide.content.map((item, index) => {
          const titles = ["Semanas 1-2 (Setup e Imersão)", "Semanas 3-12 (Execução e Otimização)", "Revisões Estratégicas"];
          return {
              title: titles[index],
              description: item
          };
      });

      const replacements: Record<string, string> = {
          clientName: escapeHtml(form.getValues('clientName')),
          presentationTitle: escapeHtml(presentationContent.presentationTitle),
          diagnosticTitle: escapeHtml(presentationContent.diagnosticSlide.title),
          diagnosticQuestion: escapeHtml(presentationContent.diagnosticSlide.question),
          diagnosticContent: pillarToHtml(presentationContent.diagnosticSlide.content.map((item, index) => {
              const titles = ["Meta Principal", "Gargalo Crítico", "Custo da Inação"];
              return { title: titles[index], description: item };
          })),
          actionPlanTitle: escapeHtml(presentationContent.actionPlanSlide.title),
          actionPlanContent: pillarToHtml(actionPlanPillars),
          timelineTitle: escapeHtml(presentationContent.timelineSlide.title),
          timelineContent: pillarToHtml(timelineItems),
          kpiTitle: escapeHtml(presentationContent.kpiSlide.title),
          kpiItems: kpiToHtml(presentationContent.kpiSlide.kpis),
          whyCpTitle: escapeHtml(presentationContent.whyCpSlide.title),
          whyCpContent: pillarToHtml(presentationContent.whyCpSlide.content.map((item, index) => {
              const titles = ["Mentoria e Agilidade", "Produção Própria", "Foco em Business Performance"];
              return { title: titles[index], description: item };
          })),
          justificationTitle: escapeHtml(presentationContent.justificationSlide.title),
          justificationContent: `<p>${escapeHtml(presentationContent.justificationSlide.content)}</p>`,
          investmentTitle: escapeHtml(presentationContent.investmentSlide.title),
          investmentTable: investmentTableToHtml(presentationContent.investmentSlide),
          nextStepsTitle: escapeHtml(presentationContent.nextStepsSlide.title),
          nextStepsContent: pillarToHtml(presentationContent.nextStepsSlide.content.map((item, index) => {
              const titles = ["Alinhamento e Assinatura", "Pagamento da Parcela Inicial", "Onboarding e Kick-off"];
              return { title: titles[index], description: item };
          })),
      };
      
      for (const key in replacements) {
          htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
      }

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Apresentacao_${form.getValues('clientName').replace(/\s/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Error downloading presentation:", error);
      toast({ title: "Erro no Download", description: "Não foi possível criar o arquivo da apresentação.", variant: "destructive" });
    }
  };


  const handleFillWithExample = () => {
    form.reset({
        clientName: "Clínica Vitalize",
        tempoEmpresa: "5 anos",
        faturamentoMedio: 50000,
        metaFaturamento: 120000,
        ticketMedio: 800,
        origemClientes: "90% vem de indicação e um pouco do Instagram.",
        motivacaoMarketing: "Chegamos num platô, o crescimento estagnou e a concorrência aumentou muito.",
        experienciaMarketing: "Sim, já contratamos uma agência no passado, mas não deu certo.",
        tentativasAnteriores: "Fizeram uns posts bonitos no Instagram, mas não gerou clientes. O tráfego pago que fizeram só trazia curiosos sem perfil.",
        principalGargalo: "Geração de leads. Chega muito pouca gente nova procurando pela clínica.",
        impactoGargalo: "A agenda dos profissionais fica com muitos buracos durante a semana. A equipe poderia produzir e atender muito mais.",
        impactoAreas: "Sim, com a receita estagnada, a gente para de investir em equipamentos novos e na modernização da clínica.",
        sentimentoPessoal: "É frustrante. Sei que temos potencial e um serviço ótimo, mas me sinto um pouco perdido sobre qual o próximo passo para crescer.",
        clientesPerdidos: "Acredito que uns 10 clientes a mais, fácil.",
        custoProblema: 20000,
        potencialResolucao: "Eu finalmente contrataria mais um especialista que estou precisando e faria aquela reforma na recepção.",
        visaoFuturo: "A agenda estaria cheia com 2 semanas de antecedência e teríamos uma previsibilidade de faturamento que hoje não existe.",
        visaoFuturoPessoal: "Com certeza, muito mais tranquilidade para gerir o negócio e quem sabe tirar umas férias sem me preocupar tanto.",
        prioridadeResolucao: "Sim, é a prioridade total agora.",
        envolvidosDecisao: "A decisão final é minha, mas gosto de conversar com minha esposa.",
        orcamentoPrevisto: "Penso em investir entre R$ 4.000 e R$ 6.000 por mês, dependendo do retorno que podemos ter.",
        prazoDecisao: "Tenho urgência. Se a proposta fizer sentido, podemos começar já no próximo mês.",
        packages: ['marketing_premium', 'captacao_estudio_contrato'],
        discount: 500,
    });
    toast({ title: 'Formulário Preenchido!', description: 'Dados de exemplo foram carregados.' });
  }

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
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary"/>Cenário e Metas</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="tempoEmpresa" render={({ field }) => (<FormItem><FormLabel>Me conta um pouco da história da empresa, há quanto tempo vocês estão no mercado?</FormLabel><FormControl><Input placeholder='Ex: "Estamos há 12 anos."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="faturamentoMedio" render={({ field }) => (<FormItem><FormLabel>E hoje, para eu entender o momento de vocês, qual é o faturamento médio mensal?</FormLabel><FormControl><CurrencyInput placeholder="R$ 50.000,00" value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metaFaturamento" render={({ field }) => (<FormItem><FormLabel>Olhando para o futuro, qual é a meta de faturamento para os próximos 6 meses?</FormLabel><FormControl><CurrencyInput placeholder="R$ 120.000,00" value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="ticketMedio" render={({ field }) => (<FormItem><FormLabel>Qual o ticket médio do seu principal serviço ou produto?</FormLabel><FormControl><CurrencyInput placeholder="R$ 2.000,00" value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="origemClientes" render={({ field }) => (<FormItem><FormLabel>Atualmente, a maioria dos seus clientes chega como? É mais por indicação?</FormLabel><FormControl><Input placeholder='Ex: "90% vem de indicação."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Briefcase className="h-6 w-6 text-primary"/>O Desafio Atual</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="motivacaoMarketing" render={({ field }) => (<FormItem><FormLabel>O que te motivou a buscar uma solução de marketing exatamente agora?</FormLabel><FormControl><Textarea placeholder='Ex: "Chegamos num platô, não estamos crescendo."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="experienciaMarketing" render={({ field }) => (<FormItem><FormLabel>Vocês já tiveram alguma experiência com marketing antes, seja com agência ou time interno?</FormLabel><FormControl><Textarea placeholder='Ex: "Sim, já contratei uma agência, mas não deu certo."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tentativasAnteriores" render={({ field }) => (<FormItem><FormLabel>Nessas tentativas, o que você sentiu que não funcionou como deveria?</FormLabel><FormControl><Textarea placeholder='Ex: "Fizeram uns posts, mas não virou cliente."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="principalGargalo" render={({ field }) => (<FormItem><FormLabel>Se você pudesse apontar o maior gargalo hoje, onde ele estaria?</FormLabel><FormControl><Textarea placeholder="Ex: Geração, com certeza. Chega pouca gente." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="impactoGargalo" render={({ field }) => (<FormItem><FormLabel>Na prática, como esse gargalo afeta o dia a dia de vocês? A equipe fica ociosa em alguns momentos?</FormLabel><FormControl><Textarea placeholder='Ex: "Sim, a agenda fica com muitos buracos."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="impactoAreas" render={({ field }) => (<FormItem><FormLabel>Além do faturamento, essa situação impacta alguma outra área da empresa?</FormLabel><FormControl><Textarea placeholder='Ex: "Sim, a gente para de investir em equipamento."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sentimentoPessoal" render={({ field }) => (<FormItem><FormLabel>Imagino que seja um cenário desafiador. Como você, pessoalmente, se sente com isso?</FormLabel><FormControl><Textarea placeholder='Ex: "É frustrante, a gente sabe que tem potencial."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><HandCoins className="h-6 w-6 text-primary"/>O Custo do Problema</div></AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-6">
                     <FormField control={form.control} name="clientesPerdidos" render={({ field }) => (<FormItem><FormLabel>Com base no seu ticket médio, quantos clientes a mais você acredita que poderiam ter fechado no último mês se esse gargalo não existisse?</FormLabel><FormControl><Input placeholder='Ex: "Acho que uns 10 clientes a mais, fácil."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="custoProblema" render={({ field }) => (<FormItem><FormLabel>Então, em um número aproximado, quanto você diria que esse problema custa para a empresa por mês?</FormLabel><FormControl><CurrencyInput placeholder="R$ 20.000,00" value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="potencialResolucao" render={({ field }) => (<FormItem><FormLabel>E se a gente resolvesse isso, o que um fluxo constante de novos clientes permitiria que você fizesse hoje que não é possível?</FormLabel><FormControl><Textarea placeholder='Ex: "Eu contrataria mais um profissional."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><ChevronsUp className="h-6 w-6 text-primary"/>A Visão de Futuro</div></AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="visaoFuturo" render={({ field }) => (<FormItem><FormLabel>Se nos falássemos daqui a 6 meses e tudo tivesse dado certo, o que estaria acontecendo de diferente aqui?</FormLabel><FormControl><Textarea placeholder='Ex: "A agenda estaria cheia com antecedência."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="visaoFuturoPessoal" render={({ field }) => (<FormItem><FormLabel>E para você, pessoalmente, o que essa mudança traria?</FormLabel><FormControl><Textarea placeholder='Ex: "Com certeza, muito mais tranquilidade."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="prioridadeResolucao" render={({ field }) => (<FormItem><FormLabel>Então, ter um sistema para gerar novos clientes de forma previsível é uma prioridade para você agora?</FormLabel><FormControl><Input placeholder='Ex: "Sim, total prioridade."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><UserCheck className="h-6 w-6 text-primary"/>Próximos Passos</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="envolvidosDecisao" render={({ field }) => (<FormItem><FormLabel>Além de você, quem mais participa da decisão para aprovar um projeto como este?</FormLabel><FormControl><Input placeholder="Sócio, esposa, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="orcamentoPrevisto" render={({ field }) => (<FormItem><FormLabel>Para um projeto que busca resolver esse cenário, qual faixa de investimento mensal vocês consideram?</FormLabel><FormControl><Input placeholder="Ex: Penso em investir entre R$ 3k e R$ 5k." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="prazoDecisao" render={({ field }) => (<FormItem><FormLabel>Se encontrarmos o plano ideal, qual o seu prazo para tomar uma decisão e iniciar o projeto?</FormLabel><FormControl><Input placeholder='Ex: "Tenho urgência, o quanto antes."' {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
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
                                        <CurrencyInput 
                                            placeholder="R$ 0,00" 
                                            value={field.value} 
                                            onValueChange={field.onChange}
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
          <CardDescription>A IA gerou o conteúdo. Clique no botão abaixo para baixar a apresentação interativa em HTML.</CardDescription>
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
              <Button onClick={handleDownloadInteractive} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Baixar Apresentação Interativa
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


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
import { Loader2, Wand2, FileDown, ArrowRight, TrendingUp, HandCoins, UserCheck, DollarSign, ListChecks, Check, BrainCircuit, Goal, Target, Briefcase, Smile, ChevronsUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { generatePresentation } from "@/ai/flows/presentation-generator-flow";
import { GeneratePresentationOutput, DiagnosticFormSchema, packageOptions } from "@/ai/schemas/presentation-generator-schemas";
import type { z } from "zod";

type DiagnosticFormValues = z.infer<typeof DiagnosticFormSchema>;

const CurrencyInput = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value: number | undefined;
    onValueChange: (value: number | undefined) => void;
}>(({ value, onValueChange, ...props }, ref) => {
    
    const format = (num: number | undefined) => {
        if (num === undefined || isNaN(num)) return '';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    const parse = (str: string) => {
        const numbers = str.replace(/\D/g, '');
        if (numbers === '') return undefined;
        return parseFloat(numbers) / 100;
    };
    
    const [displayValue, setDisplayValue] = useState(format(value));

    React.useEffect(() => {
       setDisplayValue(format(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numberValue = parse(rawValue);
        setDisplayValue(format(numberValue));
        onValueChange(numberValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Moves cursor to the end
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    };

    return <Input ref={ref} value={displayValue} onChange={handleChange} onFocus={handleFocus} {...props} />;
});
CurrencyInput.displayName = 'CurrencyInput';


export default function PresentationGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [presentationContent, setPresentationContent] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();

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

 const handleDownload = () => {
    if (!presentationContent) {
      toast({ title: 'Erro', description: 'Gere o conteúdo da apresentação primeiro.', variant: 'destructive'});
      return;
    }
    
    // Type guard to ensure `text` is a string
    const escapeHtml = (text: any): string => {
        if (typeof text !== 'string') return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, '<br>');
    };
    
    const listToHtml = (items: any): string => {
        if (!items || !Array.isArray(items)) return '<ul></ul>';
        const listItems = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    };

    const kpiIcons: { [key: string]: string } = {
        TrendingUp: '📈', Target: '🎯', DollarSign: '💰', Repeat: '🔁', Users: '👥',
    };

    const kpiItemsHtml = presentationContent.kpiSlide.kpis.map(kpi => `
        <div class="kpi-item">
            <h4>${kpiIcons[kpi.icon] || '•'} ${escapeHtml(kpi.metric)}</h4>
            <p class="kpi-estimate">${escapeHtml(kpi.estimate)}</p>
            <p class="kpi-importance">${escapeHtml(kpi.importance)}</p>
        </div>
    `).join('');

    const investmentItemsHtml = presentationContent.investmentSlide.items.map(item => `
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
                  <td class="price">${escapeHtml(presentationContent.investmentSlide.total)}</td>
              </tr>
    `;
    
    if (presentationContent.investmentSlide.discount) {
        investmentHtml += `
              <tr class="discount">
                  <td>Desconto</td>
                  <td class="price">${escapeHtml(presentationContent.investmentSlide.discount)}</td>
              </tr>
        `;
    }

    investmentHtml += `
              <tr class="total">
                  <td>Total</td>
                  <td class="price">${escapeHtml(presentationContent.investmentSlide.finalTotal)}</td>
              </tr>
          </tfoot>
      </table>
    `;

    const replacements = {
        '{{presentationTitle}}': escapeHtml(presentationContent.presentationTitle),
        '{{clientName}}': escapeHtml(form.getValues('clientName')),
        '{{diagnosticTitle}}': escapeHtml(presentationContent.diagnosticSlide.title),
        '{{{diagnosticContent}}}': listToHtml(presentationContent.diagnosticSlide.content),
        '{{diagnosticQuestion}}': escapeHtml(presentationContent.diagnosticSlide.question),
        '{{actionPlanTitle}}': escapeHtml(presentationContent.actionPlanSlide.title),
        '{{{actionPlanPillar1}}}': escapeHtml(presentationContent.actionPlanSlide.content[0]),
        '{{{actionPlanPillar2}}}': escapeHtml(presentationContent.actionPlanSlide.content[1]),
        '{{{actionPlanPillar3}}}': escapeHtml(presentationContent.actionPlanSlide.content[2]),
        '{{timelineTitle}}': escapeHtml(presentationContent.timelineSlide.title),
        '{{{timelineContent}}}': listToHtml(presentationContent.timelineSlide.content),
        '{{kpiTitle}}': escapeHtml(presentationContent.kpiSlide.title),
        '{{{kpiItems}}}': kpiItemsHtml,
        '{{whyCpTitle}}': escapeHtml(presentationContent.whyCpSlide.title),
        '{{{whyCpContent}}}': listToHtml(presentationContent.whyCpSlide.content),
        '{{justificationTitle}}': escapeHtml(presentationContent.justificationSlide.title),
        '{{{justificationContent}}}': escapeHtml(presentationContent.justificationSlide.content),
        '{{investmentTitle}}': escapeHtml(presentationContent.investmentSlide.title),
        '{{{investmentTable}}}': investmentHtml,
        '{{nextStepsTitle}}': escapeHtml(presentationContent.nextStepsSlide.title),
        '{{{nextStepsContent}}}': listToHtml(presentationContent.nextStepsSlide.content)
    };

    let finalHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta de Crescimento</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        :root {
            --background: #0D0D0D;
            --foreground: #F5F5F7;
            --card-background: #171717;
            --border: rgba(255, 255, 255, 0.1);
            --primary: #FF6B00;
            --muted-foreground: #A1A1AA;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background);
            color: var(--foreground);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 960px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
        }
        header h1 {
            font-size: 52px;
            font-weight: 900;
            color: var(--foreground);
            margin: 0;
            line-height: 1.1;
        }
        header p {
            font-size: 20px;
            color: var(--primary);
            margin: 10px 0 0;
        }
        .section {
            background-color: var(--card-background);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 40px;
        }
        .section h2 {
            font-size: 32px;
            font-weight: 700;
            color: var(--primary);
            margin: 0 0 24px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .section h3 {
            font-size: 20px;
            font-weight: 700;
            color: var(--foreground);
            margin-top: 24px;
            margin-bottom: 12px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        ul li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 12px;
            color: var(--muted-foreground);
        }
        ul li strong {
            color: var(--foreground);
            font-weight: 600;
        }
        ul li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: bold;
        }
        .diagnostic-question {
            font-style: italic;
            color: var(--muted-foreground);
            padding: 16px;
            border-left: 3px solid var(--primary);
            margin-top: 24px;
            background-color: rgba(255, 107, 0, 0.05);
        }
        .pillars {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
        }
        .pillar {
            background-color: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 8px;
        }
        .pillar p {
            color: var(--muted-foreground);
        }
         .pillar p strong {
            color: var(--foreground);
            font-weight: 600;
        }
        .kpi-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        @media (min-width: 768px) {
            .kpi-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .kpi-item {
            padding: 16px;
            border-radius: 8px;
            background-color: var(--background);
        }
        .kpi-item h4 {
            font-size: 18px;
            margin: 0 0 4px 0;
            color: var(--foreground);
        }
        .kpi-item .kpi-estimate {
            font-size: 16px;
            font-weight: bold;
            color: var(--primary);
            margin: 0 0 8px 0;
        }
        .kpi-item .kpi-importance {
            font-size: 14px;
            color: var(--muted-foreground);
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
        }
        table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
        }
        table .price {
            text-align: right;
            font-weight: bold;
        }
        table tfoot tr {
            border: none;
        }
        table tfoot tr td {
             border-bottom: none;
        }
        table tfoot tr.total td {
            padding-top: 16px;
            border-top: 2px solid var(--primary);
            font-size: 24px;
            font-weight: bold;
            color: var(--primary);
        }
         table tfoot tr.total td:first-child {
            font-size: 20px;
            font-weight: bold;
            color: var(--foreground);
        }
        table tr.discount td {
            color: #6EE7B7;
        }
        footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
            color: var(--muted-foreground);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{{presentationTitle}}</h1>
            <p>Preparado especialmente para {{clientName}}</p>
        </header>
        <div class="section">
            <h2>🎯 {{diagnosticTitle}}</h2>
            {{{diagnosticContent}}}
            <p class="diagnostic-question">{{diagnosticQuestion}}</p>
        </div>
        <div class="section">
            <h2>🚀 {{actionPlanTitle}}</h2>
            <div class="pillars">
                <div class="pillar">
                    <h3>Pilar 1: Aquisição</h3>
                    <p>{{{actionPlanPillar1}}}</p>
                </div>
                <div class="pillar">
                    <h3>Pilar 2: Conversão</h3>
                    <p>{{{actionPlanPillar2}}}</p>
                </div>
                <div class="pillar">
                    <h3>Pilar 3: Autoridade</h3>
                    <p>{{{actionPlanPillar3}}}</p>
                </div>
            </div>
        </div>
        <div class="section">
            <h2>🗓️ {{timelineTitle}}</h2>
            {{{timelineContent}}}
        </div>
        <div class="section">
            <h2>📊 {{kpiTitle}}</h2>
            <div class="kpi-grid">
                {{{kpiItems}}}
            </div>
        </div>
        <div class="section">
            <h2>⭐ {{whyCpTitle}}</h2>
            {{{whyCpContent}}}
        </div>
        <div class="section">
            <h2>💡 {{justificationTitle}}</h2>
            <p>{{{justificationContent}}}</p>
        </div>
        <div class="section">
            <h2>💰 {{investmentTitle}}</h2>
            {{{investmentTable}}}
        </div>
        <div class="section">
            <h2>🏁 {{nextStepsTitle}}</h2>
            {{{nextStepsContent}}}
        </div>
        <footer>
            CP Marketing Digital &copy; 2024
        </footer>
    </div>
</body>
</html>`;

    for (const [key, value] of Object.entries(replacements)) {
      finalHtml = finalHtml.replace(new RegExp(key.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1'), 'g'), String(value));
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
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary"/>Cenário e Metas</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="tempoEmpresa" render={({ field }) => (<FormItem><FormLabel>Há quanto tempo vocês estão no mercado?</FormLabel><FormControl><Input placeholder="Ex: Estamos há 12 anos." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="faturamentoMedio" render={({ field }) => (<FormItem><FormLabel>Qual é o faturamento médio mensal?</FormLabel><FormControl><CurrencyInput placeholder="R$ 50.000,00" {...field} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metaFaturamento" render={({ field }) => (<FormItem><FormLabel>Qual é a meta de faturamento para os próximos 6 meses?</FormLabel><FormControl><CurrencyInput placeholder="R$ 120.000,00" {...field} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="ticketMedio" render={({ field }) => (<FormItem><FormLabel>Qual o ticket médio do seu principal serviço ou produto?</FormLabel><FormControl><CurrencyInput placeholder="R$ 2.000,00" {...field} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="origemClientes" render={({ field }) => (<FormItem><FormLabel>Atualmente, a maioria dos seus clientes chega como?</FormLabel><FormControl><Input placeholder="Ex: 90% vem de indicação." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Briefcase className="h-6 w-6 text-primary"/>O Desafio Atual</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="motivacaoMarketing" render={({ field }) => (<FormItem><FormLabel>O que te motivou a buscar uma solução de marketing exatamente agora?</FormLabel><FormControl><Textarea placeholder="Ex: Chegamos num platô, não estamos crescendo." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="experienciaMarketing" render={({ field }) => (<FormItem><FormLabel>Vocês já tiveram alguma experiência com marketing antes?</FormLabel><FormControl><Textarea placeholder="Ex: Sim, já contratei uma agência, mas não deu certo." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tentativasAnteriores" render={({ field }) => (<FormItem><FormLabel>Nessas tentativas, o que você sentiu que não funcionou como deveria?</FormLabel><FormControl><Textarea placeholder="Ex: Fizeram uns posts, mas não virou cliente." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="principalGargalo" render={({ field }) => (<FormItem><FormLabel>Se você pudesse apontar o maior gargalo hoje, onde ele estaria?</FormLabel><FormControl><Textarea placeholder="Ex: Geração, com certeza. Chega pouca gente." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="impactoGargalo" render={({ field }) => (<FormItem><FormLabel>Na prática, como esse gargalo afeta o dia a dia de vocês?</FormLabel><FormControl><Textarea placeholder="Ex: A agenda fica com muitos buracos." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="impactoAreas" render={({ field }) => (<FormItem><FormLabel>Além do faturamento, essa situação impacta alguma outra área da empresa?</FormLabel><FormControl><Textarea placeholder="Ex: Sim, a gente para de investir em equipamento." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sentimentoPessoal" render={({ field }) => (<FormItem><FormLabel>Como você, pessoalmente, se sente com isso?</FormLabel><FormControl><Textarea placeholder="Ex: É frustrante, a gente sabe que tem potencial." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><HandCoins className="h-6 w-6 text-primary"/>O Custo do Problema</div></AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-6">
                     <FormField control={form.control} name="clientesPerdidos" render={({ field }) => (<FormItem><FormLabel>Quantos clientes a mais você acredita que poderiam ter fechado no último mês sem esse gargalo?</FormLabel><FormControl><Input placeholder="Ex: Acho que uns 10 clientes a mais, fácil." {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="custoProblema" render={({ field }) => (<FormItem><FormLabel>Então, quanto você diria que esse problema custa para a empresa por mês?</FormLabel><FormControl><CurrencyInput placeholder="R$ 20.000,00" {...field} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="potencialResolucao" render={({ field }) => (<FormItem><FormLabel>Se a gente resolvesse isso, o que um fluxo constante de clientes permitiria que você fizesse?</FormLabel><FormControl><Textarea placeholder="Ex: Eu contrataria mais um profissional." {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><ChevronsUp className="h-6 w-6 text-primary"/>A Visão de Futuro</div></AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="visaoFuturo" render={({ field }) => (<FormItem><FormLabel>Se nos falássemos daqui a 6 meses e tudo tivesse dado certo, o que estaria acontecendo de diferente?</FormLabel><FormControl><Textarea placeholder="Ex: A agenda estaria cheia com antecedência." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="visaoFuturoPessoal" render={({ field }) => (<FormItem><FormLabel>E para você, pessoalmente, o que essa mudança traria?</FormLabel><FormControl><Textarea placeholder="Ex: Com certeza, muito mais tranquilidade." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="prioridadeResolucao" render={({ field }) => (<FormItem><FormLabel>Então, ter um sistema para gerar novos clientes de forma previsível é uma prioridade para você agora?</FormLabel><FormControl><Input placeholder="Ex: Sim, total prioridade." {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><UserCheck className="h-6 w-6 text-primary"/>Próximos Passos</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="envolvidosDecisao" render={({ field }) => (<FormItem><FormLabel>Além de você, quem mais participa da decisão para aprovar um projeto como este?</FormLabel><FormControl><Input placeholder="Sócio, esposa, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="orcamentoPrevisto" render={({ field }) => (<FormItem><FormLabel>Para um projeto que busca resolver esse cenário, qual faixa de investimento mensal vocês consideram?</FormLabel><FormControl><Input placeholder="Ex: Penso em investir entre R$ 3k e R$ 5k." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="prazoDecisao" render={({ field }) => (<FormItem><FormLabel>Se encontrarmos o plano ideal, qual o seu prazo para tomar uma decisão?</FormLabel><FormControl><Input placeholder="Ex: Tenho urgência, o quanto antes." {...field} /></FormControl><FormMessage /></FormItem>)} />
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

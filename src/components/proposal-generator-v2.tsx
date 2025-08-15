

"use client";

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Loader2, ListChecks, Check, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { GeneratedProposal, packageOptions } from './generated-proposal';


const proposalFormSchema = z.object({
    clientName: z.string().min(1, 'O nome do cliente é obrigatório.'),
    packages: z.array(z.string()).optional(),
    discount: z.number().optional(),
});


export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

export default function ProposalGeneratorV2() {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [investmentValue, setInvestmentValue] = React.useState('R$ 0,00');
  const [originalInvestmentValue, setOriginalInvestmentValue] = React.useState<string | null>(null);
  const { toast } = useToast();
  const proposalRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      clientName: '',
      packages: [],
      discount: 0,
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  React.useEffect(() => {
    const total = watchedValues.packages?.reduce((acc, pkgKey) => {
        const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
        return acc + (pkg ? pkg.price : 0);
    }, 0) || 0;

    const discount = watchedValues.discount || 0;
    const finalValue = total - discount;

    if (discount > 0 && total > 0) {
      setOriginalInvestmentValue(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    } else {
      setOriginalInvestmentValue(null);
    }
    
    setInvestmentValue(finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

  }, [watchedValues.packages, watchedValues.discount]);


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


  return (
    <>
        <Card>
            <Form {...form}>
                <form className="space-y-4">
                    <CardHeader>
                      <CardTitle>Configuração da Proposta</CardTitle>
                      <CardDescription>Preencha o nome do cliente, selecione os pacotes e gere o PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={form.control} name="clientName" render={({ field }) => <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Nome da empresa do cliente" {...field} /></FormControl><FormMessage /></FormItem>} />
                      <Accordion type="multiple" className="w-full">
                         <AccordionItem value="item-1">
                            <AccordionTrigger className="font-semibold"><ListChecks className="mr-2 h-5 w-5 text-primary" />Serviços e Pacotes</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
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
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                            <AccordionTrigger className="font-semibold"><DollarSign className="mr-2 h-5 w-5 text-primary" />Investimento</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
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
                                    <Input value={investmentValue} readOnly />
                                </FormControl>
                                <FormMessage />
                               </FormItem>
                            </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
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
            <GeneratedProposal 
                ref={proposalRef} 
                {...watchedValues} 
                investmentValue={investmentValue} 
                originalInvestmentValue={originalInvestmentValue}
            />
        </div>
    </>
  );
}

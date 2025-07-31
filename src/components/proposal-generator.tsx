
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, DollarSign, Wand2, Eye, FileText, User, Building, Calendar, Package, Download, Briefcase, Target, Check, Rocket } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";


const serviceItemSchema = z.object({
  name: z.string().min(1, "O nome do serviço é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  price: z.coerce.number().min(0, "O preço deve ser positivo."),
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'one-time']),
  deliverables: z.array(z.object({ name: z.string() })).optional(),
});

const proposalSchema = z.object({
  clientName: z.string().min(1, "O nome do cliente é obrigatório."),
  clientCompany: z.string().optional(),
  proposalDate: z.string().min(1, "A data é obrigatória."),
  coverTitle: z.string().min(3, "O título da proposta é obrigatório."),
  challenge: z.string().min(10, "A descrição do desafio precisa de mais detalhes."),
  solution: z.string().min(10, "A descrição da solução precisa de mais detalhes."),
  aboutUs: z.string().min(10, "A seção 'Sobre nós' precisa de mais detalhes."),
  nextSteps: z.string().min(10, "A seção 'Próximos Passos' precisa de mais detalhes."),
  services: z.array(serviceItemSchema).min(1, "Adicione pelo menos um serviço."),
  total: z.number(),
  terms: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children }, ref) => (
    <div ref={ref} className={cn("p-10 bg-white shadow-lg a4-page", className)}>
        {children}
    </div>
));
Page.displayName = "Page";


export default function ProposalGenerator() {
  const [generatedProposal, setGeneratedProposal] = useState<ProposalFormValues | null>(null);
  const { toast } = useToast();
  const proposalPreviewRef = useRef<HTMLDivElement>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: "",
      clientCompany: "",
      proposalDate: new Date().toISOString().split('T')[0],
      coverTitle: "Proposta de Parceria Estratégica em Marketing Digital",
      challenge: "O principal desafio observado é a dificuldade em traduzir a alta qualidade dos seus serviços em uma presença digital que gere autoridade e um fluxo constante de clientes qualificados. Atualmente, a comunicação online não reflete o verdadeiro potencial do negócio, resultando em oportunidades perdidas para concorrentes mais ativos digitalmente.",
      solution: "Nossa solução é implementar uma estratégia de conteúdo e tráfego pago integrada. Vamos reestruturar a comunicação nas redes sociais para construir autoridade, criar campanhas de anúncios direcionadas para o público ideal e transformar o perfil digital em uma máquina de aquisição de clientes, com foco total em resultados mensuráveis.",
      aboutUs: "A CP Marketing Digital é mais do que uma agência, somos parceiros de crescimento. Nossa equipe é obcecada pelo resultado do cliente e une criatividade com análise de dados para criar estratégias que geram impacto real no faturamento. Não vendemos posts, entregamos performance.",
      nextSteps: "1. Aprovação da proposta.\n2. Reunião de kickoff e imersão estratégica.\n3. Início do desenvolvimento e apresentação do plano de conteúdo.\n4. Lançamento das primeiras campanhas em até 15 dias.",
      services: [],
      total: 0,
      terms: "Pagamento de 50% no aceite da proposta e 50% após 30 dias. Contrato com fidelidade mínima de 3 meses.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });
  
  const services = form.watch("services");
  
  useEffect(() => {
    const total = services.reduce((acc, service) => {
      if(service.billingCycle === 'monthly') return acc + (service.price || 0);
      return acc;
    }, 0);
    form.setValue('total', total);
  }, [services, form]);

  function onSubmit(values: ProposalFormValues) {
    setGeneratedProposal(values);
    toast({
      title: "Visualização Gerada!",
      description: "A pré-visualização da sua proposta foi criada ao lado.",
    });
  }
  
  const handleDownloadPdf = async () => {
    const previewElement = proposalPreviewRef.current;
    if (!previewElement) {
        toast({ title: "Erro", description: "A área de pré-visualização não foi encontrada.", variant: "destructive" });
        return;
    }
    
    toast({ title: "Gerando PDF...", description: "Isso pode levar alguns segundos." });

    const pages = previewElement.querySelectorAll<HTMLDivElement>('.a4-page');
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (document) => {
                const clonedPage = document.querySelector('.a4-page');
                if(clonedPage) {
                    (clonedPage as HTMLElement).style.boxShadow = 'none';
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.height / imgProps.width;
        const imgHeight = pdfWidth * ratio;
        
        let heightLeft = imgHeight;
        let position = 0;

        if (i > 0) {
            pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    }
    
    pdf.save(`Proposta_${generatedProposal?.clientCompany || generatedProposal?.clientName}.pdf`);
  };

  const billingCycleMap = {
    'monthly': 'mês',
    'quarterly': 'trimestre',
    'annually': 'ano',
    'one-time': 'único'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Propostas</CardTitle>
          <CardDescription>Preencha os dados abaixo para criar a proposta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" /> Dados do Cliente e Capa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="clientName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Ex: João da Silva" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="clientCompany" control={form.control} render={({ field }) => (<FormItem><FormLabel>Empresa</FormLabel><FormControl><Input placeholder="Ex: Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="proposalDate" control={form.control} render={({ field }) => (<FormItem><FormLabel>Data da Proposta</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="coverTitle" control={form.control} render={({ field }) => (<FormItem><FormLabel>Título da Proposta (Capa)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-primary" /> Conteúdo Persuasivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="challenge" control={form.control} render={({ field }) => (<FormItem><FormLabel>O Desafio do Cliente</FormLabel><FormControl><Textarea placeholder="Descreva o problema que o cliente enfrenta..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="solution" control={form.control} render={({ field }) => (<FormItem><FormLabel>Nossa Solução</FormLabel><FormControl><Textarea placeholder="Explique como a CP Marketing vai resolver o desafio..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <Button type="button" variant="outline" size="sm" className="w-full"><Wand2 className="mr-2 h-4 w-4" /> Gerar Conteúdo com IA</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Package className="h-5 w-5 text-primary" /> Escopo de Serviços e Preços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative bg-muted/30">
                       <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                       <FormField name={`services.${index}.name`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Nome do Serviço</FormLabel><FormControl><Input placeholder="Ex: Gestão de Mídias Sociais" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField name={`services.${index}.description`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Descrição do Serviço</FormLabel><FormControl><Textarea placeholder="Detalhe os entregáveis e o que está incluso..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <div className="grid grid-cols-2 gap-4">
                            <FormField name={`services.${index}.price`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Preço</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" placeholder="1500" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                            <Controller name={`services.${index}.billingCycle`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Ciclo</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="monthly">Mensal</SelectItem><SelectItem value="quarterly">Trimestral</SelectItem><SelectItem value="annually">Anual</SelectItem><SelectItem value="one-time">Pagamento Único</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                       </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full" onClick={() => append({ name: "", description: "", price: 0, billingCycle: 'monthly', deliverables: [] })}><PlusCircle className="mr-2" /> Adicionar Serviço</Button>
                </CardContent>
              </Card>
              
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5 text-primary" /> Seções Finais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField name="aboutUs" control={form.control} render={({ field }) => (<FormItem><FormLabel>Sobre a CP Marketing</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="nextSteps" control={form.control} render={({ field }) => (<FormItem><FormLabel>Próximos Passos</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="terms" control={form.control} render={({ field }) => (<FormItem><FormLabel>Termos de Pagamento</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg"><Eye className="mr-2" />Pré-visualizar Proposta</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Column */}
      <Card className="sticky top-8">
        <CardHeader>
          <div className="flex justify-between items-center"><CardTitle>Pré-visualização da Proposta</CardTitle>
            <Button onClick={handleDownloadPdf} disabled={!generatedProposal}><Download className="mr-2 h-4 w-4" />Baixar PDF</Button>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100vh-10rem)] overflow-y-auto bg-gray-200 p-4 rounded-lg">
          <div ref={proposalPreviewRef} className="space-y-4">
              {generatedProposal ? (
                <>
                {/* Page 1: Cover */}
                <Page className="flex flex-col justify-between text-black relative overflow-hidden">
                    <div className="absolute inset-0">
                         <Image src="https://placehold.co/827x1169.png" alt="Capa da proposta" layout="fill" objectFit="cover" data-ai-hint="abstract background" />
                         <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                    <div className="relative z-10 text-white">
                        <p className="font-bold text-lg text-primary">CP MARKETING DIGITAL</p>
                    </div>
                    <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center text-white">
                        <h1 className="text-4xl font-bold leading-tight drop-shadow-md">{generatedProposal.coverTitle}</h1>
                        <div className="w-24 h-1 bg-primary my-6"></div>
                        <p className="text-xl">Preparada para</p>
                        <p className="text-3xl font-semibold mt-2">{generatedProposal.clientCompany || generatedProposal.clientName}</p>
                    </div>
                    <div className="relative z-10 text-white text-center">
                        <p className="text-sm">{format(new Date(`${generatedProposal.proposalDate}T00:00:00`), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                    </div>
                </Page>
                
                {/* Page 2: Challenge & Solution */}
                <Page className="text-gray-800 space-y-8">
                    <div className="grid grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                           <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <h2 className="text-2xl font-bold text-orange-600 mb-2 flex items-center gap-3"><Target className="h-6 w-6"/>O Desafio</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{generatedProposal.challenge}</p>
                           </div>
                           <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="Placeholder 1" className="rounded-lg shadow-md" data-ai-hint="problem solving"/>
                        </div>
                         <div className="space-y-4">
                             <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="Placeholder 2" className="rounded-lg shadow-md" data-ai-hint="success chart"/>
                           <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3"><Rocket className="h-6 w-6"/>Nossa Solução</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{generatedProposal.solution}</p>
                           </div>
                        </div>
                    </div>
                </Page>

                {/* Page 3: Scope & Investment */}
                 <Page className="text-gray-800">
                     <h2 className="text-3xl font-bold text-primary mb-6 text-center">Escopo e Investimento</h2>
                     <div className="space-y-6 mb-8">
                        {generatedProposal.services.map((service, i) => (
                           <Card key={i} className="bg-gray-50/50 shadow-md transition-all hover:shadow-lg">
                               <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl text-primary">{service.name}</CardTitle>
                                        <p className="font-bold text-xl text-gray-800 whitespace-nowrap">R$ {service.price.toFixed(2)}<span className="text-sm font-normal text-gray-500 ml-1">/{billingCycleMap[service.billingCycle]}</span></p>
                                    </div>
                               </CardHeader>
                               <CardContent>
                                    <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{service.description}</p>
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold mb-2">Entregáveis:</h4>
                                        <ul className="space-y-1 text-sm text-gray-700">
                                            {service.description.split('\n').map((deliverable, idx) => deliverable.trim().startsWith('-') && (
                                                <li key={idx} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/>{deliverable.replace('-', '').trim()}</li>
                                            ))}
                                        </ul>
                                    </div>
                               </CardContent>
                           </Card>
                        ))}
                     </div>
                     <div className="text-right border-t-2 border-primary pt-4 mt-8">
                        <p className="text-gray-600">Investimento Mensal Total</p>
                        <p className="text-4xl font-bold text-primary">R$ {generatedProposal.total.toFixed(2)}</p>
                     </div>
                </Page>

                {/* Page 4: About & Next Steps */}
                 <Page className="text-gray-800">
                    <div className="grid grid-cols-5 gap-8">
                         <div className="col-span-3 space-y-6">
                            <Card className="bg-gray-50/50 p-6 h-full">
                               <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3"><Building className="h-6 w-6"/>Sobre a CP Marketing</h2>
                               <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{generatedProposal.aboutUs}</p>
                            </Card>
                             <Card className="bg-gray-50/50 p-6 h-full">
                               <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3"><Calendar className="h-6 w-6"/>Próximos Passos</h2>
                               <ol className="text-gray-600 leading-relaxed whitespace-pre-wrap list-decimal list-inside space-y-2">
                                  {generatedProposal.nextSteps.split('\n').map((step, i) => <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>)}
                               </ol>
                            </Card>
                             <Card className="bg-gray-50/50 p-6 h-full">
                               <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3"><DollarSign className="h-6 w-6"/>Termos de Pagamento</h2>
                               <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{generatedProposal.terms}</p>
                            </Card>
                         </div>
                         <div className="col-span-2">
                            <Image src="https://placehold.co/400x1100.png" width={400} height={1100} alt="Placeholder 3" className="rounded-lg shadow-md object-cover h-full" data-ai-hint="business team"/>
                         </div>
                    </div>
                     <footer className="text-center mt-8 pt-4 border-t text-xs text-gray-400">
                        <p>CP Marketing Digital | Proposta confidencial</p>
                    </footer>
                </Page>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <FileText className="h-16 w-16 mb-4" />
                  <p>Preencha os dados ao lado e clique em "Pré-visualizar" para ver a proposta aqui.</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

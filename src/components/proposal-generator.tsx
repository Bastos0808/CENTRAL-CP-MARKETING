
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, DollarSign, Wand2, Eye, FileText, User, Building, Calendar, Package, Download } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const serviceItemSchema = z.object({
  name: z.string().min(1, "O nome do serviço é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  price: z.coerce.number().min(0, "O preço deve ser positivo."),
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'one-time']),
});

const proposalSchema = z.object({
  clientName: z.string().min(1, "O nome do cliente é obrigatório."),
  clientCompany: z.string().optional(),
  proposalDate: z.string().min(1, "A data é obrigatória."),
  introduction: z.string().min(10, "A introdução precisa de mais detalhes."),
  services: z.array(serviceItemSchema).min(1, "Adicione pelo menos um serviço."),
  total: z.number(),
  timeline: z.string().optional(),
  terms: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

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
      introduction: "",
      services: [],
      total: 0,
      timeline: "A ser definido em reunião de alinhamento.",
      terms: "Pagamento de 50% no aceite da proposta e 50% após 30 dias.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const services = form.watch("services");
  const total = services.reduce((acc, service) => acc + (service.price || 0), 0);
  form.setValue('total', total);

  function onSubmit(values: ProposalFormValues) {
    setGeneratedProposal(values);
    toast({
      title: "Visualização Gerada!",
      description: "A pré-visualização da sua proposta foi criada ao lado.",
    });
  }

  const handleDownloadPdf = async () => {
    const reportElement = proposalPreviewRef.current;
    if (!reportElement || !generatedProposal) {
        toast({ title: "Erro", description: "Gere uma pré-visualização primeiro.", variant: "destructive" });
        return;
    };

    const originalTextColors = new Map<HTMLElement, string>();
    reportElement.querySelectorAll<HTMLElement>('*').forEach(el => {
        originalTextColors.set(el, el.style.color);
        el.style.color = 'black';
    });
     reportElement.querySelectorAll<HTMLElement>('.text-primary').forEach(el => {
        el.style.color = '#030860'; 
    });
    reportElement.querySelectorAll<HTMLElement>('.text-muted-foreground').forEach(el => {
        el.style.color = '#6b7280';
    });


    const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
    });

    originalTextColors.forEach((color, el) => {
        el.style.color = color;
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Proposta_${generatedProposal.clientCompany || generatedProposal.clientName}.pdf`);
  };


  const billingCycleMap = {
    'monthly': 'mensal',
    'quarterly': 'trimestral',
    'annually': 'anual',
    'one-time': 'único'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Proposta</CardTitle>
          <CardDescription>Preencha os dados abaixo para criar a proposta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Building className="h-5 w-5 text-primary" /> Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="clientName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Nome do Cliente</FormLabel><FormControl><Input placeholder="Ex: João da Silva" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="clientCompany" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Empresa</FormLabel><FormControl><Input placeholder="Ex: Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField name="proposalDate" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Data da Proposta</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-primary" /> Conteúdo da Proposta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField name="introduction" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Introdução</FormLabel><FormControl><Textarea placeholder="Descreva o desafio do cliente e como a CP Marketing pode ajudar..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <Button type="button" variant="outline" size="sm"><Wand2 className="mr-2" /> Gerar com IA</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Package className="h-5 w-5 text-primary" /> Escopo de Serviços e Preços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                       <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                       </Button>
                       <FormField name={`services.${index}.name`} control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Nome do Serviço</FormLabel><FormControl><Input placeholder="Ex: Gestão de Mídias Sociais" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name={`services.${index}.description`} control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Descrição do Serviço</FormLabel><FormControl><Textarea placeholder="Detalhe os entregáveis e o que está incluso..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name={`services.${index}.price`} control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Preço</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" placeholder="1500" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name={`services.${index}.billingCycle`} control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Ciclo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="monthly">Mensal</SelectItem>
                                        <SelectItem value="quarterly">Trimestral</SelectItem>
                                        <SelectItem value="annually">Anual</SelectItem>
                                        <SelectItem value="one-time">Pagamento Único</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full" onClick={() => append({ name: "", description: "", price: 0, billingCycle: 'monthly' })}>
                    <PlusCircle className="mr-2" /> Adicionar Serviço
                  </Button>
                </CardContent>
              </Card>
              
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5 text-primary" /> Prazos e Termos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField name="timeline" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Cronograma</FormLabel><FormControl><Input placeholder="Ex: 30-45 dias" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField name="terms" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Termos de Pagamento</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>


              <Button type="submit" className="w-full" size="lg">
                <Eye className="mr-2" />
                Pré-visualizar Proposta
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Column */}
      <Card className="sticky top-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Pré-visualização da Proposta</CardTitle>
                <CardDescription>É assim que seu cliente verá a proposta.</CardDescription>
            </div>
            <Button onClick={handleDownloadPdf} disabled={!generatedProposal}>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="min-h-[600px]">
          {generatedProposal ? (
             <div ref={proposalPreviewRef} className="p-8 border rounded-lg bg-background animate-fade-in text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                <header className="flex justify-between items-start border-b-2 border-primary pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">Proposta Comercial</h1>
                        <p className="text-muted-foreground mt-1">CP Marketing Digital</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{generatedProposal.clientCompany}</p>
                        <p className="text-sm text-muted-foreground">Para: {generatedProposal.clientName}</p>
                        <p className="text-sm text-muted-foreground">Data: {new Date(`${generatedProposal.proposalDate}T00:00:00`).toLocaleDateString('pt-BR')}</p>
                    </div>
                </header>
                <main className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-primary mb-3">Introdução</h2>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedProposal.introduction}</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-primary mb-4">Escopo dos Serviços e Investimento</h2>
                        <div className="space-y-4">
                            {generatedProposal.services.map((service, i) => (
                                <div key={i} className="p-4 rounded-md bg-gray-50 border-l-4 border-primary">
                                    <div className="flex justify-between items-center">
                                      <h3 className="font-bold text-lg text-primary">{service.name}</h3>
                                      <p className="font-bold text-lg">
                                          R$ {service.price.toFixed(2)}
                                          <span className="text-xs font-normal text-muted-foreground ml-1">/{billingCycleMap[service.billingCycle]}</span>
                                      </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                     <section className="text-right border-t-2 border-primary pt-4 mt-8">
                        <p className="text-muted-foreground">Total do Investimento</p>
                        <p className="text-4xl font-bold text-primary">R$ {generatedProposal.total.toFixed(2)}</p>
                     </section>
                      <section>
                        <h2 className="text-2xl font-semibold text-primary mb-3">Termos e Condições</h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p><strong>Cronograma:</strong> {generatedProposal.timeline}</p>
                          <p><strong>Pagamento:</strong> {generatedProposal.terms}</p>
                        </div>
                    </section>
                </main>
                 <footer className="text-center mt-12 pt-4 border-t text-xs text-gray-400">
                    <p>CP Marketing Digital | contato@cpmarketing.com.br</p>
                </footer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-muted/30 rounded-lg p-8">
              <FileText className="h-16 w-16 mb-4" />
              <p>Preencha os dados ao lado e clique em "Pré-visualizar" para ver a proposta aqui.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
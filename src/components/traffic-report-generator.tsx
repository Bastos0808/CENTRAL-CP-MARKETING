
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Users, DollarSign, MousePointerClick, TrendingUp, Target, HandCoins, Ratio, Link as LinkIcon, Calendar, BarChart, Check, FileSignature } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { generateTrafficReport } from '@/ai/flows/traffic-report-flow';
import type { GenerateTrafficReportInput } from '@/ai/schemas/traffic-report-schemas';
import { trafficPerformanceSchema } from '@/ai/schemas/traffic-report-schemas';
import GeneratedReport from './generated-report';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from './ui/calendar';

interface Client {
  id: string;
  name: string;
  briefing?: any;
}

const trafficReportSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  campaignObjective: z.string().min(1, "O objetivo da campanha é obrigatório."),
  period: z.object({
    from: z.date({ required_error: "Data de início é obrigatória."}),
    to: z.date({ required_error: "Data de fim é obrigatória."}),
  }),
  performanceData: trafficPerformanceSchema,
});

type ReportFormValues = z.infer<typeof trafficReportSchema>;

const performanceFields: { 
  name: keyof z.infer<typeof trafficPerformanceSchema>, 
  label: string, 
  icon: React.ElementType,
  isCurrency?: boolean;
}[] = [
  { name: 'investment', label: 'Valor Gasto', icon: DollarSign, isCurrency: true },
  { name: 'impressions', label: 'Impressões', icon: Users },
  { name: 'clicks', label: 'Cliques', icon: MousePointerClick },
  { name: 'ctr', label: 'CTR (%)', icon: Ratio },
  { name: 'cpc', label: 'CPC Médio', icon: MousePointerClick, isCurrency: true },
  { name: 'conversions', label: 'Conversões / Leads', icon: Target },
  { name: 'cpl', label: 'Custo por Lead (CPL)', icon: HandCoins, isCurrency: true },
  { name: 'roas', label: 'ROAS', icon: TrendingUp },
];

const bestCampaignsFields: { 
  name: keyof z.infer<typeof trafficPerformanceSchema>['bestCampaigns'][0],
  label: string,
}[] = [
    { name: 'name', label: 'Nome da Campanha' },
    { name: 'metric', label: 'Principal Métrica (Ex: CPL, Cliques)'},
    { name: 'value', label: 'Valor da Métrica'},
]


export default function TrafficReportGenerator() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(trafficReportSchema),
    defaultValues: {
      clientId: "",
      campaignObjective: "",
      performanceData: {
        investment: '',
        impressions: '',
        clicks: '',
        ctr: '',
        cpc: '',
        conversions: '',
        cpl: '',
        roas: '',
        bestCampaigns: [{ name: '', metric: '', value: ''}]
      }
    }
  });

  const { fields: campaignsFields, append: appendCampaign, remove: removeCampaign } = Controller.useFieldArray({
    control,
    name: "performanceData.bestCampaigns"
  });
  
  const selectedClientId = watch("clientId");
  
  useEffect(() => {
      if (selectedClientId) {
          const client = clients.find(c => c.id === selectedClientId);
          setSelectedClient(client || null);
      } else {
          setSelectedClient(null);
      }
  }, [selectedClientId, clients]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients: ", error);
        toast({
          title: "Erro ao carregar clientes",
          variant: "destructive",
        });
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [toast]);

  const handleSaveReport = async () => {
    if (!generatedReport || !selectedClientId) return;

    const clientDocRef = doc(db, 'clients', selectedClientId);
    try {
      await updateDoc(clientDocRef, {
        reports: arrayUnion({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          analysis: generatedReport,
        })
      });
      toast({ title: "Relatório Salvo!", description: "O relatório foi adicionado com sucesso ao dossiê do cliente." });
    } catch (error) {
      console.error("Error saving report: ", error);
      toast({ title: "Erro ao Salvar", variant: "destructive" });
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsGenerating(true);
    setGeneratedReport(null);
    try {
      const client = clients.find(c => c.id === data.clientId);
      if (!client) throw new Error("Cliente não encontrado.");
      
      const input: GenerateTrafficReportInput = {
        briefing: client.briefing,
        campaignObjective: data.campaignObjective,
        period: {
            from: format(data.period.from, 'yyyy-MM-dd'),
            to: format(data.period.to, 'yyyy-MM-dd'),
        },
        performanceData: data.performanceData,
      };
      
      const report = await generateTrafficReport(input);
      setGeneratedReport(report.analysis);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Erro ao gerar relatório", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Relatório de Tráfego</CardTitle>
          <CardDescription>
            Preencha os dados da campanha para gerar um novo relatório com IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="client-id">Selecione o Cliente</Label>
                    {loadingClients ? (<Skeleton className="h-10 w-full" />) : (
                        <Controller name="clientId" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                                <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
                            </Select>
                        )} />
                    )}
                    {errors.clientId && <p className="text-sm text-destructive">{errors.clientId.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="campaignObjective">Objetivo Principal da Campanha</Label>
                    <Controller name="campaignObjective" control={control} render={({ field }) => (
                        <Input id="campaignObjective" placeholder="Ex: Geração de Leads Qualificados" {...field} />
                    )} />
                    {errors.campaignObjective && <p className="text-sm text-destructive">{errors.campaignObjective.message}</p>}
                 </div>
            </div>
            
             <div className="space-y-2">
                <Label>Período de Análise</Label>
                <Controller name="period" control={control} render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date" variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</>) : (format(field.value.from, "LLL dd, y"))) : (<span>Escolha um período</span>)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarIcon
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                 )} />
                  {errors.period?.from && <p className="text-sm text-destructive">{errors.period.from.message}</p>}
                  {errors.period?.to && <p className="text-sm text-destructive">{errors.period.to.message}</p>}
            </div>

            <div className="space-y-4">
              <Label className='text-lg font-semibold'>Dados de Performance (Geral)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {performanceFields.map(({ name, label, icon: Icon, isCurrency }) => (
                  <div key={name} className="space-y-1">
                     <Label htmlFor={name} className="flex items-center text-sm text-muted-foreground gap-2"><Icon className="h-4 w-4" />{label}</Label>
                     <Controller name={`performanceData.${name}`} control={control} render={({ field }) => (
                         <Input id={name} placeholder="0" {...field} className="font-mono" />
                     )} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
                <Card className="p-4 bg-muted/20 space-y-3">
                    <Label className="flex items-center text-lg font-semibold gap-2"><BarChart className="h-5 w-5" /> Melhores Campanhas/Anúncios</Label>
                     {campaignsFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2">
                        {bestCampaignsFields.map(inputField => (
                             <div key={inputField.name} className="flex-1 space-y-1">
                                 <Label className="text-xs">{inputField.label}</Label>
                                 <Controller name={`performanceData.bestCampaigns.${index}.${inputField.name}`} control={control} render={({ field }) => (<Input {...field} />)} />
                             </div>
                        ))}
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCampaign(index)}><XCircle className="h-5 w-5" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendCampaign({ name: '', metric: '', value: '' })}>Adicionar Campanha</Button>
                </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                Gerar Relatório com IA
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(isGenerating || generatedReport) && (
        <GeneratedReport
          report={generatedReport}
          client={selectedClient}
          isLoading={isGenerating}
          onSave={handleSaveReport}
        />
      )}
    </div>
  );
}

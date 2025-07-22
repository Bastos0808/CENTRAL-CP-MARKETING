
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Wand2, Users, Heart, MessageSquare, Percent, TrendingUp, UserPlus, Eye, PieChart, BarChartHorizontal, MapPin, Hash, PlusCircle, XCircle, FileSignature } from "lucide-react";
import { generateReport } from '@/ai/flows/report-generator-flow';
import type { GenerateReportInput } from '@/ai/schemas/report-schemas';
import { Skeleton } from './ui/skeleton';
import { performanceSchema } from '@/ai/schemas/report-schemas';
import GeneratedReport from './generated-report';


interface Client {
  id: string;
  name: string;
}

const reportSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  performanceData: performanceSchema,
});

type ReportFormValues = z.infer<typeof reportSchema>;

const performanceFields: { 
  name: keyof z.infer<typeof performanceSchema>, 
  label: string, 
  icon: React.ElementType,
  comparisonField: {
    name: keyof z.infer<typeof performanceSchema>, 
    label: string,
  }
}[] = [
  { name: 'seguidores', label: 'Seguidores', icon: Users, comparisonField: { name: 'seguidoresVariacao', label: 'Variação' }},
  { name: 'comecaramSeguir', label: 'Começaram a Seguir', icon: UserPlus, comparisonField: { name: 'comecaramSeguirVariacao', label: 'Variação' }},
  { name: 'visualizacoes', label: 'Visualizações', icon: Eye, comparisonField: { name: 'visualizacoesVariacao', label: 'Variação' }},
  { name: 'curtidas', label: 'Curtidas', icon: Heart, comparisonField: { name: 'curtidasVariacao', label: 'Variação' }},
  { name: 'comentarios', label: 'Comentários', icon: MessageSquare, comparisonField: { name: 'comentariosVariacao', label: 'Variação' }},
  { name: 'taxaEngajamento', label: 'Taxa de Engajamento', icon: TrendingUp, comparisonField: { name: 'taxaEngajamentoVariacao', label: 'Variação' }},
];

const genderFields: { name: keyof z.infer<typeof performanceSchema>, label: string }[] = [
  { name: 'generoFeminino', label: 'Feminino (%)' },
  { name: 'generoMasculino', label: 'Masculino (%)' },
  { name: 'generoNaoEspecificado', label: 'Não Especificado (%)' },
];

const ageRangeFields: { name: keyof z.infer<typeof performanceSchema>, label: string }[] = [
  { name: 'faixaEtaria13a17', label: '13-17' }, { name: 'faixaEtaria18a24', label: '18-24' },
  { name: 'faixaEtaria25a34', label: '25-34' }, { name: 'faixaEtaria35a44', label: '35-44' },
  { name: 'faixaEtaria45a54', label: '45-54' }, { name: 'faixaEtaria55a64', label: '55-64' },
  { name: 'faixaEtaria65mais', label: '65+' },
];


export default function ReportGenerator() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      clientId: "",
      performanceData: {
        seguidores: '', seguidoresVariacao: '', comecaramSeguir: '', comecaramSeguirVariacao: '',
        visualizacoes: '', visualizacoesVariacao: '', curtidas: '', curtidasVariacao: '',
        comentarios: '', comentariosVariacao: '', taxaEngajamento: '', taxaEngajamentoVariacao: '',
        generoFeminino: '', generoMasculino: '', generoNaoEspecificado: '',
        faixaEtaria13a17: '', faixaEtaria18a24: '', faixaEtaria25a34: '', faixaEtaria35a44: '',
        faixaEtaria45a54: '', faixaEtaria55a64: '', faixaEtaria65mais: '',
        cidadesSeguidores: [{ key: '', value: '' }],
        melhoresHashtags: [{ key: '', value: '' }],
        principaisPublicacoes: [{ key: '', value: '', type: 'arte' }],
      }
    }
  });

  const { fields: cidadesFields, append: appendCidade, remove: removeCidade } = useFieldArray({
    control, name: "performanceData.cidadesSeguidores"
  });
  const { fields: hashtagsFields, append: appendHashtag, remove: removeHashtag } = useFieldArray({
    control, name: "performanceData.melhoresHashtags"
  });
  const { fields: publicacoesFields, append: appendPublicacao, remove: removePublicacao } = useFieldArray({
    control, name: "performanceData.principaisPublicacoes"
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
          description: "Não foi possível buscar a lista de clientes.",
          variant: "destructive",
        });
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [toast]);

  const handleSaveReport = async () => {
    if (!generatedReport || !selectedClientId) {
      toast({ title: "Erro", description: "Nenhum relatório ou cliente selecionado.", variant: "destructive" });
      return;
    }

    const clientDocRef = doc(db, 'clients', selectedClientId);

    try {
      const newReport = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        analysis: generatedReport,
      };

      await updateDoc(clientDocRef, {
        reports: arrayUnion(newReport)
      });
      
      toast({
        title: "Relatório Salvo!",
        description: "O relatório foi adicionado com sucesso ao dossiê do cliente.",
      });

    } catch (error) {
      console.error("Error saving report: ", error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o relatório no dossiê. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsGenerating(true);
    setGeneratedReport(null);
    try {
      const clientDocRef = doc(db, 'clients', data.clientId);
      const clientSnap = await getDoc(clientDocRef);
      if (!clientSnap.exists()) {
        toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
        setIsGenerating(false);
        return;
      }
      const clientData = clientSnap.data();
      const input: GenerateReportInput = {
        clientBriefing: JSON.stringify(clientData.briefing, null, 2),
        performanceData: data.performanceData,
      };
      const report = await generateReport(input);
      setGeneratedReport(report.analysis);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Houve um problema com a IA. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Relatório</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para gerar um novo relatório com IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client-id">Selecione o Cliente</Label>
              {loadingClients ? (<Skeleton className="h-10 w-full" />) : (
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                      <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.clientId && <p className="text-sm text-destructive">{errors.clientId.message}</p>}
            </div>
            
            <div className="space-y-4">
              <Label className='text-lg font-semibold'>Dados de Desempenho (Visão Geral)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceFields.map(({ name, label, icon: Icon, comparisonField }) => (
                  <Card key={name} className="p-4 bg-muted/20">
                     <Label htmlFor={name} className="flex items-center text-sm text-muted-foreground gap-2 mb-2"><Icon className="h-5 w-5" />{label}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Controller name={`performanceData.${name}`} control={control} render={({ field }) => (<div className="space-y-1"><Label htmlFor={name} className="text-xs">Valor</Label><Input id={name} placeholder="0" {...field} className="font-mono" /></div>)} />
                      <Controller name={`performanceData.${comparisonField.name}`} control={control} render={({ field }) => (<div className="space-y-1"><Label htmlFor={comparisonField.name} className="text-xs">{comparisonField.label}</Label><div className="relative"><Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input id={comparisonField.name} placeholder="0.0" {...field} className="font-mono pl-7" /></div></div>)} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className='text-lg font-semibold'>Dados Demográficos</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 bg-muted/20">
                  <Label className="flex items-center text-sm text-muted-foreground gap-2 mb-2"><PieChart className="h-5 w-5" /> Gênero</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {genderFields.map(({ name, label }) => (<Controller key={name} name={`performanceData.${name}`} control={control} render={({ field }) => (<div className="space-y-1"><Label htmlFor={name} className="text-xs whitespace-nowrap">{label}</Label><Input id={name} placeholder="0" {...field} className="font-mono" /></div>)} />))}
                  </div>
                </Card>
                <Card className="p-4 bg-muted/20">
                  <Label className="flex items-center text-sm text-muted-foreground gap-2 mb-2"><BarChartHorizontal className="h-5 w-5" /> Faixa Etária (Seguidores)</Label>
                   <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {ageRangeFields.map(({ name, label }) => (<Controller key={name} name={`performanceData.${name}`} control={control} render={({ field }) => (<div className="space-y-1"><Label htmlFor={name} className="text-xs">{label}</Label><Input id={name} placeholder="0" {...field} className="font-mono" /></div>)} />))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Label className='text-lg font-semibold'>Localização e Conteúdo</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="p-4 bg-muted/20 space-y-3">
                    <Label className="flex items-center text-sm text-muted-foreground gap-2"><MapPin className="h-5 w-5" /> Seguidores por Cidades</Label>
                    {cidadesFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2">
                        <Controller name={`performanceData.cidadesSeguidores.${index}.key`} control={control} render={({ field }) => (<div className="flex-1 space-y-1"><Label className="text-xs">Cidade</Label><Input {...field} placeholder="Goiânia" /></div>)} />
                        <Controller name={`performanceData.cidadesSeguidores.${index}.value`} control={control} render={({ field }) => (<div className="flex-1 space-y-1"><Label className="text-xs">Seguidores</Label><Input {...field} placeholder="1.969" /></div>)} />
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeCidade(index)}><XCircle className="h-5 w-5" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendCidade({ key: '', value: '' })}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Cidade</Button>
                 </Card>
                 <Card className="p-4 bg-muted/20 space-y-3">
                    <Label className="flex items-center text-sm text-muted-foreground gap-2"><Hash className="h-5 w-5" /> Melhores Hashtags</Label>
                    {hashtagsFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2">
                        <Controller name={`performanceData.melhoresHashtags.${index}.key`} control={control} render={({ field }) => (<div className="flex-1 space-y-1"><Label className="text-xs">Hashtag</Label><Input {...field} placeholder="#MarketingDigital" /></div>)} />
                        <Controller name={`performanceData.melhoresHashtags.${index}.value`} control={control} render={({ field }) => (<div className="flex-1 space-y-1"><Label className="text-xs">Taxa média de engajamento</Label><Input {...field} placeholder="2.5%" /></div>)} />
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeHashtag(index)}><XCircle className="h-5 w-5" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendHashtag({ key: '', value: '' })}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Hashtag</Button>
                 </Card>
              </div>
            </div>

            <div className="space-y-4">
                <Card className="p-4 bg-muted/20 space-y-3">
                    <Label className="flex items-center text-lg font-semibold gap-2"><FileSignature className="h-5 w-5" /> Principais Publicações</Label>
                    {publicacoesFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2">
                        <div className="flex-1 space-y-1"><Label className="text-xs">Nome da Publicação</Label><Controller name={`performanceData.principaisPublicacoes.${index}.key`} control={control} render={({ field }) => (<Input {...field} placeholder="Técnicos em destaque..." />)} /></div>
                        <div className="w-40 space-y-1"><Label className="text-xs">Tipo</Label><Controller name={`performanceData.principaisPublicacoes.${index}.type`} control={control} render={({ field }) => (
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <SelectTrigger><SelectValue placeholder="Tipo..." /></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="arte">Arte</SelectItem>
                                   <SelectItem value="reels">Reels</SelectItem>
                                   <SelectItem value="carrossel">Carrossel</SelectItem>
                               </SelectContent>
                           </Select>
                        )} /></div>
                        <div className="w-40 space-y-1"><Label className="text-xs">Taxa de Engajamento</Label><Controller name={`performanceData.principaisPublicacoes.${index}.value`} control={control} render={({ field }) => (<Input {...field} placeholder="12,76" />)} /></div>
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removePublicacao(index)}><XCircle className="h-5 w-5" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendPublicacao({ key: '', value: '', type: 'arte' })}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Publicação</Button>
                </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isGenerating}>
                {isGenerating ? (<Loader2 className="mr-2 h-5 w-5 animate-spin" />) : (<Wand2 className="mr-2 h-5 w-5" />)}
                {isGenerating ? "Gerando Análise..." : "Gerar Relatório com IA"}
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

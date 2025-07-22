
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Wand2, Users, Heart, MessageSquare, ArrowUp, ArrowDown, Percent, BarChart2, TrendingUp, UserPlus, Eye } from "lucide-react";
import { generateReport } from '@/ai/flows/report-generator-flow';
import type { GenerateReportInput } from '@/ai/schemas/report-schemas';
import { Skeleton } from './ui/skeleton';
import { performanceSchema } from '@/ai/schemas/report-schemas';

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
    icon: React.ElementType,
  }
}[] = [
  { 
    name: 'seguidores', 
    label: 'Seguidores', 
    icon: Users, 
    comparisonField: { name: 'seguidoresVariacao', label: 'Variação % Seguidores', icon: Percent }
  },
  { 
    name: 'comecaramSeguir', 
    label: 'Começaram a Seguir', 
    icon: UserPlus, 
    comparisonField: { name: 'comecaramSeguirVariacao', label: 'Variação % Novos Seguidores', icon: Percent }
  },
  { 
    name: 'visualizacoes', 
    label: 'Visualizações', 
    icon: Eye,
    comparisonField: { name: 'visualizacoesVariacao', label: 'Variação % Visualizações', icon: Percent }
  },
  { 
    name: 'curtidas', 
    label: 'Curtidas', 
    icon: Heart,
    comparisonField: { name: 'curtidasVariacao', label: 'Variação % Curtidas', icon: Percent }
  },
  { 
    name: 'comentarios', 
    label: 'Comentários', 
    icon: MessageSquare,
    comparisonField: { name: 'comentariosVariacao', label: 'Variação % Comentários', icon: Percent }
  },
  { 
    name: 'taxaEngajamento', 
    label: 'Taxa de Engajamento', 
    icon: TrendingUp,
    comparisonField: { name: 'taxaEngajamentoVariacao', label: 'Variação % Engajamento', icon: Percent }
  },
];


export default function ReportGenerator() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      clientId: "",
      performanceData: {
        seguidores: '',
        seguidoresVariacao: '',
        comecaramSeguir: '',
        comecaramSeguirVariacao: '',
        visualizacoes: '',
        visualizacoesVariacao: '',
        curtidas: '',
        curtidasVariacao: '',
        comentarios: '',
        comentariosVariacao: '',
        taxaEngajamento: '',
        taxaEngajamentoVariacao: '',
      }
    }
  });

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
              {loadingClients ? (
                  <Skeleton className="h-10 w-full" />
              ) : (
              <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                      <SelectValue placeholder="Escolha um cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                      {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                          {client.name}
                          </SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
                  )}
              />
              )}
              {errors.clientId && <p className="text-sm text-destructive">{errors.clientId.message}</p>}
            </div>
            
            <div className="space-y-4">
              <Label>Dados de Desempenho (Visão Geral)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceFields.map(({ name, label, icon: Icon, comparisonField }) => (
                  <Card key={name} className="p-4 bg-muted/20">
                     <Label htmlFor={name} className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
                          <Icon className="h-5 w-5" />
                          {label}
                        </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Controller
                        name={`performanceData.${name}`}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-1">
                            <Label htmlFor={name} className="text-xs">Valor</Label>
                            <Input
                              id={name}
                              placeholder="0"
                              {...field}
                              className="font-mono"
                            />
                          </div>
                        )}
                      />
                      <Controller
                        name={`performanceData.${comparisonField.name}`}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-1">
                             <Label htmlFor={comparisonField.name} className="text-xs">Variação</Label>
                            <div className="relative">
                               <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                id={comparisonField.name}
                                placeholder="0.00"
                                {...field}
                                className="font-mono pl-7"
                                />
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                {isGenerating ? "Gerando Análise..." : "Gerar Relatório com IA"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(isGenerating || generatedReport) && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              Relatório Gerado
            </CardTitle>
            <CardDescription>Esta é a análise gerada pela IA com base nos dados fornecidos.</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            )}
            {generatedReport && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: generatedReport.replace(/\n/g, '<br />') }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

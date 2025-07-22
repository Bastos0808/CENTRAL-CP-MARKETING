
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { generateReport, GenerateReportInput } from '@/ai/flows/report-generator-flow';
import { Skeleton } from './ui/skeleton';

interface Client {
  id: string;
  name: string;
}

const reportSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  reportPeriod: z.string().min(1, "O período do relatório é obrigatório."),
  reportGoals: z.string().min(1, "Os objetivos são obrigatórios."),
  performanceData: z.string().min(1, "Os dados de desempenho são obrigatórios."),
});

type ReportFormValues = z.infer<typeof reportSchema>;

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
        reportPeriod: data.reportPeriod,
        reportGoals: data.reportGoals,
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="report-period">Período do Relatório</Label>
                 <Controller
                    name="reportPeriod"
                    control={control}
                    render={({ field }) => <Input id="report-period" placeholder="Ex: 01/01/2024 - 31/01/2024" {...field} />}
                  />
                {errors.reportPeriod && <p className="text-sm text-destructive">{errors.reportPeriod.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-goals">Objetivos Principais</Label>
               <Controller
                  name="reportGoals"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="report-goals"
                      placeholder="Descreva os principais objetivos que este relatório deve analisar. Ex: Análise de crescimento de seguidores, engajamento nas publicações, etc."
                      className="min-h-[100px]"
                      {...field}
                    />
                  )}
                />
              {errors.reportGoals && <p className="text-sm text-destructive">{errors.reportGoals.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="performance-data">Dados de Desempenho (Cole os dados do PDF aqui)</Label>
               <Controller
                  name="performanceData"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="performance-data"
                      placeholder="Copie e cole as métricas do seu relatório (ex: Seguidores: 3.972, Curtidas: 931, Visualizações: 26.419, etc.)."
                      className="min-h-[150px] font-mono text-xs"
                       {...field}
                    />
                  )}
                />
              {errors.performanceData && <p className="text-sm text-destructive">{errors.performanceData.message}</p>}
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
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {generatedReport}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

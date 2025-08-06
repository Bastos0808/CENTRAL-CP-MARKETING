
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileCheck, Loader2, Bot, FileText, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateTrafficReport } from '@/ai/flows/traffic-report-flow';
import type { GenerateTrafficReportOutput } from '@/ai/schemas/traffic-report-schemas';
import GeneratedReport from './generated-report';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface Client {
    id: string;
    name: string;
    briefing?: any;
}

interface TrafficReportGeneratorProps {
    client?: Client | null;
}

export default function TrafficReportGenerator({ client }: TrafficReportGeneratorProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<GenerateTrafficReportOutput | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
        } else {
            toast({
                variant: "destructive",
                title: "Formato de arquivo inválido",
                description: "Por favor, selecione um arquivo no formato .csv.",
            });
        }
    };

    const handleGenerateReport = async () => {
        if (!file) {
            toast({
                variant: "destructive",
                title: "Nenhum arquivo selecionado",
                description: "Por favor, selecione um arquivo CSV para gerar o relatório.",
            });
            return;
        }
        if (!client) {
             toast({
                variant: "destructive",
                title: "Nenhum cliente selecionado",
                description: "Por favor, selecione um cliente para gerar o relatório.",
            });
            return;
        }

        setIsLoading(true);
        setReportData(null); 

        // This is a placeholder for actual period detection from the CSV if needed.
        const currentPeriod = {
            from: new Date().toLocaleDateString('pt-BR'),
            to: new Date().toLocaleDateString('pt-BR'),
        }

        try {
            // We don't need to read the file here, Genkit will handle it if we pass the reference
            // For now, we continue with the current implementation of reading text first.
             const reader = new FileReader();
             reader.readAsText(file);
             reader.onload = async (e) => {
                const csvText = e.target?.result as string;

                const inputForAI = {
                    briefing: client.briefing,
                    campaignObjective: 'Analisar performance de tráfego pago.',
                    period: {
                        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // approx. 30 days ago
                        to: new Date().toISOString().split('T')[0]
                    },
                    performanceData: { // This part will be populated by the AI based on CSV
                         // The flow is designed to extract this from the CSV, so we send dummy/empty data here.
                         // The prompt instructs the AI to ignore this and use the CSV.
                        investment: "0",
                        impressions: "0",
                        clicks: "0",
                        ctr: "0",
                        cpc: "0",
                        conversions: "0",
                        cpl: "0",
                        roas: "0",
                        bestCampaigns: [],
                    }
                };

                // The actual call to our implemented flow
                const result = await generateTrafficReport(inputForAI);
                setReportData(result);
                
                toast({
                    title: "Relatório Gerado!",
                    description: `Análise para ${client.name} foi concluída com sucesso.`
                });
                setIsLoading(false);
            };
            reader.onerror = () => {
                toast({ variant: "destructive", title: "Erro de Leitura", description: "Não foi possível ler o conteúdo do arquivo." });
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error generating report:", error);
            const errorMessage = error instanceof Error ? error.message : "Um erro desconhecido ocorreu.";
            toast({
                variant: "destructive",
                title: "Erro ao Gerar Relatório",
                description: `Falha na comunicação com a IA: ${errorMessage}`,
            });
             setIsLoading(false);
        }
    };
    
    const handleSaveReport = async () => {
        if (!reportData?.analysis || !client?.id) {
          toast({ title: "Erro", description: "Nenhum relatório ou cliente selecionado para salvar.", variant: "destructive" });
          return;
        }
    
        const clientDocRef = doc(db, 'clients', client.id);
    
        try {
          const newReport = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            analysis: reportData.analysis,
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


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Analisando e gerando seu relatório...</h2>
                <p className="text-muted-foreground">Isso pode levar alguns instantes. Por favor, aguarde.</p>
            </div>
        );
    }
    
    if (reportData) {
        return (
            <GeneratedReport 
                report={reportData.analysis} 
                client={client || null}
                isLoading={false}
                onSave={handleSaveReport}
            />
        )
    }

    return (
        <div className="w-full">
            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-6 w-6 text-primary flex-shrink-0"/>
                        <CardTitle className="text-2xl">Upload de Dados da Campanha</CardTitle>
                    </div>
                     <CardDescription className="break-words">
                        {client?.name ? `Gerando relatório para o cliente: ` : `Selecione um cliente e envie o arquivo CSV com os dados.`}
                         {client?.name && <span className="font-bold text-primary">{client.name}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Alert className="bg-accent/50 border-accent">
                            <Bot className="h-4 w-4 text-primary" />
                            <AlertTitle className="font-semibold">Relatórios Inteligentes com IA</AlertTitle>
                            <AlertDescription>
                                Nossa IA irá analisar os dados, agrupar por categoria e extrair os KPIs para formatar um relatório estilo dashboard.
                            </AlertDescription>
                        </Alert>

                        <div 
                            className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 sm:p-8 w-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } } as ChangeEvent<HTMLInputElement>); }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="csv-uploader"
                            />
                            {!file ? (
                                <>
                                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-lg font-semibold">Arraste ou clique para enviar</p>
                                    <p className="text-sm text-muted-foreground">Selecione um arquivo no formato CSV</p>
                                </>
                            ) : (
                                <>
                                    <FileCheck className="h-12 w-12 text-primary" />
                                    <p className="mt-4 text-lg font-semibold break-all px-2">Arquivo Selecionado</p>
                                    <p className="text-sm text-muted-foreground break-all px-2">{file.name}</p>
                                </>
                            )}
                        </div>

                        <Button onClick={handleGenerateReport} disabled={!file || !client} className="w-full text-base py-6">
                           Gerar Relatório com IA
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

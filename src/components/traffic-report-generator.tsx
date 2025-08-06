"use client";

import { useState, useRef, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileCheck, Loader2, Bot, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateTrafficReport } from '@/ai/flows/traffic-report-flow';
import type { GenerateTrafficReportInput, GenerateTrafficReportOutput } from '@/ai/schemas/traffic-report-schemas';
import GeneratedReport from './generated-report';


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

        const reader = new FileReader();

        reader.onload = async (e) => {
            const csvText = e.target?.result as string;
            if (!csvText) {
                toast({ variant: "destructive", title: "Erro de Leitura", description: "Não foi possível ler o conteúdo do arquivo." });
                setIsLoading(false);
                return;
            }

            try {
                // This will be properly typed once we create the flow and schema files
                const input: any = {
                    csvData: csvText,
                    briefing: client.briefing,
                    // We can add more fields like period here later if needed
                    campaignObjective: "Analisar performance de tráfego pago.",
                    period: {
                        from: new Date().toISOString().split('T')[0],
                        to: new Date().toISOString().split('T')[0]
                    }
                }
                
                // We'll rename this function later to match the one you want to create
                // const summaryResult = await generateTrafficReport(input);
                // setReportData(summaryResult);
                
                // Placeholder while we build the other parts
                 toast({
                    title: "Em construção!",
                    description: "A lógica para chamar a IA de tráfego será implementada a seguir.",
                });


            } catch (error) {
                console.error("Error generating report:", error);
                const errorMessage = error instanceof Error ? error.message : "Um erro desconhecido ocorreu.";
                toast({
                    variant: "destructive",
                    title: "Erro ao Gerar Relatório",
                    description: `Falha na comunicação com a IA: ${errorMessage}`,
                });
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            toast({
                variant: "destructive",
                title: "Erro ao ler o arquivo",
                description: "Ocorreu um problema ao processar o arquivo selecionado.",
            });
            setIsLoading(false);
        };

        reader.readAsText(file);
    };
    
    const handleReset = () => {
        setReportData(null);
        setFile(null);
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    };
    
    const handleSaveReport = () => {
        // This will be implemented later
        toast({ title: "Funcionalidade em desenvolvimento."})
    }


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
                client={client}
                isLoading={false}
                onSave={handleSaveReport}
            />
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-6 w-6 text-primary flex-shrink-0"/>
                        <CardTitle className="text-2xl">Gerador de Relatório de Tráfego</CardTitle>
                    </div>
                     <CardDescription className="break-words">
                        {client?.name ? `Gerando relatório para o cliente: ` : `Envie um arquivo CSV com os dados de campanha para gerar um relatório de KPIs.`}
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
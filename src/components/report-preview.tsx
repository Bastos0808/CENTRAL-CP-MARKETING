
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Briefcase, Download, RotateCcw, Target, TrendingUp, Users } from 'lucide-react';
import type { ReportData, KpiCardData } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface ReportPreviewProps {
  data: ReportData;
  clientName?: string | null;
  onCancel: () => void;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'Reconhecimento & Engajamento': TrendingUp,
  'Contato': Users,
  'Vendas': Briefcase,
};

function KpiCard({ title, value, description }: KpiCardData) {
  return (
    <div className="bg-background/50 p-4 rounded-lg border flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </div>
  );
}

export function ReportPreview({ data, clientName, onCancel }: ReportPreviewProps) {
    const { toast } = useToast();
    const [isPrinting, setIsPrinting] = React.useState(false);
    const printRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!printRef.current) return;
        setIsPrinting(true);
        toast({ title: 'Gerando PDF...', description: 'Aguarde enquanto preparamos seu relatório.' });
        
        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                backgroundColor: '#000000', // Ensure background is captured
                 windowWidth: printRef.current.scrollWidth,
                 windowHeight: printRef.current.scrollHeight,
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const newCanvasHeight = pdfWidth / ratio;
            
            let position = 0;
            let heightLeft = newCanvasHeight;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, newCanvasHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - newCanvasHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, newCanvasHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Relatorio_${clientName?.replace(/\s/g, '_') || 'Campanha'}.pdf`);
             toast({ title: 'Download Iniciado!', description: 'Seu relatório em PDF foi gerado.' });

        } catch (e) {
            console.error(e);
            toast({ title: "Erro ao gerar PDF", description: "Ocorreu um problema ao criar o arquivo. Tente novamente.", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight text-primary">{data.reportTitle}</h1>
                 {clientName && <p className="text-lg text-muted-foreground">{clientName}</p>}
                 <p className="text-sm text-muted-foreground">{data.reportPeriod}</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
                <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto"><RotateCcw className="mr-2 h-4 w-4"/>Gerar Outro</Button>
                <Button onClick={handleDownload} disabled={isPrinting} className="w-full sm:w-auto">
                    {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    Baixar PDF
                </Button>
            </div>
        </div>
        
        <div ref={printRef} className="bg-black p-8 rounded-lg">
             <div className="space-y-8">
                {data.categories.map((category) => {
                     const Icon = categoryIcons[category.categoryName] || BarChart;
                     return (
                        <Card key={category.categoryName} className="bg-gray-900/50 border-gray-800 text-white overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                     <div className="p-3 bg-primary/10 rounded-lg">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl text-primary">{category.categoryName}</CardTitle>
                                        <CardDescription>Investimento Total: <span className="font-bold text-foreground">{category.totalInvestment}</span></CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {category.kpiCards.map((kpi, index) => (
                                        <KpiCard key={index} {...kpi} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    </div>
  );
}

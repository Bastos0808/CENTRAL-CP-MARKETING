
"use client";

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Client {
  id: string;
  name: string;
}

interface GeneratedReportProps {
  report: string | null;
  client: Client | null;
  isLoading: boolean;
}

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';

  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\\n/g, '<br />')
    .replace(/\n/g, '<br />');

  return html;
};

export default function GeneratedReport({ report, client, isLoading }: GeneratedReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement || !client) return;

    // Temporarily make all text black for better PDF readability
    const originalTextColors = new Map<HTMLElement, string>();
    reportElement.querySelectorAll<HTMLElement>('*').forEach(el => {
        originalTextColors.set(el, el.style.color);
        el.style.color = 'black';
    });

    const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
    });

    // Restore original colors after canvas is created
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
    pdf.save(`Relatorio_${client.name.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><FileText /> Relatório Gerado</CardTitle>
          <CardDescription>Esta é a análise gerada pela IA com base nos dados fornecidos.</CardDescription>
        </div>
        {!isLoading && report && (
          <Button onClick={handleDownloadPdf} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div 
          ref={reportRef} 
          className="p-8 bg-white text-black rounded-md prose prose-sm dark:prose-invert max-w-none prose-headings:text-primary"
          style={{ fontFamily: "'Inter', sans-serif" }} // Ensure consistent font
        >
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-300" />
              <Skeleton className="h-5 w-full bg-gray-200" />
              <Skeleton className="h-5 w-full bg-gray-200" />
              <Skeleton className="h-5 w-5/6 bg-gray-200" />
              <Skeleton className="h-8 w-1/2 bg-gray-300 mt-6" />
              <Skeleton className="h-5 w-full bg-gray-200" />
              <Skeleton className="h-5 w-full bg-gray-200" />
            </div>
          )}
          {report && client && (
             <article>
                <header className="text-center border-b-2 pb-4 mb-8 border-primary">
                    <h1 className="text-4xl font-bold text-primary">{`Relatório de Desempenho`}</h1>
                    <h2 className="text-2xl font-semibold">{client.name}</h2>
                    <p className="text-sm text-gray-500">{`Período de Análise: ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`}</p>
                </header>
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(report) }} />
             </article>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

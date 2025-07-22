
"use client";

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, FileText, Save } from 'lucide-react';
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
  onSave: () => void;
}

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';

  // Improved regex to handle lists and paragraphs better
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-primary mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-primary mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // This will be handled by the header now
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>') // Basic list item
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>') // Wrap list items in ul
    .replace(/<\/ul>\n<ul>/gim, '') // Merge consecutive lists
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => (line.startsWith('<')) ? line : `<p class="mb-3">${line}</p>`) // Wrap non-html lines in <p>
    .join('');
    
  return html.replace(/\\n/g, '<br />');
};


export default function GeneratedReport({ report, client, isLoading, onSave }: GeneratedReportProps) {
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
          <div className="flex gap-2">
            <Button onClick={onSave} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Salvar no Dossiê
            </Button>
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="bg-muted/20 p-4 rounded-md"
        >
            <div
              ref={reportRef} 
              className="bg-white text-black rounded p-8 shadow-lg"
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
                 <article className="prose prose-sm max-w-none">
                    <header className="text-center border-b-2 pb-4 mb-8 border-primary/50">
                        <h1 className="text-3xl font-bold text-primary">{`Relatório de Desempenho`}</h1>
                        <h2 className="text-xl font-semibold text-gray-700">{client.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">{`Período de Análise: ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`}</p>
                    </header>
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(report) }} />
                 </article>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

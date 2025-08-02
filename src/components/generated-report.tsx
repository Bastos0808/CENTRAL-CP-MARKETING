
"use client";

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, FileText, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import { Inter } from 'next/font/google';

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
    if (!report || !client) return;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
    });

    const docWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = docWidth - margin * 2;
    let y = 0;

    // Add font - ensure you have the font file available
    // For this example, we'll assume standard fonts are sufficient.
    // To add a custom font like Inter, you'd need the .ttf file.
    // doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
    // doc.setFont('Inter');

    // Header
    y += 60;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#E65100'); // Primary color
    doc.text('Relatório de Desempenho', docWidth / 2, y, { align: 'center' });
    
    y += 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151'); // Dark gray
    doc.text(client.name, docWidth / 2, y, { align: 'center' });

    y += 18;
    doc.setFontSize(10);
    doc.setTextColor('#6B7280'); // Muted foreground
    doc.text(`Período de Análise: ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, docWidth / 2, y, { align: 'center' });

    y += 20;
    doc.setDrawColor('#E5E7EB'); // Border color
    doc.line(margin, y, docWidth - margin, y);
    y += 40;

    
    const renderMarkdown = (markdown: string) => {
        const lines = markdown.split('\n');
        
        lines.forEach(line => {
             if (y > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }

            line = line.trim();
            if (!line) return;

            doc.setTextColor('#374151');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            
            if (line.startsWith('## ')) {
                y += 15;
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor('#E65100');
                const text = line.substring(3).trim();
                const splitText = doc.splitTextToSize(text, contentWidth);
                doc.text(splitText, margin, y);
                y += doc.getTextDimensions(splitText).h + 5;
                doc.setDrawColor('#E5E7EB');
                doc.line(margin, y, docWidth - margin, y);
                y += 15;

            } else if (line.startsWith('### ')) {
                y += 10;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                const text = line.substring(4).trim();
                const splitText = doc.splitTextToSize(text, contentWidth);
                doc.text(splitText, margin, y);
                y += doc.getTextDimensions(splitText).h + 5;
            } else if (line.startsWith('- ')) {
                const text = line.substring(2).trim();
                const textLines = doc.splitTextToSize(text, contentWidth - 15);
                
                if (y + (textLines.length * 12) > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = margin;
                }

                doc.text("•", margin, y);
                doc.text(textLines, margin + 15, y);
                y += doc.getTextDimensions(textLines).h + 5;
            } else {
                const text = line.replace(/\*\*(.*?)\*\*/g, "$1"); // Basic bold removal for width calculation
                const splitText = doc.splitTextToSize(text, contentWidth);
                 if (y + doc.getTextDimensions(splitText).h > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = margin;
                }

                let currentX = margin;
                const parts = line.split(/(\*\*.*?\*\*)/g); // Split by bold tags

                parts.forEach(part => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        doc.setFont('helvetica', 'bold');
                        doc.text(part.slice(2, -2), currentX, y, {
                            maxWidth: contentWidth - (currentX-margin)
                        });
                    } else {
                        doc.setFont('helvetica', 'normal');
                        doc.text(part, currentX, y, {
                            maxWidth: contentWidth - (currentX-margin)
                        });
                    }
                    // This logic is simplified; multi-line bold text would require more complex cursor tracking
                });
                y += doc.getTextDimensions(splitText).h + 10;
            }
        });
    };

    renderMarkdown(report);

    doc.save(`Relatorio_${client.name.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
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

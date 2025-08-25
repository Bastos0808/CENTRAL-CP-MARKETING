
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { createInteractiveProposal } from '@/lib/interactive-template';
import type { GeneratePresentationOutput } from '@/ai/schemas/presentation-generator-schemas';
import { useToast } from '@/hooks/use-toast';

export default function PresentationPreviewPage() {
  const [presentationData, setPresentationData] = useState<GeneratePresentationOutput | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('presentationData');
      if (storedData) {
        const parsedData: GeneratePresentationOutput = JSON.parse(storedData);
        setPresentationData(parsedData);
        const interactiveHtml = createInteractiveProposal({ presentationData: parsedData });
        setHtmlContent(interactiveHtml);
      } else {
        toast({ title: "Dados não encontrados", description: "Volte e gere a apresentação primeiro.", variant: "destructive"});
        router.push('/gerador-apresentacoes');
      }
    } catch (e) {
      console.error("Could not access session storage or parse data:", e);
      toast({ title: "Erro ao carregar preview", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  }, [router, toast]);


  if (isLoading) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-screen w-full" />
        </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Nenhuma Apresentação para Visualizar</h1>
        <p className="text-muted-foreground mb-6">
          Por favor, volte e gere uma apresentação primeiro.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Gerador
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-[100]">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Gerador
            </Button>
      </div>
      <iframe
        srcDoc={htmlContent}
        title={`Preview da Apresentação para ${presentationData?.clientName}`}
        className="w-full h-screen border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  );
}


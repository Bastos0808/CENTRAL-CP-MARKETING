
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function PresentationPreviewPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedHtml = sessionStorage.getItem('presentationHtml');
      if (storedHtml) {
        setHtmlContent(storedHtml);
      }
    } catch (e) {
      console.error("Could not access session storage:", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
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
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

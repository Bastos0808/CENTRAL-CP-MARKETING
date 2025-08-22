
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap, Target, BarChart, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { GeneratePresentationOutput } from '@/ai/schemas/presentation-generator-schemas';

interface Scene {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  content?: {
    title: string;
    description: string;
  }[];
}


export default function PresentationPreviewPage() {
  const [presentationData, setPresentationData] = useState<GeneratePresentationOutput | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const router = useRouter();


  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('presentationData');
      if (storedData) {
        const parsedData: GeneratePresentationOutput = JSON.parse(storedData);
        setPresentationData(parsedData);

        const generatedScenes: Scene[] = [
           {
                title: parsedData.presentationTitle,
                subtitle: `Uma proposta desenhada para o seu sucesso.`,
                icon: Zap,
            },
            {
                title: parsedData.diagnosticSlide.title,
                subtitle: parsedData.diagnosticSlide.question,
                icon: Target,
                content: parsedData.diagnosticSlide.content.map((item, index) => {
                    const titles = ["Meta Principal", "Gargalo Crítico", "Custo da Inação"];
                    return {
                        title: titles[index] || `Ponto ${index + 1}`,
                        description: item
                    }
                }),
            },
            {
                title: parsedData.actionPlanSlide.title,
                subtitle: "Nossa estratégia é baseada em 3 pilares fundamentais.",
                icon: BarChart,
                content: parsedData.actionPlanSlide.content.map((item, index) => {
                    const titles = ["Pilar 1: Aquisição", "Pilar 2: Conversão", "Pilar 3: Autoridade"];
                    return {
                        title: titles[index] || `Pilar ${index + 1}`,
                        description: item
                    }
                }),
            },
             {
                title: parsedData.timelineSlide.title,
                subtitle: "Um cronograma claro para resultados rápidos.",
                icon: Calendar,
                content: parsedData.timelineSlide.content.map((item, index) => {
                    const titles = ["Semanas 1-2 (Setup e Imersão)", "Semanas 3-12 (Execução e Otimização)", "Revisões Estratégicas"];
                    return {
                        title: titles[index] || `Fase ${index + 1}`,
                        description: item
                    }
                }),
            },
             {
                title: parsedData.whyCpSlide.title,
                subtitle: "Nossos diferenciais a serviço do seu crescimento.",
                icon: Trophy,
                content: parsedData.whyCpSlide.content.map((item, index) => {
                    const titles = ["Mentoria e Agilidade", "Produção Própria", "Foco em Business Performance"];
                    return {
                        title: titles[index] || `Diferencial ${index + 1}`,
                        description: item
                    }
                }),
            },
        ];
        setScenes(generatedScenes);

      }
    } catch (e) {
      console.error("Could not access session storage or parse data:", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const goToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const goToPreviousScene = () => {
      if (currentSceneIndex > 0) {
          setCurrentSceneIndex(currentSceneIndex - 1);
      } else {
          router.back();
      }
  }
  
  const currentScene = scenes[currentSceneIndex];

  if (isLoading) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!presentationData || scenes.length === 0) {
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
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .scene-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255, 107, 0, 0.15), transparent),
            radial-gradient(ellipse 50% 50% at 10% 100%, rgba(255, 107, 0, 0.1), transparent),
            radial-gradient(ellipse 50% 50% at 90% 90%, rgba(255, 107, 0, 0.1), transparent);
          background-color: #0D0D0D;
          transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .scene-content {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s 0.3s forwards cubic-bezier(0.25, 1, 0.5, 1);
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .content-card {
            background: rgba(23, 23, 23, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        .content-card:hover {
             border-color: rgba(255, 107, 0, 0.5);
        }
      `}</style>

      <div
        className="scene-bg"
        style={{
          transform: `scale(${1 + currentSceneIndex * 0.1}) translate(${currentSceneIndex * -5}%, ${currentSceneIndex * -2}%)`,
        }}
      />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="absolute top-4 left-4">
            <Button variant="outline" onClick={goToPreviousScene}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
        </div>
        
        <div className="scene-content w-full max-w-4xl">
            <div className="mb-8">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6 border border-primary/20">
                    <currentScene.icon className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: currentScene.title }} />
                {currentScene.subtitle && <p className="mt-4 text-lg text-muted-foreground">{currentScene.subtitle}</p>}
            </div>

            {currentScene.content && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {currentScene.content.map((item, index) => (
                  <div key={index} className="content-card p-6 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.description }}/>
                  </div>
                ))}
              </div>
            )}

            {currentSceneIndex < scenes.length - 1 && (
                <div className="mt-12">
                    <Button size="lg" onClick={goToNextScene}>
                    Avançar <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}
             {currentSceneIndex === scenes.length - 1 && (
                <div className="mt-12">
                    <Button size="lg" onClick={() => router.back()}>
                       Finalizar <Sparkles className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
      </main>
    </>
  );
}

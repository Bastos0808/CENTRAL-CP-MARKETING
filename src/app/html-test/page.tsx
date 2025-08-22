
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap, Target, BarChart, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';

interface Scene {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  content?: {
    title: string;
    description: string;
  }[];
}

const placeholderData = {
    presentationTitle: "Plano de Crescimento para [Cliente]",
    diagnosticSlide: {
        title: "Onde estamos e para onde vamos?",
        question: "Pergunta de reflexão sobre o gargalo...",
        content: [
            "**Meta:** Acelerar de R$50k para R$120k em 6 meses.",
            "**Gargalo:** O obstáculo principal é a geração de leads qualificados.",
            "**Custo da Inação:** Manter esse gargalo representa um custo de oportunidade de R$20k/mês."
        ],
    },
    actionPlanSlide: {
        title: "Como vamos virar o jogo?",
        content: [
            "Como vamos atrair um fluxo constante de leads qualificados. **Insight:** 85% dos compradores B2B usam conteúdo online para tomar decisões.",
            "Como vamos transformar curiosos em clientes pagantes. **Insight:** Empresas que nutrem leads geram 50% mais vendas a um custo 33% menor.",
            "Como vamos posicionar sua marca como líder no setor. **Insight:** Marcas consistentes têm uma receita 23% maior, em média."
        ]
    },
    timelineSlide: {
        title: "Qual o cronograma de execução?",
        content: [
            "Alinhamento estratégico, configuração de ferramentas e planejamento de campanhas/conteúdo.",
            "Lançamento de campanhas, produção de conteúdo e otimizações semanais baseadas em dados.",
            "Reuniões mensais para análise de resultados, ROI e próximos passos."
        ]
    },
    whyCpSlide: {
        title: "Por que a CP é a escolha certa?",
        content: [
            "Projeto estratégico entregue em 10 dias com mentoria de apresentação, garantindo que a execução comece rápido.",
            "Time presencial e estúdios próprios para produzir conteúdo de alta qualidade sem depender da sua agenda.",
            "Nossa obsessão é o crescimento do seu faturamento e o ROI do seu investimento, não métricas de vaidade."
        ]
    }
}


export default function HtmlTestPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  useEffect(() => {
    const generatedScenes: Scene[] = [
        {
            title: placeholderData.presentationTitle,
            subtitle: `Uma proposta desenhada para o seu sucesso.`,
            icon: Zap,
        },
        {
            title: placeholderData.diagnosticSlide.title,
            subtitle: placeholderData.diagnosticSlide.question,
            icon: Target,
            content: placeholderData.diagnosticSlide.content.map((item, index) => {
                const titles = ["Meta Principal", "Gargalo Crítico", "Custo da Inação"];
                return {
                    title: titles[index] || `Ponto ${index + 1}`,
                    description: item
                }
            }),
        },
        {
            title: placeholderData.actionPlanSlide.title,
            subtitle: "Nossa estratégia é baseada em 3 pilares fundamentais.",
            icon: BarChart,
            content: placeholderData.actionPlanSlide.content.map((item, index) => {
                const titles = ["Pilar 1: Aquisição", "Pilar 2: Conversão", "Pilar 3: Autoridade"];
                return {
                    title: titles[index] || `Pilar ${index + 1}`,
                    description: item
                }
            }),
        },
            {
            title: placeholderData.timelineSlide.title,
            subtitle: "Um cronograma claro para resultados rápidos.",
            icon: Calendar,
            content: placeholderData.timelineSlide.content.map((item, index) => {
                const titles = ["Semanas 1-2 (Setup e Imersão)", "Semanas 3-12 (Execução e Otimização)", "Revisões Estratégicas"];
                return {
                    title: titles[index] || `Fase ${index + 1}`,
                    description: item
                }
            }),
        },
            {
            title: placeholderData.whyCpSlide.title,
            subtitle: "Nossos diferenciais a serviço do seu crescimento.",
            icon: Trophy,
            content: placeholderData.whyCpSlide.content.map((item, index) => {
                const titles = ["Mentoria e Agilidade", "Produção Própria", "Foco em Business Performance"];
                return {
                    title: titles[index] || `Diferencial ${index + 1}`,
                    description: item
                }
            }),
        },
    ];
    setScenes(generatedScenes);
  }, []);

  const goToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const goToPreviousScene = () => {
      if (currentSceneIndex > 0) {
          setCurrentSceneIndex(currentSceneIndex - 1);
      }
  }
  
  const currentScene = scenes[currentSceneIndex];

  if (scenes.length === 0) {
    return <div>Carregando...</div>
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
            <BackButton />
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

            <div className="mt-12 flex justify-center items-center gap-4">
                 <Button size="lg" onClick={goToPreviousScene} variant="outline" disabled={currentSceneIndex === 0}>
                    <ArrowLeft className="mr-2 h-5 w-5" /> Anterior
                </Button>
                {currentSceneIndex < scenes.length - 1 ? (
                    <Button size="lg" onClick={goToNextScene}>
                        Avançar <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                ) : (
                    <Button size="lg" onClick={() => alert("Fim da apresentação!")}>
                       Finalizar <Sparkles className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
      </main>
    </>
  );
}

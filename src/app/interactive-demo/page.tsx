
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';

const scenes = [
  {
    title: 'Plano de Crescimento para a <span class="text-primary">Sua Marca</span>',
    subtitle: 'Uma proposta desenhada para o seu sucesso.',
    icon: Zap,
  },
  {
    title: 'O Diagnóstico: Onde estamos e para onde vamos?',
    subtitle: 'Análise do cenário atual e o potencial de crescimento.',
    icon: Target,
    content: [
      {
        title: 'Meta Principal',
        description: 'Acelerar o faturamento de <strong>R$50.000</strong> para <strong>R$120.000</strong> nos próximos 6 meses.',
      },
      {
        title: 'Gargalo Crítico',
        description: 'A geração de leads qualificados é o principal obstáculo que impede o crescimento escalado.',
      },
      {
        title: 'Custo da Inação',
        description: 'O gargalo atual representa um custo de oportunidade estimado em <strong>R$20.000 mensais</strong>.',
      },
    ],
  },
  {
    title: 'O Plano de Ação: Como vamos virar o jogo?',
    subtitle: 'Nossa estratégia é baseada em 3 pilares fundamentais.',
    icon: BarChart,
    content: [
      {
        title: 'Pilar 1: Aquisição',
        description: 'Implementar campanhas de tráfego pago no Google e Meta Ads para atrair um fluxo constante de leads qualificados.',
      },
      {
        title: 'Pilar 2: Conversão',
        description: 'Otimizar a comunicação nas redes sociais e criar landing pages de alta conversão para transformar interessados em clientes.',
      },
      {
        title: 'Pilar 3: Autoridade',
        description: 'Produzir conteúdo estratégico (vídeos e artigos) que posiciona sua marca como líder e referência no setor.',
      },
    ],
  },
];

export default function InteractiveDemoPage() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const goToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };
  
  const currentScene = scenes[currentSceneIndex];

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
                <p className="mt-4 text-lg text-muted-foreground">{currentScene.subtitle}</p>
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
        </div>
      </main>
    </>
  );
}

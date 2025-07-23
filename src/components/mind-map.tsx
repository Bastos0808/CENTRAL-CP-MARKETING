
"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindMapNodeData {
  title: string;
  description?: string;
  list?: string[];
  children?: MindMapNodeData[];
  level: number;
}

const mindMapData: MindMapNodeData[] = [
  {
    title: 'Como Identificar Dores?',
    level: 1,
    children: [
      {
        title: 'Perguntas',
        level: 2,
        list: [
          'O que mais perguntam ou resistem?',
          'O que faz as pessoas não comprarem?',
          'Quais problemas o público reclama no atendimento?',
          'Reclamações e reclamações veladas ("eu queria, mas é caro").',
        ],
        children: [
          {
            title: 'Ferramentas',
            level: 3,
            list: ['Google Trends', 'Ask The Public', 'Comentários no Instagram e TikTok', 'Caixas de perguntas e DMs'],
          },
        ],
      },
      {
        title: 'Dor das Personas',
        level: 2,
        description: '"Quais são as maiores dores de [público] que busca [produto/serviço]?"',
        list: [
          'Polêmica ou confronto: "Mentiram pra você sobre [dor]"',
          'Provocação: "Você continua [dor] porque não entendeu isso"',
          'Verdade crua: "A real sobre [dor] que ninguém te contou"',
          'Storytelling: Uma história real ou fictícia sobre a dor',
        ],
      },
      {
        title: 'Dor do Cliente',
        level: 2,
        description: 'Mapear dores do cliente para resolver limitações HOJE e da persona para resolver o que impede o SEGUIDOR de comprar.',
        list: [
          'Falta de Leads: Público só pede preço? → Atrai curioso e não qualificado.',
          'Falta de Resultados: Só tem like e nada de venda? → Conteúdo superficial e sem CTA.',
          'Falta de Prova Social: Concorrente virou referência? → Falta de autoridade.',
        ],
      },
    ],
  },
  {
    title: 'Diagnóstico Interno',
    level: 1,
    children: [
        { title: "Diagnóstico Profundo", level: 2, description: "Entender o contexto completo do cliente e seu mercado.", list: ["Reunião de briefing estratégico", "Auditoria das redes sociais e presença digital", "Análise da comunicação e tom de voz", "Mapeamento de concorrentes e benchmark", "Levantamento dos objetivos (curto, médio, longo prazo)"] },
        { title: "Mapeamento de Dores", level: 2, description: "Entender o que trava o crescimento e impede a compra.", list: ["Cliente: Falta de leads, prova social, resultado, posicionamento.", "Persona: O que impede de comprar/confiar, o que perguntam, objeções."] },
        { title: "Arquitetura de Conteúdo", level: 2, description: "Construir um plano alinhado às dores, objetivos e diferenciais.", list: ["Etapas: Pilares, formatos, temas, tom de voz, planejamento visual.", "Estratégias de destaque: Polêmica, verdade crua, storytelling, provocação."] },
        { title: "Análise e Otimização", level: 2, description: "Monitorar o que performa e ajustar o plano sempre.", list: ["Etapas: Relatório mensal, comparativo, análise de concorrência, sugestões.", "Ferramentas: Métricas (Insta/TikTok), Google Analytics, Relatório visual."] }
    ]
  },
  {
    title: 'Como Executar',
    level: 1,
    children: [
        { 
            title: "Matriz de Conteúdo (5 Categorias)",
            level: 2,
            description: "Para cada dor/objetivo da persona, gerar um tipo de conteúdo.", 
            list: ["Despertar: Atrai curiosos", "Confronto: Quebra crenças", "Educação: Ensina o porquê", "Prova: Valida com fatos/casos", "Ação: Leva para a conversão"],
            children: [
                { title: "Exemplo Aplicado: Insegurança com o corpo", level: 3, list: ["Despertar: \"Você se olha no espelho e finge que está tudo bem?\"", "Confronto: \"Ninguém te conta, mas autoestima baixa afasta oportunidades\"", "Educação: \"Como a imagem corporal impacta suas relações\"", "Prova: \"O que essa cliente relatou após o tratamento X\"", "Ação: \"Tá pronta pra se priorizar de verdade?\""] }
            ]
        },
        { title: "Estrutura e Profundidade", level: 2, list: ["Fórmula: \"Temas Base\" (ex: ansiedade) + \"Gatilhos criativos\" (ex: bastidor).", "Matriz de Profundidade: Superficial (rápido), Intermediário (educa), Profundo (análise técnica).", "Regra: Proibido repetir título com variação estética sem mudar a intenção."] }
    ]
  },
  {
    title: 'Garantia de Consistência',
    level: 1,
    children: [
        { title: "Critérios Obrigatórios", level: 2, list: ["Padronização Visual: Cores, fontes, elementos, logos.", "Tom de Voz: Formal, técnico, descontraído, etc.", "Linguagem e Estilo: Acessível ou técnica, conforme persona.", "Validação: Material novo deve ser aprovado.", "Ajustes Periódicos: Revisão trimestral da estética."] }
    ]
  },
  {
    title: 'Aplicativo Interno CP MÖDUS',
    level: 1,
    children: [
        { title: "Todo cliente ativo precisa ter:", level: 2, description: "Esse é o checkpoint obrigatório para o time.", list: ["Documento Diagnóstico", "Documento de Dores Cliente & Persona", "Plano de Conteúdo", "Relatórios mensais"] }
    ]
  },
  {
    title: 'Como Entender o que Deu Certo?',
    level: 1,
    children: [
        { title: "Analisar o último mês", level: 2, list: ["O que foi postado?", "Quais conteúdos performaram?", "Quais não deram resultado?", "O que concorrentes estão fazendo de diferente?"] }
    ]
  },
  {
    title: 'Princípios Fundamentais',
    level: 1,
    children: [
        { level: 2, list: ["Entender o cliente profundamente", "Entender o público profundamente", "Traduzir isso em conteúdo que performa", "Gerar resultado concreto"] }
    ]
  }
];

const Node = ({ node }: { node: MindMapNodeData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCollapsible = !!node.children;

  const handleToggle = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const nodeColors: Record<number, string> = {
    0: 'bg-primary text-primary-foreground',
    1: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    2: 'bg-muted/50 text-muted-foreground',
    3: 'bg-background text-foreground',
  }
  
  const titleSize: Record<number, string> = {
    0: 'text-2xl',
    1: 'text-lg',
    2: 'text-base',
    3: 'text-sm font-semibold',
  }

  const descriptionColor: Record<number, string> = {
    1: 'text-secondary-foreground/80',
    2: 'text-muted-foreground/90',
    3: 'text-foreground/80',
  }
  
  const listColor: Record<number, string> = {
     1: 'text-secondary-foreground/90',
     2: 'text-muted-foreground',
     3: 'text-foreground/90',
  }


  return (
    <div className="branch">
      <div className="node-content">
        <div
          className={cn(
            'node',
            nodeColors[node.level],
            isCollapsible && 'collapsible'
          )}
          onClick={handleToggle}
        >
          {node.title && (
            <span className={cn('node-title', titleSize[node.level])}>
              {node.title}
              {isCollapsible && (
                <ChevronRight className={cn('icon', isExpanded && 'rotate-90')} />
              )}
            </span>
          )}
          {node.description && (
            <p className={cn('node-description', descriptionColor[node.level])}>
              {node.description}
            </p>
          )}
          {node.list && (
            <ul className={cn('node-list', listColor[node.level])}>
              {node.list.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}
        </div>
      </div>
      {isCollapsible && (
        <div className={cn('children')} data-state={isExpanded ? 'open' : 'closed'}>
          {node.children?.map((childNode, index) => (
            <Node key={index} node={childNode} />
          ))}
        </div>
      )}
    </div>
  );
};


export default function MindMap() {
    return (
        <div className="mindmap-container overflow-x-auto p-4 bg-background">
            <div className="mindmap-horizontal">
                <div className="central-node-container">
                    <div className={cn('node', 'bg-primary text-primary-foreground')}>
                        <span className="node-title text-2xl">CP MÖDUS</span>
                    </div>
                </div>
                <div className="branches-container">
                    {mindMapData.map((node, index) => (
                        <Node key={index} node={node} />
                    ))}
                </div>
            </div>
        </div>
    );
}

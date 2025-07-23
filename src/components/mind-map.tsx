
"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindMapNodeData {
  title: string;
  description?: string;
  list?: string[];
  children?: MindMapNodeData[];
}

const mindMapData: MindMapNodeData[] = [
  {
    title: 'Como Identificar Dores?',
    children: [
      {
        title: 'Perguntas',
        list: [
          'O que mais perguntam ou resistem?',
          'O que faz as pessoas não comprarem?',
          'Quais problemas o público reclama no atendimento?',
          'Reclamações e reclamações veladas ("eu queria, mas é caro").',
        ],
        children: [
          {
            title: 'Ferramentas',
            list: ['Google Trends', 'Ask The Public', 'Comentários no Instagram e TikTok', 'Caixas de perguntas e DMs'],
          },
        ],
      },
      {
        title: 'Dor das Personas',
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
    children: [
        { title: "Diagnóstico Profundo", description: "Entender o contexto completo do cliente e seu mercado.", list: ["Reunião de briefing estratégico", "Auditoria das redes sociais e presença digital", "Análise da comunicação e tom de voz", "Mapeamento de concorrentes e benchmark", "Levantamento dos objetivos (curto, médio, longo prazo)"] },
        { title: "Mapeamento de Dores", description: "Entender o que trava o crescimento e impede a compra.", list: ["Cliente: Falta de leads, prova social, resultado, posicionamento.", "Persona: O que impede de comprar/confiar, o que perguntam, objeções."] },
        { title: "Arquitetura de Conteúdo", description: "Construir um plano alinhado às dores, objetivos e diferenciais.", list: ["Etapas: Pilares, formatos, temas, tom de voz, planejamento visual.", "Estratégias de destaque: Polêmica, verdade crua, storytelling, provocação."] },
        { title: "Análise e Otimização", description: "Monitorar o que performa e ajustar o plano sempre.", list: ["Etapas: Relatório mensal, comparativo, análise de concorrência, sugestões.", "Ferramentas: Métricas (Insta/TikTok), Google Analytics, Relatório visual."] }
    ]
  },
  {
    title: 'Como Executar',
    children: [
        { 
            title: "Matriz de Conteúdo (5 Categorias)",
            description: "Para cada dor/objetivo da persona, gerar um tipo de conteúdo.", 
            list: ["Despertar: Atrai curiosos", "Confronto: Quebra crenças", "Educação: Ensina o porquê", "Prova: Valida com fatos/casos", "Ação: Leva para a conversão"],
            children: [
                { title: "Exemplo Aplicado: Insegurança com o corpo", list: ["Despertar: \"Você se olha no espelho e finge que está tudo bem?\"", "Confronto: \"Ninguém te conta, mas autoestima baixa afasta oportunidades\"", "Educação: \"Como a imagem corporal impacta suas relações\"", "Prova: \"O que essa cliente relatou após o tratamento X\"", "Ação: \"Tá pronta pra se priorizar de verdade?\""] }
            ]
        },
        { title: "Estrutura e Profundidade", list: ["Fórmula: \"Temas Base\" (ex: ansiedade) + \"Gatilhos criativos\" (ex: bastidor).", "Matriz de Profundidade: Superficial (rápido), Intermediário (educa), Profundo (análise técnica).", "Regra: Proibido repetir título com variação estética sem mudar a intenção."] }
    ]
  },
  {
    title: 'Garantia de Consistência',
    children: [
        { title: "Critérios Obrigatórios", list: ["Padronização Visual: Cores, fontes, elementos, logos.", "Tom de Voz: Formal, técnico, descontraído, etc.", "Linguagem e Estilo: Acessível ou técnica, conforme persona.", "Validação: Material novo deve ser aprovado.", "Ajustes Periódicos: Revisão trimestral da estética."] }
    ]
  },
  {
    title: 'Aplicativo Interno CP MÖDUS',
    children: [
        { title: "Todo cliente ativo precisa ter:", description: "Esse é o checkpoint obrigatório para o time.", list: ["Documento Diagnóstico", "Documento de Dores Cliente & Persona", "Plano de Conteúdo", "Relatórios mensais"] }
    ]
  },
  {
    title: 'Como Entender o que Deu Certo?',
    children: [
        { title: "Analisar o último mês", list: ["O que foi postado?", "Quais conteúdos performaram?", "Quais não deram resultado?", "O que concorrentes estão fazendo de diferente?"] }
    ]
  },
  {
    title: 'Princípios Fundamentais',
    children: [
        { list: ["Entender o cliente profundamente", "Entender o público profundamente", "Traduzir isso em conteúdo que performa", "Gerar resultado concreto"] }
    ]
  }
];

const Node = ({ node, onClick, isSelected }: { node: MindMapNodeData, onClick: () => void, isSelected: boolean }) => {
  const hasChildren = !!node.children && node.children.length > 0;

  return (
    <div
      className={cn(
        'w-full p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-300',
        isSelected 
          ? 'bg-primary/10 border-primary shadow-lg' 
          : 'bg-background/50 hover:bg-muted/80 hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className={cn("font-semibold", isSelected ? 'text-primary' : 'text-foreground')}>
          {node.title}
        </h3>
        {hasChildren && <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", isSelected && "text-primary")} />}
      </div>
      {node.description && <p className="text-sm text-muted-foreground mt-1">{node.description}</p>}
      {node.list && (
        <ul className="mt-2 pl-4 list-disc text-sm text-muted-foreground space-y-1">
          {node.list.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </div>
  );
};

const MindMapColumn = ({ nodes, level, onNodeClick, activePath }: { nodes: MindMapNodeData[], level: number, onNodeClick: (node: MindMapNodeData, index: number, level: number) => void, activePath: number[] }) => {
  return (
    <div className="mindmap-column flex-shrink-0 w-80 md:w-96 space-y-2 p-2">
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          onClick={() => onNodeClick(node, index, level)}
          isSelected={activePath[level] === index}
        />
      ))}
    </div>
  );
};


export default function MindMap() {
    const rootNode: MindMapNodeData = { title: "CP MÖDUS", children: mindMapData };
    const [columns, setColumns] = useState<MindMapNodeData[][]>([rootNode.children || []]);
    const [path, setPath] = useState<number[]>([]);

    const handleNodeClick = (node: MindMapNodeData, index: number, level: number) => {
        const newPath = path.slice(0, level);
        newPath[level] = index;
        setPath(newPath);

        const newColumns = columns.slice(0, level + 1);
        if (node.children && node.children.length > 0) {
            newColumns.push(node.children);
        }
        setColumns(newColumns);
    };

    return (
        <div className="flex overflow-x-auto p-4 bg-background/30 rounded-lg border min-h-[400px]">
            {/* Root Node */}
            <div className="flex-shrink-0 w-80 md:w-96 space-y-2 p-2 flex items-start">
                 <div
                    className={cn(
                        'w-full p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-300 flex justify-between items-center',
                         'bg-primary text-primary-foreground shadow-lg' 
                    )}
                    onClick={() => { setColumns([rootNode.children || []]); setPath([]); }}
                >
                    <h3 className="font-bold text-xl">{rootNode.title}</h3>
                    <ChevronRight className="h-5 w-5" />
                </div>
            </div>
            
            {/* Dynamic Columns */}
            {columns.map((columnNodes, level) => (
                <MindMapColumn
                    key={level}
                    nodes={columnNodes}
                    level={level}
                    onNodeClick={handleNodeClick}
                    activePath={path}
                />
            ))}
        </div>
    );
}

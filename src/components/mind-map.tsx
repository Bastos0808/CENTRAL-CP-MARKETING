
"use client";

import { useState, useMemo } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';

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
        title: 'Fontes de Informação',
        list: [
          'O que mais perguntam ou resistem na prospecção?',
          'O que faz as pessoas não comprarem? (Analisar funil)',
          'Quais problemas o público reclama no atendimento de concorrentes?',
          'Reclamações veladas ("eu queria, mas é caro", "não tenho tempo").',
        ],
        children: [
          {
            title: 'Ferramentas Práticas',
            list: ['Google Trends (buscar por "como resolver X")', 'Answer The Public', 'Comentários no Instagram e TikTok de concorrentes', 'Caixas de perguntas e DMs (nossos e de concorrentes)'],
          },
        ],
      },
      {
        title: 'Transformando Dor em Conteúdo',
        description: '"Quais são as maiores dores de [público] que busca [produto/serviço]?"',
        list: [
          '<b>Polêmica/Confronto:</b> "Mentiram pra você sobre [dor]"',
          '<b>Provocação:</b> "Você continua [sentindo a dor] porque não entendeu isso"',
          '<b>Verdade Crua:</b> "A real sobre [dor] que ninguém te contou"',
          '<b>Storytelling:</b> Uma história (real ou fictícia) sobre alguém que superou a dor',
        ],
      },
      {
        title: 'Dor do Cliente vs. Dor da Persona',
        description: 'Mapear dores do CLIENTE para resolver limitações HOJE e da PERSONA para impedir o SEGUIDOR de virar cliente.',
        list: [
          '<b>Cliente com Falta de Leads:</b> Público só pede preço? → Atrai curioso e não qualificado.',
          '<b>Cliente com Falta de Resultados:</b> Só tem like e nada de venda? → Conteúdo superficial e sem CTA claro.',
          '<b>Cliente sem Prova Social:</b> Concorrente virou referência? → Falta de autoridade e conteúdo que gera confiança.',
        ],
      },
    ],
  },
  {
    title: 'Diagnóstico Interno (O Início)',
    children: [
        { title: "Diagnóstico Profundo", description: "Entender o contexto completo do cliente e seu mercado.", list: ["Reunião de briefing estratégico (obrigatório)", "Auditoria completa das redes sociais e presença digital atual", "Análise da comunicação e tom de voz existentes", "Mapeamento de 3-5 concorrentes e benchmarks de inspiração", "Levantamento dos objetivos de negócio (curto, médio, longo prazo)"] },
        { title: "Mapeamento de Dores", description: "Entender o que trava o crescimento e impede a compra.", list: ["<b>Dores do Cliente:</b> Falta de leads, falta de prova social, baixo resultado em vendas, posicionamento confuso.", "<b>Dores da Persona:</b> O que a impede de comprar/confiar? Quais suas principais dúvidas e objeções?"] },
        { title: "Arquitetura de Conteúdo", description: "Construir um plano alinhado às dores, objetivos e diferenciais.", list: ["<b>Definição de:</b> Pilares de conteúdo, formatos prioritários, temas centrais, tom de voz oficial, planejamento visual."] },
        { title: "Análise e Otimização Contínua", description: "Monitorar o que performa e ajustar o plano sempre que necessário.", list: ["<b>Processo:</b> Relatório mensal de performance, comparativo com meses anteriores, análise de concorrência, sugestões de melhoria."] }
    ]
  },
  {
    title: 'Como Executar (A Estratégia)',
    children: [
        { 
            title: "Matriz de Conteúdo (As 5 Categorias)",
            description: "Para cada dor/objetivo da persona, é possível gerar um conteúdo em cada uma das 5 categorias.", 
            list: ["<b>Despertar:</b> Atrai a atenção de curiosos e potenciais clientes.", "<b>Confronto:</b> Quebra crenças limitantes e mostra um novo caminho.", "<b>Educação:</b> Ensina o porquê da sua solução ser a melhor.", "<b>Prova:</b> Valida sua autoridade com fatos, dados e depoimentos.", "<b>Ação:</b> Leva o seguidor qualificado para a conversão."],
            children: [
                { title: "Exemplo Prático: Personal Trainer", description: "Dor da persona: Insegurança com o próprio corpo.", list: ["<b>Despertar:</b> \"Você se olha no espelho e finge que está tudo bem?\"", "<b>Confronto:</b> \"Ninguém te conta, mas sua autoestima baixa afasta oportunidades na sua vida.\"", "<b>Educação:</b> \"Como a imagem corporal que você tem impacta suas relações profissionais.\"", "<b>Prova:</b> \"O que essa cliente relatou após iniciar o tratamento X... (print de depoimento)\"", "<b>Ação:</b> \"Tá pronta para se priorizar de verdade? Comente 'EU' para receber uma proposta.\""] }
            ]
        },
        { title: "Estrutura e Profundidade do Conteúdo", list: ["<b>Fórmula Base:</b> \"Temas Base\" (ex: ansiedade) + \"Gatilhos criativos\" (ex: bastidor, storytelling).", "<b>Matriz de Profundidade:</b> Conteúdo Superficial (rápido, viral), Intermediário (educa, gera valor), Profundo (análise técnica, denso).", "<b>Regra de Ouro:</b> Proibido repetir um título com variação estética sem mudar a intenção ou a profundidade do conteúdo."] }
    ]
  },
   {
    title: 'Garantia de Consistência Visual e Textual',
    children: [
        { title: "Critérios Obrigatórios de Identidade", list: ["<b>Padronização Visual:</b> Uso correto de cores, fontes, elementos gráficos e logos.", "<b>Tom de Voz:</b> Aderência ao tom definido (ex: Formal, técnico, descontraído).", "<b>Linguagem e Estilo:</b> Nível de complexidade da escrita alinhado à persona.", "<b>Validação:</b> Todo material novo ou template deve ser aprovado pelo Diretor de Criação.", "<b>Ajustes Periódicos:</b> Revisão trimestral da identidade visual e verbal para garantir que continua relevante."] }
    ]
  },
  {
    title: 'Processos Internos (Checklist)',
    children: [
        { title: "Todo cliente ativo na agência precisa ter:", description: "Esse é o checkpoint obrigatório para o time de estratégia e conteúdo.", list: ["Documento de Diagnóstico Estratégico preenchido", "Documento de Dores (Cliente & Persona) mapeado e validado", "Plano de Conteúdo inicial (primeiros 30 dias)", "Relatórios mensais de performance arquivados no Dossiê"] }
    ]
  },
];


const Node = ({ node, onClick, isSelected }: { node: MindMapNodeData, onClick: () => void, isSelected: boolean }) => {
  const hasChildren = !!node.children && node.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'w-full p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-200',
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
       {node.description && <p className="text-sm text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: node.description }} />}
      {node.list && (
        <ul className="mt-2 pl-4 list-disc text-sm text-muted-foreground space-y-1">
          {node.list.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const MindMapColumn = ({ nodes, level, onNodeClick, activePath, isVisible }: { nodes: MindMapNodeData[], level: number, onNodeClick: (node: MindMapNodeData, index: number, level: number) => void, activePath: number[], isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="mindmap-column flex-shrink-0 w-full md:w-96 p-2 absolute top-0"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          onClick={() => onNodeClick(node, index, level)}
          isSelected={activePath[level] === index}
        />
      ))}
    </motion.div>
  );
};


export default function MindMap() {
    const rootNode: MindMapNodeData = { title: "CP MÖDUS", children: mindMapData };
    const [history, setHistory] = useState<{ nodes: MindMapNodeData[], path: number[], title: string }[]>([
        { nodes: rootNode.children || [], path: [], title: rootNode.title }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentView = history[currentIndex];

    const handleNodeClick = (node: MindMapNodeData, index: number) => {
        if (!node.children || node.children.length === 0) return;

        const newPath = [...currentView.path, index];
        const newView = { nodes: node.children, path: newPath, title: node.title };
        
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(newView);

        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };
    
    const handleGoBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const getParentTitle = () => {
        if (currentIndex > 0) {
            return history[currentIndex - 1].title;
        }
        return "Início";
    }

    return (
        <div className="p-4 bg-background/30 rounded-lg border min-h-[500px] flex flex-col">
            <div className="flex items-center mb-4">
                 {currentIndex > 0 && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {getParentTitle()}
                    </Button>
                )}
            </div>
            <div className="relative flex-1">
                <AnimatePresence initial={false}>
                    <MindMapColumn
                        key={currentIndex}
                        nodes={currentView.nodes}
                        level={currentIndex}
                        onNodeClick={(node, index) => handleNodeClick(node, index)}
                        activePath={currentView.path}
                        isVisible={true}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
}

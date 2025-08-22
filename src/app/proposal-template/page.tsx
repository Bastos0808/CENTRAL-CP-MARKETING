

"use client";

import { BackButton } from "@/components/ui/back-button";
import { GeneratedPresentation, AboutUsSlide } from "@/components/presentation-generator";
import { GeneratePresentationOutput } from "@/ai/schemas/presentation-generator-schemas";

// Mock data to display the presentation template
const mockPresentationContent: GeneratePresentationOutput = {
  presentationTitle: "Plano de Crescimento para Clínica Vitalize",
  diagnosticSlide: {
    title: "Onde estamos e para onde vamos?",
    content: [
      "**Meta:** Acelerar de R$ 50.000 para R$ 120.000.",
      "**Gargalo:** O obstáculo principal é a geração de leads qualificados.",
      "**Custo da Inação:** O gargalo atual gera um custo de oportunidade estimado em R$ 20.000 mensais."
    ],
    question: "Quantos clientes deixaram de entrar em contato este mês por não encontrarem vocês da forma certa?"
  },
  actionPlanSlide: {
    title: "Como vamos virar o jogo?",
    content: [
      "**Pilar 1 - Aquisição:** Como vamos atrair um fluxo constante de leads qualificados. **Insight:** Empresas que usam conteúdo estratégico geram 3x mais leads.",
      "**Pilar 2 - Conversão:** Como vamos transformar curiosos em clientes pagantes. **Insight:** Nutrir leads pode aumentar as vendas em 50% com 33% menos custo.",
      "**Pilar 3 - Autoridade:** Como vamos posicionar sua marca como líder no setor. **Insight:** 70% dos consumidores preferem conhecer uma empresa através de artigos a anúncios."
    ]
  },
  justificationSlide: {
      title: "Por que este plano é ideal para você?",
      content: [
          "Este plano foi desenhado para atacar diretamente seu maior gargalo: a geração de leads qualificados. Combinando marketing de conteúdo para construir autoridade e tráfego pago para acelerar o alcance, vamos não só aumentar o volume de contatos, mas também a qualidade, garantindo que o time comercial receba oportunidades mais quentes e alinhadas ao seu serviço, o que é essencial para atingir a meta de R$ 120.000."
      ]
  },
  timelineSlide: {
    title: "Qual o cronograma de execução?",
    content: [
      "**Semanas 1-2:** Setup e Imersão",
      "**Semanas 3-12:** Execução e Otimização",
      "**Revisões Estratégicas:** Reuniões mensais"
    ]
  },
  kpiSlide: {
    title: "Como vamos medir o sucesso (e o ROI)?",
    kpis: [
      { metric: "Custo por Lead (CPL)", estimate: "< R$25,00", importance: "Garante que o topo do funil seja saudável e escalável.", icon: "Target" },
      { metric: "Taxa de Conversão", estimate: "> 5%", importance: "Mede a eficácia da nossa comunicação em transformar visitantes em oportunidades.", icon: "TrendingUp" },
      { metric: "Custo por Aquisição (CAC)", estimate: "< R$150,00", importance: "A métrica mais importante para a saúde financeira, mostrando o custo real para conquistar um cliente.", icon: "DollarSign" },
      { metric: "Retorno sobre Investimento (ROAS)", estimate: "> 3:1", importance: "Mostra o lucro gerado para cada real investido em anúncios, provando o valor do marketing.", icon: "Repeat" },
      { metric: "Novos Clientes", estimate: "+20/mês", importance: "A métrica final que se conecta diretamente à meta de faturamento e crescimento.", icon: "Users" }
    ]
  },
  whyCpSlide: {
    title: "Por que a CP é a escolha certa?",
    content: [
      "**Mentoria e Agilidade:** Projeto estratégico entregue em 10 dias com mentoria de apresentação, garantindo que a execução comece rápido para atacar o gargalo de geração de leads.",
      "**Produção Própria:** Time presencial e estúdios próprios para produzir conteúdo de alta qualidade sem depender da sua agenda.",
      "**Foco em Business Performance:** Enquanto o mercado foca em métricas de vaidade, nossa obsessão é o crescimento do seu faturamento e o ROI."
    ]
  },
  investmentSlide: {
    title: "Proposta de Investimento",
    items: [
        { name: "Plano de Marketing - Premium", price: "R$ 3.999,00" },
        { name: "Captação em Estúdio (Contrato 6 meses)", price: "R$ 799,00" }
    ],
    total: "R$ 4.798,00",
    discount: "- R$ 500,00",
    finalTotal: "R$ 4.298,00"
  },
  nextStepsSlide: {
    title: "Quais os próximos passos?",
    content: [
      "Alinhamento e assinatura da proposta.",
      "Pagamento da primeira parcela para reserva de agenda.",
      "Reunião de Onboarding e Kick-off estratégico."
    ]
  }
};

const mockPresentationContentNoPackages = {
    ...mockPresentationContent,
    investmentSlide: {
        title: "Proposta de Investimento",
        items: [], // No packages selected
        total: "R$ 0,00",
        discount: undefined,
        finalTotal: "R$ 0,00"
    }
};



export default function ProposalTemplatePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-200 p-8 gap-8">
      <div className="w-full max-w-5xl flex justify-start">
        <BackButton />
      </div>
      
      <div className="text-center bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Exemplo 1: Proposta com Pacotes Selecionados</h2>
      </div>
      <div className="transform scale-[0.7] -translate-y-[15%]">
        <GeneratedPresentation
          content={mockPresentationContent}
          clientName="Clínica Vitalize"
        />
      </div>

       <hr className="w-full max-w-5xl border-t-2 border-gray-400 my-8" />
      
       <div className="text-center bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Exemplo 2: Proposta sem Pacotes (Exibindo Planos Padrão)</h2>
      </div>
       <div className="transform scale-[0.7] -translate-y-[15%]">
        <GeneratedPresentation
          content={mockPresentationContentNoPackages}
          clientName="Empresa Exemplo"
        />
      </div>

       <hr className="w-full max-w-5xl border-t-2 border-gray-400 my-8" />
      
       <div className="text-center bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Exemplo 3: Slide "Sobre Nós" Individual</h2>
      </div>
       <div className="transform scale-[0.7] -translate-y-[15%]">
        <AboutUsSlide />
      </div>
    </main>
  );
}

    

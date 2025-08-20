
"use client";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Download } from "lucide-react";

const slideStyles = {
    capa: { background: "radial-gradient(ellipse at center, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    parceria: { background: "radial-gradient(ellipse at top left, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    objetivos: { background: "radial-gradient(ellipse at bottom right, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    diferenciais: { background: "radial-gradient(ellipse at top right, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    escopo: { background: "radial-gradient(ellipse at bottom left, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    plano: { background: "radial-gradient(ellipse at center, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    investimento: { background: "radial-gradient(ellipse at top center, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" },
    proximos: { background: "radial-gradient(ellipse at bottom center, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" }
};

export default function ProposalTemplatePage() {
  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <BackButton />
            <Button>
                <Download className="mr-2 h-4 w-4" />
                Gerar PDF de Teste
            </Button>
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Template de Proposta
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Este é o modelo visual que será usado para gerar os PDFs. As informações sublinhadas serão substituídas dinamicamente.
          </p>
        </header>

        {/* PDF Template Wrapper */}
        {/* Slide 1: Capa */}
        <div style={slideStyles.capa} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
                <h1 className="text-6xl font-extrabold my-4"><u>Plano de Crescimento para Clínica OdontoPrime</u></h1>
                <p className="text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - <u>15 de Agosto de 2024</u></p>
            </div>
        </div>
        
        {/* Slide 2: Diagnóstico */}
        <div style={slideStyles.objetivos} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">O Ponto de Partida</h2>
                <h1 className="text-6xl font-extrabold my-4">Meta vs. Realidade</h1>
                 <div className="mt-8 grid grid-cols-1 gap-8 text-2xl">
                    <p><strong>Meta:</strong> <u>A meta é escalar o faturamento de R$ 20.000 para R$ 70.000.</u></p>
                    <p><strong>Gargalo:</strong> <u>O principal obstáculo que impede esse crescimento é a baixa geração de leads qualificados e a falta de um processo de conversão.</u></p>
                    <p><strong>Impacto:</strong> <u>Este gargalo representa um custo de oportunidade estimado em R$ 15.000 por mês.</u></p>
                </div>
            </div>
        </div>

        {/* Slide 3: Plano de Ação */}
        <div style={slideStyles.parceria} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</h2>
                <h1 className="text-6xl font-extrabold my-4">Os 3 Pilares do Crescimento (180 Dias)</h1>
                <div className="mt-8 grid grid-cols-3 gap-8">
                    <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Aquisição</h3>
                        <p className="text-lg text-gray-300"><u>Vamos atrair leads qualificados através de campanhas de Tráfego Pago no Google e Instagram, focadas em pacientes que buscam por "implante dentário" e "clareamento dental".</u></p>
                    </div>
                     <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Conversão</h3>
                        <p className="text-lg text-gray-300"><u>Vamos transformar leads em clientes com a criação de uma Landing Page de alta conversão para agendamentos e desenvolvimento de um roteiro de atendimento para o WhatsApp.</u></p>
                    </div>
                     <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Autoridade</h3>
                        <p className="text-lg text-gray-300"><u>Vamos fortalecer a marca com a produção de conteúdo em vídeo com depoimentos de pacientes e otimização do Google Meu Negócio para fortalecer a prova social.</u></p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Slide 4: Justificativa Estratégica */}
        <div style={slideStyles.plano} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</h2>
                <h1 className="text-6xl font-extrabold my-4">Por que este plano é ideal para você?</h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  <u>Analisamos seu cenário e concluímos que o principal gargalo não é a falta de interesse, mas a ausência de um sistema para transformar esse interesse em agendamentos. Nosso plano ataca exatamente isso: as campanhas de **Tráfego Pago** trarão o volume de interessados, a **Landing Page** irá qualificá-los e facilitar o primeiro contato, e os vídeos de **Prova Social** quebrarão a principal objeção de confiança, justificando o investimento do paciente. É um sistema completo para garantir o crescimento.</u>
                </p>
            </div>
        </div>

        {/* Slide 5: Cronograma */}
        <div style={slideStyles.escopo} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Roadmap de Execução</h2>
                <h1 className="text-6xl font-extrabold my-4">Fases do Projeto</h1>
                <div className="mt-8 grid grid-cols-1 gap-6 text-2xl">
                    <p><strong>Semanas 1-2 (Setup e Estratégia):</strong> <u>Realizaremos a configuração de ferramentas, o planejamento de conteúdo e campanhas, e um briefing aprofundado para alinhar todos os detalhes.</u></p>
                    <p><strong>Semanas 3-12 (Execução e Otimização):</strong> <u>Lançaremos as campanhas, produziremos o conteúdo, analisaremos as métricas e faremos otimizações semanais para maximizar o resultado.</u></p>
                    <p><strong>Revisões Estratégicas:</strong> <u>Teremos reuniões mensais de alinhamento para apresentar os resultados, discutir os aprendizados e planejar os próximos passos.</u></p>
                </div>
            </div>
        </div>

        {/* Slide 6: KPIs */}
        <div style={slideStyles.diferenciais} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</h2>
                <h1 className="text-6xl font-extrabold my-4">Como Mediremos o Sucesso</h1>
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6 text-3xl font-bold text-center">
                    <div className="border border-primary/30 p-8 rounded-lg">Leads Gerados</div>
                    <div className="border border-primary/30 p-8 rounded-lg">Custo por Lead (CPL)</div>
                    <div className="border border-primary/30 p-8 rounded-lg">Taxa de Conversão</div>
                    <div className="border border-primary/30 p-8 rounded-lg">Custo de Aquisição (CAC)</div>
                    <div className="border border-primary/30 p-8 rounded-lg">Retorno (ROAS)</div>
                </div>
            </div>
        </div>
        
        {/* Slide 7: Diferenciais */}
        <div style={slideStyles.parceria} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Por que a CP Marketing?</h2>
                <h1 className="text-6xl font-extrabold my-4">Nossos Diferenciais</h1>
                <div className="mt-8 grid grid-cols-1 gap-8 text-2xl">
                    <p><strong>Mentoria e Agilidade:</strong> <u>Para garantir alinhamento e agilidade, entregamos o projeto estratégico em 10 dias com uma mentoria de apresentação.</u></p>
                    <p><strong>Produção Própria:</strong> <u>Para produzir conteúdo de alta qualidade sem depender da sua agenda, temos time presencial e estúdios próprios.</u></p>
                </div>
            </div>
        </div>

        {/* Slide 8: Investimento */}
        <div style={slideStyles.investimento} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Investimento</h2>
                <div className="mt-8 bg-gray-900/50 rounded-lg p-12 text-center">
                    <h3 className="text-2xl text-gray-300">Valor do Investimento Mensal</h3>
                    <p className="text-8xl font-bold text-primary tracking-tighter my-4"><u>R$ 3.598,00</u></p>
                    <p className="text-lg text-red-400 line-through">De <u>R$ 3.998,00</u></p>
                    <div className="mt-8 text-left text-lg space-y-2">
                        <p className="flex items-center gap-3"><span className="text-primary font-bold">Incluso:</span> <u>Plano de Marketing Essencial + Captação em Estúdio</u></p>
                        <p className="flex items-center gap-3"><span className="text-primary font-bold">Desconto Aplicado:</span> <u>- R$ 400,00</u></p>
                    </div>
                </div>
            </div>
        </div>

        {/* Slide 9: Próximos Passos */}
        <div style={slideStyles.proximos} className="w-[1280px] h-[720px] mx-auto text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Próximos Passos</h2>
                <h1 className="text-6xl font-extrabold my-4">Vamos Começar?</h1>
                 <div className="mt-8 grid grid-cols-1 gap-6 text-2xl">
                    <p><strong>1.</strong> <u>Alinhamento e assinatura da proposta.</u></p>
                    <p><strong>2.</strong> <u>Pagamento da primeira parcela.</u></p>
                    <p><strong>3.</strong> <u>Reunião de Onboarding e Kick-off estratégico.</u></p>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}

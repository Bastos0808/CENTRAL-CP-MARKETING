
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";


const slideStyle = { 
    background: "radial-gradient(ellipse at center, transparent 20%, #0A0A0A 70%), linear-gradient(rgba(230, 81, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(230, 81, 0, 0.1) 1px, transparent 1px)",
    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
    backgroundColor: "#0A0A0A"
};


export default function ProposalTemplatePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    if (!proposalRef.current) return;

    setIsGenerating(true);
    toast({ title: "Gerando PDF...", description: "Aguarde, isso pode levar um momento." });

    const slides = proposalRef.current.querySelectorAll<HTMLElement>('[data-slide]');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    try {
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            
            const canvas = await html2canvas(slide, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0A0A0A', 
            });
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
              pdf.addPage([pdfWidth, pdfHeight], 'landscape');
            }
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        }

        pdf.save("Proposta_Teste_CP_Marketing.pdf");
        toast({ title: "Download Concluído!", description: "Seu PDF de teste foi gerado." });

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        toast({ title: "Erro ao Gerar PDF", description: "Ocorreu um problema ao criar o arquivo.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <BackButton />
            <Button onClick={handleDownloadPdf} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGenerating ? "Gerando..." : "Gerar PDF de Teste"}
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

        {/* This div is only for structuring the content and will not be part of the PDF */}
        <div className="space-y-8">
            {/* Slide 1: Capa */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white"><u>Plano de Crescimento para Clínica OdontoPrime</u></h1>
                    <p className="text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - <u>15 de Agosto de 2024</u></p>
                </div>
            </div>
            
            {/* Slide 2: Diagnóstico */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">O Ponto de Partida</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Meta vs. Realidade</h1>
                     <div className="mt-8 grid grid-cols-1 gap-8 text-2xl text-white">
                        <p><strong>Meta:</strong> <u>A meta é escalar o faturamento de R$ 20.000 para R$ 70.000.</u></p>
                        <p><strong>Gargalo:</strong> <u>O principal obstáculo que impede esse crescimento é a baixa geração de leads qualificados e a falta de um processo de conversão.</u></p>
                        <p><strong>Impacto:</strong> <u>Este gargalo representa um custo de oportunidade estimado em R$ 15.000 por mês.</u></p>
                    </div>
                </div>
            </div>

            {/* Slide 3: Plano de Ação */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Os 3 Pilares do Crescimento (180 Dias)</h1>
                    <div className="mt-8 grid grid-cols-3 gap-8">
                        <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Aquisição</h3>
                            <p className="text-lg text-gray-300"><u>Vamos atrair leads qualificados através de campanhas de Tráfego Pago no Google e Instagram, focadas em pacientes que buscam por "implante dentário" e "clareamento dental".</u></p>
                        </div>
                         <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Conversão</h3>
                            <p className="text-lg text-gray-300"><u>Vamos transformar leads em clientes com a criação de uma Landing Page de alta conversão para agendamentos e desenvolvimento de um roteiro de atendimento para o WhatsApp.</u></p>
                        </div>
                         <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Autoridade</h3>
                            <p className="text-lg text-gray-300"><u>Vamos fortalecer a marca com a produção de conteúdo em vídeo com depoimentos de pacientes e otimização do Google Meu Negócio para fortalecer a prova social.</u></p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Slide 4: Justificativa Estratégica */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Por que este plano é ideal para você?</h1>
                    <p className="text-xl text-gray-300 leading-relaxed text-white">
                      <u>Analisamos seu cenário e concluímos que o principal gargalo não é a falta de interesse, mas a ausência de um sistema para transformar esse interesse em agendamentos. Nosso plano ataca exatamente isso: as campanhas de **Tráfego Pago** trarão o volume de interessados, a **Landing Page** irá qualificá-los e facilitar o primeiro contato, e os vídeos de **Prova Social** quebrarão a principal objeção de confiança, justificando o investimento do paciente. É um sistema completo para garantir o crescimento.</u>
                    </p>
                </div>
            </div>

            {/* Slide 5: Cronograma */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Roadmap de Execução</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Fases do Projeto</h1>
                    <div className="mt-8 grid grid-cols-1 gap-6 text-2xl text-white">
                        <p><strong>Semanas 1-2 (Setup e Estratégia):</strong> <u>Realizaremos a configuração de ferramentas, o planejamento de conteúdo e campanhas, e um briefing aprofundado para alinhar todos os detalhes.</u></p>
                        <p><strong>Semanas 3-12 (Execução e Otimização):</strong> <u>Lançaremos as campanhas, produziremos o conteúdo, analisaremos as métricas e faremos otimizações semanais para maximizar o resultado.</u></p>
                        <p><strong>Revisões Estratégicas:</strong> <u>Teremos reuniões mensais de alinhamento para apresentar os resultados, discutir os aprendizados e planejar os próximos passos.</u></p>
                    </div>
                </div>
            </div>

            {/* Slide 6: KPIs */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Como Mediremos o Sucesso</h1>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6 text-3xl font-bold text-center text-white">
                        <div className="border border-primary/30 p-8 rounded-lg">Leads Gerados</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Custo por Lead (CPL)</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Taxa de Conversão</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Custo de Aquisição (CAC)</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Retorno (ROAS)</div>
                    </div>
                </div>
            </div>
            
            {/* Slide 7: Diferenciais */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Por que a CP Marketing?</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Nossos Diferenciais</h1>
                    <div className="mt-8 grid grid-cols-1 gap-8 text-2xl text-white">
                        <p><strong>Mentoria e Agilidade:</strong> <u>Para garantir alinhamento e agilidade, entregamos o projeto estratégico em 10 dias com uma mentoria de apresentação.</u></p>
                        <p><strong>Produção Própria:</strong> <u>Para produzir conteúdo de alta qualidade sem depender da sua agenda, temos time presencial e estúdios próprios.</u></p>
                    </div>
                </div>
            </div>

            {/* Slide 8: Investimento */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Investimento</h2>
                    <div className="mt-8 bg-gray-900/50 rounded-lg p-12 text-center">
                        <h3 className="text-2xl text-gray-300">Valor do Investimento Mensal</h3>
                        <p className="text-8xl font-bold text-primary tracking-tighter my-4"><u>R$ 3.598,00</u></p>
                        <p className="text-lg text-red-400 line-through">De <u>R$ 3.998,00</u></p>
                        <div className="mt-8 text-left text-lg space-y-2 text-white">
                            <p className="flex items-center gap-3"><span className="text-primary font-bold">Incluso:</span> <u>Plano de Marketing Essencial + Captação em Estúdio</u></p>
                            <p className="flex items-center gap-3"><span className="text-primary font-bold">Desconto Aplicado:</span> <u>- R$ 400,00</u></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 9: Próximos Passos */}
            <div style={slideStyle} className="w-full h-auto aspect-video shadow-2xl flex flex-col justify-center">
                <div className="p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Próximos Passos</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Vamos Começar?</h1>
                     <div className="mt-8 grid grid-cols-1 gap-6 text-2xl text-white">
                        <p><strong>1.</strong> <u>Alinhamento e assinatura da proposta.</u></p>
                        <p><strong>2.</strong> <u>Pagamento da primeira parcela.</u></p>
                        <p><strong>3.</strong> <u>Reunião de Onboarding e Kick-off estratégico.</u></p>
                    </div>
                </div>
            </div>
        </div>

        {/* Hidden container for PDF generation */}
        <div className="fixed -left-[9999px] top-0">
             <div ref={proposalRef} className="w-fit">
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white"><u>Plano de Crescimento para Clínica OdontoPrime</u></h1>
                    <p className="text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - <u>15 de Agosto de 2024</u></p>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">O Ponto de Partida</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Meta vs. Realidade</h1>
                     <div className="mt-8 grid grid-cols-1 gap-8 text-2xl text-white">
                        <p><strong>Meta:</strong> <u>A meta é escalar o faturamento de R$ 20.000 para R$ 70.000.</u></p>
                        <p><strong>Gargalo:</strong> <u>O principal obstáculo que impede esse crescimento é a baixa geração de leads qualificados e a falta de um processo de conversão.</u></p>
                        <p><strong>Impacto:</strong> <u>Este gargalo representa um custo de oportunidade estimado em R$ 15.000 por mês.</u></p>
                    </div>
                </div>
                 <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Os 3 Pilares do Crescimento (180 Dias)</h1>
                    <div className="mt-8 grid grid-cols-3 gap-8">
                        <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Aquisição</h3>
                            <p className="text-lg text-gray-300"><u>Vamos atrair leads qualificados através de campanhas de Tráfego Pago no Google e Instagram, focadas em pacientes que buscam por "implante dentário" e "clareamento dental".</u></p>
                        </div>
                         <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Conversão</h3>
                            <p className="text-lg text-gray-300"><u>Vamos transformar leads em clientes com a criação de uma Landing Page de alta conversão para agendamentos e desenvolvimento de um roteiro de atendimento para o WhatsApp.</u></p>
                        </div>
                         <div className="border-l-4 border-primary pl-6 py-4">
                            <h3 className="text-3xl font-bold mb-2 text-white">Autoridade</h3>
                            <p className="text-lg text-gray-300"><u>Vamos fortalecer a marca com a produção de conteúdo em vídeo com depoimentos de pacientes e otimização do Google Meu Negócio para fortalecer a prova social.</u></p>
                        </div>
                    </div>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Por que este plano é ideal para você?</h1>
                    <p className="text-xl text-gray-300 leading-relaxed text-white">
                      <u>Analisamos seu cenário e concluímos que o principal gargalo não é a falta de interesse, mas a ausência de um sistema para transformar esse interesse em agendamentos. Nosso plano ataca exatamente isso: as campanhas de **Tráfego Pago** trarão o volume de interessados, a **Landing Page** irá qualificá-los e facilitar o primeiro contato, e os vídeos de **Prova Social** quebrarão a principal objeção de confiança, justificando o investimento do paciente. É um sistema completo para garantir o crescimento.</u>
                    </p>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Roadmap de Execução</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Fases do Projeto</h1>
                    <div className="mt-8 grid grid-cols-1 gap-6 text-2xl text-white">
                        <p><strong>Semanas 1-2 (Setup e Estratégia):</strong> <u>Realizaremos a configuração de ferramentas, o planejamento de conteúdo e campanhas, e um briefing aprofundado para alinhar todos os detalhes.</u></p>
                        <p><strong>Semanas 3-12 (Execução e Otimização):</strong> <u>Lançaremos as campanhas, produziremos o conteúdo, analisaremos as métricas e faremos otimizações semanais para maximizar o resultado.</u></p>
                        <p><strong>Revisões Estratégicas:</strong> <u>Teremos reuniões mensais de alinhamento para apresentar os resultados, discutir os aprendizados e planejar os próximos passos.</u></p>
                    </div>
                </div>
                 <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Como Mediremos o Sucesso</h1>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6 text-3xl font-bold text-center text-white">
                        <div className="border border-primary/30 p-8 rounded-lg">Leads Gerados</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Custo por Lead (CPL)</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Taxa de Conversão</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Custo de Aquisição (CAC)</div>
                        <div className="border border-primary/30 p-8 rounded-lg">Retorno (ROAS)</div>
                    </div>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Por que a CP Marketing?</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Nossos Diferenciais</h1>
                    <div className="mt-8 grid grid-cols-1 gap-8 text-2xl text-white">
                        <p><strong>Mentoria e Agilidade:</strong> <u>Para garantir alinhamento e agilidade, entregamos o projeto estratégico em 10 dias com uma mentoria de apresentação.</u></p>
                        <p><strong>Produção Própria:</strong> <u>Para produzir conteúdo de alta qualidade sem depender da sua agenda, temos time presencial e estúdios próprios.</u></p>
                    </div>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Investimento</h2>
                    <div className="mt-8 bg-gray-900/50 rounded-lg p-12 text-center">
                        <h3 className="text-2xl text-gray-300">Valor do Investimento Mensal</h3>
                        <p className="text-8xl font-bold text-primary tracking-tighter my-4"><u>R$ 3.598,00</u></p>
                        <p className="text-lg text-red-400 line-through">De <u>R$ 3.998,00</u></p>
                        <div className="mt-8 text-left text-lg space-y-2 text-white">
                            <p className="flex items-center gap-3"><span className="text-primary font-bold">Incluso:</span> <u>Plano de Marketing Essencial + Captação em Estúdio</u></p>
                            <p className="flex items-center gap-3"><span className="text-primary font-bold">Desconto Aplicado:</span> <u>- R$ 400,00</u></p>
                        </div>
                    </div>
                </div>
                <div data-slide style={slideStyle} className="w-[1920px] h-[1080px] flex flex-col justify-center text-white p-16">
                    <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Próximos Passos</h2>
                    <h1 className="text-6xl font-extrabold my-4 text-white">Vamos Começar?</h1>
                     <div className="mt-8 grid grid-cols-1 gap-6 text-2xl text-white">
                        <p><strong>1.</strong> <u>Alinhamento e assinatura da proposta.</u></p>
                        <p><strong>2.</strong> <u>Pagamento da primeira parcela.</u></p>
                        <p><strong>3.</strong> <u>Reunião de Onboarding e Kick-off estratégico.</u></p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}

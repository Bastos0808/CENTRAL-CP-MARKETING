
"use client";

import { useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Download, Loader2, Goal, TrendingUp, Target, Lightbulb, CheckCheck, Check, BrainCircuit } from "lucide-react";
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
    
    const slidesContainer = proposalRef.current;
    if (!slidesContainer) return;

    const slides = Array.from(slidesContainer.querySelectorAll<HTMLElement>('[data-slide]'));
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
          scale: 2, // Aumenta a resolução da captura
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0A0A0A',
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);

        if (i > 0) {
          pdf.addPage([pdfWidth, pdfHeight], 'landscape');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
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

  const selectedPackages = ["marketing_essencial", "captacao_estudio_contrato"];
  const hasSelectedPackages = selectedPackages.length > 0;
  const watchedDiscount = 400;


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
        
        <div ref={proposalRef} className="proposal-container w-full max-w-7xl mx-auto space-y-4">
          {/* Slide 1: Capa */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center items-center p-8 text-center text-white rounded-lg overflow-hidden">
            <h2 className="text-xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
            <h1 className="text-5xl md:text-7xl font-extrabold my-4 max-w-5xl"><u>Plano de Crescimento para Clínica OdontoPrime</u></h1>
            <p className="text-lg md:text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - <u>15 de Agosto de 2024</u></p>
          </div>

          {/* Slide 2: Diagnóstico */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
            <p className="text-lg font-bold text-primary uppercase tracking-widest">O Ponto de Partida</p>
            <h1 className="text-5xl md:text-6xl font-extrabold my-2">Meta vs. Realidade</h1>
            <div className="mt-8 flex flex-col md:flex-row items-start gap-6 max-w-7xl">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                <h3 className="text-xl font-bold text-primary mb-3">Meta</h3>
                <p className="text-base text-gray-300 break-words flex-grow"><u>Atingir um faturamento de R$ 70.000, partindo dos R$ 20.000 atuais.</u></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                <h3 className="text-xl font-bold text-primary mb-3">Gargalo</h3>
                <p className="text-base text-gray-300 break-words flex-grow"><u>Baixa geração de leads qualificados e ausência de um processo claro de conversão.</u></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                <h3 className="text-xl font-bold text-primary mb-3">Impacto Financeiro</h3>
                <p className="text-base text-gray-300 break-words flex-grow"><u>Custo de oportunidade estimado em R$ 15.000 mensais devido ao gargalo atual.</u></p>
              </div>
            </div>
          </div>
          
          {/* Slide 3: Plano de Ação */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</p>
              <h1 className="text-5xl md:text-6xl font-extrabold my-2">Os 3 Pilares do Crescimento</h1>
              <div className="mt-8 flex flex-col md:flex-row items-start gap-6 max-w-7xl">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                      <h3 className="text-xl font-bold mb-2 text-white">1. Aquisição</h3>
                      <p className="text-base text-gray-300 break-words flex-grow"><u>Atrair leads qualificados via Google e Instagram Ads, focando em termos de alta intenção como "implante dentário".</u></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                      <h3 className="text-xl font-bold mb-2 text-white">2. Conversão</h3>
                      <p className="text-base text-gray-300 break-words flex-grow"><u>Criar uma Landing Page de alta conversão e roteirizar o atendimento via WhatsApp para transformar leads em agendamentos.</u></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col items-start">
                      <h3 className="text-xl font-bold mb-2 text-white">3. Autoridade</h3>
                      <p className="text-base text-gray-300 break-words flex-grow"><u>Produzir vídeos de depoimentos e otimizar o Google Meu Negócio para construir prova social e confiança.</u></p>
                  </div>
              </div>
          </div>
          
          {/* Slide 4: Justificativa Estratégica */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <div className="max-w-7xl">
                  <p className="text-lg font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</p>
                  <h1 className="text-5xl md:text-6xl font-extrabold my-2">Por que este plano é ideal para você?</h1>
                  <p className="mt-6 text-lg text-gray-300 leading-relaxed break-words max-w-7xl">
                    <u>Analisamos seu cenário e concluímos que o principal gargalo não é a falta de interesse, mas a ausência de um sistema para transformar esse interesse em agendamentos. Nosso plano ataca exatamente isso: as campanhas de **Tráfego Pago** trarão o volume de interessados, a **Landing Page** irá qualificá-los e facilitar o primeiro contato, e os vídeos de **Prova Social** quebrarão a principal objeção de confiança, justificando o investimento do paciente. É um sistema completo para garantir o crescimento.</u>
                  </p>
              </div>
          </div>

          {/* Slide 5: Cronograma */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Roadmap de Execução</p>
              <h1 className="text-5xl md:text-6xl font-extrabold my-2">Fases do Projeto</h1>
              <ul className="mt-8 space-y-4 text-lg text-gray-300 max-w-7xl">
                  <li className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                      <strong className="text-primary">Semanas 1-2:</strong>
                      <span className="break-words flex-1"><u>Setup e Estratégia: Realizaremos a configuração de ferramentas, o planejamento de conteúdo e campanhas, e um briefing aprofundado para alinhar todos os detalhes.</u></span>
                  </li>
                  <li className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                      <strong className="text-primary">Semanas 3-12:</strong>
                      <span className="break-words flex-1"><u>Execução e Otimização: Lançaremos as campanhas, produziremos o conteúdo, analisaremos as métricas e faremos otimizações semanais para maximizar o resultado.</u></span>
                  </li>
                  <li className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                      <strong className="text-primary">Revisões:</strong>
                      <span className="break-words flex-1"><u>Teremos reuniões mensais de alinhamento para apresentar os resultados, discutir os aprendizados e planejar os próximos passos.</u></span>
                  </li>
              </ul>
          </div>

          {/* Slide 6: KPIs */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
             <p className="text-lg font-bold text-primary uppercase tracking-widest">Métricas de Sucesso</p>
             <h1 className="text-5xl md:text-6xl font-extrabold my-2">Como Mediremos o Sucesso</h1>
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl">
                 <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                     <h4 className="font-bold text-base text-primary flex items-center gap-2"><TrendingUp/> Custo por Lead (CPL)</h4>
                     <p className="text-gray-300 mt-1 text-sm">Estimativa: <strong className="text-white"><u>Abaixo de R$25,00</u></strong></p>
                     <p className="text-xs text-gray-400 mt-2 break-words"><u>Para alcançar a meta de R$ 70.000 de forma lucrativa, precisamos garantir que cada lead custe no máximo R$25. Manter o CPL baixo nos permite escalar o investimento em anúncios sem comprometer a margem, atacando diretamente o gargalo de 'geração de leads' de forma sustentável.</u></p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                     <h4 className="font-bold text-base text-primary flex items-center gap-2"><Target/> Taxa de Conversão de Lead</h4>
                     <p className="text-gray-300 mt-1 text-sm">Estimativa: <strong className="text-white"><u>Acima de 15%</u></strong></p>
                     <p className="text-xs text-gray-400 mt-2 break-words"><u>Com o gargalo na 'conversão', esta métrica é crucial. Uma taxa acima de 15% significa que nosso processo de qualificação e a oferta estão ressoando com o público, transformando o investimento em tráfego em agendamentos reais e, consequentemente, em faturamento.</u></p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                     <h4 className="font-bold text-base text-primary flex items-center gap-2"><BrainCircuit/> Retorno sobre Investimento (ROAS)</h4>
                     <p className="text-gray-300 mt-1 text-sm">Estimativa: <strong className="text-white"><u>Mínimo de 3x</u></strong></p>
                     <p className="text-xs text-gray-400 mt-2 break-words"><u>A métrica final que mostra o lucro gerado a partir do investimento em marketing.</u></p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                     <h4 className="font-bold text-base text-primary flex items-center gap-2"><CheckCheck/> Agendamentos Qualificados</h4>
                     <p className="text-gray-300 mt-1 text-sm">Estimativa: <strong className="text-white"><u>20 por mês</u></strong></p>
                     <p className="text-xs text-gray-400 mt-2 break-words"><u>O verdadeiro indicador de que estamos atraindo as pessoas certas para o negócio.</u></p>
                 </div>
             </div>
          </div>
          
          {/* Slide 7: Diferenciais */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center p-10 text-white rounded-lg overflow-hidden">
              <p className="text-lg font-bold text-primary uppercase tracking-widest">Por que a CP Marketing?</p>
              <h1 className="text-5xl md:text-6xl font-extrabold my-2">Nossos Diferenciais</h1>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl">
                  <div className="p-6 bg-white/5 border-t-4 border-primary rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-2">Mentoria e Agilidade</h3>
                      <p className="text-base text-gray-300 break-words"><u>Diferente de agências tradicionais que levam meses para apresentar um plano, nós entregamos o projeto estratégico completo em 10 dias, acompanhado de uma mentoria de apresentação. Isso garante alinhamento total e acelera o início da execução, para que você comece a ver resultados o mais rápido possível.</u></p>
                  </div>
                  <div className="p-6 bg-white/5 border-t-4 border-primary rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-2">Produção Própria</h3>
                      <p className="text-base text-gray-300 break-words"><u>Não dependemos de freelancers ou terceiros. Com estúdios e equipe de produção próprios, temos controle total sobre a qualidade e agilidade do conteúdo. Isso nos permite criar materiais de alta qualidade (vídeos, fotos, podcasts) sem sobrecarregar sua agenda ou a do seu time.</u></p>
                  </div>
                   <div className="p-6 bg-white/5 border-t-4 border-primary rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-2">Foco em Performance de Negócio</h3>
                      <p className="text-base text-gray-300 break-words"><u>Nosso trabalho não termina na entrega de relatórios de curtidas. Somos obcecados por métricas que impactam o seu negócio: Custo por Aquisição (CAC), Retorno sobre Investimento (ROI) e Faturamento. Cada ação é pensada para mover o ponteiro do que realmente importa.</u></p>
                  </div>
              </div>
          </div>

           {/* Slide 8: Investimento */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center items-center p-10 text-center text-white rounded-lg overflow-hidden">
            {hasSelectedPackages ? (
                <div className="flex flex-col items-center">
                    <h3 className="text-xl text-gray-300 mb-2">Valor do Investimento Mensal</h3>
                    <p className="text-2xl text-red-400 line-through">De R$ 3.998,00</p>
                    <div className="text-8xl font-bold text-primary tracking-tighter my-2">R$ 3.598,00</div>
                    <div className="mt-4 text-base text-white">
                        <p><strong>Incluso:</strong> <u>Plano de Marketing Essencial + Captação em Estúdio</u></p>
                        {watchedDiscount > 0 && <p className="mt-2"><strong>Desconto Aplicado:</strong> <u>- R$ 400,00</u></p>}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-7xl">
                    <p className="text-lg font-bold text-primary uppercase tracking-widest">Proposta de Investimento</p>
                    <h1 className="text-5xl md:text-6xl font-extrabold my-2">Escolha o plano ideal para você</h1>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Plano Essencial */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col h-full">
                            <h3 className="text-3xl font-bold text-white mb-2">Plano Essencial</h3>
                            <p className="text-gray-400 mb-6 flex-grow">A base para construir sua autoridade e iniciar a geração de resultados.</p>
                            <p className="text-5xl font-bold text-primary mb-6">R$ 2.999,00</p>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Gestão de Mídias Sociais</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Tráfego Pago Básico</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Relatórios Mensais</li>
                            </ul>
                        </div>
                        {/* Plano Completo (Recomendado) */}
                        <div className="bg-white/10 border-2 border-primary rounded-xl p-8 flex flex-col h-full relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">RECOMENDADO</div>
                            <h3 className="text-3xl font-bold text-primary mb-2">Plano Completo</h3>
                            <p className="text-gray-300 mb-6 flex-grow">A solução completa para acelerar seu crescimento e dominar seu mercado.</p>
                            <p className="text-5xl font-bold text-primary mb-6">R$ 3.999,00</p>
                             <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Tudo do Plano Essencial</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> 1 Gravação de Podcast/Mês</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Captação de Vídeo em Estúdio</li>
                                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Mentoria Estratégica</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
          </div>


          {/* Slide 9: Próximos Passos */}
          <div data-slide style={slideStyle} className="w-full aspect-video shadow-2xl flex flex-col justify-center items-center p-10 text-center text-white rounded-lg overflow-hidden">
                <Goal className="h-16 w-16 text-primary mx-auto mb-6" />
                <h1 className="text-5xl md:text-6xl font-extrabold my-2 text-white">Vamos Começar?</h1>
                <p className="text-xl text-gray-400 mt-4 max-w-6xl">Estamos prontos para aplicar nossa metodologia e paixão para transformar os resultados do seu negócio.</p>
                <div className="mt-12 flex flex-col md:flex-row items-stretch gap-8 w-full max-w-7xl">
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-left flex-1 flex flex-col justify-center">
                        <span className="text-5xl font-bold text-primary">1.</span>
                        <p className="mt-2 text-xl font-semibold text-white break-words"><u>Alinhamento e assinatura da proposta.</u></p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-left flex-1 flex flex-col justify-center">
                        <span className="text-5xl font-bold text-primary">2.</span>
                        <p className="mt-2 text-xl font-semibold text-white break-words"><u>Pagamento da primeira parcela.</u></p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-left flex-1 flex flex-col justify-center">
                        <span className="text-5xl font-bold text-primary">3.</span>
                        <p className="mt-2 text-xl font-semibold text-white break-words"><u>Reunião de Onboarding e Kick-off estratégico.</u></p>
                    </div>
                </div>
          </div>
        </div>
      </div>
    </main>
  );
}

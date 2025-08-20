
"use client";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Download } from "lucide-react";

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
        <div className="w-[1280px] h-[720px] mx-auto bg-gray-800 text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Diagnóstico & Plano de Ação</h2>
                <h1 className="text-6xl font-extrabold my-4">Plano de Crescimento para <u>Clínica OdontoPrime</u></h1>
                <p className="text-xl text-gray-400">Proposta elaborada por CP Marketing Digital - <u>15 de Agosto de 2024</u></p>
                <div className="mt-12 pt-8 border-t-2 border-primary/50 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-primary uppercase">O Gargalo</h3>
                        <p className="text-2xl mt-2"><u>Baixa captação de novos pacientes para procedimentos de alto valor, como implantes e clareamento.</u></p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-primary uppercase">A Meta</h3>
                        <p className="text-2xl mt-2"><u>Aumentar o faturamento em R$ 50.000 nos próximos 6 meses.</u></p>
                    </div>
                </div>
            </div>
        </div>
        
         <div className="w-[1280px] h-[720px] mx-auto bg-gray-800 text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Nosso Plano de Ação</h2>
                <h1 className="text-6xl font-extrabold my-4">Os 3 Pilares do Crescimento</h1>
                <div className="mt-8 grid grid-cols-3 gap-8">
                    <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Aquisição</h3>
                        <p className="text-lg text-gray-300"><u>Campanhas de Tráfego Pago no Google e Instagram, focadas em pacientes que buscam por "implante dentário" e "clareamento dental".</u></p>
                    </div>
                     <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Conversão</h3>
                        <p className="text-lg text-gray-300"><u>Criação de uma Landing Page de alta conversão para agendamentos e desenvolvimento de um roteiro de atendimento para o WhatsApp.</u></p>
                    </div>
                     <div className="border-l-4 border-primary pl-6 py-4">
                        <h3 className="text-3xl font-bold mb-2">Autoridade</h3>
                        <p className="text-lg text-gray-300"><u>Produção de conteúdo em vídeo com depoimentos de pacientes e otimização do Google Meu Negócio para fortalecer a prova social.</u></p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="w-[1280px] h-[720px] mx-auto bg-gray-800 text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Justificativa Estratégica</h2>
                <h1 className="text-6xl font-extrabold my-4">Por que este plano é ideal para você?</h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  <u>Analisamos seu cenário e concluímos que o principal gargalo não é a falta de interesse, mas a ausência de um sistema para transformar esse interesse em agendamentos. Nosso plano ataca exatamente isso: as campanhas de **Tráfego Pago** trarão o volume de interessados, a **Landing Page** irá qualificá-los e facilitar o primeiro contato, e os vídeos de **Prova Social** quebrarão a principal objeção de confiança, justificando o investimento do paciente. É um sistema completo para garantir o crescimento.</u>
                </p>
            </div>
        </div>

        <div className="w-[1280px] h-[720px] mx-auto bg-gray-800 text-white shadow-2xl scale-[0.6] origin-top-left sm:scale-100 sm:origin-center sm:w-full sm:h-auto sm:aspect-video mt-8">
            <div className="p-16 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Investimento</h2>
                <div className="mt-8 bg-gray-900/50 rounded-lg p-12 text-center">
                    <h3 className="text-2xl text-gray-300">Valor do Investimento Mensal</h3>
                    <p className="text-8xl font-bold text-primary tracking-tighter my-4"><u>R$ 3.598,00</u></p>
                    <p className="text-lg text-red-400 line-through">De <u>R$ 3.998,00</u></p>
                    <div className="mt-8 text-left text-lg space-y-2">
                        <p className="flex items-center gap-3"><span className="text-primary font-bold">Incluso:</span> <u>Plano de Marketing Essencial + Captação em Estúdio</u></p>
                        <p className="flex items-center gap-3"><span className="text-primary font-bold">Desconto Aplicado:</span> <u>R$ 400,00</u></p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}

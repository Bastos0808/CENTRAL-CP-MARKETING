

import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Palette, Megaphone, Mic, Sparkles, Goal, Check } from 'lucide-react';
import type { ProposalFormValues } from './proposal-generator-v2';

export const packageOptions = {
    "marketing_vendas": { name: "Plano de Marketing - Vendas", price: 999, description: "Análise de perfil com otimização\nCriação de projeto para público alvo\nPlanejamento mensal\nMentoria\nCopywriting\nTráfego pago (Meta e Google)\n3 postagens semanais (1 arte e 2 vídeos)\nRelatório mensal\nArtes profissionais\nGestão completa e suporte via WhatsApp.", icon: Palette },
    "marketing_essencial": { name: "Plano de Marketing - Essencial", price: 1999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_performance": { name: "Plano de Marketing - Performance", price: 2500, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n20 postagens mensais\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\n2 reuniões de pauta\nGestão de LinkedIn\n1 diária de captação de vídeo externa\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_premium": { name: "Plano de Marketing - Premium", price: 2999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta, Google e YouTube)\n3 postagens semanais (arte ou vídeos)\n1 Gravação de podcast de 1H mensal\nMentoria para cliente (Apresentação)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nCaptação de vídeo em nosso estúdio de gravação de vídeos com videomaker mobile\nCaptação de fotos comercias para criação de conteúdo\nGerente de conta", icon: Palette },
    "marketing_master": { name: "Plano de Marketing - Master", price: 3999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta, Google e YouTube)\nGestão do canal do YouTube\nGestão do Spotify para postagem do podcast\n3 postagens semanais (arte ou vídeos)\n4 episódios de 1 hora cada: No caso de meses com 5 semanas completas (de segunda a sexta), oferecemos um episódio adicional sem custo extra.\n2 cortes por episódio: Incluídos no pacote.\nOs episódios podem ser gravados em qualquer horário de segunda a sexta, entre 8h e 17h. (Feriados não estão inclusos.)", icon: Palette },
    "trafego_pago": { name: "Tráfego Pago - Avulso", price: 1200, description: "Planejamento Estratégico de Campanhas\nSegmentação Avançada de Público\nTeste A/B de Anúncios\nMonitoramento de Desempenho\nRelatórios Detalhados e Insights\nOtimização de Campanhas\nAcompanhamento de Leads\nGestão de Campanhas no Google e Meta Ads\n\nContrato de 6 meses. Valor promocional de R$2.000,00 por R$1.200,00.", icon: Megaphone },
    "podcast_bronze": { name: "Podcast - Bronze", price: 840, description: "4 episódios/mês (1h cada) gravados em nosso estúdio profissional, com edição de áudio e vídeo e distribuição nas principais plataformas (Spotify e YouTube).", icon: Mic },
    "podcast_prata": { name: "Podcast - Prata", price: 1600, description: "Tudo do plano Bronze, mais criação de 2 cortes estratégicos (pílulas de conteúdo) por episódio para redes sociais.", icon: Mic },
    "podcast_safira": { name: "Podcast - Safira", price: 2000, description: "Tudo do plano Prata, mais 2 cortes estratégicos por episódio (total de 4), e 1 diária de captação externa para gravações especiais.", icon: Mic },
    "podcast_diamante": { name: "Podcast - Diamante", price: 2500, description: "Tudo do plano Safira, mais gestão completa do canal do YouTube com thumbnails profissionais e otimização de SEO.", icon: Mic },
    "identidade_visual": { name: "Identidade Visual", price: 2500, description: "A cara da sua marca. Criação de logo, paleta de cores, tipografia e um manual de marca completo para garantir consistência.", icon: Sparkles },
    "website": { name: "Website Institucional", price: 5000, description: "Sua casa na internet. Criação de site com até 5 páginas, design responsivo e otimizado para os mecanismos de busca (SEO).", icon: Sparkles },
    "landing_page": { name: "Landing Page de Alta Conversão", price: 1800, description: "Foco total em resultado. Uma página 100% otimizada para campanhas específicas, com formulário integrado para captura de leads.", icon: Sparkles }
};

const logoHorizontalBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjE3MyIgdmlld0JveD0iMCAwIDUxMiAxNzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPgo8cGF0aCBkPSJNNjMuMDY2NiA2MS4wMDM5QzYwLjA1ODUgNjEuMDAzOSA1Ny40NDkzIDU5Ljk0MzUgNTUuNjU0IDU4LjE0ODJDNTEuODYzNyA1NC4zNTc5IDUxLjg2MzcgNDcuODQwMiA1NS42NTQgNDQuMDQ5OUw3Ni44NjI4IDIzLjQ1MDJDODAuNjUzMSAxOS42NTk5IDg3LjIyMjggMTkuNjU5OSA5MS4wMTMxIDIzLjQ1MDJDMTAwLjU1NyAzMi45OTQ2IDEwMC41NTcgNDguNDk0NiA5MS4wMTMxIDU4LjAzOTFMNjkuODAzNSA3OS44Mjk3QzY4LjAwODMgODELjYyNDkgNjUuMzk4MSA4Mi42ODUzIDYyLjM5IDgyLjY4NTNINDQuMDA4Nkw1MS43MjkgOTAuNDA1N0w2Mi4wNDEgODIuNjgzOEw2Ni4xMzM2IDc4LjU5MTMgNzIuNTg0NiA3OC41OTEzIDc2LjY3NzEgODIuNjgzOEwxMTIuMDQxIDExOC4wNDhDMTIzLjMyNSAxMjkuMzMyIDEyMy4zMjUgMTQ3LjQ0MyAxMTIuMDQxIDE1Mzg3MjdDMTExLjE0NCAxNTkuNjIzIDEwOS45MTkgMTYwLjMxMiAxMDguNjU0IDE2MC44MzdINzguMTkxN0w4Ni40MzM4IDE1Mi41NzVDOTMuMDkzNiAxNDUuODU0IDkzLjA5MzYgMTM1LjEyNyA4Ni40MzM4IDEyOC40MDZMNzYuNTEwNCAxMTguMjc2QzcyLjQxNzkgMTE0LjE4NCA2NS45NjY5IDExNC4xODQgNjEuODc0NCAxMTguMjc2TDQzLjgwMSA3OS44OTNDNDAuOTkzNSA4Mi43MTI2IDM3LjIzNzUgODQuMTk0NSAzMy4zNjcxIDg0LjE5NDVIMTUuNDEzN0wxMS4wMDYxIDg4LjYwMjFIMzMuMzY3MUMzOC42MzQ4IDg4LjYwMjEgNDMuNTUzIDg2LjQ1MjIgNDcuMjE2MyA4Mi43ODg5TDY1LjY5NDIgNjQuMzA5NUM2OC40NTQxIDYxLjU0OTUgNjYuODg2MyA1Ny4wMzAxIDYzLjA2NjYgNjEuMDAzOVoiIGZpbGw9IiNGRTU0MTIiLz4KPHBhdGggZD0iTTMwLjY2MSA3OS44Mjk3TDQxLjY0MjQgNjguODM4NEwzMC42NjEgNTcuODQ3MUw0MS42NDI0IDQ2Ljg1NTdMNTIuNjIzOCANTcuODQ3MUw0MS42NDI0IDY4LjgzODRMNzYuODYyOCA4Mi42ODUzQzgyLjA5NzUgODMuNzgyNSA4My4wMzMgODkuNTgxNSA3OC42NjU3IDkzLjEzMTlMNjEuODc0NCAxMTAuMzczTDQzLjgwMSA5MS42OTg2TDYxLjg3NDQgNzMuNjI0M0w3OC42NjU3IDU2Ljg1MzlMODQuMzkzNiA2Mi42MTE5TDYxLjg3NDQgODUuMTMxNkw0My44MDEgMTAzLjE2NUw2MS44NzQ0IDEyMS4yMzlMODkuMjExNyA5My44NTE5QzExMS4zMDQgNzEuNzU4NSAxMTIuOTQxIDM2LjczODIgOTMuNjM2NyAxNy40MzM5TDg0LjM5MzYgOC4xOTAyNkM3My41NTU0IC0yLjY0Nzk0IDU2LjczOTMgLTIuNjQ3OTQgNDUuODU5NyA4LjE5MDI2TDguMTkwMjUgNDUuODk5OEMtMi42MDMgNTYuNjAwNyAtMi43MjYxNyA3My44NjI4IDcuOTQ5MDQgODQuNTM4TDQzLjgwMSAxMjAuNjkzQzQ3LjQ2NDMgMTI0LjM1NiA1Mi4zNTAzIDEyNi4yMzQgNTcuMjU3NyAxMjYuMjM0SDExMC43MDdMMTM3LjQ4NiA5OS40NTYxSDU3LjI1NzdDNTEuMTIxNyA5OS40NTYxIDQ1LjU0ODQgOTcuMjQxNiA0MS4xNTU3IDkyLjg0ODlMMzAuNjYxIDc5LjgyOTdaIiBmaWxsPSIjRkU1NDEyIi8+CjxwYXRoIGQ9Ik0xODUuMjcxIDEyMS40MDZIMTY2Ljc4N1Y1MC4xMDc0SDE4NS4yNzFWMjMuNDE3OUgxNDIuMTU3VjE0OC4xMDJIMTg1LjI3MVYxMjEuNDA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI0MC4zNDQgNTAuMTA3NEgyNTguODNWMTE4LjAyNkgyNDQuNTM0QzIyMS4zOTcgMTE4LjAyNiAyMDcuNDEgMTA3LjE4OCAyMDcuNDEgODYuNDMzOUMyMDcuNDEgNjUuNjc5OCAyMjEuMzk3IDUwLjEwNzQgMjQ0LjUzNCA1MC4xMDc0Wk0yNDUuMDk3IDU5LjgwMjVDMjI4LjMwOCA1OS44MDI3IDIyMC43MDcgNjkuNjcyMiAyMjAuNzA3IDg2LjQzMzlDMjIwLjcwNyAxMDQuMTE1IDIyOC4zMDggMTA4LjkzNCAyNDUuMDk3IDEwOC45MzRIMjU4LjgzVjU5LjgwMjRIMjQ1LjA5N1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MjEuNjEgMTQ4LjEwMlY1MC4xMDc0SDQ0MC4xVjEyMy4yMDNINDgwLjg4N1Y1MC4xMDc0SDQ5OS4zN1YxNDguMTAySDQ4MC44ODdWMTM5LjU4M0g0NDAuMVYxNDguMTAySDQyMS42MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNzIuMzk5IDIzLjQxNzlMMzA2LjIzNyAxMDAuODgxTDM0MC4wNzQgMjMuNDE3OUgyNjguMjA5SDI3Mi4zOTlaTTM1Mi45MTMgMjMuNDE3OUwyOTQuMzU0IDEzMS4zNDdMMjkxLjQ4OCAxMzEuMzQ3TDI4OC45NzEgMTIxLjQ0N0gyNzguMjMxTDI3NS45NTUgMTMxLjM0N0wyNzMuMDggMTMxLjM0N0wyMTUuMjQ2IDIzLjQxNzlIMjM1LjY4OUwyODQuMzIyIDEwMC44ODFMNDE3LjU1NCAyMy40MTc5SDM1Mi45MTNaIiBmaWxsPSJ3aGl0ZSIvLz4KPHBhdGggZD0iTTQxNy4zMzEgMTQ4LjEwMlY1MC4xMDc0SDQzNS44MTZWMTE4LjAyNkM0NDIuMjQxIDEyMi4zMjcgNDQ4Ljk0MyAxMjYuNTQ0IDQ1NS42ODQgMTI4LjgwN0w0NTkuNTY4IDExMC44MjFDNDUzLjc4NSAxMDguNTgyIDQ0OC4wMDMgMTA0LjM4MSA0NDEuNjE3IDEwMS40NzdINDQwLjFWNTAuMTA3NEg0NTguNTg0Vjg2LjgwMTlINDc0LjIzN1Y1MC4xMDc0SDQ5Mi43MjFWMTE2Ljc5NEM0OTcuODQzIDExNS41NDMgNTAyLjI5MiAxMTQuMTQ4IDUwNi4zOTggMTEyLjU1N0w1MDcuNjU3IDEyNi4xMjNDNDk4LjQxNCAxMjkuOTA3IDQ4OC40OTcgMTMyLjgwOCA0NzkuMjU0IDEzNC4wMjFMNzUuNjM1MyAxNzIuNjA1QzM4LjkwNTcgMTc5LjU3MSAwIDE1OC4zNDUgMCAxMjAuODc0VjE0Ljg5OTlDNS4wNjEyMiAxMC40NjAyIDExLjgxMDggMTIuNTk3MiAxMi4zMzE4IDE4LjQzOTVMMTIuNDkxNCAxMjAuODc0QzEyLjQ5MTQgMTQ5LjQyNyA0My45Njc1IDE2MS4zMjggNjcuODQxNSAxNTYuNDc1TDQ3OS4yNTQgMTM0LjAyMUM0ODIuOTMgMTMzLjM0NiA0ODYuNDggMTMyLjUxMSA0ODkuODgyIDEzMS41MDlMNjgxLjQwNiAyMi43NTAzQzY4Ny44MzEgMTYuMzI1NSA2NzguNTg4IDYuNDIyMzYgNjcxLjE2IDExLjIxMzJMNjU5LjA2MyAxOS40MzQ4QzY0OC4xODUgMjYuODIzNyA2NDUuMDYgNDAuODMwMSA2NTMuMjgyIDUwLjM1NTNMNzUuNjM1MyAxNzIuNjA1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTM1Ny4wMDggODUuOTgzM1Y1MC4xMDc0SDM3NS40OTNWMTAyLjMyMUgzOTIuOTcyVjUwLjEwNzRINDExLjQ1N1YxNDguMTAySDM5Mi45NzJWMTIuNTgyMUgzNTcuMDA4Vjg1Ljk4MzNaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjE3MyIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";

const Page = React.forwardRef<HTMLDivElement, {children: React.ReactNode, className?: string, style?: React.CSSProperties}>(({ children, className, style }, ref) => (
  <div
    ref={ref}
    data-slide
    style={style}
    className={cn(
        "w-[1920px] h-[1080px] bg-[#0A0A0A] text-white p-24 flex flex-col justify-center items-center relative font-sans overflow-hidden",
        className
    )}
    >
        <div className="absolute inset-0 w-full h-full">
            <Image crossOrigin="anonymous" src={logoHorizontalBase64} alt="CP Marketing Logo Watermark" layout="fill" objectFit="contain" className="opacity-5" />
        </div>
        <div className="absolute bottom-12 right-12 w-48 h-12 opacity-30">
             <Image crossOrigin="anonymous" src={logoHorizontalBase64} alt="CP Marketing Logo" layout="fill" objectFit="contain" />
        </div>
        {children}
    </div>
));
Page.displayName = 'Page';

interface GeneratedProposalProps extends ProposalFormValues {
    investmentValue: string;
}

export const GeneratedProposal = React.forwardRef<HTMLDivElement, GeneratedProposalProps>((props, ref) => {
    const {
        clientName,
        packages,
        investmentValue,
    } = props;

    const hasMarketingPackage = packages?.some(p => p.startsWith('marketing'));
    const hasPodcastPackage = packages?.some(p => p.startsWith('podcast'));
    const hasTrafficPackage = packages?.includes('trafego_pago');

    // Partnership Description
    const partnershipDescription = `Em um mercado onde a atenção é o ativo mais valioso, a parceria com a CP Marketing Digital para ${clientName} é a união da sua expertise de negócio com a nossa especialidade em criar conexões digitais que geram resultados. Entendemos que seu desafio não é apenas estar online, mas sim transformar presença em performance, e é exatamente aí que nossa colaboração se inicia.`;

    // Objectives
    const objectiveItems = [
      "Posicionar a marca como autoridade e referência em seu nicho de atuação.",
      "Construir uma comunidade engajada e fiel, que não apenas consome, mas defende a marca.",
      "Gerar um fluxo consistente e previsível de oportunidades de negócio e vendas.",
      "Aumentar a percepção de valor dos seus produtos/serviços, justificando um posicionamento premium."
    ];
    if(hasTrafficPackage) objectiveItems.push("Estruturar um sistema de aquisição de clientes através de anúncios de alta performance.");
    if(hasPodcastPackage) objectiveItems.push("Transformar conhecimento em um ativo de conteúdo de longa duração através de um podcast profissional.");

    // Differentials
    const differentialItems = [
      "Somos obcecados pelo resultado do cliente. Sua meta é a nossa meta.",
      "Planejamento estratégico focado em resolver problemas reais do negócio, não apenas em postar.",
      "Criatividade com propósito: cada ideia é desenhada para atingir um objetivo claro.",
      "Transparência total nos relatórios, focados em ROI e métricas que importam.",
      "Equipe multidisciplinar e antenada com as últimas tendências do mercado digital."
    ];

    // Ideal Plan
    const idealPlanItems = [
      "A combinação dos serviços selecionados ataca o crescimento em múltiplas frentes, do alcance imediato à construção de autoridade a longo prazo.",
      "Foca em criar ativos para a marca (como conteúdo de qualidade e autoridade), que geram valor contínuo.",
      "O plano é desenhado para não apenas atrair, mas para construir um relacionamento sólido e de confiança com o público-alvo.",
      "Permite a flexibilidade de adaptar a estratégia com base nos dados e no desempenho, otimizando o investimento continuamente."
    ];

    const renderPackageServices = () => (
        <div className="flex flex-wrap justify-center gap-8 text-left">
            {packages?.map(pkgKey => {
                const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
                if (!pkg) return null;
                const Icon = pkg.icon;
                return (
                    <div key={pkgKey} className="bg-gray-900/70 p-8 rounded-lg border border-gray-700 flex flex-col w-full max-w-lg">
                        <div className="flex-grow">
                            <div className="flex items-center gap-4 mb-4">
                                <Icon className="h-10 w-10 text-[#FE5412]" />
                                <h3 className="font-bold text-2xl">{pkg.name}</h3>
                            </div>
                            <p
                                className="text-sm text-gray-300 mt-2 whitespace-pre-wrap leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: pkg.description.replace(/\n/g, '<br />') }}
                            />
                        </div>
                        <div className="pt-4 mt-auto text-right">
                            <span className="text-2xl font-bold text-[#FE5412]">{pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    );

  return (
    <div ref={ref}>
        <Page className="bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1749680287741-243118ed6b2c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
              <div className="z-10 text-center flex flex-col items-center" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                  <p className="text-[#FE5412] font-semibold tracking-widest mb-4 text-2xl">PROPOSTA COMERCIAL</p>
                  <h1 className="text-[160px] font-extrabold max-w-5xl leading-snug">{clientName || '[Nome do Cliente]'}</h1>
                  <p className="text-3xl font-light text-gray-200 mt-6">Gestão Estratégica de Marketing Digital</p>
              </div>
        </Page>
        <Page className="items-start">
            <div className="absolute top-1/2 -translate-y-1/2 right-24 w-1/2 h-1/2 opacity-5">
                 <Image crossOrigin="anonymous" src={logoHorizontalBase64} alt="CP Marketing Logo" layout="fill" objectFit="contain" />
            </div>
            <div className="w-full max-w-6xl relative z-10">
                <h2 className="text-7xl font-bold uppercase mb-12 text-left">Sobre a Parceria</h2>
                <div className="flex items-start gap-8">
                    <div className="w-2 bg-[#FE5412] self-stretch"></div>
                    <p className="text-4xl font-light text-gray-200 text-left">{partnershipDescription}</p>
                </div>
            </div>
        </Page>
        <Page>
            <div className="w-full max-w-6xl">
                <h2 className="text-7xl font-bold uppercase mb-12">Nossos Objetivos</h2>
                <ul className="space-y-6 text-3xl font-light">
                    {objectiveItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6"><Goal className="h-10 w-10 text-[#FE5412] flex-shrink-0" /><span>{item}</span></li>
                    ))}
                </ul>
            </div>
        </Page>
        <Page>
             <div className="w-full max-w-6xl">
                <h2 className="text-7xl font-bold uppercase mb-12">Nossos Diferenciais</h2>
                <ul className="space-y-6 text-3xl font-light columns-2 gap-x-16">
                    {differentialItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6 mb-6 break-inside-avoid"><Sparkles className="h-10 w-10 text-[#FE5412] flex-shrink-0" /><span>{item}</span></li>
                    ))}
                </ul>
             </div>
        </Page>
        <Page className="p-16 items-start justify-start">
            <div className="w-full">
                <h2 className="text-7xl font-bold uppercase mb-12 text-center">Escopo dos Serviços</h2>
                {renderPackageServices()}
            </div>
        </Page>
        <Page>
             <div className="w-full max-w-6xl text-center">
                <h2 className="text-7xl font-bold uppercase mb-12">Por que este plano é <span className="text-[#FE5412]">ideal</span>?</h2>
                 <ul className="space-y-6 text-3xl font-light text-left max-w-4xl mx-auto">
                    {idealPlanItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6"><Check className="h-10 w-10 text-green-400 flex-shrink-0" /><span>{item}</span></li>
                    ))}
                </ul>
             </div>
        </Page>
        <Page>
            <div className="w-full max-w-6xl text-center flex justify-center items-center">
              <div className="border-8 border-[#FE5412] p-16 rounded-2xl max-w-5xl w-full">
                  <h2 className="text-6xl font-bold uppercase mb-4">Investimento Mensal</h2>
                  <p className="text-9xl font-extrabold text-[#FE5412] mb-6">{investmentValue || 'R$ 0,00'}</p>
              </div>
            </div>
        </Page>
        <Page>
            <div className="w-full max-w-6xl text-center">
                <h2 className="text-7xl font-bold uppercase mb-12">Próximos Passos</h2>
                <div className="flex justify-center items-stretch gap-10 text-left">
                    <div className="bg-gray-900/50 border-gray-800 border-2 rounded-lg w-1/3 p-10 flex flex-col">
                        <div className="text-8xl font-extrabold text-[#FE5412] mb-6">1</div>
                        <h3 className="font-bold text-3xl mb-3">Aprovação</h3>
                        <p className="text-xl text-gray-300">Análise e aprovação da proposta.</p>
                    </div>
                    <div className="bg-gray-900/50 border-gray-800 border-2 rounded-lg w-1/3 p-10 flex flex-col">
                        <div className="text-8xl font-extrabold text-[#FE5412] mb-6">2</div>
                        <h3 className="font-bold text-3xl mb-3">Assinatura</h3>
                        <p className="text-xl text-gray-300">Assinatura do contrato de prestação de serviços.</p>
                    </div>
                    <div className="bg-gray-900/50 border-gray-800 border-2 rounded-lg w-1/3 p-10 flex flex-col">
                        <div className="text-8xl font-extrabold text-[#FE5412] mb-6">3</div>
                        <h3 className="font-bold text-3xl mb-3">Onboarding</h3>
                        <p className="text-xl text-gray-300">Início da parceria e alinhamento estratégico.</p>
                    </div>
                </div>
            </div>
        </Page>
        <Page>
            <div className="text-center">
                <h2 className="text-9xl font-bold uppercase">E <span className="text-[#FE5412]">agora?</span></h2>
                <p className="text-4xl mt-6 text-gray-300 max-w-4xl mx-auto">O próximo passo é simples: basta responder a esta proposta para agendarmos nossa conversa inicial.</p>
            </div>
        </Page>
    </div>
  );
});
GeneratedProposal.displayName = "GeneratedProposal";

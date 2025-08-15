

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

const logoUrl = "https://i.postimg.cc/1zfkmh1X/LOGO-RTANGULAR-PARA-EMAIL.png";

interface GeneratedProposalProps extends ProposalFormValues {
  investmentValue: string;
  originalInvestmentValue: string | null;
}

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


export const GeneratedProposal = React.forwardRef<HTMLDivElement, GeneratedProposalProps>((props, ref) => {
    const { clientName, packages = [], investmentValue, originalInvestmentValue } = props;
    const selectedPackages = packages.map(key => packageOptions[key as keyof typeof packageOptions]).filter(Boolean);

    const renderPackageServices = (description: string) => {
        return description.split('\n').map((item, index) => (
            item && <li key={index} className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /><span>{item}</span></li>
        ));
    };
    
    // Determine which sections to show based on selected packages
    const showMarketing = packages.some(p => p.startsWith('marketing'));
    const showPodcast = packages.some(p => p.startsWith('podcast'));
    const showCreative = packages.some(p => p.startsWith('identidade') || p.startsWith('website') || p.startsWith('landing'));
    const showTraffic = packages.some(p => p.startsWith('trafego'));


    return (
        <div ref={ref} className="font-body">
            {/* Slide 1: Capa */}
            <div data-slide style={slideStyles.capa} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center items-center p-20">
                <Image src={logoUrl} alt="Logo CP Marketing" width={600} height={200} />
                <h1 className="text-7xl font-bold mt-4 tracking-tighter">PROPOSTA DE MARKETING</h1>
                <p className="text-4xl font-normal mt-4 text-primary">{clientName}</p>
            </div>

            {/* Slide 2: Sobre a Parceria */}
             <div data-slide style={slideStyles.parceria} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="max-w-7xl">
                    <p className="text-3xl font-normal text-primary mb-4">SOBRE A PARCERIA</p>
                    <h2 className="text-8xl font-bold mb-8 tracking-tighter">Nós não somos uma agência.<br/>Somos seu motor de crescimento.</h2>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-3xl font-normal text-gray-300">
                        <p>Nosso trabalho é transformar potencial em performance, e performance em lucro. Não entregamos posts, entregamos um sistema. Não gerenciamos redes, construímos ativos que geram valor para o seu negócio 24/7.</p>
                        <p>Enquanto outras agências se concentram em métricas de vaidade, nossa obsessão é o resultado que impacta sua última linha: o faturamento. Esta proposta é o primeiro passo para profissionalizar sua presença digital e construir uma máquina de vendas previsível.</p>
                    </div>
                </div>
            </div>

            {/* Slide 3: Objetivos */}
             <div data-slide style={slideStyles.objetivos} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="max-w-7xl">
                    <p className="text-3xl font-normal text-primary mb-4">NOSSOS OBJETIVOS</p>
                    <h2 className="text-8xl font-bold mb-8 tracking-tighter">O plano é claro: dominar, não competir.</h2>
                    <p className="text-3xl font-normal text-gray-300 max-w-5xl mb-12">Para isso, focaremos em três pilares que, juntos, criam uma base sólida para o crescimento acelerado e sustentável da sua marca no ambiente digital.</p>
                    <div className="grid grid-cols-3 gap-8 text-2xl font-normal">
                        <div className="border-t-2 border-primary pt-4"><strong className="text-white text-3xl">Posicionamento de Autoridade:</strong><br/>Transformar sua marca na primeira e única opção na mente do seu cliente ideal.</div>
                        <div className="border-t-2 border-primary pt-4"><strong className="text-white text-3xl">Aquisição de Clientes:</strong><br/>Implementar um sistema de aquisição de clientes que funcione de forma previsível e escalável.</div>
                        <div className="border-t-2 border-primary pt-4"><strong className="text-white text-3xl">Maximização de Lucro:</strong><br/>Otimizar cada ponto de contato para aumentar o retorno sobre o investimento e o valor do ciclo de vida do cliente.</div>
                    </div>
                </div>
            </div>

            {/* Slide 4: Diferenciais */}
             <div data-slide style={slideStyles.diferenciais} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="grid grid-cols-2 gap-16 items-center">
                    <div className="max-w-2xl">
                        <p className="text-3xl font-normal text-primary mb-4">NOSSOS DIFERENCIAIS</p>
                        <h2 className="text-8xl font-bold mb-8 tracking-tighter">Por que a CP é a escolha certa?</h2>
                        <p className="text-3xl font-normal text-gray-300">Em um mercado comoditizado, nosso processo e nossa cultura são nosso maior ativo. É isso que nos permite entregar resultados onde outros entregam apenas relatórios.</p>
                    </div>
                     <div className="text-3xl font-normal text-gray-300 space-y-8">
                        <div className="border-l-2 border-primary pl-6 py-2">
                            <h3 className="font-bold text-white text-4xl mb-2">Obsessão pelo Resultado</h3>
                            <p>Nossa remuneração e nosso sucesso estão diretamente atrelados ao seu. Se você não cresce, nós falhamos.</p>
                        </div>
                         <div className="border-l-2 border-primary pl-6 py-2">
                            <h3 className="font-bold text-white text-4xl mb-2">Processo Próprio (CP MÖDUS)</h3>
                            <p>Não usamos "fórmulas prontas". Aplicamos uma metodologia testada e validada para diagnosticar e executar com precisão.</p>
                        </div>
                         <div className="border-l-2 border-primary pl-6 py-2">
                            <h3 className="font-bold text-white text-4xl mb-2">Transparência Radical</h3>
                            <p>Você terá acesso total ao que está sendo feito, por que está sendo feito e aos resultados em tempo real. Sem desculpas, sem rodeios.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 5: Escopo do Projeto */}
            <div data-slide style={slideStyles.escopo} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="max-w-7xl w-full">
                    <p className="text-3xl font-normal text-primary mb-4">ESCOPO DO PROJETO</p>
                    <h2 className="text-8xl font-bold mb-12 tracking-tighter">O que faremos juntos.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {selectedPackages.map(pkg => (
                            <div key={pkg.name} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <pkg.icon className="h-8 w-8 text-primary" />
                                        <h3 className="text-2xl font-bold">{pkg.name}</h3>
                                    </div>
                                    <ul className="text-base text-gray-300 space-y-2 font-normal">
                                        {renderPackageServices(pkg.description)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Slide 6: Por que este plano? */}
            <div data-slide style={slideStyles.plano} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="max-w-6xl">
                    <p className="text-3xl font-normal text-primary mb-4">PLANO DE AÇÃO</p>
                    <h2 className="text-8xl font-bold mb-8 tracking-tighter">Por que este plano é ideal para você?</h2>
                    <div className="text-3xl font-normal text-gray-300 space-y-6 max-w-5xl">
                        <p>Analisamos seu cenário atual e seus objetivos de crescimento. Com base nisso, montamos uma proposta que não é apenas um "pacote de serviços", mas um plano estratégico desenhado para atacar suas maiores alavancas de crescimento agora.</p>
                        {(showMarketing || showTraffic) && <p><strong className="text-white">A base de Marketing e Tráfego Pago</strong> garante que sua marca seja vista pelo público certo, enquanto construímos uma base sólida de autoridade e conteúdo.</p>}
                        {showPodcast && <p><strong className="text-white">A inclusão do Podcast</strong> é o seu acelerador de autoridade. É a ferramenta que vai te posicionar como a referência do seu mercado, criando uma conexão profunda com a audiência.</p>}
                        {showCreative && <p><strong className="text-white">Os serviços criativos, como Identidade Visual e Website,</strong> são o alicerce da sua presença digital. Eles garantem que a primeira impressão seja impecável e que sua marca transmita a qualidade que seu serviço possui.</p>}
                        <p className="font-bold text-white pt-4">Esta combinação foi pensada para gerar resultados sinérgicos, onde cada frente de trabalho potencializa a outra, garantindo o máximo de Retorno Sobre o Investimento.</p>
                    </div>
                </div>
            </div>

            {/* Slide 7: Investimento */}
            <div data-slide style={slideStyles.investimento} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center items-center p-20 text-center">
                 <p className="text-2xl font-normal text-primary mb-4">INVESTIMENTO</p>
                 <h2 className="text-7xl font-bold tracking-tighter">Proposta Financeira</h2>
                 <p className="text-3xl font-normal text-gray-300 mt-4 mb-12">Um investimento claro para um retorno exponencial.</p>
                 <div className="bg-gray-900/50 p-12 rounded-lg border border-gray-800">
                    <p className="text-2xl text-gray-300">Valor do investimento mensal</p>
                    {originalInvestmentValue && (
                         <div className="flex items-baseline justify-center gap-4">
                            <span className="text-3xl text-red-500 font-semibold">DE</span>
                            <p className="text-5xl font-semibold text-red-500 my-2 tracking-tighter line-through decoration-red-500/80">{originalInvestmentValue}</p>
                         </div>
                    )}
                    <div className="flex items-baseline justify-center gap-4 my-4">
                        {originalInvestmentValue && <span className="text-3xl text-primary font-semibold">POR</span>}
                        <p className="text-8xl font-bold text-primary tracking-tighter">{investmentValue}</p>
                    </div>
                 </div>
            </div>

             {/* Slide 8: Próximos Passos */}
            <div data-slide style={slideStyles.proximos} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center items-center p-20 text-center">
                <Goal className="h-24 w-24 text-primary mb-8"/>
                 <h2 className="text-7xl font-bold tracking-tighter">Vamos construir juntos?</h2>
                 <p className="text-3xl font-normal text-gray-300 mt-6 mb-12 max-w-5xl">Estamos prontos para aplicar nossa metodologia e nossa paixão para transformar os resultados do seu negócio. Este é o início de uma parceria de sucesso.</p>
                 <div className="text-2xl font-normal space-y-6 text-left border-t border-b border-primary/20 py-8">
                    <p className="flex items-center gap-4"><strong className="text-primary text-3xl">1.</strong> Alinhamento e assinatura da proposta.</p>
                    <p className="flex items-center gap-4"><strong className="text-primary text-3xl">2.</strong> Reunião de Onboarding e Kick-off estratégico.</p>
                    <p className="flex items-center gap-4"><strong className="text-primary text-3xl">3.</strong> Início da execução e busca pelos primeiros resultados.</p>
                 </div>
            </div>

        </div>
    );
});

GeneratedProposal.displayName = "GeneratedProposal";

    



import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Palette, Megaphone, Mic, Sparkles, Goal, Check, Video, FileSignature } from 'lucide-react';
import type { ProposalFormValues } from './proposal-generator-v2';

export const packageOptions = {
    "marketing_vendas": { name: "Plano de Marketing - Vendas", price: 1499, description: "Análise de perfil com otimização\nCriação de projeto para público alvo\nPlanejamento mensal\nMentoria\nCopywriting\nTráfego pago (Meta e Google)\n3 postagens semanais (1 arte e 2 vídeos)\nRelatório mensal\nArtes profissionais\nGestão completa e suporte via WhatsApp.\nContrato de 6 meses.", icon: Palette },
    "marketing_essencial": { name: "Plano de Marketing - Essencial", price: 2999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nGestão da rede social: planejamento, criação, postagem e acompanhamento\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO\nGerente de conta\nContrato de 6 meses.", icon: Palette },
    "marketing_premium": { name: "Plano de Marketing - Premium", price: 3999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta, Google e YouTube)\n3 postagens semanais (arte ou vídeos)\n1 Gravação de podcast de 1H mensal\nMentoria para cliente (Apresentação)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nGestão da rede social: planejamento, criação, postagem e acompanhamento\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO\nCaptação de vídeo em nosso estúdio com videomaker mobile\nCaptação de fotos comercias para criação de conteúdo\nGerente de conta\nContrato de 6 meses.", icon: Palette },
    "marketing_master": { name: "Plano de Marketing - Master", price: 4999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta, Google e YouTube)\nGestão do canal do YouTube\nGestão do Spotify para postagem do podcast\n3 postagens semanais (arte ou vídeos)\n4 episódios de 1 hora cada (com bônus de 1 episódio em meses com 5 semanas)\n2 cortes por episódio\nGravações de Seg a Sex (8h-17h, exceto feriados)\nContrato de 6 meses.", icon: Palette },
    "trafego_pago": { name: "Tráfego Pago - Avulso", price: 1999, description: "Planejamento Estratégico de Campanhas\nSegmentação Avançada de Público\nTeste A/B de Anúncios\nMonitoramento de Desempenho\nRelatórios Detalhados e Insights\nOtimização de Campanhas\nGestão de Campanhas no Google e Meta Ads\nContrato de 6 meses.", icon: Megaphone },
    "captacao_estudio_contrato": { name: "Captação em Estúdio (Contrato 6 meses)", price: 799, description: "Captação de vídeos em nosso estúdio\nVideomaker e câmera profissional\n8 vídeos de 60 segundos editados\n2 horas de gravação.", icon: Video },
    "captacao_estudio_avulso": { name: "Captação em Estúdio (Avulso)", price: 1100, description: "Captação de vídeos em nosso estúdio\nVideomaker e câmera profissional\n8 vídeos de 60 segundos editados\n2 horas de gravação.", icon: Video },
    "captacao_externa": { name: "Captação Externa (Goiânia)", price: 999, description: "Captação externa de vídeo com videomaker e câmera profissional em Goiânia.", icon: Video },
    "gestao_youtube_podcast": { name: "Gestão de YouTube para Podcast", price: 999, description: "Gestão completa do canal do YouTube para o podcast do cliente.\nContrato de 6 meses.", icon: Mic },
    "identidade_visual": { name: "Identidade Visual", price: 999, description: "Desenvolvimento completo da marca\nLogo\nPaleta de cor\nTipografia e elementos visuais.", icon: Sparkles },
    "website": { name: "Website Institucional", price: 1999, description: "Criação de um site profissional que apresenta sua empresa, serviço e valores, reforçando autoridade, credibilidade e presença on-line.", icon: Sparkles },
    "landing_page": { name: "Landing Page de Alta Conversão", price: 999, description: "Página focada em conversão, com layout estratégico, gatilhos mentais e chamada de ação, ideal para campanhas e captação de Leads.", icon: Sparkles },
    "rd_station": { name: "Implementação RD Station (Marketing & CRM)", price: 999, description: "Implementação do CRM junto às campanhas de tráfego\nAuxílio na configuração\nReunião para ensinar o time comercial\nConfiguração do RD Marketing\nCriação de uma isca digital\n(Valor da assinatura do RD não incluso).", icon: FileSignature },
    "podcast_bronze_3m": { name: "Podcast Bronze (Contrato 3 meses)", price: 899, description: "4 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-17h).", icon: Mic },
    "podcast_bronze_6m": { name: "Podcast Bronze (Contrato 6 meses)", price: 699, description: "4 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-17h).", icon: Mic },
    "podcast_prata_3m": { name: "Podcast Prata (Contrato 3 meses)", price: 1399, description: "4 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "podcast_prata_6m": { name: "Podcast Prata (Contrato 6 meses)", price: 1199, description: "4 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "podcast_safira_3m": { name: "Podcast Safira (Contrato 3 meses)", price: 1099, description: "2 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "podcast_safira_6m": { name: "Podcast Safira (Contrato 6 meses)", price: 899, description: "2 episódios de 1h/mês\nEpisódio bônus em meses de 5 semanas\n2 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "podcast_diamante_3m": { name: "Podcast Diamante (Contrato 3 meses)", price: 2199, description: "4 episódios de 2h/mês\nEpisódio bônus em meses de 5 semanas\n4 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "podcast_diamante_6m": { name: "Podcast Diamante (Contrato 6 meses)", price: 1999, description: "4 episódios de 2h/mês\nEpisódio bônus em meses de 5 semanas\n4 cortes de até 90s por episódio\nGravação Seg-Sex (8h-22h) e Sáb (8h-12h).", icon: Mic },
    "edicao_episodio": { name: "Edição de Episódio (Avulso)", price: 299, description: "Edição completa de um episódio de podcast.", icon: Mic },
    "podcast_entrevista": { name: "Podcast Entrevista (Avulso)", price: 599, description: "Gravação de um podcast com um entrevistador da nossa equipe. O cliente envia as perguntas.", icon: Mic },
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


export const AboutUsSlide = () => (
    <div data-slide style={{ padding: '50px 80px 80px', background: "radial-gradient(ellipse at top left, rgba(230, 81, 0, 0.10), transparent 60%), #0A0A0A" }} className="w-[1920px] h-[1080px] shadow-2xl flex items-center justify-center text-white rounded-lg overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <p className="text-[#E65100] font-bold text-lg uppercase tracking-wider">SOBRE NÓS</p>
                <h1 className="text-5xl font-black leading-tight">Somos obcecados por resultados, não por métricas de vaidade.</h1>
                <p className="text-gray-300 text-lg leading-relaxed">Em um mercado onde muitos se contentam em entregar posts e relatórios, nós entregamos crescimento. Nosso ambiente colaborativo e estúdios próprios nos dão a agilidade e a qualidade para transformar sua presença digital em um ativo que gera lucro e autoridade.</p>
                <div className="flex items-center gap-6 pt-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">+203</p>
                        <p className="text-sm text-gray-400">Clientes Atendidos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">+3 Anos</p>
                        <p className="text-sm text-gray-400">de Mercado</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                <div className="col-span-2 row-span-1 relative rounded-lg overflow-hidden">
                     <Image src="https://placehold.co/600x240.png" alt="Placeholder de imagem de escritório" layout="fill" objectFit="cover" data-ai-hint="office meeting" />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-lg overflow-hidden">
                    <Image src="https://placehold.co/300x300.png" alt="Placeholder de imagem de equipe" layout="fill" objectFit="cover" data-ai-hint="team collaboration" />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-lg overflow-hidden">
                   <Image src="https://placehold.co/300x300.png" alt="Placeholder de imagem de detalhe" layout="fill" objectFit="cover" data-ai-hint="computer screen" />
                </div>
            </div>
        </div>
    </div>
);


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
    const showCreative = packages.some(p => p.startsWith('identidade') || p.startsWith('website') || p.startsWith('landing') || p.startsWith('rd_station'));
    const showTraffic = packages.some(p => p.startsWith('trafego'));
    const showVideo = packages.some(p => p.startsWith('captacao'));


    return (
        <div ref={ref} className="font-body">
            {/* Slide 1: Capa */}
            <div data-slide style={slideStyles.capa} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center items-center p-20">
                <div className="relative w-[600px] h-[200px]">
                    <Image src={logoUrl} alt="Logo CP Marketing" layout="fill" objectFit="contain" priority />
                </div>
                <h1 className="text-7xl font-bold mt-8 tracking-tighter">PROPOSTA DE MARKETING</h1>
                <p className="text-4xl font-normal mt-4 text-primary">{clientName}</p>
            </div>

            {/* Slide 2: Sobre Nós */}
            <AboutUsSlide />

            {/* Slide 3: Sobre a Parceria */}
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

            {/* Slide 4: Objetivos */}
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

            {/* Slide 5: Diferenciais */}
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

            {/* Slide 6: Escopo do Projeto */}
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
            
            {/* Slide 7: Por que este plano? */}
            <div data-slide style={slideStyles.plano} className="w-[1920px] h-[1080px] text-white flex flex-col justify-center p-20">
                <div className="max-w-6xl">
                    <p className="text-3xl font-normal text-primary mb-4">PLANO DE AÇÃO</p>
                    <h2 className="text-8xl font-bold mb-8 tracking-tighter">Por que este plano é ideal para você?</h2>
                    <div className="text-3xl font-normal text-gray-300 space-y-6 max-w-5xl">
                        <p>Analisamos seu cenário atual e seus objetivos de crescimento. Com base nisso, montamos uma proposta que não é apenas um "pacote de serviços", mas um plano estratégico desenhado para atacar suas maiores alavancas de crescimento agora.</p>
                        {(showMarketing || showTraffic) && <p><strong className="text-white">A base de Marketing e Tráfego Pago</strong> garante que sua marca seja vista pelo público certo, enquanto construímos uma base sólida de autoridade e conteúdo.</p>}
                        {showPodcast && <p><strong className="text-white">A inclusão do Podcast</strong> é o seu acelerador de autoridade. É a ferramenta que vai te posicionar como a referência do seu mercado, criando uma conexão profunda com a audiência.</p>}
                        {showCreative && <p><strong className="text-white">Os serviços criativos, como Identidade Visual e Website,</strong> são o alicerce da sua presença digital. Eles garantem que a primeira impressão seja impecável e que sua marca transmita a qualidade que seu serviço possui.</p>}
                        {showVideo && <p><strong className="text-white">A produção de vídeo profissional</strong> eleva a percepção de valor da sua marca, permitindo mostrar seus produtos e serviços com a qualidade que eles merecem.</p>}
                        <p className="font-bold text-white pt-4">Esta combinação foi pensada para gerar resultados sinérgicos, onde cada frente de trabalho potencializa a outra, garantindo o máximo de Retorno Sobre o Investimento.</p>
                    </div>
                </div>
            </div>

            {/* Slide 8: Investimento */}
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

             {/* Slide 9: Próximos Passos */}
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

    

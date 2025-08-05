
import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Palette, Megaphone, Mic, Sparkles, Goal, Check } from 'lucide-react';
import type { ProposalFormValues } from './proposal-generator-v2';

export const packageOptions = {
    "marketing_vendas": { name: "Plano de Marketing - Vendas", price: 999, description: "Análise de perfil com otimização\nCriação de projeto para público alvo\nPlanejamento mensal\nMentoria\nCopywriting\nTráfego pago (Meta e Google)\n3 postagens semanais (1 arte e 2 vídeos)\nRelatório mensal\nArtes profissionais\nGestão completa e suporte via WhatsApp.", icon: Palette },
    "marketing_essencial": { name: "Plano de Marketing - Essencial", price: 1999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_performance": { name: "Plano de Marketing - Performance", price: 2500, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n20 postagens mensais\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\n2 reuniões de pauta\nGestão de LinkedIn\n1 diária de captação de vídeo externa\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nGerente de conta", icon: Palette },
    "marketing_premium": { name: "Plano de Marketing - Premium", price: 2999, description: "Análise de perfil com alterações para otimizar\nAnálise de concorrentes ou inspirações\nCriação de persona para direcionamento de conteúdo\nPlanejamento estratégico mensal\nDirecionamento para posicionamento de imagem nas gravações\nDirecionamento para stories\nTráfego pago (Meta e Google) sem limite de campanha\n3 postagens semanais (arte ou vídeos)\n1 Gravação de podcast de 1H mensal\nMentoria para cliente (Apresentação)\nArtes profissionais criadas no Photoshop e videos editados no premiere e after effects\nTécnicas de copywriting nas legendas\nNeste plano, fazemos a gestão da rede social: planejamento, criação, postagem e acompanhamento de resultados.\nEntrega de relatório mensal com análise de métricas\nCriação e configuração do Google meu negócio com SEO e palavras de reconhecimento\nCaptação de vídeo em nosso estúdio de gravação de vídeos com videomaker mobile\nCaptação de fotos comercias para criação de conteúdo\nGerente de conta", icon: Palette },
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
        {children}
        <div className="absolute bottom-12 left-12 w-48 h-12">
             <Image crossOrigin="anonymous" src="https://firebasestorage.googleapis.com/v0/b/briefing-cp-marketing-digital.appspot.com/o/proposta%2FLOGO%20HORIZONTAL.svg?alt=media&token=c1110008-89e4-4161-9f79-373c52e69b59" alt="CP Marketing Logo" layout="fill" objectFit="contain" />
        </div>
    </div>
));
Page.displayName = 'Page';

export const GeneratedProposal = (props: ProposalFormValues) => {
    const {
        clientName,
        packages,
        useCustomServices,
        customServices,
        investmentValue,
        partnershipDescription,
        objectiveItems,
        differentialItems,
        idealPlanItems,
    } = props;
    
    const renderCustomServices = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {Object.entries(customServices || {}).map(([key, serviceItems]) => {
              if (!serviceItems || serviceItems.length === 0) return null;
              const { name, icon: Icon } = {
                  socialMedia: { name: "Mídia Social", icon: Palette },
                  paidTraffic: { name: "Tráfego Pago", icon: Megaphone },
                  podcast: { name: "Podcast", icon: Mic },
                  branding: { name: "Branding", icon: Sparkles },
                  website: { name: "Website", icon: Sparkles },
                  landingPage: { name: "Landing Page", icon: Sparkles },
              }[key] || { name: key, icon: Sparkles};
              return (
                  <div key={key} className="bg-gray-900/70 p-8 rounded-lg border border-gray-700 flex flex-col">
                      <Icon className="h-10 w-10 text-[#FE5412] mb-4" />
                      <h3 className="font-bold text-2xl">{name}</h3>
                      <ul className="text-base text-gray-300 mt-4 list-disc pl-5 space-y-2 flex-grow">
                          {serviceItems.map((item, index) => <li key={index}>{item.value}</li>)}
                      </ul>
                  </div>
              );
          })}
      </div>
    );

    const renderPackageServices = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {packages?.map(pkgKey => {
                const pkg = packageOptions[pkgKey as keyof typeof packageOptions];
                if (!pkg) return null;
                const Icon = pkg.icon;
                return (
                    <div key={pkgKey} className="bg-gray-900/70 p-6 rounded-lg border border-gray-700 flex flex-col">
                        <div className="flex-grow">
                            <div className="flex items-center gap-4 mb-4">
                                <Icon className="h-10 w-10 text-[#FE5412]" />
                                <h3 className="font-bold text-2xl">{pkg.name}</h3>
                            </div>
                            <p className="text-sm text-gray-300 mt-2 whitespace-pre-line leading-relaxed">{pkg.description}</p>
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
    <div>
        <Page className="bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04421cd673?q=80&w=3870&auto=format&fit=crop')", backgroundPosition: 'center center' }}>
             <div className="absolute inset-0 bg-black/40 z-0"></div>
              <div className="z-10 text-center flex flex-col items-center">
                  <p className="text-[#FE5412] font-semibold tracking-widest mb-4 text-2xl">PROPOSTA COMERCIAL</p>
                  <h1 className="text-9xl font-extrabold max-w-5xl leading-tight">{clientName || '[Nome do Cliente]'}</h1>
                  <p className="text-3xl font-light text-gray-300 mt-6">Gestão Estratégica de Marketing Digital</p>
              </div>
        </Page>
        <Page className="items-start">
            <div className="w-full max-w-6xl">
                <h2 className="text-7xl font-bold uppercase mb-12 text-left">Sobre a Parceria</h2>
                <div className="flex items-start gap-8">
                    <div className="w-2 bg-[#FE5412] self-stretch"></div>
                    <p className="text-4xl font-light text-gray-200 text-left">{partnershipDescription || 'Nossa parceria visa transformar o potencial do seu negócio em performance de mercado, construindo uma presença digital sólida e gerando resultados concretos.'}</p>
                </div>
            </div>
        </Page>
        <Page>
            <div className="w-full max-w-6xl">
                <h2 className="text-7xl font-bold uppercase mb-12">Nossos Objetivos</h2>
                <ul className="space-y-6 text-3xl font-light">
                    {(objectiveItems && objectiveItems.length > 0) ? objectiveItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6"><Goal className="h-10 w-10 text-[#FE5412] flex-shrink-0" /><span>{item.value}</span></li>
                    )) : <li>Aumentar a autoridade da marca no setor.</li>}
                </ul>
            </div>
        </Page>
        <Page>
             <div className="w-full max-w-6xl">
                <h2 className="text-7xl font-bold uppercase mb-12">Nossos Diferenciais</h2>
                <ul className="space-y-6 text-3xl font-light columns-2 gap-x-16">
                    {(differentialItems && differentialItems.length > 0) ? differentialItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6 mb-6 break-inside-avoid"><Sparkles className="h-10 w-10 text-[#FE5412] flex-shrink-0" /><span>{item.value}</span></li>
                    )) : <li>Planejamento estratégico focado em resultados.</li>}
                </ul>
             </div>
        </Page>
        <Page className="p-16 items-start justify-start">
            <div className="w-full">
                <h2 className="text-7xl font-bold uppercase mb-12 text-center">Escopo dos Serviços</h2>
                {useCustomServices ? renderCustomServices() : renderPackageServices()}
            </div>
        </Page>
        <Page>
             <div className="w-full max-w-6xl text-center">
                <h2 className="text-7xl font-bold uppercase mb-12">Por que este plano é <span className="text-[#FE5412]">ideal</span>?</h2>
                 <ul className="space-y-6 text-3xl font-light text-left max-w-4xl mx-auto">
                    {(idealPlanItems && idealPlanItems.length > 0) ? idealPlanItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-6"><Check className="h-10 w-10 text-green-400 flex-shrink-0" /><span>{item.value}</span></li>
                    )): <li>Construção de uma marca forte e reconhecida.</li>}
                </ul>
             </div>
        </Page>
        <Page>
            <div className="w-full max-w-4xl text-center">
              <div className="border-8 border-[#FE5412] p-16 rounded-2xl">
                  <h2 className="text-6xl font-bold uppercase mb-4">Investimento Mensal</h2>
                  <p className="text-9xl font-extrabold text-[#FE5412] mb-6">{investmentValue || 'R$ 0,00'}</p>
                  <div className="max-w-xl mx-auto">
                    <p className="text-2xl font-semibold tracking-wider text-gray-300">INCLUI TODOS OS SERVIÇOS ESTRATÉGICOS ACIMA.</p>
                  </div>
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
};

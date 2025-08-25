

import type { GeneratePresentationOutput } from "@/ai/schemas/presentation-generator-schemas";

// Helper function to safely escape HTML content
const escapeHtml = (text: string | undefined): string => {
    if (typeof text !== 'string') return '';
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

// Helper function to highlight keywords in a sentence
const highlightKeywords = (text: string): string => {
    if (!text) return '';
    // Highlight text within <strong> tags with a specific style
    return text.replace(/<strong>(.*?)<\/strong>/g, '<strong class="highlight-phrase">$1</strong>');
}

interface CreateProposalData {
    presentationData: GeneratePresentationOutput;
}


export function createInteractiveProposal(data: CreateProposalData): string {
  const { presentationData } = data;

  const {
    clientName,
    proposalDate,
    proposalValidityDate,
    presentationTitle,
    diagnosticSlide,
    painSlide,
    futureSlide,
    inactionCostSlide,
    strategySlide,
    metricsSlide,
    investmentSlide,
    investmentValue,
    packages,
  } = presentationData;
  
  const extractNumber = (currencyString: string) => {
      if (!currencyString) return 0;
      // Handles formats like "140%" and "R$ 20.000,00"
      return parseFloat(currencyString.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;
  }
  
  const cenarioInerciaHtml = `<strong>${highlightKeywords(escapeHtml(inactionCostSlide.cenario_inercia))}</strong>`;


  const painQuestions = [
    "Qual o impacto disso na operação?",
    "E o custo emocional de tentativas que não deram certo?",
    "Até quando deixar a concorrência na frente?",
  ];
  
  const futureIcons = ["fa-calendar-check", "fa-lightbulb", "fa-star", "fa-smile"];
  const strategyIcons = ["fa-users", "fa-chart-line", "fa-star"];
  const metricsIcons = ["fa-arrow-trend-up", "fa-user-check", "fa-bullseye"];

  const slides = [
       {
          id: 'cp-intro',
          title: `<h2>Por que a CP Marketing?</h2>`,
          content: `<div class="intro-grid-container">
                      <div class="intro-text-block">
                          <h4><i class="fas fa-building"></i> Estrutura Física Completa</h4>
                          <p>Nossa sede não é apenas um escritório, mas um <strong class="highlight-text">centro de produção de resultados</strong> com ambiente propício para a criação e execução de estratégias de alto impacto.</p>
                          
                          <h4><i class="fas fa-video"></i> Estúdios Próprios</h4>
                          <p>Garantimos <strong class="highlight-text">agilidade e qualidade de cinema</strong> para seu conteúdo audiovisual, eliminando a dependência de terceiros e otimizando seu tempo.</p>
                           
                          <h4><i class="fas fa-users-cog"></i> Time Multidisciplinar</h4>
                          <p>Especialistas em estratégia, tráfego, design e conteúdo trabalham <strong class="highlight-text">lado a lado, em tempo real</strong>, no seu projeto, garantindo uma visão 360º.</p>
                          
                          <h4><i class="fas fa-drafting-compass"></i> Metodologia CP MÖDUS</h4>
                          <p>Desenvolvemos um sistema validado para transformar <strong class="highlight-text">potencial de negócio em performance de mercado</strong>, com processos claros e foco total em ROI.</p>
                      </div>
                       <div class="intro-image-gallery-block">
                          <img src="https://placehold.co/600x800.png" alt="Imagem da estrutura 1" data-ai-hint="modern office" class="main-image" />
                          <img src="https://placehold.co/400x400.png" alt="Imagem da estrutura 2" data-ai-hint="podcast studio" />
                          <img src="https://placehold.co/400x400.png" alt="Imagem da estrutura 3" data-ai-hint="team meeting" />
                      </div>
                    </div>`
      },
      {
          id: 'diagnosis',
          title: `<h2>${escapeHtml(diagnosticSlide.title)}</h2>`,
          content: `
            <div class="content-center-wrapper">
                <p class="question">${escapeHtml(diagnosticSlide.question)}</p>
                <div class="card-grid two-cols">
                    <div class="card">
                        <h3>Meta Principal</h3>
                        <p class="card-subtitle">Onde queremos chegar</p>
                        <span class="highlight animated-number" data-target="${extractNumber(diagnosticSlide.meta)}">R$ 0,00</span>
                    </div>
                    <div class="card">
                        <h3>Custo da Inação</h3>
                        <p class="card-subtitle">O valor que fica na mesa</p>
                        <span class="highlight loss animated-number" data-target="${extractNumber(diagnosticSlide.custo)}">R$ 0,00</span>
                    </div>
                </div>
                <div class="accordion-container">
                    <div class="accordion-item">
                        <button class="accordion-trigger">
                            <h4>Análise do Gargalo</h4>
                            <i class="fas fa-plus"></i>
                        </button>
                        <div class="accordion-content">
                            <p>${escapeHtml(diagnosticSlide.gargalo)}</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <button class="accordion-trigger">
                            <h4>Como Alcançaremos a Meta</h4>
                            <i class="fas fa-plus"></i>
                        </button>
                        <div class="accordion-content">
                           <p>${escapeHtml(diagnosticSlide.comoAlcancaremos)}</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <button class="accordion-trigger">
                            <h4>Por Que o Custo da Inação Existe</h4>
                             <i class="fas fa-plus"></i>
                        </button>
                        <div class="accordion-content">
                            <p>${escapeHtml(diagnosticSlide.porqueCustoExiste)}</p>
                        </div>
                    </div>
                </div>
            </div>`
      },
      {
          id: 'pain',
          title: `<h2>${escapeHtml(painSlide.title)}</h2>`,
          content: `
            <div class="content-center-wrapper">
                <p class="question">${escapeHtml(painSlide.question)}</p>
                <div class="impact-list">
                    ${painSlide.content.map((item, index) => `
                        <div class="impact-item">
                          <p class="question impact-question">${escapeHtml(painQuestions[index] || '')}</p>
                          <p class="impact-text">${highlightKeywords(escapeHtml(item))}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`
      },
      {
          id: 'inaction-cost',
          title: `<h2>${escapeHtml(inactionCostSlide.title)}</h2>`,
          content: `<div class="content-center-wrapper">
                      <div class="card-grid cost-grid">
                          <div class="card cost-card">
                              <h3>Custo em 6 Meses</h3>
                              <span class="highlight loss">${escapeHtml(inactionCostSlide.custo_6_meses)}</span>
                          </div>
                          <div class="card cost-card">
                              <h3>Custo em 1 Ano</h3>
                              <span class="highlight loss">${escapeHtml(inactionCostSlide.custo_1_ano)}</span>
                          </div>
                      </div>
                      <br>
                      <p class="question" style="text-align: center; max-width: 700px;">${cenarioInerciaHtml}</p>
                    </div>`
      },
       {
          id: 'future',
          title: `<h2>${escapeHtml(futureSlide.title)}</h2>`,
          content: `
            <div class="content-center-wrapper">
                <p class="question">${escapeHtml(futureSlide.question)}</p>
                <div class="card-grid">
                  ${futureSlide.content.map((item, index) => `
                        <div class="future-item card">
                            <i class="fas ${futureIcons[index % futureIcons.length]}"></i>
                            <h4>${escapeHtml(item.title)}</h4>
                            <p>${escapeHtml(item.description)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`
      },
      {
          id: 'strategy',
          title: `<h2>${escapeHtml(strategySlide.title)}</h2>`,
          content: `<div class="content-center-wrapper"><div class="card-grid">
              ${strategySlide.content.map((item, index) => `
                  <div class="card">
                      <i class="fas ${strategyIcons[index % strategyIcons.length]}"></i>
                      <h4>${escapeHtml(item.title)}</h4>
                      <p>${escapeHtml(item.description)}</p>
                  </div>
              `).join('')}
          </div></div>`
      },
       {
          id: 'social-proof',
          title: `<h2>Resultados que Falam por Si</h2>`,
          content: `<div class="content-center-wrapper"><p>Clientes que confiaram em nossa metodologia e alcançaram o sucesso.</p>
                      <div class="card-grid testimonial-grid">
                          <div class="card testimonial-card">
                            <p class="testimonial-text">"Estávamos invisíveis online. A CP não só nos colocou no mapa, como transformou nosso Instagram em uma máquina de agendamentos. A agenda nunca esteve tão cheia."</p>
                            <h4 class="testimonial-author">- Dr. Ricardo Alves, Clínica Dermato+</h4>
                            <span class="testimonial-metric">+250% em agendamentos qualificados</span>
                          </div>
                          <div class="card testimonial-card">
                            <p class="testimonial-text">"Nosso Custo por Lead era altíssimo e só atraíamos curiosos. A equipe de tráfego da CP otimizou tudo e hoje temos um fluxo constante de clientes com perfil de compra."</p>
                            <h4 class="testimonial-author">- Sofia Martins, Consultoria Financeira</h4>
                            <span class="testimonial-metric">-40% no Custo por Lead</span>
                          </div>
                          <div class="card testimonial-card">
                             <p class="testimonial-text">"Achava que marketing era só post bonito. Com a CP, entendi o que é estratégia. Hoje, cada real investido volta multiplicado. É outro nível de previsibilidade para o negócio."</p>
                             <h4 class="testimonial-author">- Bruno Lima, E-commerce de Moda</h4>
                             <span class="testimonial-metric">ROAS de 8.5 em 6 meses</span>
                          </div>
                           <div class="card testimonial-card">
                             <p class="testimonial-text">"Gravar o podcast foi um divisor de águas para a minha autoridade. O processo foi impecável e o resultado foi uma audiência engajada que confia no meu trabalho."</p>
                             <h4 class="testimonial-author">- Laura Mendes, Advogada Tributarista</h4>
                             <span class="testimonial-metric">+300% de alcance orgânico</span>
                          </div>
                          <div class="card testimonial-card">
                             <p class="testimonial-text">"Tínhamos um processo de vendas desorganizado e perdíamos clientes por falta de follow-up. A implementação do CRM pela CP mudou nosso jogo. Agora, nenhuma oportunidade é perdida."</p>
                             <h4 class="testimonial-author">- Fernando Costa, Imobiliária Prime</h4>
                             <span class="testimonial-metric">+35% na Taxa de Conversão</span>
                          </div>
                          <div class="card testimonial-card">
                             <p class="testimonial-text">"A produção audiovisual da CP elevou a percepção da nossa marca. Os vídeos institucionais e de produto transmitiram um profissionalismo que as fotos nunca conseguiram."</p>
                             <h4 class="testimonial-author">- Camila Rocha, Arquiteta</h4>
                             <span class="testimonial-metric">Contratos 50% maiores</span>
                          </div>
                      </div>
                    </div>`
      },
      {
          id: 'metrics',
          title: `<h2>${escapeHtml(metricsSlide.title)}</h2>`,
          content: `<div class="content-center-wrapper">
                      <p class="question">${escapeHtml(metricsSlide.subtitle)}</p>
                      <div class="card-grid metric-grid">
                          ${metricsSlide.metrics.map((metric, index) => `
                            <div class="metric-card card">
                                <i class="fas ${metricsIcons[index % metricsIcons.length]}"></i>
                                <h4>${escapeHtml(metric.title)}</h4>
                                <span class="highlight gain animated-counter" data-target="${extractNumber(metric.value)}" data-suffix="${metric.value.includes('%') ? '%' : ''}">${metric.value.includes('%') ? '0%' : '0'}</span>
                                <p class="metric-description">${highlightKeywords(escapeHtml(metric.description))}</p>
                            </div>
                          `).join('')}
                      </div>
                      <div class="explanation-text">
                        <p>${escapeHtml(metricsSlide.comoAlcancaremos)}</p>
                      </div>
                    </div>`
      },
      {
          id: 'investment',
          title: `<h2>${escapeHtml(investmentSlide.title)}</h2>`,
          content: `
            <div class="content-center-wrapper">
              <div class="investment-layout">
                  <div class="packages-list">
                      <h4>Pacotes Selecionados:</h4>
                      <ul>
                          ${packages.map(pkg => `<li><strong>${escapeHtml(pkg.name)}</strong>: ${pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>`).join('')}
                      </ul>
                  </div>
                  <div class="total-investment">
                      <h4>Investimento Total Mensal</h4>
                      <span class="final-price">${escapeHtml(investmentValue)}</span>
                  </div>
              </div>
              <br>
              <p class="question">${escapeHtml(investmentSlide.ancoragemPreco)}</p>
              <div class="card special-offers" style="margin-top: 20px; text-align: left;">
                <p><strong><i class="fas fa-exclamation-circle"></i> ${escapeHtml(investmentSlide.gatilhoEscassez)}</strong></p>
                <p><strong><i class="fas fa-gift"></i> Bônus de Ação Rápida:</strong> ${escapeHtml(investmentSlide.gatilhoBonus)}</p>
              </div>
              <br>
              <p class="question">${escapeHtml(investmentSlide.ganchoDecisao)}</p>
            </div>`
      }
  ];

  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta para ${escapeHtml(clientName)}</title>
    
    <!-- Fontes e Ícones -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --primary-color: #ffffff;
            --secondary-color: #a7a7a7;
            --background-color: #000000;
            --accent-color: #FE5400;
            --highlight-color: #360FC5;
            --card-background: rgba(17, 17, 17, 0.85);
            --border-color: #222222;
            --loss-color: #ef4444;
            --gain-color: #22c55e;
        }

        body { 
            position: relative; 
            margin: 0; 
            overflow: hidden; 
            background-color: var(--background-color); 
            color: var(--primary-color); 
            font-family: 'Montserrat', sans-serif; 
        }

        #webgl-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .ui-layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }
        .ui-layer > * {
            pointer-events: auto;
        }

        .intro-container { 
            text-align: center;
            padding: 20px;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        }
        .intro-container.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .proposal-container-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            opacity: 0; 
            pointer-events: none; 
            transition: opacity 0.5s ease-in-out;
        }
        .proposal-container-wrapper.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .sky-container {
            width: 100%;
            max-width: 1600px;
            height: 90vh;
            padding: 40px;
            background-color: var(--card-background);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border: 1px solid var(--border-color);
            position: relative;
        }
        
        .sky-container-content {
            width: 100%;
            flex-grow: 1;
            transition: opacity 0.4s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow-y: auto;
            min-height: 0;
        }
        
        .content-center-wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 1rem 0;
        }

        .close-button { 
            position: absolute;
            top: 20px; 
            right: 20px;
            width: 40px; 
            height: 40px; 
            cursor: pointer; 
            z-index: 12;
        }
        .close-button .left, .close-button .right { width: 2px; height: 25px; background: white; position: absolute; top: 7.5px; left: 19px; border-radius: 3px; transition: 0.3s ease-out; }
        .close-button .right { transform: rotate(-45deg); }
        .close-button .left { transform: rotate(45deg); }
        .close-button:hover .right, .close-button:hover .left { transform: rotate(0deg); }

        h1, h2, h3 { font-weight: 900; margin-bottom: 20px; text-align: center; }
        h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); text-transform: uppercase; line-height: 1.3; color: var(--accent-color); }
        h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); margin: 0; padding-bottom: 20px; text-shadow: 0 0 10px rgba(0,0,0,0.5); }
        h3 { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--primary-color); text-transform: uppercase; letter-spacing: 2px; }
        p { font-size: clamp(0.9rem, 1.2vw, 1.1rem); line-height: 1.6; color: var(--secondary-color); max-width: 800px; text-align: center; margin-left: auto; margin-right: auto;}
        
        .intro-container .fancy-text { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--secondary-color); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
        .proposal-meta { margin-top: 20px; font-size: 0.9rem; color: var(--secondary-color); }

        .button { position: relative; cursor: pointer; display: inline-block; text-transform: uppercase; min-width: 250px; margin-top: 30px; color: white; font-weight: 700; text-align: center; }
        .button .border { border: 2px solid var(--accent-color); transform: skewX(-20deg); height: 50px; border-radius: 5px; overflow: hidden; position: relative; transition: 0.2s ease-out; }
        .button .text { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); transition: 0.2s ease-out; font-size: 1.1rem; }
        .button .left-plane, .button .right-plane { position: absolute; background: var(--accent-color); height: 100%; width: 51%; transition: 0.2s ease-out; }
        .button .left-plane { left: 0; transform: translateX(-101%); }
        .button .right-plane { right: 0; transform: translateX(101%); }
        .button:hover .border { box-shadow: 0px 0px 15px 0px var(--accent-color); }
        .button:hover .left-plane, .button:hover .right-plane { transform: translateX(0%); }
        .button:hover .text { color: var(--background-color); }
        
        .nav-arrows { 
            width: 100%;
            padding-top: 20px;
            margin-top: auto; /* Push to bottom */
            border-top: 1px solid var(--border-color);
            text-align: center;
            flex-shrink: 0; /* Prevent shrinking */
        }
        
        .nav-button { 
            background: none; 
            border: 1px solid var(--accent-color); 
            color: var(--accent-color); 
            padding: 10px 20px; 
            margin: 0 10px; 
            cursor: pointer; 
            font-family: 'Montserrat', sans-serif; 
            text-transform: uppercase; 
            font-weight: 700; 
            border-radius: 50px; 
            transition: all 0.3s ease; 
        }
        .nav-button:not(:disabled):hover { 
            transform: scale(1.05);
            box-shadow: 0 0 10px var(--accent-color);
        }
        .nav-button:disabled { 
            border-color: var(--border-color);
            color: var(--border-color);
            opacity: 0.5;
            cursor: not-allowed; 
        }

        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%; margin-top: 30px; max-width: 1200px; }
        .card-grid.two-cols { grid-template-columns: 1fr 1fr; }
        .card { background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center;}
        .card i { font-size: 2rem; color: var(--accent-color); margin-bottom: 15px; }
        .card h4 { font-size: 1.1rem; margin-bottom: 10px; text-align: center; }
        .card p {font-size: 0.9rem; text-align: center;}
        .card p.card-subtitle { font-size: 0.9rem; color: var(--secondary-color); margin-top: -15px; margin-bottom: 10px; height: 30px; }
        .highlight { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; display: block; margin: 10px 0; }
        .highlight.loss { color: var(--loss-color); }
        .highlight.gain { color: var(--gain-color); }
        
        .highlight-phrase, .highlight-text {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        p.question {
            font-weight: 600;
            font-size: 1.1rem;
            color: var(--primary-color);
            border-left: 3px solid var(--accent-color);
            padding-left: 1rem;
            text-align: left;
            margin: 1rem auto;
            max-width: 900px;
        }
        .impact-item p.impact-question {
            color: var(--primary-color);
            border-left: none;
            padding-left: 0;
            font-size: 1.2rem;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .impact-item p.impact-text strong {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .intro-grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            width: 100%;
            max-width: 1200px;
            align-items: flex-start;
        }
        
        .intro-text-block h4 {
            font-size: 1.3rem;
            color: var(--primary-color);
            margin-top: 15px;
            margin-bottom: 8px;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .intro-text-block h4 i {
            color: var(--accent-color);
            font-size: 1.2em;
        }
        .intro-text-block p {
            font-size: 1.1rem;
            color: var(--secondary-color);
            text-align: left;
            margin: 0 0 20px 0;
            padding-left: 35px;
        }

        .intro-image-gallery-block {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
            gap: 15px;
            height: 100%;
        }
        .intro-image-gallery-block img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease;
        }
        .intro-image-gallery-block img:hover {
            transform: scale(1.03);
        }
        .intro-image-gallery-block .main-image {
            grid-column: 1 / -1;
        }

        .video-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }
        .video-modal-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .video-modal-content {
            position: relative;
            width: 90%;
            height: 90%;
            max-width: 1600px;
            max-height: 900px;
        }
        .video-modal-content video {
            width: 100%;
            height: 100%;
        }
        .close-video-modal-button {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
        }
        
        .floating-video-button {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 10;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .floating-video-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px var(--accent-color);
        }
        
        @media (max-width: 900px) {
            .intro-grid-container {
                grid-template-columns: 1fr;
            }
        }
        
        .impact-list { width: 100%; max-width: 900px; margin-top: 30px; }
        .impact-item { background-color: #1a1a1a; border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; margin-bottom: 15px; opacity: 0; transform: translateY(20px); text-align: left; }
        .slide-active .impact-item.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        
        .future-item { opacity: 0; transform: translateY(20px); }
        .slide-active .future-item.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        
        .investment-layout { display: flex; flex-direction: row; align-items: stretch; gap: 30px; width: 100%; margin-top: 20px; }
        .packages-list { flex: 2; background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); }
        .total-investment { flex: 1; background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); }
        .packages-list h4, .total-investment h4 { font-size: 1.1rem; text-align: left; margin-bottom: 15px; }
        .packages-list ul { list-style: none; padding: 0; text-align: left; font-size: 0.9rem; }
        .packages-list li { padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .packages-list li:last-child { border-bottom: none; }
        .total-investment { text-align: center; }
        .final-price { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: var(--accent-color); }
        .special-offers p { font-size: 0.9rem; text-align: left; }
        .special-offers i { color: var(--accent-color); margin-right: 10px; }

        /* Accordion Styles */
        .accordion-container { width: 100%; max-width: 900px; margin-top: 20px; }
        .accordion-item { border-bottom: 1px solid var(--border-color); }
        .accordion-item:last-child { border-bottom: none; }
        .accordion-trigger { background: none; border: none; width: 100%; text-align: left; padding: 15px 5px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .accordion-trigger h4 { font-size: 1.1rem; color: var(--primary-color); margin: 0; text-align: left; }
        .accordion-trigger i { color: var(--accent-color); transition: transform 0.3s ease; }
        .accordion-item.active .accordion-trigger i { transform: rotate(45deg); }
        .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out; }
        .accordion-content p { background-color: rgba(254, 73, 0, 0.1); padding: 20px; border-left: 3px solid var(--accent-color); margin: 0 5px 15px; border-radius: 5px; text-align: left; font-size: 1rem; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card.cost-card { opacity: 0; transform: translateY(20px); }
        .slide-active .cost-card.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .cost-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        
        .testimonial-grid { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
        .testimonial-card { text-align: left; background: #1a1a1a; padding: 20px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; opacity: 0; transform: translateY(20px);}
        .slide-active .testimonial-card.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .testimonial-text { font-style: italic; color: var(--secondary-color); border-left: 3px solid var(--accent-color); padding-left: 15px; margin-bottom: 20px; flex-grow: 1; text-align: left; }
        .testimonial-author { font-weight: bold; color: var(--primary-color); text-align: left; margin-bottom: 5px; }
        .testimonial-metric { font-weight: 700; color: var(--gain-color); text-align: left; font-size: 1.1rem; }

        .metric-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); max-width: 1200px; }
        .metric-card { opacity: 0; transform: translateY(20px); align-items: flex-start; text-align: left; padding: 20px; }
        .slide-active .metric-card.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .metric-card h4 { text-align: left; }
        .metric-card .highlight { text-align: left; font-size: clamp(2.5rem, 4vw, 3.5rem); margin: 0 0 15px 0;}
        .metric-card .metric-description { text-align: left; font-size: 0.9rem; color: var(--secondary-color); margin: 0; line-height: 1.5; }
        
        .explanation-text {
            margin-top: 30px;
            max-width: 800px;
            font-style: italic;
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-left: 3px solid var(--accent-color);
            border-radius: 5px;
        }
        .explanation-text p {
            font-size: 1rem;
            line-height: 1.7;
            text-align: center;
            color: var(--secondary-color);
        }

        @media (max-width: 1024px) {
             .investment-layout { flex-direction: column; }
        }

    </style>
</head>
<body>
    <!-- Fundo 3D -->
    <div id="webgl-container"></div>
    
    <!-- Modal de Vídeo -->
    <div id="video-modal" class="video-modal-overlay">
        <div class="video-modal-content">
            <button id="close-video-modal" class="close-video-modal-button">&times;</button>
            <video id="modal-video-player" src="https://banco.linkscp.com.br/wp-content/uploads/2025/08/video-tour-horizontal-2.mp4" controls></video>
        </div>
    </div>

    <!-- Camada da Interface -->
    <div class="ui-layer">
        <!-- Capa Inicial -->
        <div class="intro-container">
            <img src="https://res.cloudinary.com/dp3gukavt/image/upload/v1755524633/Prancheta_6_ajhh0n.png" alt="Logo da CP Marketing" style="max-height: 120px; margin-bottom: 30px;">
            <h3 class="fancy-text">Plano de Crescimento para</h3>
            <h1>${escapeHtml(clientName)}</h1>
            <div class="proposal-meta">
                <p>Data: ${escapeHtml(proposalDate)} | Validade: ${escapeHtml(proposalValidityDate)}</p>
            </div>
            <div class="button shift-camera-button">
                <div class="border">
                    <div class="left-plane"></div><div class="right-plane"></div>
                </div>
                <div class="text">Iniciar Apresentação</div>
            </div>
        </div>

        <!-- Wrapper da Proposta -->
        <div class="proposal-container-wrapper">
            <div class="sky-container">
                <div class="sky-container-content">
                    <!-- Conteúdo dos slides será injetado aqui -->
                </div>
                 <button id="open-video-button" class="floating-video-button">
                    <i class="fas fa-play"></i> Assista nosso tour
                 </button>
                <div class="nav-arrows">
                    <button id="prev-button" class="nav-button">Voltar</button>
                    <button id="next-button" class="nav-button">Avançar</button>
                </div>
            </div>
            <div class="close-button">
                <div class="left"></div>
                <div class="right"></div>
            </div>
        </div>
    </div>

    <!-- Bibliotecas JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/108/three.min.js"></script>

    <!-- Script Principal -->
    <script>
        "use strict";
        let camera, scene, renderer, plane, stars;
        
        const slides = ${JSON.stringify(slides)};
        let currentSlide = -1;

        const cameraPath = [
            { y: 120, z: 20 }, // Posição 0
            { y: 110, z: 25 }, // Posição 1
            { y: 100, z: 30 }, // Posição 2
            { y: 90, z: 35 },  // Posição 3
            { y: 80, z: 40 },  // Posição 4
            { y: 60, z: 50 },  // Posição 5
            { y: 50, z: 55 },  // Posição 6
            { y: 40, z: 60 },   // Posição 7
            { y: 30, z: 65 }    // Posição 8
        ];
        
        function animateCounter(element) {
            const target = parseInt(element.dataset.target, 10);
            const suffix = element.dataset.suffix || '';
            const duration = 1500; // 1.5 seconds
            const frameRate = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;
            
            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentNumber = Math.round(target * progress);
                
                element.textContent = currentNumber + suffix;
                
                if (frame === totalFrames) {
                    clearInterval(counter);
                    element.textContent = target + suffix;
                }
            }, frameRate);
        }

        function animateNumber(element) {
            const target = parseInt(element.dataset.target, 10);
            const duration = 1500; // 1.5 seconds
            const frameRate = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;
            
            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentNumber = Math.round(target * progress);
                
                element.textContent = currentNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                if (frame === totalFrames) {
                    clearInterval(counter);
                    element.textContent = target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
            }, frameRate);
        }

        function setupAccordion() {
            const accordionItems = document.querySelectorAll('.accordion-item');
            accordionItems.forEach(item => {
                const trigger = item.querySelector('.accordion-trigger');
                const content = item.querySelector('.accordion-content');
                
                trigger.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
                        }
                    });

                    if (isActive) {
                        item.classList.remove('active');
                        content.style.maxHeight = '0px';
                    } else {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });
        }

        function setupVideoModal() {
            const videoButton = document.getElementById('open-video-button');
            const videoModal = document.getElementById('video-modal');
            const modalVideoPlayer = document.getElementById('modal-video-player');
            const closeVideoModal = document.getElementById('close-video-modal');

            const closeModal = () => {
                videoModal.classList.remove('visible');
                modalVideoPlayer.pause();
                modalVideoPlayer.currentTime = 0;
            };

            if(videoButton) {
                videoButton.addEventListener('click', () => {
                    videoModal.classList.add('visible');
                    modalVideoPlayer.play();
                });
            }
            
            if(closeVideoModal) closeVideoModal.addEventListener('click', closeModal);
            if(videoModal) videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) closeModal();
            });
        }

        function updateSlideContent() {
            const container = document.querySelector('.sky-container-content');
            
            TweenLite.to(container, 0.3, { opacity: 0, ease: Power2.easeOut, onComplete: () => {
                const firstChild = container.firstChild;
                 if (firstChild && firstChild.classList) {
                    firstChild.classList.remove('slide-active');
                }

                if (currentSlide < 0 || currentSlide >= slides.length) {
                    container.innerHTML = '';
                    return;
                }

                const slide = slides[currentSlide];
                const slideWrapper = document.createElement('div');
                slideWrapper.classList.add('slide-content-wrapper');
                slideWrapper.setAttribute('data-slide-id', slide.id);
                slideWrapper.innerHTML = slide.title + slide.content;
                container.innerHTML = '';
                container.appendChild(slideWrapper);
                
                document.getElementById('prev-button').disabled = currentSlide === 0;
                document.getElementById('next-button').disabled = currentSlide === slides.length - 1;
                
                requestAnimationFrame(() => {
                    slideWrapper.classList.add('slide-active');
                    
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Animate currency numbers
                                const animatedNumbers = entry.target.querySelectorAll('.animated-number');
                                animatedNumbers.forEach(el => animateNumber(el));
                                
                                // Animate counters for metrics
                                const animatedCounters = entry.target.querySelectorAll('.animated-counter');
                                animatedCounters.forEach(el => animateCounter(el));

                                // Animate items sequentially
                                const animatedItems = entry.target.querySelectorAll('.cost-card, .impact-item, .future-item, .metric-card, .testimonial-card');
                                if (animatedItems.length > 0) {
                                    animatedItems.forEach((item, index) => {
                                       setTimeout(() => {
                                            item.style.animationDelay = (index * 0.2) + 's';
                                            item.classList.add('animate-in');
                                        }, 0);
                                    });
                                }
                                
                                if (entry.target.dataset.slideId === 'diagnosis') {
                                    setupAccordion();
                                }
                                
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(slideWrapper);
                });

                TweenLite.to(container, 0.5, { opacity: 1, ease: Power2.easeIn });
            }});
        }

        function createStars() {
            let starGeometry = new THREE.Geometry();
            for(let i=0; i<10000; i++) {
                let star = new THREE.Vector3();
                star.x = THREE.Math.randFloatSpread(2000);
                star.y = THREE.Math.randFloatSpread(2000);
                star.z = THREE.Math.randFloatSpread(2000);
                starGeometry.vertices.push(star);
            }
            let starMaterial = new THREE.PointsMaterial({
                color: 0xaaaaaa,
                size: 0.7
            });
            stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);
        }

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            camera.position.z = 50;
            renderer.setClearColor(0x000000, 0); // Fundo transparente
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('webgl-container').appendChild(renderer.domElement);

            let topLight = new THREE.DirectionalLight(0xffffff, 1);
            topLight.position.set(0, 1, 1).normalize();
            scene.add(topLight);

            let geometry = new THREE.PlaneGeometry(400, 400, 70, 70);
            let material = new THREE.MeshPhongMaterial({ color: 0x111111, flatShading: true, side: THREE.DoubleSide });
            
            geometry.vertices.forEach(function (vertice) {
                vertice.x += (Math.random() - 0.5) * 4;
                vertice.y += (Math.random() - 0.5) * 4;
                vertice.z += (Math.random() - 0.5) * 4;
                vertice.dx = Math.random() - 0.5;
                vertice.dy = Math.random() - 0.5;
                vertice.randomDelay = Math.random() * 5;
            });
            
            plane = new THREE.Mesh(geometry, material);
            scene.add(plane);

            createStars();
            render();
        }

        let timer = 0;
        function render() {
            requestAnimationFrame(render);
            timer += 0.01;
            if (plane && plane.geometry) {
              let vertices = plane.geometry.vertices;
              for (let i = 0; i < vertices.length; i++) {
                  vertices[i].x -= (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dx;
                  vertices[i].y += (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dy;
              }
              plane.geometry.verticesNeedUpdate = true;
            }
            if (stars) {
                stars.rotation.y += 0.0001;
            }
            renderer.render(scene, camera);
        }

        function navigateToScene(index) {
            const targetPosition = cameraPath[index];
            TweenLite.to(camera.position, 1.5, {
                y: targetPosition.y,
                z: targetPosition.z,
                ease: Power3.easeInOut
            });
            updateSlideContent();
        }

        window.onload = function() {
            init();
            setupVideoModal();

            const introContainer = document.querySelector('.intro-container');
            const proposalWrapper = document.querySelector('.proposal-container-wrapper');
            const closeButton = document.querySelector('.close-button');
            
            document.querySelector('.shift-camera-button').addEventListener('click', function() {
                let introTimeline = new TimelineMax();
                introTimeline.add([
                    TweenLite.to(introContainer, 0.5, { opacity: 0, ease: Power3.easeIn, onComplete: () => { introContainer.style.pointerEvents = 'none'; } }),
                    TweenLite.to(camera.rotation, 3, { x: Math.PI / 2, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { y: cameraPath[0].y, z: cameraPath[0].z, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 2, ease: Power3.easeInOut }),
                ]);
                introTimeline.add([
                    TweenLite.to(proposalWrapper, 1, { opacity: 1, ease: Power3.easeInOut, onStart: () => {
                         proposalWrapper.style.pointerEvents = 'auto';
                         currentSlide = 0;
                         updateSlideContent();
                    } }),
                ]);
            });

            closeButton.addEventListener('click', function() {
                let outroTimeline = new TimelineMax();
                outroTimeline.add([
                    TweenLite.to(proposalWrapper, 0.5, { opacity: 0, ease: Power3.easeInOut, onComplete: () => {
                        proposalWrapper.style.pointerEvents = 'none';
                        currentSlide = -1;
                        updateSlideContent();
                    }}),
                    TweenLite.to(camera.rotation, 3, { x: 0, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { z: 50, y: 0, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 1, ease: Power3.easeInOut }),
                ]);
                outroTimeline.add([
                    TweenLite.to(introContainer, 0.5, { opacity: 1, ease: Power3.easeIn, delay: 1, onComplete: () => { introContainer.style.pointerEvents = 'auto'; } }),
                ]);
            });

            document.getElementById('next-button').addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    navigateToScene(currentSlide);
                }
            });

            document.getElementById('prev-button').addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    navigateToScene(currentSlide);
                }
            });

            window.addEventListener("resize", function () {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        };
    </script>
</body>
</html>`;
}

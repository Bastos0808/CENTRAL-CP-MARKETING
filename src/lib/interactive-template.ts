
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
    const keywords = ['frustração', 'risco', 'concorrência', 'estagnado', 'perda', 'dificuldades', 'impacto operacional', 'falharam'];
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    return text.replace(regex, '<strong style="color: var(--accent-color); font-weight: bold;">$1</strong>');
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
      return parseFloat(currencyString.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;
  }
  
  const cenarioInerciaHtml = `<strong>${highlightKeywords(escapeHtml(inactionCostSlide.cenario_inercia))}</strong>`;


  const painQuestions = [
    "Qual o impacto disso na operação?",
    "E o custo emocional de tentativas que não deram certo?",
    "Até quando deixar a concorrência na frente?",
  ];
  
  const futureIcons = ["fa-calendar-check", "fa-lightbulb", "fa-star", "fa-smile"];

  const slides = [
       {
          id: 'cp-intro',
          title: `<h2>Por que a CP Marketing?</h2>`,
          content: `<div class="presentation-gallery-layout">
                      <div class="main-content-intro">
                          <div class="video-container">
                              <video src="https://banco.linkscp.com.br/wp-content/uploads/2025/08/video-tour-horizontal-2.mp4" autoplay loop muted playsinline></video>
                          </div>
                           <div class="features-list">
                              <div class="feature-item">
                                <i class="fas fa-building"></i>
                                <div>
                                    <h4>Estrutura Física Completa</h4>
                                    <p>Nossa sede não é apenas um escritório, mas um centro de produção de resultados. Com estrutura física robusta, garantimos um ambiente propício para a criação e execução de estratégias de alto impacto para sua marca.</p>
                                </div>
                              </div>
                              <div class="feature-item">
                                <i class="fas fa-video"></i>
                                <div>
                                    <h4>Estúdios Próprios</h4>
                                    <p>Garantimos agilidade e qualidade de cinema para seu conteúdo audiovisual. Com estúdios próprios, eliminamos a dependência de terceiros e temos controle total sobre a produção, do roteiro à finalização.</p>
                                </div>
                              </div>
                               <div class="feature-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <h4>Time Presencial e Multidisciplinar</h4>
                                    <p>Especialistas em estratégia, tráfego, design e conteúdo trabalham lado a lado, em tempo real, no seu projeto. A colaboração presencial garante sinergia e agilidade na tomada de decisões.</p>
                                </div>
                              </div>
                              <div class="feature-item">
                                <i class="fas fa-lightbulb"></i>
                                <div>
                                    <h4>Metodologia CP MÖDUS</h4>
                                    <p>Desenvolvemos um sistema validado para transformar potencial de negócio em performance de mercado. O CP MÖDUS é nossa bússola, guiando cada passo do projeto com foco em resultados mensuráveis.</p>
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="side-content-intro">
                           <div class="image-gallery">
                               <div class="image-placeholder" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755524572/PODCAST_01_kglzeu.png')"></div>
                               <div class="image-placeholder" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755799843/Prancheta_30_wj7xqg.png')"></div>
                          </div>
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
          content: `<div class="content-center-wrapper"><div class="card-grid"><div class="card"><i class="fas fa-users"></i> <h4>Aquisição</h4> <p>${escapeHtml(strategySlide.content[0])}</p> </div><div class="card"><i class="fas fa-chart-line"></i> <h4>Conversão</h4> <p>${escapeHtml(strategySlide.content[1])}</p> </div><div class="card"><i class="fas fa-star"></i> <h4>Autoridade</h4> <p>${escapeHtml(strategySlide.content[2])}</p> </div></div></div>`
      },
       {
          id: 'social-proof',
          title: `<h2>Resultados que Falam por Si</h2>`,
          content: `<div class="content-center-wrapper"><p>Clientes que confiaram em nossa metodologia e alcançaram o sucesso.</p>
                      <div class="card-grid">
                          <div class="card proof-card"><div class="image-placeholder" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755524564/Case_2_j99jwd.png')"></div><h4>Case 1: Clínica Estética</h4><p>+250% em agendamentos qualificados.</p></div>
                          <div class="card proof-card"><div class="image-placeholder" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755524565/Case_3_xypeop.png')"></div><h4>Case 2: E-commerce de Moda</h4><p>+80% no faturamento online.</p></div>
                          <div class="card proof-card"><div class="image-placeholder" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755524562/Case_1_q1yqcv.png')"></div><h4>Case 3: Consultoria B2B</h4><p>-40% no Custo por Lead (CPL).</p></div>
                      </div>
                    </div>`
      },
      {
          id: 'metrics',
          title: `<h2>${escapeHtml(metricsSlide.title)}</h2>`,
          content: `<div class="content-center-wrapper">
                      <p>O sucesso será medido com dados claros. Nossas metas mensais:</p>
                      <div class="metrics-grid">
                          <div class="metric-item">
                              <div class="metric-label">
                                  <h4>Crescimento Percentual</h4>
                                  <span>Meta: ${escapeHtml(metricsSlide.crescimentoPercentual)}</span>
                              </div>
                              <div class="animated-bar-container horizontal"><div class="animated-bar gain-bar"></div></div>
                          </div>
                          <div class="metric-item">
                              <div class="metric-label">
                                  <h4>Leads Qualificados</h4>
                                  <span>Meta: ${escapeHtml(metricsSlide.metaLeadsQualificados)}</span>
                              </div>
                              <div class="animated-bar-container horizontal"><div class="animated-bar gain-bar"></div></div>
                          </div>
                           <div class="metric-item">
                              <div class="metric-label">
                                  <h4>Taxa de Conversão</h4>
                                  <span>Meta: ${escapeHtml(metricsSlide.metaTaxaConversao)}</span>
                              </div>
                              <div class="animated-bar-container horizontal"><div class="animated-bar gain-bar"></div></div>
                          </div>
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
            --accent-color: #FE4900;
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
            justify-content: space-between;
            align-items: center;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            position: relative;
        }
        
        .sky-container::-webkit-scrollbar {
            width: 0;
            background: transparent;
        }
        
        .sky-container-content {
            width: 100%;
            flex-grow: 1;
            transition: opacity 0.4s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: center;
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
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            text-align: center;
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
        .card { background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;}
        .card i { font-size: 2rem; color: var(--accent-color); margin-bottom: 15px; }
        .card h4 { font-size: 1.1rem; margin-bottom: 10px; text-align: center; }
        .card p {font-size: 0.9rem; text-align: center;}
        .card p.card-subtitle { font-size: 0.9rem; color: var(--secondary-color); margin-top: -15px; margin-bottom: 10px; height: 30px; }
        .highlight { color: var(--highlight-color); font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; display: block; margin: 10px 0; }
        .highlight.loss { color: var(--loss-color); }
        .highlight-text { font-size: 1.3rem; font-weight: 700; color: var(--primary-color); }
        
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

        .impact-item p.impact-text {
            color: var(--primary-color);
        }
        
        .impact-item p.impact-text strong {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .presentation-gallery-layout { display: flex; gap: 20px; align-items: flex-start; width: 100%; flex-wrap: wrap; }
        .main-content-intro { flex: 2; display: flex; flex-direction: column; gap: 20px; min-width: 300px; }
        .side-content-intro { flex: 1; min-width: 300px; }
        .video-container { 
            width: 100%; 
            max-height: 250px; 
            border-radius: 10px; 
            overflow: hidden; 
            background-color: #000; 
        }
        .video-container video { 
            width: 100%; 
            height: 100%; 
            object-fit: contain; 
        }
        
        .features-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; flex-grow: 1; }
        .feature-item { display: flex; align-items: flex-start; text-align: left; }
        .feature-item i { font-size: 1.2rem; color: var(--accent-color); margin-right: 15px; margin-top: 5px; }
        .feature-item h4 { margin: 0 0 5px 0; font-size: 1rem; text-align: left; color: var(--primary-color); }
        .feature-item p { font-size: 0.8rem; text-align: left; margin: 0; }

        .image-gallery { display: flex; flex-direction: column; gap: 15px; width: 100%; height: 100%; }
        .image-placeholder { flex: 1; width: 100%; min-height: 200px; background-color: var(--border-color); border-radius: 10px; background-size: cover; background-position: center; }
        
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


        /* Animated Graphs */
        @keyframes grow-bar-vertical { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes grow-bar-horizontal { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .animated-bar-container { background-color: var(--border-color); border-radius: 5px; overflow: hidden; }
        .animated-bar { height: 100%; width: 100%; transform-origin: bottom; }
        .slide-active .animated-bar { animation: grow-bar-vertical 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .card.cost-card { opacity: 0; transform: translateY(20px); }
        .slide-active .cost-card.animate-in { animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .cost-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .loss-bar { background-color: var(--loss-color); }
        .gain-bar { background-color: var(--gain-color); }
        .animated-bar-container.horizontal { width: 100%; height: 25px; }
        .animated-bar.horizontal { transform-origin: left; }
        .slide-active .animated-bar.horizontal { animation-name: grow-bar-horizontal; }
        
        .metrics-grid { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; width: 100%; max-width: 900px; }
        .metric-item { background-color: #1a1a1a; padding: 20px; border-radius: 10px; border: 1px solid var(--border-color); }
        .metric-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .metric-label h4 { font-size: 1.1rem; margin: 0; text-align: left; }
        .metric-label span { font-size: 0.8rem; color: var(--secondary-color); }
        
        .card.proof-card .image-placeholder { height: 150px; width: 100%; margin-bottom: 15px; }

        @media (max-width: 1024px) {
            .presentation-gallery-layout, .investment-layout { flex-direction: column; }
        }

    </style>
</head>
<body>
    <!-- Fundo 3D -->
    <div id="webgl-container"></div>
    
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
            { y: 70, z: 45 },  // Posição 5
            { y: 60, z: 50 },  // Posição 6
            { y: 50, z: 55 },  // Posição 7
            { y: 40, z: 60 },   // Posição 8
            { y: 30, z: 65 }    // Posição 9
        ];
        
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
                    
                    // Close all other items
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
                        }
                    });

                    // Toggle current item
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
                
                // Add active class to trigger animations
                requestAnimationFrame(() => {
                    slideWrapper.classList.add('slide-active');
                    
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Animate numbers
                                const animatedNumbers = entry.target.querySelectorAll('.animated-number');
                                animatedNumbers.forEach(el => animateNumber(el));
                                
                                // Animate cost cards sequentially
                                const costCards = entry.target.querySelectorAll('.cost-card');
                                costCards.forEach((card, index) => {
                                    setTimeout(() => {
                                        card.style.animationDelay = (index * 0.3) + 's';
                                        card.classList.add('animate-in');
                                    }, 0);
                                });

                                // Animate impact items sequentially
                                const animatedItems = entry.target.querySelectorAll('.impact-item, .future-item');
                                if (animatedItems.length > 0) {
                                    animatedItems.forEach((item, index) => {
                                       setTimeout(() => {
                                            item.style.animationDelay = (index * 0.2) + 's';
                                            item.classList.add('animate-in');
                                        }, 0);
                                    });
                                }
                                
                                // Set up accordion for diagnosis slide
                                if (entry.target.dataset.slideId === 'diagnosis') {
                                    setupAccordion();
                                }
                                
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 }); // Trigger a bit earlier
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

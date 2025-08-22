
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

interface CreateProposalData {
    presentationData: GeneratePresentationOutput;
}


export function createInteractiveProposal(data: CreateProposalData): string {
  const { presentationData } = data;

  const {
    clientName,
    proposalDate,
    proposalValidityDate,
    diagnosticSlide,
    painSlide,
    futureSlide,
    inactionCostSlide,
    strategySlide,
    metricsSlide,
    investmentSlide,
  } = presentationData;

  // We will build the slides array dynamically here
  const slidesData = [
      {
          title: `<h2>Por que a CP Marketing?</h2><p>Somos mais que uma agência. Somos seu parceiro estratégico de crescimento, com estrutura para entregar resultados reais.</p>`,
          content: `<div class="presentation-gallery-layout">
                      <div class="features-list">
                          <div class="feature-item"><i class="fas fa-building"></i><div><h4>Estrutura Física</h4><p>Recursos para atender sua demanda com excelência.</p></div></div>
                          <div class="feature-item"><i class="fas fa-video"></i><div><h4>Estúdios Próprios</h4><p>Produção de conteúdo ágil e de alta qualidade.</p></div></div>
                          <div class="feature-item"><i class="fas fa-users"></i><div><h4>Time Presencial</h4><p>Colaboração e sinergia de uma equipe dedicada.</p></div></div>
                          <div class="feature-item"><i class="fas fa-lightbulb"></i><div><h4>Metodologia</h4><p>Processos validados para gerar resultados mensuráveis.</p></div></div>
                      </div>
                      <div class="image-gallery">
                          <div class="image-placeholder img-h" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755524630/PODCAST_01_wifyte.png')"></div>
                          <div class="image-placeholder img-s1" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755799843/Prancheta_30_wj7xqg.png')"></div>
                          <div class="image-placeholder img-s2" style="background-image: url('https://res.cloudinary.com/dp3gukavt/image/upload/v1755799843/Prancheta_32_gxdlmx.png')"></div>
                      </div>
                    </div>`
      },
      {
          title: `<h2>Entendemos o seu Desafio</h2>`,
          content: `<p class="question">${escapeHtml(diagnosticSlide.resumoEmpatico)}</p><br><p class="question">${escapeHtml(diagnosticSlide.analiseReflexiva)}</p>`
      },
      {
          title: `<h2>O Impacto Real do Gargalo Atual</h2>`,
          content: `<div class="impact-list"><div class="impact-item"><i class="fas fa-arrow-down"></i> <p><strong>Impacto Operacional:</strong> ${escapeHtml(painSlide.consequencia_1)}</p></div><div class="impact-item"><i class="fas fa-arrow-down"></i> <p><strong>Frustração Estratégica:</strong> ${escapeHtml(painSlide.consequencia_2)}</p></div><div class="impact-item"><i class="fas fa-arrow-down"></i> <p><strong>Vantagem Competitiva:</strong> ${escapeHtml(painSlide.consequencia_3)}</p></div></div>`
      },
      {
          title: `<h2>Uma Nova Realidade para o seu Negócio</h2>`,
          content: `<div class="card-grid"><div class="card"><h3>Seu Cenário em 6 Meses</h3><p>${escapeHtml(futureSlide.cenario_6_meses)}</p></div><div class="card"><h3>Seu Cenário em 1 Ano</h3><p>${escapeHtml(futureSlide.cenario_1_ano)}</p></div></div>`
      },
      {
          title: `<h2>O Custo de Não Agir Agora</h2>`,
          content: `<div class="card-grid" style="grid-template-columns: repeat(2, 1fr); place-items: center;"><div class="card cost-card"><h3>Custo em 6 Meses</h3><span class="highlight">${escapeHtml(inactionCostSlide.custo_6_meses)}</span></div><div class="card cost-card"><h3>Custo em 1 Ano</h3><span class="highlight">${escapeHtml(inactionCostSlide.custo_1_ano)}</span></div></div><br><p class="question" style="text-align: center;">${escapeHtml(inactionCostSlide.cenario_inercia)}</p>`
      },
      {
          title: `<h2>Nosso Plano para Virar o Jogo</h2>`,
          content: `<div class="card-grid"><div class="card"><i class="fas fa-users"></i> <h4>Aquisição</h4> <p>${escapeHtml(strategySlide.pilarAquisicao)}</p> </div><div class="card"><i class="fas fa-chart-line"></i> <h4>Conversão</h4> <p>${escapeHtml(strategySlide.pilarConversao)}</p> </div><div class="card"><i class="fas fa-star"></i> <h4>Autoridade</h4> <p>${escapeHtml(strategySlide.pilarAutoridade)}</p> </div></div>`
      },
      {
          title: `<h2>Resultados que Falam por Si</h2>`,
          content: `<p>Clientes que confiaram em nossa metodologia e alcançaram o sucesso.</p>
                    <div class="card-grid">
                        <div class="card">
                            <div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/400x300.png')" data-ai-hint="happy woman"></div>
                            <h4>Clínica Estética</h4>
                            <p>+250% em agendamentos qualificados.</p>
                        </div>
                        <div class="card">
                            <div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/400x300.png')" data-ai-hint="fashion style"></div>
                            <h4>E-commerce de Moda</h4>
                            <p>+80% no faturamento online.</p>
                        </div>
                        <div class="card">
                            <div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/400x300.png')" data-ai-hint="business meeting"></div>
                            <h4>Consultoria B2B</h4>
                            <p>-40% no Custo por Lead (CPL).</p>
                        </div>
                    </div>`
      },
      {
          title: `<h2>Nosso Compromisso com seu Crescimento de ${escapeHtml(metricsSlide.crescimentoPercentual)}</h2>`,
          content: `<p>O sucesso será medido com dados claros. Nossas metas mensais:</p><div class="card-grid"><div class="card"><h3>Leads Qualificados</h3><span class="highlight">${escapeHtml(metricsSlide.metaLeadsQualificados)}</span></div><div class="card"><h3>Taxa de Conversão</h3><span class="highlight">${escapeHtml(metricsSlide.metaTaxaConversao)}</span></div></div>`
      },
      {
          title: `<h2>O Investimento no seu Crescimento</h2>`,
          content: `<p class="question">${escapeHtml(investmentSlide.ancoragemPreco)}</p><div class="card" style="margin-top: 20px;"><p>${escapeHtml(investmentSlide.gatilhoEscassez)}</p><p><strong>Bônus de Ação Rápida:</strong> ${escapeHtml(investmentSlide.gatilhoBonus)}</p></div><br><p class="question">${escapeHtml(investmentSlide.ganchoDecisao)}</p>`
      }
  ];

  const html = `
<!DOCTYPE html>
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
        }

        body { 
            position: relative; 
            margin: 0; 
            overflow: hidden; 
            background-color: var(--background-color); 
            color: var(--primary-color); 
            font-family: 'Montserrat', sans-serif;
            background-image: radial-gradient(ellipse 80% 80% at 50% -20%,rgba(3, 8, 96, 0.25), transparent),
                              radial-gradient(ellipse 50% 50% at 90% 90%,rgba(254, 84, 18, 0.15), transparent);
            background-size: 200% 200%;
        }

        .scene {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1100px;
            height: auto;
            max-height: 90vh;
            padding: 4rem 2rem 8rem;
            background-color: var(--card-background);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid var(--border-color);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.6s ease-in-out, visibility 0.6s;
            overflow-y: auto;
            text-align: center;
        }
        .scene.active {
            opacity: 1;
            visibility: visible;
            z-index: 10;
        }
        
        .navigation {
            position: fixed;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
        }
        
        .nav-button { 
            background: none; 
            border: 1px solid var(--accent-color); 
            color: var(--accent-color); 
            padding: 12px 25px; 
            margin: 0 10px; 
            cursor: pointer; 
            font-family: 'Montserrat', sans-serif; 
            text-transform: uppercase; 
            font-weight: 700; 
            border-radius: 50px; 
            transition: all 0.3s ease; 
        }
        .nav-button:not(:disabled):hover { background-color: var(--accent-color); color: white; }
        .nav-button:disabled { opacity: 0.4; cursor: not-allowed; }

        h1, h2, h3 { font-weight: 900; margin-bottom: 20px; text-wrap: balance; }
        h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); text-transform: uppercase; line-height: 1.3; color: var(--accent-color); }
        h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
        h3 { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--secondary-color); text-transform: uppercase; letter-spacing: 2px; }
        p { font-size: clamp(0.9rem, 1.5vw, 1.1rem); line-height: 1.6; color: var(--secondary-color); max-width: 800px; margin-left: auto; margin-right: auto; }
        
        .proposal-meta { margin-top: 20px; font-size: 0.9rem; color: var(--secondary-color); }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            width: 100%;
            margin-top: 30px;
        }
        .card { 
            background-color: #1a1a1a; 
            padding: 25px; 
            border-radius: 10px; 
            border: 1px solid var(--border-color); 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center;
            height: 100%; /* Important for equal height */
        }
        .card i { font-size: 2rem; color: var(--accent-color); margin-bottom: 15px; }
        .card h4 { font-size: 1.2rem; margin-bottom: 10px; text-align: center; }
        
        .cost-card { justify-content: center; }
        .highlight { color: var(--highlight-color); font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; display: block; margin: 10px 0; }
        
        p.question {
            font-weight: 600;
            color: var(--primary-color);
            border-left: 3px solid var(--accent-color);
            padding-left: 1rem;
            text-align: left;
            margin: 1rem 0;
        }
        
        .presentation-gallery-layout { display: grid; grid-template-columns: 1fr; gap: 30px; align-items: flex-start; width: 100%; margin-top: 30px; }
        .features-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .features-list .feature-item { display: flex; align-items: flex-start; text-align: left; }
        .features-list i { font-size: 1.5rem; color: var(--accent-color); margin-right: 15px; margin-top: 5px; }
        .features-list h4 { margin-bottom: 5px; font-size: 1.2rem; }
        .features-list p { font-size: 1rem; text-align: left; }

        .image-gallery { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; height: 300px; }
        .image-placeholder { width: 100%; height: 100%; background-color: var(--border-color); border-radius: 10px; background-size: cover; background-position: center; }
        .img-h { grid-column: 1 / -1; } .img-s1 { grid-column: 1 / 2; } .img-s2 { grid-column: 2 / 3; }

        .impact-list { width: 100%; margin-top: 30px; }
        .impact-item { background-color: #1a1a1a; border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; display: flex; align-items: center; text-align: left; margin-bottom: 15px; }
        .impact-item i { font-size: 1.8rem; color: var(--accent-color); margin-right: 20px; }
        
        @media (min-width: 1024px) {
            .presentation-gallery-layout { grid-template-columns: 7fr 5fr; gap: 40px; }
        }

    </style>
</head>
<body>
    <div id="presentation-container">
        <!-- Capa Inicial -->
        <div id="intro-slide" class="scene active">
            <img src="https://res.cloudinary.com/dp3gukavt/image/upload/v1755524633/Prancheta_6_ajhh0n.png" alt="Logo da CP Marketing" style="max-height: 120px; margin-bottom: 30px;">
            <h3>Plano de Crescimento para</h3>
            <h1>${escapeHtml(clientName)}</h1>
            <div class="proposal-meta">
                <p>Data: ${escapeHtml(proposalDate)} | Validade: ${escapeHtml(proposalValidityDate)}</p>
            </div>
        </div>

        <!-- Slides Dinâmicos -->
        ${slidesData.map((slide, index) => `
            <div id="slide-${index}" class="scene">
                ${slide.title}
                ${slide.content}
            </div>
        `).join('')}
    </div>

    <div class="navigation">
        <button id="prev-button" class="nav-button">Anterior</button>
        <button id="next-button" class="nav-button">Avançar</button>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.scene');
        const totalSlides = slides.length;

        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        function updateSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === totalSlides - 1;
        }

        nextButton.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlide(currentSlide);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlide(currentSlide);
            }
        });

        // Initialize first slide
        updateSlide(0);
    </script>
</body>
</html>
  `;
  return html;
}

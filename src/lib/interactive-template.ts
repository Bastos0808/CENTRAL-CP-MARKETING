
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
    investmentValue,
    packages,
  } = presentationData;

  const slides = [
       {
          title: `<h2>Por que a CP Marketing?</h2><p>Somos mais que uma agência. Somos seu parceiro estratégico de crescimento, com estrutura para entregar resultados reais.</p>`,
          content: `<div class="presentation-gallery-layout">
                      <div class="features-list">
                          <div class="feature-item"><i class="fas fa-building"></i><div><h4>Estrutura Física</h4><p>Recursos para atender sua demanda com excelência.</p></div></div>
                          <div class="feature-item"><i class="fas fa-video"></i><div><h4>Estúdios Próprios</h4><p>Produção de conteúdo ágil e de alta qualidade.</p></div></div>
                          <div class="feature-item"><i class="fas fa-users"></i><div><h4>Time Presencial</h4><p>Colaboração e sinergia de uma equipe dedicada.</p></div></div>
                          <div class="feature-item"><i class="fas fa-lightbulb"></i><div><h4>Metodologia</h4><p>Processos validados para gerar resultados mensuráveis.</p></div></div>
                      </div>
                      <div class="video-container">
                          <video src="https://banco.linkscp.com.br/wp-content/uploads/2025/08/video-tour-horizontal-2.mp4" autoplay loop muted playsinline></video>
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
          title: `<h2>O Custo de Adiar a Decisão</h2>`,
          content: `<div class="card-grid"><div class="card cost-card"><h3>Custo em 6 Meses</h3><span class="highlight">${escapeHtml(inactionCostSlide.custo_6_meses)}</span></div><div class="card cost-card"><h3>Custo em 1 Ano</h3><span class="highlight">${escapeHtml(inactionCostSlide.custo_1_ano)}</span></div></div><br><p class="question" style="text-align: center;">${escapeHtml(inactionCostSlide.cenario_inercia)}</p>`
      },
      {
          title: `<h2>Nosso Plano para Virar o Jogo</h2>`,
          content: `<div class="card-grid"><div class="card"><i class="fas fa-users"></i> <h4>Aquisição</h4> <p>${escapeHtml(strategySlide.pilarAquisicao)}</p> </div><div class="card"><i class="fas fa-chart-line"></i> <h4>Conversão</h4> <p>${escapeHtml(strategySlide.pilarConversao)}</p> </div><div class="card"><i class="fas fa-star"></i> <h4>Autoridade</h4> <p>${escapeHtml(strategySlide.pilarAutoridade)}</p> </div></div>`
      },
      {
          title: `<h2>Resultados que Falam por Si</h2>`,
          content: `<p>Clientes que confiaram em nossa metodologia e alcançaram o sucesso.</p><div class="card-grid"><div class="card"><div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/600x400.png?text=Case+1')" data-ai-hint="business success"></div><h4>Case 1: Clínica Estética</h4><p>+250% em agendamentos qualificados.</p></div><div class="card"><div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/600x400.png?text=Case+2')" data-ai-hint="fashion store"></div><h4>Case 2: E-commerce de Moda</h4><p>+80% no faturamento online.</p></div><div class="card"><div class="image-placeholder" style="height: 120px; width:100%; margin-bottom: 15px; background-image: url('https://placehold.co/600x400.png?text=Case+3')" data-ai-hint="corporate office"></div><h4>Case 3: Consultoria B2B</h4><p>-40% no Custo por Lead (CPL).</p></div></div>`
      },
      {
          title: `<h2>Nosso Compromisso com seu Crescimento de ${escapeHtml(metricsSlide.crescimentoPercentual)}</h2>`,
          content: `<p>O sucesso será medido com dados claros. Nossas metas mensais:</p><div class="card-grid"><div class="card"><h3>Leads Qualificados</h3><span class="highlight">${escapeHtml(metricsSlide.metaLeadsQualificados)}</span></div><div class="card"><h3>Taxa de Conversão</h3><span class="highlight">${escapeHtml(metricsSlide.metaTaxaConversao)}</span></div></div>`
      },
      {
          title: `<h2>O Investimento no seu Crescimento</h2>`,
          content: `
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
            <div class="card" style="margin-top: 20px; text-align: left;">
              <p><strong><i class="fas fa-exclamation-circle"></i> ${escapeHtml(investmentSlide.gatilhoEscassez)}</strong></p>
              <p><strong><i class="fas fa-gift"></i> Bônus de Ação Rápida:</strong> ${escapeHtml(investmentSlide.gatilhoBonus)}</p>
            </div>
            <br>
            <p class="question">${escapeHtml(investmentSlide.ganchoDecisao)}</p>`
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
        }

        /* Camada 3D (fundo) */
        #webgl-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        /* Camada da Interface (sobrepõe o 3D) */
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
            pointer-events: none; /* Permite cliques no canvas 3D se necessário */
        }
        .ui-layer > * {
            pointer-events: auto; /* Reativa eventos para os filhos diretos */
        }

        /* Capa Inicial */
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
        
        /* Container da Proposta (slides) */
        .proposal-container-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
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
            max-width: 900px;
            max-height: 90vh;
            padding: 40px;
            background-color: var(--card-background);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Ajustado */
            align-items: center;
            overflow: hidden; /* Garante que não haja rolagem */
            border: 1px solid var(--border-color);
            position: relative; /* Para conter a navegação */
        }
        .sky-container-content {
            width: 100%;
            flex-grow: 1; /* Permite que o conteúdo cresça */
            transition: opacity 0.4s ease-in-out;
            overflow-y: auto;
            padding-right: 15px; /* Evita que a barra de rolagem cubra o conteúdo */
            margin-bottom: 20px; /* Espaço antes da navegação */
        }

        /* Botão de Fechar */
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

        /* Tipografia Responsiva */
        h1, h2, h3 { font-weight: 900; margin-bottom: 20px; text-align: center; }
        h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); text-transform: uppercase; line-height: 1.3; color: var(--accent-color); }
        h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
        h3 { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--secondary-color); text-transform: uppercase; letter-spacing: 2px; }
        p { font-size: clamp(0.9rem, 1.5vw, 1.1rem); line-height: 1.6; color: var(--secondary-color); max-width: 800px; text-align: center; margin-left: auto; margin-right: auto;}
        
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
        
        /* Navegação */
        .nav-arrows { 
            width: 100%;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
            text-align: center;
        }
        .nav-button { background: none; border: 1px solid var(--accent-color); color: var(--accent-color); padding: 12px 25px; margin: 0 10px; cursor: pointer; font-family: 'Montserrat', sans-serif; text-transform: uppercase; font-weight: 700; border-radius: 50px; transition: all 0.3s ease; }
        .nav-button:not(:disabled):hover { background-color: var(--accent-color); color: white; }
        .nav-button:disabled { opacity: 0.4; cursor: not-allowed; }
        
        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; width: 100%; margin-top: 30px; }
        .card { background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;}
        .card i { font-size: 2rem; color: var(--accent-color); margin-bottom: 15px; }
        .card h4 { font-size: 1.2rem; margin-bottom: 10px; text-align: center; }
        .card p {text-align: center;}
        .highlight { color: var(--highlight-color); font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; display: block; margin: 10px 0; }
        
        p.question {
            font-weight: 600;
            color: var(--primary-color);
            border-left: 3px solid var(--accent-color);
            padding-left: 1rem;
            text-align: left;
            margin: 1rem auto;
        }
        
        .presentation-gallery-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            align-items: flex-start;
            width: 100%;
            margin-top: 30px;
        }
        .features-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .features-list .feature-item { display: flex; align-items: flex-start; text-align: left; }
        .features-list i { font-size: 1.5rem; color: var(--accent-color); margin-right: 15px; margin-top: 5px; }
        .features-list h4 { margin-bottom: 5px; font-size: 1.2rem; text-align: left; }
        .features-list p { font-size: 1rem; text-align: left; }

        .video-container {
            width: 100%;
            height: 300px;
            border-radius: 10px;
            overflow: hidden;
        }
        .video-container video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .image-placeholder { width: 100%; height: 100%; background-color: var(--border-color); border-radius: 10px; background-size: cover; background-position: center; }
        
        .impact-list { width: 100%; margin-top: 30px; }
        .impact-item { background-color: #1a1a1a; border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; display: flex; align-items: center; text-align: left; margin-bottom: 15px; }
        .impact-item i { font-size: 1.8rem; color: var(--accent-color); margin-right: 20px; }

        .investment-layout { display: flex; flex-direction: column; gap: 30px; width: 100%; margin-top: 20px; }
        .packages-list, .total-investment { background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); }
        .packages-list h4, .total-investment h4 { font-size: 1.2rem; text-align: left; margin-bottom: 15px; }
        .packages-list ul { list-style: none; padding: 0; text-align: left; }
        .packages-list li { padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .packages-list li:last-child { border-bottom: none; }
        .total-investment { text-align: center; }
        .final-price { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: var(--accent-color); }
        
        @media (min-width: 768px) {
            .investment-layout { flex-direction: row; align-items: flex-start; }
            .packages-list { flex: 2; }
            .total-investment { flex: 1; }
        }

        @media (min-width: 1024px) {
            .presentation-gallery-layout {
                grid-template-columns: 7fr 5fr;
                gap: 40px;
            }
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
            { y: 30, z: 65 }    // Posição 9 (Novo slide)
        ];

        function updateSlideContent() {
            const container = document.querySelector('.sky-container-content');
            const skyContainer = document.querySelector('.sky-container');
            
            TweenLite.to(container, 0.3, { opacity: 0, ease: Power2.easeOut, onComplete: () => {
                if (currentSlide < 0 || currentSlide >= slides.length) {
                    container.innerHTML = '';
                    return;
                }
                const slide = slides[currentSlide];
                container.innerHTML = slide.title + slide.content;
                
                document.getElementById('prev-button').disabled = currentSlide === 0;
                document.getElementById('next-button').disabled = currentSlide === slides.length - 1;

                skyContainer.scrollTop = 0;

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

            createStars(); // Adiciona as estrelas à cena
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
</html>
  `;
  return html;
}

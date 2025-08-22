
import type { GeneratePresentationOutput } from "@/ai/schemas/presentation-generator-schemas";

// --- Embedded Libraries ---
// Ideally, these are loaded once and cached. For this self-contained example, they are embedded.
// Note: In a real-world scenario, you might fetch these or use a build step.
const GSAP_CODE = `/* Paste minified GSAP (TweenMax/TweenLite) code here */`;
const THREE_JS_CODE = `/* Paste minified three.js r83 code here */`;

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
    clientName: string;
    presentationData: GeneratePresentationOutput;
}

export function createInteractiveProposal(data: CreateProposalData): string {
  const { clientName, presentationData } = data;

  const introTitle = `Plano de Crescimento para`;
  const mainTitle = escapeHtml(clientName);
  
  const diagnosticSlide = presentationData.diagnosticSlide;
  const actionPlanSlide = presentationData.actionPlanSlide;
  const timelineSlide = presentationData.timelineSlide;
  const kpiSlide = presentationData.kpiSlide;
  const whyCpSlide = presentationData.whyCpSlide;
  const justificationSlide = presentationData.justificationSlide;
  const investmentSlide = presentationData.investmentSlide;
  const nextStepsSlide = presentationData.nextStepsSlide;


  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta para ${escapeHtml(clientName)}</title>
    
    <link rel="stylesheet" href="https://use.typekit.net/af/949335/00000000000000003b9b0036/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

    <style>
        body { position: relative; margin: 0; overflow: hidden; background-color: #121212; color: white; font-family: 'brandon-grotesque', sans-serif; }
        .intro-container, .sky-container, .x-mark, .nav-arrows { position: absolute; text-align: center; margin: 0 auto; left: 0; right: 0; z-index: 10; transition: opacity 0.5s ease-in-out; }
        .intro-container { top: 50%; transform: translateY(-50%); }
        .sky-container { top: 10%; opacity: 0; pointer-events: none; }
        .x-mark { top: 20px; right: 20px; width: 40px; height: 40px; cursor: pointer; opacity: 0; pointer-events: none; }
        .x-mark .container { position: relative; width: 100%; height: 100%; }
        .x-mark .left, .x-mark .right { width: 2px; height: 20px; background: white; position: absolute; top: 10px; left: 19px; border-radius: 3px; transition: 0.15s ease-out; }
        .x-mark .right { transform: rotate(-45deg); }
        .x-mark .left { transform: rotate(45deg); }
        .x-mark:hover .right { transform: rotate(-45deg) scaleY(1.2); }
        .x-mark:hover .left { transform: rotate(45deg) scaleY(1.2); }
        h1 { font-weight: bold; margin: 0; font-size: 20px; text-transform: uppercase; line-height: 1.3; }
        @media screen and (min-width: 860px) { h1 { font-size: 40px; line-height: 52px; } }
        .fancy-text { font-family: 'adobe-garamond-pro', sans-serif; font-style: italic; letter-spacing: 1px; margin-bottom: 17px; }
        .button { position: relative; cursor: pointer; display: inline-block; font-family: 'brandon-grotesque', sans-serif; text-transform: uppercase; min-width: 200px; margin-top: 30px; color: white; }
        .button .border { border: 1px solid white; transform: skewX(-20deg); height: 32px; border-radius: 3px; overflow: hidden; position: relative; transition: 0.1s ease-out; }
        .button .text { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); transition: 0.15s ease-out; }
        .button .left-plane, .button .right-plane { position: absolute; background: white; height: 32px; width: 100px; transition: 0.15s ease-out; }
        .button .left-plane { left: 0; transform: translateX(-100%); }
        .button .right-plane { right: 0; transform: translateX(100%); }
        .button:hover .border { box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 1); }
        .button:hover .left-plane { transform: translateX(0%); }
        .button:hover .right-plane { transform: translateX(0%); }
        .button:hover .text { color: #121212; }
        .nav-arrows { bottom: 30px; opacity: 0; pointer-events: none; }
        .nav-button { background: none; border: 1px solid white; color: white; padding: 10px 20px; margin: 0 10px; cursor: pointer; font-family: 'brandon-grotesque', sans-serif; text-transform: uppercase; }
        .nav-button:disabled { opacity: 0.5; cursor: not-allowed; }
    </style>
</head>
<body>
    <!-- Dynamic Content -->
    <div class="x-mark">
        <div class="container">
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
    <div class="intro-container">
        <h2 class="fancy-text">${escapeHtml(introTitle)}</h2>
        <h1>${mainTitle}</h1>
        <div class="button shift-camera-button">
            <div class="border">
                <div class="left-plane"></div><div class="right-plane"></div>
            </div>
            <div class="text">Começar</div>
        </div>
    </div>
    <div class="sky-container">
        <!-- Content will be injected here by JS -->
    </div>
     <div class="nav-arrows">
        <button id="prev-button" class="nav-button">Anterior</button>
        <button id="next-button" class="nav-button">Próximo</button>
    </div>

    <!-- Embedded Libraries -->
    <script>${THREE_JS_CODE}</script>
    <script>${GSAP_CODE}</script>

    <!-- Main Animation Script -->
    <script>
        "use strict";
        let camera, scene, renderer;
        let plane;
        let normalizedMouse = { x: 0, y: -180 };
        const slides = [
            { title: \`<h1>${escapeHtml(diagnosticSlide.title)}</h1><p class='fancy-text'>${escapeHtml(diagnosticSlide.question)}</p>\`, content: \`<ul>${diagnosticSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(actionPlanSlide.title)}</h1>\`, content: \`<div>${actionPlanSlide.content.map(c => `<p>${escapeHtml(c)}</p>`).join('')}</div>\` },
            { title: \`<h1>${escapeHtml(timelineSlide.title)}</h1>\`, content: \`<ul>${timelineSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(kpiSlide.title)}</h1>\`, content: \`<div>${kpiSlide.kpis.map(k => `<p><strong>${escapeHtml(k.metric)}:</strong> ${escapeHtml(k.estimate)}</p>`).join('')}</div>\` },
            { title: \`<h1>${escapeHtml(whyCpSlide.title)}</h1>\`, content: \`<ul>${whyCpSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(justificationSlide.title)}</h1>\`, content: \`<p>${escapeHtml(justificationSlide.content)}</p>\` },
            { title: \`<h1>${escapeHtml(investmentSlide.title)}</h1>\`, content: \`<p>Total: ${escapeHtml(investmentSlide.finalTotal)}</p>\` },
            { title: \`<h1>${escapeHtml(nextStepsSlide.title)}</h1>\`, content: \`<ul>${nextStepsSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` }
        ];
        let currentSlide = -1;

        function updateSlideContent() {
            if (currentSlide < 0 || currentSlide >= slides.length) {
                document.querySelector('.sky-container').innerHTML = '';
                return;
            }
            const slide = slides[currentSlide];
            document.querySelector('.sky-container').innerHTML = slide.title + slide.content;
            
            document.getElementById('prev-button').disabled = currentSlide === 0;
            document.getElementById('next-button').disabled = currentSlide === slides.length - 1;
        }

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true });
            camera.position.z = 50;
            renderer.setClearColor("#121212", 1.0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.body.appendChild(renderer.domElement);

            let topLight = new THREE.DirectionalLight(0xffffff, 1);
            topLight.position.set(0, 1, 1).normalize();
            scene.add(topLight);

            let geometry = new THREE.PlaneGeometry(400, 400, 70, 70);
            let darkBlueMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            geometry.vertices.forEach(function (vertice) {
                vertice.x += (Math.random() - 0.5) * 4;
                vertice.y += (Math.random() - 0.5) * 4;
                vertice.z += (Math.random() - 0.5) * 4;
                vertice.dx = Math.random() - 0.5;
                vertice.dy = Math.random() - 0.5;
                vertice.randomDelay = Math.random() * 5;
            });
            for (var i = 0; i < geometry.faces.length; i++) {
                geometry.faces[i].color.setStyle("rgb(0,52,74)");
                geometry.faces[i].baseColor = { r: 0, g: 52, b: 74 };
            }
            plane = new THREE.Mesh(geometry, darkBlueMaterial);
            scene.add(plane);
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
              plane.geometry.elementsNeedUpdate = true;
            }
            renderer.render(scene, camera);
        }

        window.onload = function() {
            init();

            document.querySelector('.shift-camera-button').addEventListener('click', function() {
                let introTimeline = new TimelineMax();
                introTimeline.add([
                    TweenLite.to('.intro-container', 0.5, { opacity: 0, ease: Power3.easeIn, onComplete: () => { document.querySelector('.intro-container').style.pointerEvents = 'none'; } }),
                    TweenLite.to(camera.rotation, 3, { x: Math.PI / 2, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 2.5, { z: 20, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { y: 120, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 2, ease: Power3.easeInOut }),
                ]);
                introTimeline.add([
                    TweenLite.to('.x-mark, .sky-container, .nav-arrows', 2, { opacity: 1, ease: Power3.easeInOut, onStart: () => {
                         document.querySelector('.x-mark').style.pointerEvents = 'auto';
                         document.querySelector('.nav-arrows').style.pointerEvents = 'auto';
                         currentSlide = 0;
                         updateSlideContent();
                    } }),
                ]);
            });

            document.querySelector('.x-mark').addEventListener('click', function() {
                let outroTimeline = new TimelineMax();
                outroTimeline.add([
                    TweenLite.to('.x-mark, .sky-container, .nav-arrows', 0.5, { opacity: 0, ease: Power3.easeInOut, onComplete: () => {
                        document.querySelector('.x-mark').style.pointerEvents = 'none';
                        document.querySelector('.nav-arrows').style.pointerEvents = 'none';
                        currentSlide = -1;
                        updateSlideContent();
                    }}),
                    TweenLite.to(camera.rotation, 3, { x: 0, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { z: 50, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 2.5, { y: 0, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 1, ease: Power3.easeInOut }),
                ]);
                outroTimeline.add([
                    TweenLite.to('.intro-container', 0.5, { opacity: 1, ease: Power3.easeIn, onComplete: () => { document.querySelector('.intro-container').style.pointerEvents = 'auto'; } }),
                ]);
            });

            document.getElementById('next-button').addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateSlideContent();
                }
            });

            document.getElementById('prev-button').addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlideContent();
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
}

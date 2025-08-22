
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

const renderBullets = (items: string[] | undefined) => {
    if (!items || items.length === 0) return '';
    return `
        <ul class="check-list">
            ${items.map(item => `<li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${escapeHtml(item)}</li>`).join('')}
        </ul>
    `;
};


interface CreateProposalData {
    clientName: string;
    presentationData: GeneratePresentationOutput;
}


export function createInteractiveProposal(data: CreateProposalData): string {
  const { clientName, presentationData } = data;

  const {
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

  const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta para ${escapeHtml(clientName)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-bg: #000000;
            --color-text: #EAEAEA;
            --color-primary: #030860;
            --color-accent: #FE5412;
            --color-surface: #1A1A1A;
            --color-border: rgba(255, 255, 255, 0.1);
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            background-color: var(--color-bg);
            color: var(--color-text);
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .scene {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 6rem 2rem;
            border-bottom: 1px solid var(--color-border);
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 1s forwards;
        }
        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        h1, h2, h3 {
            font-weight: 900;
            line-height: 1.2;
            color: white;
            text-wrap: balance;
        }
        h1 {
            font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);
            color: var(--color-accent);
            margin-bottom: 0.5rem;
        }
        h2 {
            font-size: clamp(2rem, 4vw, 3.5rem);
            color: white;
            margin-bottom: 2rem;
            position: relative;
        }
        h2::after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background-color: var(--color-accent);
            margin: 1rem auto 0;
            border-radius: 2px;
        }
        h3 {
            font-size: clamp(1.2rem, 2vw, 1.5rem);
            color: var(--color-accent);
            margin-bottom: 1rem;
        }
        p {
            max-width: 65ch;
            margin-bottom: 1rem;
            color: #B3B3B3;
        }
        .card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 2rem;
            width: 100%;
            text-align: left;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            width: 100%;
        }
        .check-list {
            list-style: none;
            padding: 0;
            text-align: left;
        }
        .check-list li {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            color: var(--color-text);
        }
        .check-list svg {
            flex-shrink: 0;
            color: var(--color-accent);
            margin-top: 2px;
        }
        .value-display {
            font-size: clamp(2.5rem, 6vw, 5rem);
            font-weight: 900;
            color: var(--color-accent);
            line-height: 1;
        }
        .highlight {
            color: var(--color-accent);
            font-weight: 700;
        }
        .logo { max-width: 150px; margin-bottom: 2rem; }
        .footer {
            text-align: center;
            padding: 2rem;
            font-size: 0.9rem;
            color: #808080;
        }
    </style>
</head>
<body>

    <main class="container">
        <!-- Scene 1: Capa -->
        <section class="scene">
            <img src="https://i.postimg.cc/8P2zVfFf/cp-logo-white.png" alt="CP Marketing Digital Logo" class="logo">
            <p style="font-weight:600; color: white;">PLANO DE CRESCIMENTO PARA</p>
            <h1>${escapeHtml(clientName)}</h1>
            <p>Proposta válida até: <span class="highlight">${escapeHtml(proposalValidityDate)}</span> | Data: ${escapeHtml(proposalDate)}</p>
        </section>

        <!-- Scene 2: Apresentação CP (Fixo) -->
        <section class="scene">
            <h2>Nossa Estrutura a Serviço do seu Sucesso</h2>
            <div class="grid">
                <div class="card">
                    <h3>Estrutura Física</h3>
                    <p>Time presencial, estúdios próprios e uma cultura de colaboração que se traduz em agilidade e qualidade para o seu projeto.</p>
                </div>
                 <div class="card">
                    <h3>Metodologia CP MÖDUS</h3>
                    <p>Um processo testado e validado, focado em diagnóstico, estratégia e execução, que nos permite entregar performance de mercado, e não apenas posts.</p>
                </div>
            </div>
        </section>

        <!-- Scene 3: Diagnóstico -->
        <section class="scene">
            <h2>O Diagnóstico</h2>
            <div class="card">
                <h3>Resumo Empático</h3>
                <p>${escapeHtml(diagnosticSlide.resumoEmpatico)}</p>
            </div>
            <div class="card">
                <h3>Análise Reflexiva</h3>
                <p>${escapeHtml(diagnosticSlide.analiseReflexiva)}</p>
            </div>
        </section>
        
        <!-- Scene 4: A Dor -->
        <section class="scene">
            <h2>O Impacto Real do Gargalo Atual</h2>
            <div class="card">
                ${renderBullets([painSlide.consequencia_1, painSlide.consequencia_2, painSlide.consequencia_3])}
            </div>
        </section>

        <!-- Scene 5: Visão de Futuro -->
        <section class="scene">
            <h2>A Visualização do Futuro</h2>
            <div class="grid">
                 <div class="card">
                    <h3>Seu Cenário em 6 Meses</h3>
                    <p>${escapeHtml(futureSlide.cenario_6_meses)}</p>
                </div>
                <div class="card">
                    <h3>Seu Cenário em 1 Ano</h3>
                    <p>${escapeHtml(futureSlide.cenario_1_ano)}</p>
                </div>
            </div>
        </section>
        
        <!-- Scene 6: Custo da Inação -->
        <section class="scene">
            <h2>O Custo de Adiar a Decisão</h2>
            <div class="grid">
                <div class="card">
                    <h3>Custo da Inação em 6 Meses</h3>
                    <p class="value-display">${escapeHtml(inactionCostSlide.custo_6_meses)}</p>
                </div>
                 <div class="card">
                    <h3>Custo da Inação em 1 Ano</h3>
                    <p class="value-display">${escapeHtml(inactionCostSlide.custo_1_ano)}</p>
                </div>
            </div>
            <div class="card" style="margin-top: 2rem;">
                <h3>O Cenário da Inércia</h3>
                <p>${escapeHtml(inactionCostSlide.cenario_inercia)}</p>
            </div>
        </section>

        <!-- Scene 7: Estratégia -->
        <section class="scene">
            <h2>Nosso Plano para Virar o Jogo</h2>
            <div class="grid">
                <div class="card">
                    <h3>Aquisição</h3>
                    <p>${escapeHtml(strategySlide.pilarAquisicao)}</p>
                </div>
                <div class="card">
                    <h3>Conversão</h3>
                    <p>${escapeHtml(strategySlide.pilarConversao)}</p>
                </div>
                <div class="card">
                    <h3>Autoridade</h3>
                    <p>${escapeHtml(strategySlide.pilarAutoridade)}</p>
                </div>
            </div>
        </section>

        <!-- Scene 8: Prova Social (Fixo) -->
        <section class="scene">
            <h2>Resultados que Falam por Nós</h2>
            <p>Nossa maior métrica é o sucesso dos nossos parceiros. Veja alguns exemplos.</p>
            <!-- Adicionar logos de clientes ou depoimentos aqui -->
        </section>

        <!-- Scene 9: Métricas -->
        <section class="scene">
            <h2>Nosso Compromisso com seu Crescimento de <span class="highlight">${escapeHtml(metricsSlide.crescimentoPercentual)}</span></h2>
             <div class="grid">
                <div class="card">
                    <h3>Meta de Leads Qualificados</h3>
                    <p class="value-display">${escapeHtml(metricsSlide.metaLeadsQualificados)}</p>
                    <p>por mês</p>
                </div>
                <div class="card">
                    <h3>Meta de Taxa de Conversão</h3>
                    <p class="value-display">${escapeHtml(metricsSlide.metaTaxaConversao)}</p>
                    <p>de lead para cliente</p>
                </div>
            </div>
        </section>

        <!-- Scene 10: Investimento -->
        <section class="scene">
            <h2>O Investimento na sua Aceleração</h2>
            <div class="card">
                <h3>Ancoragem de Preço</h3>
                <p>${escapeHtml(investmentSlide.ancoragemPreco)}</p>
            </div>
            <div class="card">
                <h3>Sua Decisão</h3>
                <p>${escapeHtml(investmentSlide.ganchoDecisao)}</p>
            </div>
            <div class="card" style="margin-top: 1.5rem;">
                ${renderBullets([investmentSlide.gatilhoEscassez, investmentSlide.gatilhoBonus])}
            </div>
        </section>

    </main>
    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} CP Marketing Digital. Todos os direitos reservados.</p>
    </footer>

</body>
</html>
  `;
  return html;
}

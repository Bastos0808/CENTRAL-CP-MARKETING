
import { BackButton } from "@/components/ui/back-button";
import { Check, CheckCircle, Diamond, Goal, Repeat, Target, TrendingUp, Users, DollarSign } from "lucide-react";

const kpiIcons: { [key: string]: React.ElementType } = {
    TrendingUp, Target, DollarSign, Repeat, Users,
};


export default function HtmlTestPage() {
    
    const clientName = "Nome do Cliente";
    const presentationTitle = `Plano de Crescimento para ${clientName}`;
    const diagnosticTitle = "Onde estamos e para onde vamos?";
    const diagnosticContent = [
        "<strong>Meta:</strong> Acelerar de R$ 50.000 para R$ 120.000.",
        "<strong>Gargalo:</strong> O obstáculo principal é a geração de leads qualificados.",
        "<strong>Custo da Inação:</strong> O gargalo atual gera um custo de oportunidade estimado em R$ 20.000 mensais.",
    ];
    const diagnosticQuestion = "Quantos clientes deixaram de entrar em contato este mês por não encontrarem vocês da forma certa?";
    
    const actionPlanTitle = "Como vamos virar o jogo?";
    const actionPlanPillar1 = "Como vamos atrair um fluxo constante de leads qualificados. <strong>Insight:</strong> 74% dos compradores B2B fazem a maior parte de sua pesquisa online antes de comprar.";
    const actionPlanPillar2 = "Como vamos transformar curiosos em clientes pagantes. <strong>Insight:</strong> Nutrir leads pode gerar 50% mais vendas a um custo 33% menor.";
    const actionPlanPillar3 = "Como vamos posicionar sua marca como líder no setor. <strong>Insight:</strong> Marcas consistentes têm uma receita 23% maior, em média.";

    const timelineTitle = "Qual o cronograma de execução?";
    const timelineContent = [
        "<strong>Semanas 1-2 (Setup e Imersão):</strong> Alinhamento estratégico, configuração de ferramentas e planejamento de campanhas/conteúdo.",
        "<strong>Semanas 3-12 (Execução e Otimização):</strong> Lançamento de campanhas, produção de conteúdo e otimizações semanais baseadas em dados.",
        "<strong>Revisões Estratégicas:</strong> Reuniões mensais para análise de resultados, ROI e próximos passos.",
    ];
    
    const kpiTitle = "Como vamos medir o sucesso (e o ROI)?";
    const kpiItems = [
        { metric: 'Custo por Lead (CPL)', estimate: 'Abaixo de R$ 50,00', importance: 'Mede a eficiência das campanhas na geração de contatos. Essencial para garantir que o investimento em marketing seja sustentável e escalável.', icon: 'Target' },
        { metric: 'Taxa de Conversão de Vendas', estimate: 'Acima de 15%', importance: 'Indica a qualidade dos leads gerados e a eficácia da equipe de vendas em fechar negócios, impactando diretamente a meta de faturamento.', icon: 'TrendingUp' },
        { metric: 'Custo por Aquisição (CAC)', estimate: 'Abaixo de R$ 350,00', importance: 'A métrica mais importante para a saúde financeira. Mostra o custo real para conquistar cada novo cliente, conectando o investimento ao crescimento da base.', icon: 'DollarSign' },
        { metric: 'Retorno sobre o Investimento (ROAS)', estimate: 'Mínimo de 3:1', importance: 'Mede o retorno financeiro direto das campanhas de publicidade. Para cada R$1 investido, quantos retornam em vendas.', icon: 'Repeat' },
        { metric: 'Novos Clientes por Mês', estimate: 'Média de 10-15', importance: 'Uma métrica clara de crescimento que mostra o impacto direto do plano de marketing no aumento da base de clientes e na meta de faturamento.', icon: 'Users' }
    ];

    const whyCpTitle = "Por que a CP é a escolha certa?";
    const whyCpContent = [
        "<strong>Mentoria e Agilidade:</strong> Projeto estratégico entregue em 10 dias com mentoria de apresentação, garantindo que a execução comece rápido para atacar o gargalo de geração de leads.",
        "<strong>Produção Própria:</strong> Time presencial e estúdios próprios para produzir conteúdo de alta qualidade sem depender da sua agenda, garantindo consistência e padrão profissional.",
        "<strong>Foco em Business Performance:</strong> Enquanto o mercado foca em métricas de vaidade, nossa obsessão é o crescimento do seu faturamento e o ROI do seu investimento.",
    ];
    
    const justificationTitle = "Por que este plano é ideal para você?";
    const justificationContent = "Este plano foi desenhado para atacar diretamente seu maior gargalo: a geração de leads qualificados. Ao combinar tráfego pago para atrair e uma estratégia de conteúdo para converter, criamos um sistema de aquisição que não apenas traz mais contatos, mas clientes prontos para comprar, impulsionando sua meta de faturamento de forma sustentável.";
    
    const investmentTitle = "Proposta de Investimento";
    const investmentItems = [
        { name: 'Plano de Marketing - Essencial', price: 'R$ 2.999,00' },
        { name: 'Tráfego Pago - Avulso', price: 'R$ 1.999,00' },
    ];
    const totalValue = 'R$ 4.998,00';
    const discount = '- R$ 499,00';
    const finalTotal = 'R$ 4.499,00';

    const nextStepsTitle = "Quais os próximos passos?";
    const nextStepsContent = [
        "Alinhamento e assinatura da proposta.",
        "Pagamento da primeira parcela para reserva de agenda.",
        "Reunião de Onboarding e Kick-off estratégico.",
    ];

    return (
    <div className="bg-gray-900 text-gray-100 font-sans p-4 sm:p-8">
        <BackButton />
        <div className="max-w-4xl mx-auto">
            <header className="text-center my-16">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight">
                   {presentationTitle}
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-orange-400 font-medium">
                    Preparado especialmente para {clientName}
                </p>
            </header>

            <main className="space-y-12">
                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6 flex items-center gap-3"><Goal className="w-8 h-8"/> {diagnosticTitle}</h2>
                    <ul className="space-y-3 text-lg text-gray-300">
                        {diagnosticContent.map((item, i) => (
                           <li key={i} className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item }} /></li>
                        ))}
                    </ul>
                    <p className="mt-8 text-lg italic text-gray-400 p-6 border-l-4 border-orange-400 bg-gray-900/50 rounded-r-lg">
                       {diagnosticQuestion}
                    </p>
                </section>
                
                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-8">{actionPlanTitle}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-900/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Pilar 1: Aquisição</h3>
                            <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: actionPlanPillar1 }}/>
                        </div>
                         <div className="bg-gray-900/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Pilar 2: Conversão</h3>
                            <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: actionPlanPillar2 }}/>
                        </div>
                         <div className="bg-gray-900/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Pilar 3: Autoridade</h3>
                            <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: actionPlanPillar3 }}/>
                        </div>
                    </div>
                </section>
                
                 <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6">{timelineTitle}</h2>
                     <ul className="space-y-3 text-lg text-gray-300">
                        {timelineContent.map((item, i) => (
                           <li key={i} className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item }} /></li>
                        ))}
                    </ul>
                </section>
                
                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-8">{kpiTitle}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {kpiItems.map((kpi, i) => {
                           const Icon = kpiIcons[kpi.icon] || Target;
                           return (
                            <div key={i} className="bg-gray-900/50 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                   <Icon className="w-6 h-6 text-orange-400"/>
                                   <h4 className="text-xl font-semibold text-white">{kpi.metric}</h4>
                                </div>
                                <p className="text-lg font-bold text-orange-400 mb-3">{kpi.estimate}</p>
                                <p className="text-sm text-gray-400">{kpi.importance}</p>
                            </div>
                           )
                        })}
                    </div>
                </section>

                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6">{whyCpTitle}</h2>
                    <ul className="space-y-3 text-lg text-gray-300">
                        {whyCpContent.map((item, i) => (
                           <li key={i} className="flex items-start gap-3"><Diamond className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item }} /></li>
                        ))}
                    </ul>
                </section>
                
                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6">{justificationTitle}</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">{justificationContent}</p>
                </section>

                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6">{investmentTitle}</h2>
                     <table className="w-full text-left text-lg">
                        <tbody>
                             {investmentItems.map(item => (
                                <tr key={item.name} className="border-b border-gray-700">
                                    <td className="py-4 text-gray-300">{item.name}</td>
                                    <td className="py-4 text-right font-semibold text-white">{item.price}</td>
                                </tr>
                             ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-b border-gray-700">
                                <td className="py-3 text-gray-400">Subtotal</td>
                                <td className="py-3 text-right text-gray-300">{totalValue}</td>
                            </tr>
                            <tr className="text-green-400 border-b border-gray-700">
                                <td className="py-3">Desconto</td>
                                <td className="py-3 text-right">{discount}</td>
                            </tr>
                            <tr className="text-white">
                                <td className="pt-4 text-2xl font-bold">Total</td>
                                <td className="pt-4 text-right text-3xl font-bold text-orange-400">{finalTotal}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-orange-400 mb-6">{nextStepsTitle}</h2>
                     <ul className="space-y-3 text-lg text-gray-300">
                        {nextStepsContent.map((item, i) => (
                           <li key={i} className="flex items-start gap-3"><Check className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item }} /></li>
                        ))}
                    </ul>
                </section>

                <footer className="text-center mt-20 mb-10">
                    <p className="text-gray-500">CP Marketing Digital &copy; 2024</p>
                </footer>

            </main>
        </div>
    </div>
  );
}

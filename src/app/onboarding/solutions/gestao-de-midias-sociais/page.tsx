
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, CheckCircle, UserCheck, AlertTriangle, BookOpen, MessageSquare, Edit, Bot, TrendingUp, Instagram, Linkedin, MicVocal } from "lucide-react";

export default function GestaoMidiasPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Palette className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">O que é a Gestão de Mídias Sociais?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Pense na Gestão de Mídias Sociais como ter uma equipe de marketing profissional cuidando do Instagram, Facebook e outras redes de uma empresa. Nosso trabalho é transformar o perfil, que muitas vezes é amador, em uma poderosa ferramenta que atrai seguidores que realmente compram e constrói a imagem da marca.
          </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen /> Definições Básicas</CardTitle>
          <CardDescription>Conceitos e ferramentas que você precisa saber para vender este serviço.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Edit className="h-4 w-4 text-primary" /> Linha Editorial</h3>
            <p className="text-sm text-muted-foreground pl-6">É o planejamento de conteúdo da marca. Funciona como um mapa que define os temas a serem abordados, garantindo que o perfil tenha uma comunicação coesa e não vire uma "colcha de retalhos".</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Copywriting</h3>
            <p className="text-sm text-muted-foreground pl-6">É a técnica de escrever textos persuasivos. O objetivo é criar legendas que incentivem o seguidor a tomar uma ação específica, seja curtir, comentar, compartilhar ou comprar.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><MicVocal className="h-4 w-4 text-primary" /> Tom de Voz</h3>
            <p className="text-sm text-muted-foreground pl-6">É a "personalidade" da marca na comunicação. Define se a linguagem será mais formal, técnica, descontraída ou divertida, garantindo consistência em todos os pontos de contato.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Algoritmo</h3>
            <p className="text-sm text-muted-foreground pl-6">É o sistema da rede social que decide qual conteúdo será exibido para os usuários. Nosso trabalho é criar publicações de alta qualidade que o algoritmo considere relevantes e mostre para mais pessoas.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Engajamento</h3>
            <p className="text-sm text-muted-foreground pl-6">São todas as interações que o público tem com a publicação: curtidas, comentários, compartilhamentos e salvamentos. É um forte indicador de que o conteúdo é relevante para a audiência.</p>
          </div>
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Instagram className="h-4 w-4 text-primary" /> Instagram & Facebook</h3>
            <p className="text-sm text-muted-foreground pl-6">São as principais "vitrines visuais". Ideais para criar desejo, mostrar o estilo de vida da marca, os bastidores e construir uma comunidade fiel através de fotos, vídeos (Reels) e stories.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Linkedin className="h-4 w-4 text-primary" /> LinkedIn</h3>
            <p className="text-sm text-muted-foreground pl-6">É a principal rede social profissional. A plataforma ideal para empresas que vendem para outras empresas (B2B), para construir autoridade e se conectar com outros players do mercado.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é o Cliente Ideal?</CardTitle>
          <CardDescription>Este serviço é perfeito para negócios que se encontram nestas situações:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>A Qualidade Não Transparece:</strong> A empresa oferece um produto ou serviço excelente, mas o perfil nas redes sociais parece amador, desorganizado e não passa a mesma confiança.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Postam Sem Vender:</strong> Eles criam conteúdo e postam com frequência, mas isso não se traduz em perguntas de clientes, orçamentos ou vendas. Os seguidores existem, mas não se tornam clientes.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Falta de Tempo e Ideias:</strong> O dono do negócio sabe que precisa estar presente online, mas está tão focado na operação que não tem tempo, consistência ou criatividade para manter as redes sociais ativas e interessantes.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (As Dores que Resolvemos)</CardTitle>
          <CardDescription>Use estas perguntas para fazer o prospect sentir a dor que a nossa solução cura.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Analisando seu perfil, sinto que ele ainda não faz justiça à qualidade do serviço que vocês oferecem. Faz sentido para você?"</li>
            <li>"Vejo que vocês mantêm uma boa frequência de posts. Como está o resultado disso em termos de novas vendas e clientes?"</li>
            <li>"Imagino que cuidar do negócio e ainda ter que pensar em conteúdo para as redes sociais seja um grande desafio. Como você tem lido com a falta de tempo para isso?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Diferencial: Processo Estratégico)</CardTitle>
          <CardDescription>Não vendemos "posts", vendemos um processo que gera resultados. Este é o "jeito CP de fazer".</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Diagnóstico e Planejamento Estratégico</span>
                    <p className="text-sm text-muted-foreground">O primeiro passo nunca é criar posts. É fazer uma imersão no negócio do cliente. Estudamos o público, os concorrentes e os objetivos. A partir daí, criamos um plano de comunicação (a <strong>Linha Editorial</strong>), que é o mapa do que vamos falar, como e para quem, garantindo que cada post tenha um propósito.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Produção de Conteúdo de Alta Qualidade</span>
                    <p className="text-sm text-muted-foreground">Nossa equipe cria o conteúdo do zero. Isso inclui o design das artes e a edição dos vídeos, e também o <strong>Copywriting</strong>, que é a técnica de escrever os textos (legendas) de forma persuasiva, para gerar engajamento e levar o seguidor a uma ação (comprar, perguntar, etc.).</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Gestão e Publicação Consistente</span>
                    <p className="text-sm text-muted-foreground">Cuidamos de todo o processo: enviamos o conteúdo para aprovação do cliente e agendamos as publicações nos melhores dias e horários. Isso garante a consistência que é fundamental para o <strong>Algoritmo</strong> e para manter a marca sempre presente na mente dos seguidores.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Análise de Performance e Otimização</span>
                    <p className="text-sm text-muted-foreground">Todo mês, enviamos um relatório que mostra o que funcionou e, mais importante, o porquê. Não olhamos apenas para curtidas, mas para como o conteúdo impactou os objetivos do negócio. Usamos esses dados para refinar a estratégia e garantir a melhoria contínua.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

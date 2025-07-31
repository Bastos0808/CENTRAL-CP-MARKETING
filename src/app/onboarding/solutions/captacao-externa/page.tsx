
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, CheckCircle, UserCheck, AlertTriangle, Video, Clapperboard, Users, Lightbulb, Film, Map, Bot, FileVideo } from "lucide-react";

export default function CaptacaoExternaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Camera className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">O que é a Captação de Conteúdo Externo?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            É quando levamos nossa equipe de filmagem e equipamentos profissionais até a empresa do cliente (em Goiânia). O objetivo é produzir vídeos e fotos de alta qualidade que mostrem a realidade da operação, os bastidores, o ambiente e os produtos em ação. É a melhor forma de gerar confiança e mostrar o que torna o negócio único.
          </p>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb /> Definições Básicas</CardTitle>
          <CardDescription>Conceitos que você precisa saber para vender este serviço.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Map className="h-4 w-4 text-primary" /> Pré-Produção / Roteiro</h3>
            <p className="text-sm text-muted-foreground pl-6">É o "mapa da gravação". Antes mesmo de pensar em ligar a câmera, nós planejamos cada detalhe: o que será filmado, quem vai aparecer, o que será dito. Isso garante que o tempo da gravação seja 100% aproveitado e que o resultado final conte a história certa.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Clapperboard className="h-4 w-4 text-primary" /> Direção de Cena</h3>
            <p className="text-sm text-muted-foreground pl-6">É o nosso "papel de diretor de cinema". Durante a gravação, nós guiamos o cliente, indicando a melhor forma de agir, o que falar e como se posicionar para a câmera. Isso garante um resultado natural e profissional, mesmo para quem nunca gravou um vídeo na vida.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Pós-Produção / Edição</h3>
            <p className="text-sm text-muted-foreground pl-6">É "a mágica da edição". Depois que a gravação termina, pegamos todo o material bruto e o transformamos em um vídeo incrível. Cortamos as melhores partes, melhoramos as cores, adicionamos música, legendas e o logo da empresa. É aqui que o vídeo ganha vida.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><FileVideo className="h-4 w-4 text-primary" /> Vídeo Institucional</h3>
            <p className="text-sm text-muted-foreground pl-6">É o "cartão de visitas" da empresa em formato de vídeo. É um material curto e de alto impacto que apresenta a empresa, sua missão, seus valores e seus diferenciais. Perfeito para colocar na página principal do site ou fixar nas redes sociais.</p>
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
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Querem Humanizar a Marca:</strong> Empresas que desejam mostrar as pessoas por trás do negócio, seus processos e a cultura da empresa para criar uma conexão mais forte com o público.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Negócios Físicos:</strong> Clínicas, restaurantes, lojas ou academias que precisam de imagens e vídeos profissionais para mostrar a qualidade de seu espaço, equipamentos e atendimento.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Precisam de Prova Social:</strong> Clientes que querem gravar depoimentos de seus próprios clientes em seu ambiente de trabalho ou vídeos de vendas mais elaborados e autênticos.</span></li>
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
            <li>"Você sente que seu público gostaria de ver mais dos bastidores e de como as coisas realmente funcionam aí na empresa?"</li>
            <li>"As fotos e vídeos que você tira com o celular conseguem transmitir o verdadeiro padrão de qualidade do seu espaço/serviço?"</li>
            <li>"Já pensou no impacto de ter um vídeo profissional apresentando sua empresa, gravado aí mesmo no seu ambiente?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Diferencial: Direção Estratégica)</CardTitle>
          <CardDescription>Não somos apenas "cinegrafistas". Transformamos o ambiente do cliente em um set de filmagem com propósito.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Pré-Produção e Roteiro</span>
                    <p className="text-sm text-muted-foreground">Antes de ligar a câmera, planejamos tudo. Junto com o cliente, definimos o que será gravado, quem participará e qual a mensagem principal. Criamos um roteiro para otimizar o tempo no dia da gravação e garantir que nenhum detalhe importante seja esquecido.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Produção com Direção Profissional</span>
                    <p className="text-sm text-muted-foreground">No dia combinado, nosso filmmaker vai até o cliente em Goiânia com todo o equipamento necessário: câmeras de cinema, iluminação profissional, microfones de lapela e até drones, se o projeto exigir. Cuidamos de toda a direção da cena para extrair o melhor material.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Pós-Produção de Alta Qualidade</span>
                    <p className="text-sm text-muted-foreground">Todo o material bruto gravado é levado para nossa ilha de edição. Lá, fazemos o tratamento de cor, a edição do áudio, incluímos a trilha sonora, legendas e o logo da empresa para criar vídeos com acabamento de cinema.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Múltiplos Formatos de Vídeo</span>
                    <p className="text-sm text-muted-foreground">A partir de uma única diária de gravação, conseguimos extrair diversos materiais. Entregamos vídeos mais longos para o YouTube ou site, e também vários vídeos curtos (Reels/Shorts) já prontos para postar nas redes sociais.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, CheckCircle, UserCheck, AlertTriangle, Youtube } from "lucide-react";

export default function PodcastPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Mic className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">O que é a Produção de Podcast?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Nosso serviço de podcast é uma solução completa para transformar o conhecimento de um especialista em um programa profissional. Cuidamos de tudo, da gravação em nosso estúdio à distribuição. O cliente só precisa se preocupar com o conteúdo, o resto é com a gente. É a forma mais eficaz de construir autoridade e se conectar com o público.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é o Cliente Ideal?</CardTitle>
          <CardDescription>Este serviço é perfeito para negócios que se encontram nestas situações:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Quer Ser Referência:</strong> Especialistas (médicos, advogados, consultores) e empresários que querem ser vistos como a principal autoridade em seu mercado.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Tem Conhecimento, Falta Tempo:</strong> Profissionais que dominam seu assunto, mas a ideia de lidar com câmeras, microfones, edição e publicação os impede de começar.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Busca Conexão Profunda:</strong> Marcas que querem ir além do conteúdo rápido das redes sociais e criar uma conexão mais forte e duradoura com sua audiência através de conversas e discussões aprofundadas.</span></li>
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
            <li>"Você é uma referência na sua área, mas sente que sua mensagem ainda não está alcançando o público que deveria?"</li>
            <li>"O que te impede hoje de transformar todo o seu conhecimento em um podcast de sucesso: a parte técnica ou a falta de tempo?"</li>
            <li>"Você já pensou em ter um podcast, mas só a ideia de ter que gerenciar tudo (gravação, edição, publicação) já te desanima?"</li>
             <li>"Como seria se você pudesse apenas sentar, gravar seu conteúdo e deixar que uma equipe cuidasse de todo o resto para você?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Solução Completa)</CardTitle>
          <CardDescription>Oferecemos uma experiência "Turnkey" (chave na mão). O cliente entra, grava e nós cuidamos de todo o resto.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Gravação Profissional em Estúdio</span>
                    <p className="text-sm text-muted-foreground">Oferecemos um estúdio em Goiânia com câmeras, microfones e iluminação de alta qualidade. Nossa equipe técnica acompanha toda a gravação, garantindo o melhor resultado. O cliente não se preocupa com nada técnico.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Edição e Pós-produção de Alto Nível</span>
                    <p className="text-sm text-muted-foreground">Nossa equipe de edição "limpa" a gravação, remove erros, trata o áudio para ficar agradável e adiciona vinhetas e trilhas para deixar o programa com cara de profissional.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Criação de Cortes Estratégicos (Nuggets)</span>
                    <p className="text-sm text-muted-foreground">Sabemos que pouca gente assiste a um vídeo de 1 hora. Por isso, pegamos os melhores momentos de cada episódio e os transformamos em vídeos curtos e legendados, perfeitos para postar no Reels, Shorts e TikTok, multiplicando o alcance do conteúdo.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Distribuição e Gestão de Canais</span>
                    <p className="text-sm text-muted-foreground">Publicamos o episódio completo no YouTube (com thumbnail profissional e descrição otimizada) e nas principais plataformas de áudio, como Spotify e Apple Podcasts, garantindo que o conteúdo chegue a toda a audiência.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">5</div>
                <div>
                    <span className="font-semibold text-lg">Design e Identidade Visual</span>
                    <p className="text-sm text-muted-foreground">Criamos a "cara" do programa: o logo, as capas para as plataformas de áudio e os modelos gráficos para os vídeos e cortes, garantindo uma identidade visual profissional e coesa.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

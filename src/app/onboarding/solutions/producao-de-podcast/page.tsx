
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
            <h1 className="text-3xl font-bold tracking-tight">Produção de Podcast</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Oferecemos uma solução completa, do estúdio à distribuição, para transformar seu conhecimento em um ativo de autoridade e reconhecimento de marca.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Especialistas e empresários que querem se tornar referência em seu mercado.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Profissionais com muito conhecimento para compartilhar, mas que não sabem por onde começar ou não têm tempo para a parte técnica.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Marcas que buscam um formato de conteúdo mais profundo para criar conexão com a audiência.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Quer construir autoridade e se tornar uma referência no seu mercado?"</li>
            <li>"Tem muito conhecimento, mas a complexidade técnica de um podcast te paralisa?"</li>
            <li>"Busca um formato de conteúdo premium para se conectar de verdade com sua audiência?"</li>
             <li>"Sonha em ter um podcast, mas só quer chegar, sentar e gravar sem se preocupar com mais nada?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Solução Completa)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Gravação Profissional em Estúdio</span>
                    <p className="text-sm text-muted-foreground">Disponibilizamos nosso estúdio com equipamentos de ponta: câmeras profissionais e microfones de lapela de alta qualidade. Nossa equipe técnica cuida de toda a operação; você só precisa chegar com seu convidado e gravar.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Edição e Pós-produção de Alto Nível</span>
                    <p className="text-sm text-muted-foreground">Realizamos cortes precisos, tratamento e limpeza de áudio, além da adição de vinhetas e trilhas sonoras para garantir um produto final com acabamento profissional e dinâmico.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Criação de Cortes Estratégicos (Nuggets e Pills)</span>
                    <p className="text-sm text-muted-foreground">Transformamos cada episódio gravado em múltiplos clipes curtos (cortes) e impactantes, ideais para viralizar e ampliar o alcance do seu conteúdo nas redes sociais (Reels, Shorts, TikTok).</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Distribuição e Gestão de Canais</span>
                    <p className="text-sm text-muted-foreground">Publicamos seu podcast nas principais plataformas de áudio (Spotify, Apple Podcasts, etc.) e fazemos a gestão completa do seu canal no YouTube, incluindo upload, otimização (SEO para vídeos) e criação de thumbnails.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">5</div>
                <div>
                    <span className="font-semibold text-lg">Design e Identidade Visual</span>
                    <p className="text-sm text-muted-foreground">Criamos toda a identidade visual do seu programa, desde as capas para as plataformas de streaming até os templates gráficos para os cortes e vídeos no YouTube.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

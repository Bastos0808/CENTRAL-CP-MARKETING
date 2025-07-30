
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

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
            Oferecemos uma solução completa de produção de podcast, desde a gravação até a distribuição, para transformar seu conhecimento em um ativo de autoridade.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Especialistas e empresários que querem se tornar referência em seu mercado.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Profissionais com muito conhecimento para compartilhar, mas que não sabem por onde começar.</span></li>
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
            <li>"Tem muito conhecimento para compartilhar, mas não sabe como começar?"</li>
            <li>"Busca um formato de conteúdo profundo para se conectar com sua audiência?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-foreground">
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Gravação Profissional</span>
                    <p className="text-sm text-muted-foreground">Equipamentos de ponta para garantir a melhor qualidade de áudio e vídeo.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Edição e Pós-produção</span>
                    <p className="text-sm text-muted-foreground">Cortes, limpeza de áudio, adição de trilhas e vinhetas para um acabamento profissional.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Criação de Cortes (Nuggets e Pills)</span>
                    <p className="text-sm text-muted-foreground">Transformamos cada episódio em múltiplos clipes curtos e impactantes para as redes sociais.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Distribuição Estratégica</span>
                    <p className="text-sm text-muted-foreground">Publicamos seu podcast nas principais plataformas (Spotify, Apple Podcasts, etc.) e gerenciamos seu canal no YouTube.</p>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Design e Identidade Visual</span>
                    <p className="text-sm text-muted-foreground">Criamos as capas e a identidade visual completa do seu programa.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

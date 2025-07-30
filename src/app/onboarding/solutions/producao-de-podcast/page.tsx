
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function PodcastPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
             <div className="bg-primary/10 p-3 rounded-full">
                <Mic className="h-10 w-10 text-primary" />
             </div>
            <CardTitle className="text-3xl">Produção de Podcast</CardTitle>
          </div>
          <CardDescription className="text-lg pl-16">
            Oferecemos uma solução completa de produção de podcast, desde a gravação até a distribuição, para transformar seu conhecimento em um ativo de autoridade.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <ul className="space-y-2 text-muted-foreground">
              <li>"Quer construir autoridade e se tornar uma referência no seu mercado?"</li>
              <li>"Tem muito conhecimento para compartilhar, mas não sabe como começar?"</li>
              <li>"Busca um formato de conteúdo profundo para se conectar com sua audiência?"</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Gravação Profissional:</strong> Equipamentos de ponta para garantir a melhor qualidade de áudio e vídeo.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Edição e Pós-produção:</strong> Cortes, limpeza de áudio, adição de trilhas e vinhetas para um acabamento profissional.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Criação de Cortes (Nuggets e Pills):</strong> Transformamos cada episódio em múltiplos clipes curtos e impactantes para as redes sociais.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Distribuição Estratégica:</strong> Publicamos seu podcast nas principais plataformas (Spotify, Apple Podcasts, etc.) e gerenciamos seu canal no YouTube.</div></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><div><strong>Design e Identidade Visual:</strong> Criamos as capas e a identidade visual completa do seu programa.</div></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

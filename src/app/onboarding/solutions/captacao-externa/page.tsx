
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, CheckCircle, UserCheck, AlertTriangle, Video, Clapperboard, Users, Lightbulb } from "lucide-react";

export default function CaptacaoExternaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Camera className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Captação de Conteúdo Externo</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Levamos nossa equipe e equipamentos profissionais até o seu negócio em Goiânia para produzir conteúdo audiovisual de alta qualidade, mostrando a realidade da sua operação.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Empresas que querem mostrar seus bastidores, processos e cultura.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios (clínicas, restaurantes, lojas) que precisam de imagens e vídeos profissionais do seu espaço físico e produtos.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Clientes que desejam criar vídeos institucionais, depoimentos de clientes ou vídeos de vendas mais elaborados.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Quer mostrar o que acontece por trás das câmeras e gerar mais conexão com seu público?"</li>
            <li>"Sente que as fotos e vídeos do seu negócio não transmitem a qualidade que você oferece?"</li>
            <li>"Precisa de um vídeo profissional para apresentar sua empresa ou um novo produto?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg">Pré-Produção e Roteiro</span>
                    <p className="text-sm text-muted-foreground">Planejamos a gravação junto com o cliente, definindo os objetivos, o roteiro, os locais e a logística necessária para otimizar o dia da captação.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg">Produção com Equipe Profissional</span>
                    <p className="text-sm text-muted-foreground">Nossa equipe (filmmaker) vai até o local do cliente em Goiânia com equipamentos de ponta: câmeras profissionais, iluminação, microfones e drones (se aplicável).</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg">Pós-Produção de Alta Qualidade</span>
                    <p className="text-sm text-muted-foreground">Editamos todo o material bruto, realizando tratamento de cor, edição de áudio, inclusão de trilha sonora, legendas e elementos gráficos para criar vídeos impactantes e alinhados à marca.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Múltiplos Formatos de Vídeo</span>
                    <p className="text-sm text-muted-foreground">Entregamos o material finalizado em diversos formatos, otimizados para diferentes plataformas: vídeos longos para YouTube, Reels/Shorts para Instagram e TikTok, e vídeos para anúncios.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

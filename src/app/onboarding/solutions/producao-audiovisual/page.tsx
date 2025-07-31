
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, CheckCircle, UserCheck, AlertTriangle, Clapperboard, Camera, Plane } from "lucide-react";

export default function ProducaoAudiovisualPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Video className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">Produção Audiovisual Completa</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            Soluções de vídeo ponta a ponta para elevar a percepção da sua marca, incluindo gravações em estúdio, captações externas e imagens aéreas com drone.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Marcas que buscam um padrão de vídeo cinematográfico para se destacar da concorrência.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Negócios que precisam de vídeos institucionais, de vendas ou para campanhas de marketing de alto impacto.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Clientes que desejam um material audiovisual completo, sem ter que gerenciar múltiplos fornecedores.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Ganchos de Venda (Dores)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>"Seu vídeo parece amador perto dos seus concorrentes?"</li>
            <li>"Quer um vídeo de vendas que realmente converta e justifique seu preço?"</li>
            <li>"Cansado de ter que contratar um videomaker, um editor e um piloto de drone separadamente?"</li>
            <li>"Precisa de um vídeo que realmente mostre a grandiosidade do seu projeto ou negócio?"</li>
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
                    <span className="font-semibold text-lg flex items-center gap-2"><Clapperboard /> Pré-Produção Estratégica</span>
                    <p className="text-sm text-muted-foreground">Não apertamos o 'play' sem um plano. Desenvolvemos o conceito, o roteiro e o cronograma de filmagem (storyboard) em conjunto com o cliente para garantir que o resultado final atinja os objetivos de negócio.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg flex items-center gap-2"><Camera /> Captação Profissional (Interna e Externa)</span>
                    <p className="text-sm text-muted-foreground">Realizamos gravações com qualidade de cinema, seja em nosso estúdio parceiro com fundo infinito, seja na locação do cliente, utilizando iluminação e áudio profissionais para um acabamento impecável.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg flex items-center gap-2"><Plane /> Filmagens Aéreas com Drone</span>
                    <p className="text-sm text-muted-foreground">Oferecemos uma perspectiva única e impactante do seu negócio, evento ou projeto com imagens aéreas de alta resolução, capturadas por pilotos experientes e equipamentos de ponta.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Pós-Produção Completa</span>
                    <p className="text-sm text-muted-foreground">Nossa equipe de edição transforma o material bruto em uma peça de comunicação poderosa, cuidando do tratamento de cor, motion graphics, trilha sonora, e finalização para múltiplas plataformas (YouTube, Instagram, Ads).</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

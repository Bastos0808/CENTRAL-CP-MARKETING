
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, CheckCircle, UserCheck, AlertTriangle, Clapperboard, Camera, Plane } from "lucide-react";

export default function ProducaoAudiovisualPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <Video className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-bold tracking-tight">O que é a Produção Audiovisual?</h1>
          </div>
          <p className="text-lg text-muted-foreground pl-16">
            É o nosso serviço mais completo de produção de vídeo. Aqui, oferecemos soluções ponta a ponta para criar vídeos de alto impacto que elevam a percepção de valor da marca. Isso pode incluir desde gravações em estúdio profissional, captações externas no local do cliente, até imagens aéreas com drone para mostrar a grandiosidade de um projeto.
          </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck /> Para Quem é o Cliente Ideal?</CardTitle>
           <CardDescription>Este serviço é perfeito para negócios que se encontram nestas situações:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Buscam Padrão Premium:</strong> Marcas que querem se diferenciar da concorrência com uma qualidade de vídeo de cinema, transmitindo sofisticação e autoridade.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Precisam de Vídeos Estratégicos:</strong> Empresas que necessitam de um vídeo institucional para apresentar a empresa, um vídeo de vendas para um produto específico ou vídeos para campanhas de marketing de alto impacto.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Querem uma Solução Completa:</strong> Clientes que não querem o trabalho de gerenciar um videomaker, um editor e um piloto de drone separadamente. Nós oferecemos a solução completa.</span></li>
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
            <li>"Seus vídeos atuais parecem amadores quando comparados aos de seus principais concorrentes?"</li>
            <li>"Você precisa de um vídeo de vendas que não só explique, mas que realmente convença o cliente e justifique o valor do seu produto?"</li>
            <li>"Já pensou em mostrar a dimensão real do seu negócio ou projeto com imagens de drone impressionantes?"</li>
            <li>"Está cansado de coordenar vários profissionais diferentes para produzir um único vídeo?"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O Que Entregamos? (Nosso Processo Criativo)</CardTitle>
          <CardDescription>Da ideia à tela, cuidamos de cada detalhe para entregar um resultado excepcional.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6 text-foreground">
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">1</div>
                <div>
                    <span className="font-semibold text-lg flex items-center gap-2"><Clapperboard /> Pré-Produção Estratégica</span>
                    <p className="text-sm text-muted-foreground">Não apertamos o "REC" sem um plano sólido. Junto ao cliente, desenvolvemos o conceito criativo, o roteiro detalhado e o cronograma de filmagem (storyboard), garantindo que cada cena tenha um propósito e que a mensagem final seja clara e impactante.</p>
                </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">2</div>
                <div>
                    <span className="font-semibold text-lg flex items-center gap-2"><Camera /> Captação Profissional (Estúdio ou Locação)</span>
                    <p className="text-sm text-muted-foreground">Realizamos as gravações com qualidade de cinema. Podemos usar um estúdio parceiro com fundo infinito para um visual limpo e controlado, ou ir até a locação do cliente para captar a essência do negócio. Sempre com iluminação e áudio profissionais.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">3</div>
                <div>
                    <span className="font-semibold text-lg flex items-center gap-2"><Plane /> Filmagens Aéreas com Drone</span>
                    <p className="text-sm text-muted-foreground">Para adicionar uma camada de grandiosidade e produção, oferecemos filmagens aéreas de alta resolução. É a forma perfeita de mostrar a escala de um imóvel, um evento ou a fachada de uma empresa de um ângulo que impressiona.</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mt-1 flex-shrink-0">4</div>
                <div>
                    <span className="font-semibold text-lg">Pós-Produção Completa</span>
                    <p className="text-sm text-muted-foreground">É aqui que a mágica acontece. Nossa equipe de edição une as melhores cenas, aplica tratamento de cor profissional, cria animações gráficas (motion graphics), adiciona a trilha sonora perfeita e finaliza o vídeo em todos os formatos necessários.</p>
                </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

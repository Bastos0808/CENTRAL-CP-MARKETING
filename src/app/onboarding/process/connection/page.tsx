
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, CheckSquare, AlertTriangle } from "lucide-react";

const checklist = [
    { text: "Envie um convite de conexão para o decisor identificado no LinkedIn." },
    { text: "NÃO envie uma mensagem junto com o convite. O objetivo é apenas a conexão, sem vender nada. Isso reduz a fricção e aumenta a chance de aceitação." },
    { text: "Após a conexão ser aceita, interaja com 1 ou 2 posts recentes do decisor ou da empresa. Uma curtida ou um comentário genuíno mostra que você está prestando atenção." },
    { text: "Aguarde de 1 a 2 dias após a interação antes de passar para a próxima fase (Contato Direto). Esse tempo é crucial para não parecer apressado ou desesperado." }
];

export default function ConnectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Handshake className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 2: Conexão</h1>
            <p className="text-lg text-muted-foreground mt-1">
                O objetivo aqui é simples: aparecer no radar do prospect de forma sutil e profissional. Pessoas compram de quem elas conhecem e confiam. Esta fase inicia o processo de familiaridade.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Checklist de Ações</CardTitle>
        </CardHeader>
        <CardContent>
             <ul className="space-y-4">
                {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item.text}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>

       <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-500"><AlertTriangle /> Ponto de Atenção: O Jogo da Paciência</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-yellow-700/80 dark:text-yellow-500/80">
                  A ansiedade para vender pode estragar todo o trabalho de pesquisa da Fase 1. Resista à tentação de enviar uma mensagem de venda imediata. A paciência nesta fase não é passividade, é uma tática que aumenta drasticamente suas chances de obter uma resposta na fase seguinte.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckSquare } from "lucide-react";
import Link from "next/link";

const checklist = [
    { text: "Identificar potenciais clientes que se encaixam 100% no nosso ICP (Perfil de Cliente Ideal). Se houver dúvida, não avance." },
    { text: "Analisar a presença digital atual do prospect: site, blog, e principalmente Instagram e LinkedIn. O que eles postam? Com que frequência?" },
    { text: "Identificar o decisor correto (CEO, Diretor de Marketing, Sócio). Pesquise no LinkedIn ou na seção 'Sobre' do site da empresa." },
    { text: "Procurar por 'ganchos' ou dores evidentes: posts antigos, comunicação que não reflete a qualidade do serviço, falta de engajamento, anúncios dos concorrentes, etc." },
    { text: "Verificar se a empresa está contratando na área de marketing ou vendas, pois isso indica um desejo de crescimento." },
];

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fase 1: Pesquisa e Qualificação</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Esta é a fase mais importante. Um bom SDR gasta 80% do seu tempo aqui. Uma prospecção bem-sucedida não depende de quantas pessoas você contata, mas da qualidade desses contatos.
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
      
       <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
              <CardTitle>Ferramentas e Recursos</CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                  <li><strong>LinkedIn Sales Navigator:</strong> Para encontrar decisores e filtrar empresas por setor, tamanho e localização.</li>
                  <li><strong>Exact Spotter:</strong> Nossa ferramenta interna para prospecção B2B. <Link href="/ferramentas" className="text-primary hover:underline">Acesse aqui.</Link></li>
                  <li><strong>Biblioteca de Anúncios do Facebook:</strong> Para verificar se os concorrentes do seu prospect estão anunciando.</li>
                   <li><strong>Documentação do ICP:</strong> Use como seu guia principal. <Link href="/onboarding/icp" className="text-primary hover:underline">Consulte aqui.</Link></li>
              </ul>
          </CardContent>
      </Card>

    </div>
  );
}

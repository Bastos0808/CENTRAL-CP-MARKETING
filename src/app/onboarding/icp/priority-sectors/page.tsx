
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CheckCircle } from "lucide-react";

export default function PrioritySectorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Building className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Setores Prioritários</h1>
      </div>
      <p className="text-lg text-muted-foreground pl-16">
        Embora sejamos versáteis, nossa expertise e os resultados mais expressivos se concentram em alguns setores-chave onde nossa metodologia gera mais impacto.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Setores com Maior Afinidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Saúde e Bem-Estar:</strong> Clínicas, médicos, dentistas, psicólogos e outros profissionais da saúde que precisam construir autoridade.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Serviços B2B:</strong> Consultorias, agências de nicho, empresas de tecnologia e outros negócios que vendem para outras empresas.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>E-commerce com Produto Validado:</strong> Lojas virtuais que já têm um produto testado e aprovado pelo mercado, e que agora precisam escalar as vendas.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Negócios Locais Premium:</strong> Restaurantes, clínicas de estética, e outros serviços locais que atendem a um público de alto padrão.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

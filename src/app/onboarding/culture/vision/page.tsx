
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, Star, Users } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Eye className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl">Nossa Visão</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xl text-muted-foreground border-l-4 border-primary pl-4">
            Ser a agência de marketing digital reconhecida como a principal parceira de crescimento para empresas ambiciosas.
          </p>
          <p className="text-foreground">
            Nossa visão vai além de sermos apenas mais uma agência no mercado. Almejamos ser a primeira escolha para empresas que não querem apenas "estar no digital", mas sim dominar seus nichos. Quando um negócio pensa em escalar, em se tornar autoridade e em traduzir marketing em faturamento, queremos que o nome "CP Marketing Digital" seja a resposta óbvia.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp/> Sinônimo de Crescimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Queremos que nossa marca seja inseparável da ideia de crescimento de negócio, não apenas de métricas de vaidade.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Star/> Domínio de Mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Aspiramos ser conhecidos por nossa capacidade de construir estratégias que geram domínio de mercado para nossos clientes.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users/> Parceria Estratégica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nossa visão é sermos vistos como uma extensão estratégica da equipe do cliente, um parceiro vital para o seu sucesso.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Localização</h1>
            <p className="text-lg text-muted-foreground mt-1">
                Nosso modelo de trabalho nos permite atender clientes em qualquer lugar, mas temos um foco geográfico estratégico para otimizar resultados.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foco Geográfico</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Atuação em todo o Brasil:</strong> Estamos equipados para atender clientes em qualquer estado do país de forma 100% remota.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Foco em Capitais e Grandes Centros:</strong> Nossa prospecção ativa é direcionada principalmente para capitais e grandes cidades, onde a concentração de empresas do nosso ICP é maior.
              </span>
            </li>
             <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Podcast Studio:</strong> Para clientes do serviço de podcast, a gravação presencial ocorre em nosso estúdio. Clientes de outras localidades podem ser atendidos remotamente ou em estúdios parceiros (sob consulta).
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

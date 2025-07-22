import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const clients = [
  {
    name: "Empresa Alpha",
    responsible: "João Silva",
    status: "active",
    plan: "Plano Premium",
    startDate: "01/02/2023",
  },
  {
    name: "Comércio Beta",
    responsible: "Maria Oliveira",
    status: "inactive",
    plan: "Plano Básico",
    startDate: "15/07/2022",
  },
  {
    name: "Serviços Gama",
    responsible: "Carlos Pereira",
    status: "active",
    plan: "Plano Intermediário",
    startDate: "20/09/2023",
  },
  {
    name: "Indústria Delta",
    responsible: "Ana Costa",
    status: "pending",
    plan: "Plano Premium",
    startDate: "10/01/2024",
  },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    active: "default",
    pending: "secondary",
    inactive: "destructive",
};

export default function ClientDatabasePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Base de Dados de Clientes
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Aqui você encontra todos os clientes da CP Marketing.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Total de {clients.length} clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Cliente</TableHead>
                  <TableHead>Responsável (CP)</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.name}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.responsible}</TableCell>
                    <TableCell>{client.plan}</TableCell>
                    <TableCell>{client.startDate}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant={statusVariantMap[client.status] || "secondary"}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

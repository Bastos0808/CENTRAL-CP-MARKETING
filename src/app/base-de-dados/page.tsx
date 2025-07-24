
"use client";

import { useEffect, useState } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  responsible: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  startDate: string;
}

const preRegisterSchema = z.object({
    name: z.string().min(1, "O nome do cliente é obrigatório."),
    plan: z.string().min(1, "O plano é obrigatório."),
    planDetails: z.string().optional(),
});

type PreRegisterFormValues = z.infer<typeof preRegisterSchema>;

const statusMap: { 
  [key in Client['status']]: { 
    text: string; 
    className: string;
    order: number;
  } 
} = {
    active: { text: "Ativo", className: "bg-green-500/20 text-green-700 border-green-500/50 hover:bg-green-500/30", order: 1 },
    pending: { text: "Pendente", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50 hover:bg-yellow-500/30", order: 2 },
    inactive: { text: "Inativo", className: "bg-red-500/20 text-red-700 border-red-500/50 hover:bg-red-500/30", order: 3 },
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return "Data inválida";
  }
};


export default function ClientDatabasePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PreRegisterFormValues>({
      resolver: zodResolver(preRegisterSchema)
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      const sortedClients = clientsData.sort((a, b) => {
        const orderA = statusMap[a.status]?.order || 99;
        const orderB = statusMap[b.status]?.order || 99;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });
      setClients(sortedClients);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      toast({ title: "Erro ao buscar clientes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onPreRegisterSubmit = async (data: PreRegisterFormValues) => {
      const newClientId = crypto.randomUUID();
      const newClient = {
          id: newClientId,
          name: data.name,
          plan: data.plan,
          responsible: "Não definido",
          status: "pending" as const,
          startDate: format(new Date(), 'yyyy-MM-dd'),
          briefing: {
              informacoesOperacionais: {
                  nomeNegocio: data.name,
                  planoContratado: data.plan,
                  observacoesPlano: data.planDetails || '',
                  // Initialize other briefing fields as empty
                  redesSociaisAcesso: [],
                  possuiIdentidadeVisual: 'nao',
                  possuiBancoImagens: 'nao',
                  linksRelevantes: '',
              },
              negociosPosicionamento: {},
              publicoPersona: {},
              concorrenciaMercado: {
                  principaisConcorrentes: [],
                  inspiracoesPerfis: [],
              },
              comunicacaoExpectativas: {},
              metasObjetivos: {},
              equipeMidiaSocial: {},
              equipeTrafegoPago: {},
          },
          visualIdentity: {},
          reports: [],
          contentPlanner: [],
      };

      try {
          await setDoc(doc(db, 'clients', newClientId), newClient);
          toast({
              title: "Cliente Pré-cadastrado!",
              description: `${data.name} foi adicionado. Agora você pode completar o briefing.`,
          });
          reset();
          setIsDialogOpen(false);
          await fetchClients(); // Refresh the client list
      } catch (error) {
          console.error("Error creating client:", error);
          toast({ title: "Erro ao criar cliente", variant: "destructive" });
      }
  };

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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                {loading ? "Carregando..." : `Total de ${clients.length} clientes.`}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Novo Cliente
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pré-Cadastro de Cliente</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onPreRegisterSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Cliente</Label>
                            <Input id="name" {...register("name")} placeholder="Ex: Acme Inc."/>
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan">Plano Contratado</Label>
                            <Input id="plan" {...register("plan")} placeholder="Ex: Plano Performance"/>
                            {errors.plan && <p className="text-sm text-destructive">{errors.plan.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="planDetails">Observações sobre o Plano</Label>
                            <Textarea id="planDetails" {...register("planDetails")} placeholder="Detalhes, exceções ou acordos específicos..."/>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Cliente
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
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
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-2/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-2/4" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 inline-block" /></TableCell>
                    </TableRow>
                  ))
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-muted/60" onClick={() => router.push(`/base-de-dados/${client.id}`)}>
                      <TableCell className="font-medium text-primary hover:underline">
                          {client.name}
                      </TableCell>
                      <TableCell>{client.responsible}</TableCell>
                      <TableCell>{client.plan}</TableCell>
                      <TableCell>{formatDate(client.startDate)}</TableCell>
                      <TableCell className="text-right">
                         <Badge 
                           className={statusMap[client.status]?.className || "bg-gray-500/20 text-gray-700 border-gray-500/50"}
                           variant="outline"
                         >
                          {statusMap[client.status]?.text || client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

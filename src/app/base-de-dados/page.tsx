
"use client";

import { useEffect, useState, useMemo } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2, Search, Briefcase, Mic } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { BackButton } from '@/components/ui/back-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Recording {
    id: string;
    date: string; // YYYY-MM-DD
}
interface PodcastPlan {
    recordingsPerMonth: number;
    accumulatedRecordings: number;
    paymentDay: number;
    recordingHistory?: Recording[];
}

interface Client {
  id: string;
  name: string;
  responsible: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  startDate: string;
  briefing: any;
  podcastPlan?: PodcastPlan;
}

const preRegisterSchema = z.object({
    name: z.string().min(1, "O nome do cliente é obrigatório."),
    plan: z.string().min(1, "O plano é obrigatório."),
    planDetails: z.string().optional(),
    hasPodcast: z.boolean().default(false),
    recordingsPerMonth: z.coerce.number().optional(),
    paymentDay: z.coerce.number().optional(),
    hoursPerEpisode: z.string().optional(),
    pillsPerEpisode: z.string().optional(),
    youtubeManagement: z.boolean().default(false),
    recordingTime: z.string().optional(),
}).refine(data => {
    if (data.hasPodcast) {
        return (data.recordingsPerMonth !== undefined && data.recordingsPerMonth > 0) &&
               (data.paymentDay !== undefined && data.paymentDay >= 1 && data.paymentDay <= 31);
    }
    return true;
}, {
    message: "Se o cliente tem podcast, os episódios por mês e o dia do pagamento são obrigatórios.",
    path: ['recordingsPerMonth']
});


type PreRegisterFormValues = z.infer<typeof preRegisterSchema>;

const statusMap: { 
  [key in Client['status'] | 'all']: { 
    text: string; 
    className?: string;
    order?: number;
  } 
} = {
    all: { text: "Todos" },
    active: { text: "Ativo", className: "bg-green-500/20 text-green-700 border-green-500/50 hover:bg-green-500/30", order: 1 },
    pending: { text: "Pendente", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50 hover:bg-yellow-500/30", order: 2 },
    inactive: { text: "Inativo", className: "bg-red-500/20 text-red-700 border-red-500/50 hover:bg-red-500/30", order: 3 },
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "Não definida";
  }
  try {
    // Adiciona T00:00:00 para garantir que a data seja interpretada como local
    const date = new Date(`${dateString}T00:00:00`);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date object");
    }
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return "Data inválida";
  }
};


export default function ClientDatabasePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");

  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<PreRegisterFormValues>({
      resolver: zodResolver(preRegisterSchema),
      defaultValues: {
          hasPodcast: false,
      }
  });

  const hasPodcast = watch('hasPodcast');

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
  }, [toast]);
  
  const filteredClients = useMemo(() => {
    return clients
      .filter(client => {
        // Client Type filter
        const isPodcastOnly = !!client.podcastPlan && !client.briefing.negociosPosicionamento?.descricao;
        if (clientTypeFilter === 'podcast' && !isPodcastOnly) {
          return false;
        }
        if (clientTypeFilter === 'social' && isPodcastOnly) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && client.status !== statusFilter) {
          return false;
        }
        // Search term filter (name)
        if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        // Search term filter (plan)
        if (planFilter && !client.plan.toLowerCase().includes(planFilter.toLowerCase())) {
            return false;
        }
        return true;
      });
  }, [clients, searchTerm, statusFilter, planFilter, clientTypeFilter]);


  const onPreRegisterSubmit = async (data: PreRegisterFormValues) => {
      const newClientId = crypto.randomUUID();
      const newClient: any = {
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
      };

      if (data.hasPodcast && data.recordingsPerMonth && data.paymentDay) {
          newClient.podcastPlan = {
              recordingsPerMonth: data.recordingsPerMonth,
              accumulatedRecordings: data.recordingsPerMonth,
              paymentDay: data.paymentDay,
              recordingHistory: [],
              hoursPerEpisode: data.hoursPerEpisode || '',
              pillsPerEpisode: data.pillsPerEpisode || '',
              youtubeManagement: data.youtubeManagement || false,
              recordingTime: data.recordingTime || '',
          }
      }

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
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Base de Dados de Clientes
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Aqui você encontra todos os clientes da CP Marketing.
          </p>
        </header>
        
        <div className="mb-6 flex justify-center">
            <Tabs value={clientTypeFilter} onValueChange={setClientTypeFilter} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="social"><div className='flex items-center gap-2'><Briefcase/> Mídia Social</div></TabsTrigger>
                    <TabsTrigger value="podcast"><div className='flex items-center gap-2'><Mic /> Podcast</div></TabsTrigger>
                </TabsList>
            </Tabs>
        </div>


        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>
                    {loading ? "Carregando..." : `Total de ${filteredClients.length} clientes encontrados.`}
                    </CardDescription>
                </div>
                 <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-2">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                     <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por plano..."
                            value={planFilter}
                            onChange={(e) => setPlanFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusMap).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value.text}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex justify-between items-center mb-4">
                <div />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
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

                            <div className='p-4 border rounded-md space-y-4'>
                               <Controller
                                    control={control}
                                    name="hasPodcast"
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="has-podcast" className='font-semibold'>Cliente possui plano de podcast?</Label>
                                            <Switch
                                                id="has-podcast"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                                {hasPodcast && (
                                    <div className='space-y-4 pt-2 border-t'>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="recordingsPerMonth">Episódios por Mês</Label>
                                                <Input 
                                                id="recordingsPerMonth" 
                                                type="number" 
                                                {...register("recordingsPerMonth")} 
                                                placeholder="Ex: 4"
                                                />
                                                {errors.recordingsPerMonth && <p className="text-sm text-destructive">{errors.recordingsPerMonth.message}</p>}
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="paymentDay">Dia do Pagamento (Ref.)</Label>
                                                <Input 
                                                id="paymentDay" 
                                                type="number"
                                                min="1" max="31"
                                                {...register("paymentDay")} 
                                                placeholder="Ex: 10"
                                                />
                                                {errors.paymentDay && <p className="text-sm text-destructive">{errors.paymentDay.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hoursPerEpisode">Hora p/ Episódio</Label>
                                                <Input id="hoursPerEpisode" {...register("hoursPerEpisode")} placeholder="Ex: 1h"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pillsPerEpisode">Número de Pílulas</Label>
                                                <Input id="pillsPerEpisode" {...register("pillsPerEpisode")} placeholder="Ex: 2 por episódio"/>
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="recordingTime">Horário de Gravação</Label>
                                            <Input id="recordingTime" {...register("recordingTime")} placeholder="Ex: Horário comercial"/>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="youtubeManagement"
                                            render={({ field }) => (
                                                <div className="flex items-center justify-between pt-2">
                                                    <Label htmlFor="youtube-management" className='font-normal'>Gestão de Youtube?</Label>
                                                    <Switch
                                                        id="youtube-management"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
                                    </div>
                                )}
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
            </div>
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
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
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

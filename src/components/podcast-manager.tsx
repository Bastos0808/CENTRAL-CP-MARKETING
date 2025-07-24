
"use client";

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, Calendar as CalendarIcon, Users, Package, CalendarPlus, ChevronsUpDown } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { format, startOfMonth } from 'date-fns';

interface PodcastPlan {
    recordingsPerMonth: number;
    accumulatedRecordings: number;
    lastUpdated: string; // ISO string for the month this was last updated
}
interface Client {
  id: string;
  name: string;
  podcastPlan?: PodcastPlan;
}

interface Schedule {
    id: string;
    clientId: string;
    clientName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
}

export default function PodcastManager() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [recordingsPerMonth, setRecordingsPerMonth] = useState(0);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
    const [scheduleTime, setScheduleTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { toast } = useToast();

    // Fetch all clients
    const fetchClients = async () => {
        setLoadingClients(true);
        try {
            const querySnapshot = await getDocs(collection(db, "clients"));
            const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast({ title: "Erro ao carregar clientes", variant: "destructive" });
        } finally {
            setLoadingClients(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateClient = async () => {
        if (!newClientName.trim()) {
            toast({ title: "Nome inválido", description: "O nome do cliente não pode estar em branco.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        const newClientId = crypto.randomUUID();
        try {
            const newClientData = { 
                id: newClientId, 
                name: newClientName, 
                status: 'pending',
                startDate: format(new Date(), 'yyyy-MM-dd'),
                briefing: {},
                reports: [],
                contentPlanner: [],
            };
            await setDoc(doc(db, 'clients', newClientId), newClientData);
            toast({ title: "Cliente Adicionado!", description: `${newClientName} foi adicionado à base de dados.`});
            setIsClientDialogOpen(false);
            setNewClientName('');
            await fetchClients(); // Refresh list
        } catch (error) {
            console.error("Error creating client:", error);
            toast({ title: "Erro ao criar cliente", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    // Function to update accumulated recordings based on the current month
    const updateAccumulatedRecordings = async (client: Client): Promise<Client> => {
        if (!client.podcastPlan) return client;

        const lastUpdatedMonth = startOfMonth(new Date(client.podcastPlan.lastUpdated));
        const currentMonth = startOfMonth(new Date());

        if (currentMonth > lastUpdatedMonth) {
            const monthsDiff = (currentMonth.getFullYear() - lastUpdatedMonth.getFullYear()) * 12 + (currentMonth.getMonth() - lastUpdatedMonth.getMonth());
            const newAccumulated = client.podcastPlan.accumulatedRecordings + (client.podcastPlan.recordingsPerMonth * monthsDiff);
            
            const updatedClient = {
                ...client,
                podcastPlan: {
                    ...client.podcastPlan,
                    accumulatedRecordings: newAccumulated,
                    lastUpdated: currentMonth.toISOString(),
                }
            };

            const clientDocRef = doc(db, 'clients', client.id);
            await updateDoc(clientDocRef, { podcastPlan: updatedClient.podcastPlan });
            
            toast({ title: "Saldo atualizado!", description: `O saldo de ${client.name} foi atualizado para o mês atual.`});
            return updatedClient;
        }
        return client;
    };


    const handleClientChange = async (clientId: string) => {
        if (!clientId) {
          setSelectedClient(null);
          return;
        }
        const clientData = clients.find(c => c.id === clientId);
        if (clientData) {
            if (clientData.podcastPlan) {
                const updatedClient = await updateAccumulatedRecordings(clientData);
                setSelectedClient(updatedClient);
            } else {
                 setSelectedClient(clientData);
            }
        }
    };

    const handleOpenPlanDialog = () => {
        if(selectedClient?.podcastPlan) {
            setRecordingsPerMonth(selectedClient.podcastPlan.recordingsPerMonth);
        } else {
            setRecordingsPerMonth(0);
        }
        setIsPlanDialogOpen(true);
    };

    const handleSavePlan = async () => {
        if (!selectedClient || recordingsPerMonth <= 0) {
            toast({ title: "Dados inválidos", description: "Selecione um cliente e um número de gravações válido.", variant: "destructive" });
            return;
        }

        const newPlan: PodcastPlan = {
            recordingsPerMonth: recordingsPerMonth,
            accumulatedRecordings: selectedClient.podcastPlan?.accumulatedRecordings || recordingsPerMonth,
            lastUpdated: startOfMonth(new Date()).toISOString()
        };
        
        const clientDocRef = doc(db, 'clients', selectedClient.id);
        await updateDoc(clientDocRef, { podcastPlan: newPlan });

        const updatedClient = { ...selectedClient, podcastPlan: newPlan };
        setSelectedClient(updatedClient);
        setClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));

        toast({ title: "Plano Salvo!", description: `Plano de podcast para ${selectedClient.name} foi salvo.` });
        setIsPlanDialogOpen(false);
    };

    const handleSaveSchedule = async () => {
        if (!selectedClient || !scheduleDate || !scheduleTime) {
             toast({ title: "Dados inválidos", description: "Preencha todos os campos para agendar.", variant: "destructive" });
            return;
        }
        if (!selectedClient.podcastPlan || selectedClient.podcastPlan.accumulatedRecordings <= 0) {
             toast({ title: "Saldo insuficiente", description: `${selectedClient.name} não possui gravações disponíveis.`, variant: "destructive" });
            return;
        }

        // TODO: Add logic to check for schedule conflicts

        // Create new schedule and deduct from accumulated
        const newSchedule: Omit<Schedule, 'id'> = {
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            date: format(scheduleDate, 'yyyy-MM-dd'),
            time: scheduleTime,
        };

        const docRef = await addDoc(collection(db, "schedules"), newSchedule);
        setSchedules(prev => [...prev, { id: docRef.id, ...newSchedule }]);

        const newAccumulated = selectedClient.podcastPlan.accumulatedRecordings - 1;
        const clientDocRef = doc(db, 'clients', selectedClient.id);
        await updateDoc(clientDocRef, { "podcastPlan.accumulatedRecordings": newAccumulated });
        setSelectedClient(prev => prev ? {...prev, podcastPlan: {...prev.podcastPlan!, accumulatedRecordings: newAccumulated}} : null);

        toast({ title: "Agendamento Criado!", description: `Uma gravação foi agendada e debitada do saldo de ${selectedClient.name}.` });
        setIsScheduleDialogOpen(false);
        setScheduleDate(new Date());
        setScheduleTime('');
    };


    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Cliente</CardTitle>
                    <CardDescription>Escolha um cliente para gerenciar ou adicione um novo cliente de podcast.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-center">
                    {loadingClients ? (<Skeleton className="h-10 flex-1" />) : (
                        <Select onValueChange={handleClientChange} value={selectedClient?.id || ''}>
                            <SelectTrigger className="flex-1"><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                            <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
                        </Select>
                    )}
                    <Button variant="outline" onClick={() => setIsClientDialogOpen(true)}><PlusCircle className="mr-2"/> Adicionar Cliente</Button>
                </CardContent>
            </Card>

            {selectedClient && (
                <div className='grid md:grid-cols-3 gap-8'>
                    <div className='md:col-span-1 space-y-8'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Plano do Cliente</span>
                                    <Button variant="ghost" size="sm" onClick={handleOpenPlanDialog}>{selectedClient.podcastPlan ? 'Editar' : 'Criar Plano'}</Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-baseline p-3 rounded-lg bg-muted">
                                    <Label className="flex items-center gap-2"><Users/> Gravações / Mês</Label>
                                    <span className="text-2xl font-bold">{selectedClient.podcastPlan?.recordingsPerMonth || 0}</span>
                                </div>
                                 <div className="flex justify-between items-baseline p-3 rounded-lg bg-muted">
                                    <Label className="flex items-center gap-2"><Package/> Saldo Acumulado</Label>
                                    <span className="text-2xl font-bold">{selectedClient.podcastPlan?.accumulatedRecordings || 0}</span>
                                </div>
                                <Button className="w-full" onClick={() => setIsScheduleDialogOpen(true)} disabled={!selectedClient.podcastPlan || selectedClient.podcastPlan.accumulatedRecordings <= 0}>
                                    <CalendarPlus className="mr-2"/> Agendar Gravação
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='md:col-span-2'>
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Agenda Geral de Podcasts</span>
                                    <Button variant="outline" size="sm"><ChevronsUpDown className="mr-2"/>Ver Agenda do Cliente</Button>
                                </CardTitle>
                                <CardDescription>Visão geral de todos os agendamentos para evitar conflitos.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <Calendar
                                    mode="month"
                                    className="rounded-md border"
                                />
                             </CardContent>
                        </Card>
                    </div>
                </div>
            )}

             {/* Dialog to add new client */}
            <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Cliente para Podcast</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="new-client-name">Nome do Cliente</Label>
                        <Input 
                            id="new-client-name" 
                            value={newClientName} 
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="Ex: Podcast de Sucesso"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsClientDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateClient} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Adicionar Cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog to set/edit plan */}
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Definir Plano de Podcast para {selectedClient?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="recordings">Gravações por Mês</Label>
                        <Input 
                            id="recordings" 
                            type="number" 
                            value={recordingsPerMonth} 
                            onChange={(e) => setRecordingsPerMonth(Number(e.target.value))}
                            placeholder="Ex: 4"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPlanDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSavePlan}>Salvar Plano</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Dialog to create schedule */}
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agendar Gravação para {selectedClient?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduleDate ? format(scheduleDate, "PPP") : <span>Escolha uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus/>
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Horário</Label>
                            <Input id="time" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsScheduleDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveSchedule}>Confirmar Agendamento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

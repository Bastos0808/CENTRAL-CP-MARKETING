
"use client";

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, Calendar as CalendarIcon, Users, Package, CalendarPlus, ChevronsUpDown, Mic, Moon, Sun } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { format, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface PodcastPlan {
    recordingsPerMonth: number;
    accumulatedRecordings: number;
    lastUpdated: string; // ISO string for the month this was last updated
    canRecordAtNight: 'sim' | 'nao';
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
    const [podcastClients, setPodcastClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [recordingsPerMonth, setRecordingsPerMonth] = useState(0);
    const [canRecordAtNight, setCanRecordAtNight] = useState<'sim' | 'nao'>('nao');
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
            const q = query(collection(db, "clients"), where("podcastPlan", "!=", null));
            const querySnapshot = await getDocs(q);
            const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
            setPodcastClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast({ title: "Erro ao carregar clientes", variant: "destructive" });
        } finally {
            setLoadingClients(false);
        }
    };

    const fetchSchedules = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "schedules"));
            const schedulesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
            setSchedules(schedulesData);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast({ title: "Erro ao carregar agendamentos", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchClients();
        fetchSchedules();
    }, []);

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
        setLoadingClients(true);
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        if (clientDoc.exists()) {
            const clientData = { id: clientDoc.id, ...clientDoc.data() } as Client;
             if (clientData.podcastPlan) {
                const updatedClient = await updateAccumulatedRecordings(clientData);
                setSelectedClient(updatedClient);
            } else {
                 setSelectedClient(clientData);
            }
        }
        setLoadingClients(false);
    };

    const handleOpenPlanDialog = () => {
        if(selectedClient?.podcastPlan) {
            setRecordingsPerMonth(selectedClient.podcastPlan.recordingsPerMonth);
            setCanRecordAtNight(selectedClient.podcastPlan.canRecordAtNight);
        } else {
            setRecordingsPerMonth(0);
            setCanRecordAtNight('nao');
        }
        setIsPlanDialogOpen(true);
    };

    const handleSavePlan = async () => {
        if (!selectedClient || recordingsPerMonth <= 0) {
            toast({ title: "Dados inválidos", description: "Selecione um cliente e um número de gravações válido.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            const newPlan: PodcastPlan = {
                recordingsPerMonth: recordingsPerMonth,
                accumulatedRecordings: selectedClient.podcastPlan?.accumulatedRecordings ?? recordingsPerMonth, // Use existing balance or new value
                lastUpdated: selectedClient.podcastPlan?.lastUpdated ?? startOfMonth(new Date()).toISOString(),
                canRecordAtNight: canRecordAtNight,
            };
            
            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { podcastPlan: newPlan });

            const updatedClient = { ...selectedClient, podcastPlan: newPlan };
            setSelectedClient(updatedClient);
            
            // Update client in the local list
            setPodcastClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));

            toast({ title: "Plano Salvo!", description: `Plano de podcast para ${selectedClient.name} foi atualizado.` });
            setIsPlanDialogOpen(false);
        } catch (error) {
             console.error("Error saving plan:", error);
             toast({ title: "Erro ao salvar plano", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
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
        setIsSubmitting(true);

        try {
            const newScheduleData: Omit<Schedule, 'id'> = {
                clientId: selectedClient.id,
                clientName: selectedClient.name,
                date: format(scheduleDate, 'yyyy-MM-dd'),
                time: scheduleTime,
            };

            const docRef = await addDoc(collection(db, "schedules"), newScheduleData);
            setSchedules(prev => [...prev, { id: docRef.id, ...newScheduleData }]);

            const newAccumulated = selectedClient.podcastPlan.accumulatedRecordings - 1;
            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { "podcastPlan.accumulatedRecordings": newAccumulated });
            
            const updatedClient = {...selectedClient, podcastPlan: {...selectedClient.podcastPlan!, accumulatedRecordings: newAccumulated}};

            setSelectedClient(updatedClient);
            setPodcastClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));


            toast({ title: "Agendamento Criado!", description: `Uma gravação foi agendada e debitada do saldo de ${selectedClient.name}.` });
            setIsScheduleDialogOpen(false);
            setScheduleDate(new Date());
            setScheduleTime('');
        } catch(e) {
             console.error("Error creating schedule:", e);
             toast({ title: "Erro ao agendar", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Cliente</CardTitle>
                    <CardDescription>Escolha um cliente de podcast para gerenciar.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-center">
                    {loadingClients ? (<Skeleton className="h-10 flex-1" />) : (
                        <Select onValueChange={handleClientChange} value={selectedClient?.id || ''}>
                            <SelectTrigger className="flex-1"><SelectValue placeholder="Escolha um cliente com plano de podcast..." /></SelectTrigger>
                            <SelectContent>{podcastClients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
                        </Select>
                    )}
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
                                    <Label className="flex items-center gap-2"><Mic/> Gravações / Mês</Label>
                                    <span className="text-2xl font-bold">{selectedClient.podcastPlan?.recordingsPerMonth || 0}</span>
                                </div>
                                 <div className="flex justify-between items-baseline p-3 rounded-lg bg-muted">
                                    <Label className="flex items-center gap-2"><Package/> Saldo Acumulado</Label>
                                    <span className="text-2xl font-bold">{selectedClient.podcastPlan?.accumulatedRecordings || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                                    <Label className="flex items-center gap-2">Pode Gravar à Noite?</Label>
                                    <Badge variant={selectedClient.podcastPlan?.canRecordAtNight === 'sim' ? 'default' : 'secondary'}>
                                        {selectedClient.podcastPlan?.canRecordAtNight === 'sim' ? <Moon className='mr-2' /> : <Sun className='mr-2' />}
                                        {selectedClient.podcastPlan?.canRecordAtNight === 'sim' ? 'Sim' : 'Não'}
                                    </Badge>
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
                                    locale={ptBR}
                                    className="rounded-md border"
                                />
                             </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Dialog to set/edit plan */}
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Definir Plano de Podcast para {selectedClient?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className='space-y-2'>
                            <Label htmlFor="recordings">Gravações por Mês</Label>
                            <Input 
                                id="recordings" 
                                type="number" 
                                value={recordingsPerMonth} 
                                onChange={(e) => setRecordingsPerMonth(Number(e.target.value))}
                                placeholder="Ex: 4"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pode gravar à noite?</Label>
                            <RadioGroup 
                                onValueChange={(value: 'sim' | 'nao') => setCanRecordAtNight(value)} 
                                value={canRecordAtNight}
                                className="flex items-center gap-4"
                            >
                                <div className='flex items-center space-x-2'><RadioGroupItem value="sim" id="night-yes" /><Label htmlFor="night-yes">Sim</Label></div>
                                <div className='flex items-center space-x-2'><RadioGroupItem value="nao" id="night-no" /><Label htmlFor="night-no">Não</Label></div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPlanDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSavePlan} disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                           Salvar Plano
                        </Button>
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
                                        {scheduleDate ? format(scheduleDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus locale={ptBR} />
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
                        <Button onClick={handleSaveSchedule} disabled={isSubmitting}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Agendamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

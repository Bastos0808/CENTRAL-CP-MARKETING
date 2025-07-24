
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, Mic, Package, Calendar } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { startOfToday, startOfMonth, isBefore } from 'date-fns';

interface PodcastPlan {
    recordingsPerMonth: number;
    accumulatedRecordings: number;
    paymentDay: number;
    lastCreditUpdate: string; // ISO string
}
interface Client {
  id: string;
  name: string;
  podcastPlan?: PodcastPlan;
}

export default function PodcastManager() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [recordingsPerMonth, setRecordingsPerMonth] = useState(0);
    const [paymentDay, setPaymentDay] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

    // Fetch all clients with podcastPlan
    const fetchClients = async () => {
        setLoadingClients(true);
        try {
            const q = query(collection(db, "clients"), where("podcastPlan", "!=", null));
            const querySnapshot = await getDocs(q);
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

    // Function to update accumulated recordings based on the current month
    const updateAccumulatedRecordings = async (client: Client): Promise<Client> => {
        if (!client.podcastPlan) return client;

        const { paymentDay, lastCreditUpdate, recordingsPerMonth } = client.podcastPlan;
        const today = startOfToday();
        const lastUpdateDate = new Date(lastCreditUpdate);
        const thisMonthCreditCycleDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);

        // Check if today is past the payment day for this month, and if the last update was before this month's cycle date
        if (isBefore(thisMonthCreditCycleDate, today) && isBefore(lastUpdateDate, thisMonthCreditCycleDate)) {
             const newAccumulated = client.podcastPlan.accumulatedRecordings + recordingsPerMonth;
            
            const updatedClient = {
                ...client,
                podcastPlan: {
                    ...client.podcastPlan,
                    accumulatedRecordings: newAccumulated,
                    lastCreditUpdate: today.toISOString(),
                }
            };

            const clientDocRef = doc(db, 'clients', client.id);
            await updateDoc(clientDocRef, { podcastPlan: updatedClient.podcastPlan });
            
            toast({ title: "Saldo atualizado!", description: `Créditos de ${client.name} foram renovados para o ciclo atual.`});
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
            setPaymentDay(selectedClient.podcastPlan.paymentDay);
        } else {
            setRecordingsPerMonth(0);
            setPaymentDay(1);
        }
        setIsPlanDialogOpen(true);
    };

    const handleSavePlan = async () => {
        if (!selectedClient || recordingsPerMonth <= 0 || paymentDay < 1 || paymentDay > 31) {
            toast({ title: "Dados inválidos", description: "Selecione um cliente, gravações e dia de pagamento válidos.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            const newPlan: PodcastPlan = {
                recordingsPerMonth: recordingsPerMonth,
                accumulatedRecordings: selectedClient.podcastPlan?.accumulatedRecordings ?? recordingsPerMonth,
                paymentDay: paymentDay,
                lastCreditUpdate: selectedClient.podcastPlan?.lastCreditUpdate ?? new Date(1970, 0, 1).toISOString(),
            };
            
            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { podcastPlan: newPlan });

            const updatedClient = { ...selectedClient, podcastPlan: newPlan };
            setSelectedClient(updatedClient);
            
            setClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));

            toast({ title: "Plano Salvo!", description: `Plano de podcast para ${selectedClient.name} foi atualizado.` });
            setIsPlanDialogOpen(false);
        } catch (error) {
             console.error("Error saving plan:", error);
             toast({ title: "Erro ao salvar plano", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRegisterRecording = async () => {
        if (!selectedClient?.podcastPlan || selectedClient.podcastPlan.accumulatedRecordings <= 0) {
            toast({ title: "Saldo Insuficiente", description: "O cliente não tem créditos de gravação disponíveis.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        try {
            const newAccumulated = selectedClient.podcastPlan.accumulatedRecordings - 1;
            const updatedPlan = { ...selectedClient.podcastPlan, accumulatedRecordings: newAccumulated };

            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { podcastPlan: updatedPlan });

            const updatedClient = { ...selectedClient, podcastPlan: updatedPlan };
            setSelectedClient(updatedClient);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));

            toast({ title: "Gravação Registrada!", description: `Um crédito foi debitado do saldo de ${selectedClient.name}.`});
        } catch(error) {
             console.error("Error registering recording:", error);
             toast({ title: "Erro ao registrar gravação", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Cliente</CardTitle>
                    <CardDescription>Escolha um cliente de podcast para gerenciar os créditos de gravação.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-center">
                    {loadingClients ? (<Skeleton className="h-10 flex-1" />) : (
                        <Select onValueChange={handleClientChange} value={selectedClient?.id || ''}>
                            <SelectTrigger className="flex-1"><SelectValue placeholder="Escolha um cliente com plano de podcast..." /></SelectTrigger>
                            <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
                        </Select>
                    )}
                </CardContent>
            </Card>

            {selectedClient && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Plano e Créditos de {selectedClient.name}</span>
                            <Button variant="outline" size="sm" onClick={handleOpenPlanDialog}>
                                {selectedClient.podcastPlan ? 'Editar Plano' : 'Criar Plano'}
                            </Button>
                        </CardTitle>
                        <CardDescription>Gerencie o plano mensal e o saldo de gravações do cliente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted border">
                                <Label className="flex items-center gap-2"><Mic/> Gravações / Mês</Label>
                                <span className="text-2xl font-bold">{selectedClient.podcastPlan?.recordingsPerMonth || 0}</span>
                            </div>
                            <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted border">
                                <Label className="flex items-center gap-2"><Package/> Saldo de Gravações</Label>
                                <span className="text-2xl font-bold">{selectedClient.podcastPlan?.accumulatedRecordings || 0}</span>
                            </div>
                             <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted border">
                                <Label className="flex items-center gap-2"><Calendar/> Dia de Renovação</Label>
                                <span className="text-2xl font-bold">{selectedClient.podcastPlan ? `Todo dia ${selectedClient.podcastPlan.paymentDay}` : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                             <Button 
                                size="lg" 
                                onClick={handleRegisterRecording} 
                                disabled={isSubmitting || !selectedClient.podcastPlan || selectedClient.podcastPlan.accumulatedRecordings <= 0}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Registrar Gravação Utilizada
                            </Button>
                        </div>
                    </CardContent>
                </Card>
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
                        <div className='space-y-2'>
                            <Label htmlFor="paymentDay">Dia do Pagamento para Renovação dos Créditos</Label>
                            <Input 
                                id="paymentDay" 
                                type="number"
                                min="1"
                                max="31"
                                value={paymentDay} 
                                onChange={(e) => setPaymentDay(Number(e.target.value))}
                                placeholder="Ex: 10"
                            />
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
        </div>
    );
}

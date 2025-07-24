
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, Mic, Package, Calendar, DollarSign, RefreshCw, BookMarked } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  podcastPlan?: PodcastPlan;
}

export default function PodcastManager() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loadingClients, setLoadingClients] = useState(true);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [isAdvancePaymentDialogOpen, setIsAdvancePaymentDialogOpen] = useState(false);
    const [isRegisterRecordingDialogOpen, setIsRegisterRecordingDialogOpen] = useState(false);
    
    const [recordingDate, setRecordingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [advanceCredits, setAdvanceCredits] = useState(0);
    const [recordingsPerMonth, setRecordingsPerMonth] = useState(0);
    const [paymentDay, setPaymentDay] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

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
    }, [toast]);


    const handleClientChange = async (clientId: string) => {
        if (!clientId) {
          setSelectedClient(null);
          return;
        }
        setLoadingClients(true);
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        if (clientDoc.exists()) {
            const clientData = { id: clientDoc.id, ...clientDoc.data() } as Client;
            setSelectedClient(clientData);
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
                recordingHistory: selectedClient.podcastPlan?.recordingHistory ?? [],
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
        if (!recordingDate) {
             toast({ title: "Data Inválida", description: "Por favor, selecione a data da gravação.", variant: "destructive"});
            return;
        }

        setIsSubmitting(true);
        try {
            const newAccumulated = selectedClient.podcastPlan.accumulatedRecordings - 1;
            const newRecording: Recording = { id: crypto.randomUUID(), date: recordingDate };
            const updatedHistory = [...(selectedClient.podcastPlan.recordingHistory || []), newRecording];
            
            const updatedPlan = { 
                ...selectedClient.podcastPlan, 
                accumulatedRecordings: newAccumulated,
                recordingHistory: updatedHistory,
            };

            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { "podcastPlan": updatedPlan });

            const updatedClient = { ...selectedClient, podcastPlan: updatedPlan };
            setSelectedClient(updatedClient);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));

            toast({ title: "Gravação Registrada!", description: `Um crédito foi debitado do saldo de ${selectedClient.name}.`});
            setIsRegisterRecordingDialogOpen(false);
        } catch(error) {
             console.error("Error registering recording:", error);
             toast({ title: "Erro ao registrar gravação", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddAdvanceCredits = async () => {
         if (!selectedClient?.podcastPlan || advanceCredits <= 0) {
            toast({ title: "Dados inválidos", description: "Informe um número de créditos válido.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        try {
            const newAccumulated = selectedClient.podcastPlan.accumulatedRecordings + advanceCredits;
            const updatedPlan = { ...selectedClient.podcastPlan, accumulatedRecordings: newAccumulated };

            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { "podcastPlan.accumulatedRecordings": newAccumulated });

            const updatedClient = { ...selectedClient, podcastPlan: updatedPlan };
            setSelectedClient(updatedClient);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
            
            toast({ title: "Créditos Adicionados!", description: `${advanceCredits} créditos foram adicionados ao saldo de ${selectedClient.name}.`});
            setIsAdvancePaymentDialogOpen(false);
            setAdvanceCredits(0);
        } catch(error) {
            console.error("Error adding advance credits:", error);
            toast({ title: "Erro ao adicionar créditos", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualPayment = async () => {
        if (!selectedClient?.podcastPlan) {
             toast({ title: "Cliente sem plano", description: "Este cliente não possui um plano de podcast para renovar.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        try {
            const { accumulatedRecordings, recordingsPerMonth } = selectedClient.podcastPlan;
            const newAccumulated = accumulatedRecordings + recordingsPerMonth;
            
            const updatedPlan = { 
                ...selectedClient.podcastPlan, 
                accumulatedRecordings: newAccumulated,
            };

            const clientDocRef = doc(db, 'clients', selectedClient.id);
            await updateDoc(clientDocRef, { "podcastPlan": updatedPlan });

            const updatedClient = { ...selectedClient, podcastPlan: updatedPlan };
            setSelectedClient(updatedClient);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
            
            toast({ title: "Pagamento Registrado!", description: `Créditos de ${selectedClient.name} renovados com sucesso.`});
        } catch(error) {
            console.error("Error on manual payment:", error);
            toast({ title: "Erro ao registrar pagamento", variant: "destructive" });
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
             <>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Plano e Créditos de {selectedClient.name}</span>
                             <div className='flex items-center gap-2'>
                                <Button variant="outline" size="sm" onClick={handleOpenPlanDialog}>
                                    {selectedClient.podcastPlan ? 'Editar Plano' : 'Criar Plano'}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setIsAdvancePaymentDialogOpen(true)}>
                                    <DollarSign className='mr-2 h-4 w-4' />
                                    Adicionar Créditos Avulsos
                                </Button>
                            </div>
                        </CardTitle>
                        <CardDescription>Gerencie o plano mensal e o saldo de gravações do cliente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted border">
                                <Label className="flex items-center gap-2"><Mic/> Gravações / Mês</Label>
                                <span className="text-2xl font-bold">{selectedClient.podcastPlan?.recordingsPerMonth || 0}</span>
                            </div>
                            <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted border">
                                <Label className="flex items-center gap-2"><Package/> Saldo de Gravações</Label>
                                <span className="text-2xl font-bold">{selectedClient.podcastPlan?.accumulatedRecordings || 0}</span>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg" variant="outline" disabled={isSubmitting || !selectedClient.podcastPlan}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Registrar Pagamento Mensal
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Registrar Pagamento do Ciclo?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação adicionará os créditos mensais ({selectedClient.podcastPlan?.recordingsPerMonth}) ao saldo de {selectedClient.name}. Confirme que o pagamento deste ciclo foi recebido.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleManualPayment}>Confirmar Pagamento</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                             <Button 
                                size="lg" 
                                onClick={() => setIsRegisterRecordingDialogOpen(true)} 
                                disabled={isSubmitting || !selectedClient.podcastPlan || selectedClient.podcastPlan.accumulatedRecordings <= 0}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Registrar Gravação Utilizada
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookMarked />
                            Histórico de Gravações
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Data da Gravação</TableHead>
                                <TableHead className="text-right">ID da Gravação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedClient.podcastPlan?.recordingHistory && selectedClient.podcastPlan.recordingHistory.length > 0 ? (
                                    selectedClient.podcastPlan.recordingHistory
                                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((rec) => (
                                        <TableRow key={rec.id}>
                                            <TableCell className="font-medium">{format(new Date(`${rec.date}T00:00:00`), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">{rec.id}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                        Nenhuma gravação registrada ainda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </>
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
                            <Label htmlFor="paymentDay">Dia do Pagamento para Renovação (Referência)</Label>
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
            
            {/* Dialog to add advance payment */}
            <Dialog open={isAdvancePaymentDialogOpen} onOpenChange={setIsAdvancePaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Créditos Avulsos para {selectedClient?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className='space-y-2'>
                            <Label htmlFor="advance-credits">Quantidade de Créditos</Label>
                            <Input 
                                id="advance-credits" 
                                type="number" 
                                value={advanceCredits} 
                                onChange={(e) => setAdvanceCredits(Number(e.target.value))}
                                placeholder="Ex: 10"
                            />
                        </div>
                         <CardDescription>
                            Esta ação adiciona créditos ao saldo atual sem afetar o ciclo de renovação mensal. Ideal para pagamentos de pacotes extras.
                        </CardDescription>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => { setIsAdvancePaymentDialogOpen(false); setAdvanceCredits(0); }}>Cancelar</Button>
                        <Button onClick={handleAddAdvanceCredits} disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                           Adicionar Créditos
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Dialog to register recording */}
            <Dialog open={isRegisterRecordingDialogOpen} onOpenChange={setIsRegisterRecordingDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Gravação para {selectedClient?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className='space-y-2'>
                            <Label htmlFor="recording-date">Data da Gravação</Label>
                            <Input 
                                id="recording-date" 
                                type="date"
                                value={recordingDate}
                                onChange={(e) => setRecordingDate(e.target.value)}
                            />
                        </div>
                         <CardDescription>
                            Selecionar a data da gravação utilizada irá debitar 1 crédito do saldo do cliente.
                        </CardDescription>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRegisterRecordingDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleRegisterRecording} disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                           Confirmar Registro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

    
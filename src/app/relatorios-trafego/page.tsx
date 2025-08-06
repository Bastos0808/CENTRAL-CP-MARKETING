
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BackButton } from "@/components/ui/back-button";
import TrafficReportGenerator from "@/components/traffic-report-generator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Client {
  id: string;
  name: string;
  briefing?: any;
}

export default function ReportGeneratorPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <BackButton />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Gerador de Relatórios de Tráfego Pago
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecione um cliente, forneça os dados de performance e deixe a IA criar uma análise completa.
          </p>
        </header>
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Cliente</CardTitle>
                    <CardDescription>Para qual cliente este relatório de tráfego se destina?</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <Select onValueChange={handleClientChange} value={selectedClient?.id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </CardContent>
            </Card>
            
            <TrafficReportGenerator client={selectedClient} />
        </div>
      </div>
    </main>
  );
}

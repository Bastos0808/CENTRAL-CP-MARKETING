
"use client";

import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import TrafficReportGenerator from "@/components/traffic-report-generator";
import { Skeleton } from "@/components/ui/skeleton";


interface Client {
  id: string;
  name: string;
  briefing?: any;
}


export default function ReportGeneratorPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId) || null;
    setSelectedClient(client);
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
            Selecione o cliente e envie o CSV da campanha para gerar uma análise de performance com IA.
          </p>
        </header>
        <div className="max-w-2xl mx-auto w-full space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Seleção de Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingClients ? (<Skeleton className="h-10 w-full" />) : (
                        <Select onValueChange={handleClientChange} value={selectedClient?.id || ''}>
                            <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                            <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
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


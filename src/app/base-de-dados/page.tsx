
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { collection, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  responsible: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  startDate: string;
}

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
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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
            <CardDescription>
              {loading ? "Carregando..." : `Total de ${clients.length} clientes.`}
            </CardDescription>
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


"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Briefcase,
  Building,
  Target,
  Users,
  Megaphone,
  Goal,
  DollarSign,
  type LucideIcon,
  Calendar,
  User,
  CheckCircle,
  ClipboardList,
  Info,
  FileText
} from "lucide-react";


interface Client {
  id: string;
  name: string;
  responsible: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  startDate: string;
  briefing: any; 
}

const statusMap: { 
  [key in Client['status']]: { 
    text: string; 
    icon: LucideIcon;
    className: string;
  } 
} = {
    active: { text: "Ativo", icon: CheckCircle, className: "bg-green-500/20 text-green-700 border-green-500/50" },
    pending: { text: "Pendente", icon: Calendar, className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50" },
    inactive: { text: "Inativo", icon: User, className: "bg-red-500/20 text-red-700 border-red-500/50" },
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    return "Data inválida";
  }
};

const InfoCard = ({ title, value, icon: Icon }: { title: string; value?: string; icon: LucideIcon }) => (
    <div className="flex items-start gap-4 rounded-lg bg-background p-4 border">
        <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-md font-semibold text-foreground">{value || "Não informado"}</p>
        </div>
    </div>
);

export default function ClientDossierPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      try {
        const docRef = doc(db, 'clients', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() } as Client);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-6xl">
                 <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                 <Skeleton className="h-6 w-1/2 mx-auto mb-10" />
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-5 w-1/3" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
  }

  if (!client) {
    return notFound();
  }

  const StatusInfo = statusMap[client.status];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            {client.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Dossiê completo do cliente.
          </p>
        </header>

        <section className="mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Resumo do Cliente</CardTitle>
                    <CardDescription>Informações principais e status atual.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="flex items-center gap-4 rounded-lg bg-background p-4 border">
                        <StatusInfo.icon className={`h-6 w-6 ${StatusInfo.className.split(' ')[1]} flex-shrink-0 mt-1`} />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                             <Badge 
                               className={`${StatusInfo.className} text-md`}
                               variant="outline"
                             >
                              {StatusInfo.text}
                            </Badge>
                        </div>
                    </div>
                    <InfoCard title="Plano Contratado" value={client.plan} icon={ClipboardList} />
                    <InfoCard title="Responsável (CP)" value={client.responsible} icon={User} />
                    <InfoCard title="Data de Início" value={formatDate(client.startDate)} icon={Calendar} />
                </CardContent>
            </Card>
        </section>
        
        <section className="mb-8">
          <Card>
            <CardHeader>
                <CardTitle>Briefing Detalhado</CardTitle>
                <CardDescription>Respostas fornecidas no formulário de briefing inicial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Building className="h-5 w-5" />Informações Operacionais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7 border-l-2 border-primary/20">
                        <InfoCard title="Website" value={client.briefing.informacoesOperacionais.website} icon={Info} />
                        <InfoCard title="Telefone" value={client.briefing.informacoesOperacionais.telefone} icon={Info} />
                        <InfoCard title="Email de Contato" value={client.briefing.informacoesOperacionais.emailContato} icon={Info} />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Briefcase className="h-5 w-5" />Negócios e Posicionamento</h3>
                    <div className="space-y-4 pl-7 border-l-2 border-primary/20">
                        <InfoCard title="O que a empresa faz?" value={client.briefing.negociosPosicionamento.descricao} icon={Megaphone} />
                        <InfoCard title="Principal diferencial competitivo" value={client.briefing.negociosPosicionamento.diferencial} icon={Target} />
                        <InfoCard title="Missão, Visão e Valores" value={client.briefing.negociosPosicionamento.missaoValores} icon={Goal} />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Target className="h-5 w-5" />Público e Persona</h3>
                    <div className="space-y-4 pl-7 border-l-2 border-primary/20">
                        <InfoCard title="Público-alvo" value={client.briefing.publicoPersona.publicoAlvo} icon={Users} />
                        <InfoCard title="Persona ideal" value={client.briefing.publicoPersona.persona} icon={User} />
                    </div>
                </div>
                 {/* Add other briefing sections here following the same pattern */}
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardHeader>
                <CardTitle>Relatórios Gerados</CardTitle>
                <CardDescription>Histórico de relatórios de desempenho gerados para este cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-8">
                    <FileText className="mx-auto h-12 w-12" />
                    <p className="mt-4">Nenhum relatório gerado ainda.</p>
                </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </main>
  );
}

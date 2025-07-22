
"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, useRouter } from 'next/navigation';
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
  FileText,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// Simple markdown to HTML converter, can be extracted to utils if used elsewhere
const markdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-primary mt-4 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-primary mt-6 mb-2 border-b pb-1">$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      .replace(/<\/ul>\n<ul>/gim, '')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => (line.startsWith('<')) ? line : `<p class="mb-2 leading-relaxed">${line}</p>`)
      .join('');
    return html.replace(/\\n/g, '<br />');
};

interface Report {
    id: string;
    createdAt: string;
    analysis: string;
}

interface Client {
  id: string;
  name: string;
  responsible: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  startDate: string;
  briefing: any; 
  reports?: Report[];
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Invalid date
        const parts = dateString.split('-');
        if (parts.length === 3) {
            // Assuming YYYY-MM-DD
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return "Data inválida";
    }
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
  const router = useRouter();
  const clientId = use(params).id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleStatusChange = async (newStatus: Client['status']) => {
    if (!client) return;

    const clientDocRef = doc(db, "clients", client.id);

    try {
      await updateDoc(clientDocRef, { status: newStatus });
      setClient(prevClient => prevClient ? { ...prevClient, status: newStatus } : null);
      toast({
        title: "Status Atualizado!",
        description: `O status de ${client.name} foi alterado para "${statusMap[newStatus].text}".`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível salvar a alteração. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    if (!client) return;

    const clientDocRef = doc(db, "clients", client.id);
    const updatedReports = client.reports?.filter(report => report.id !== reportId) || [];

    try {
      await updateDoc(clientDocRef, { reports: updatedReports });
      setClient(prevClient => prevClient ? { ...prevClient, reports: updatedReports } : null);
      toast({
        title: "Relatório Excluído!",
        description: "O relatório foi removido permanentemente do dossiê.",
      });
    } catch (error) {
      console.error("Error deleting report: ", error);
      toast({
        title: "Erro ao Excluir",
        description: "Não foi possível remover o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;

    const clientDocRef = doc(db, "clients", client.id);

    try {
      await deleteDoc(clientDocRef);
      toast({
        title: "Cliente Excluído!",
        description: `${client.name} foi removido permanentemente da base de dados.`,
      });
      router.push('/base-de-dados');
    } catch (error) {
      console.error("Error deleting client: ", error);
      toast({
        title: "Erro ao Excluir Cliente",
        description: "Não foi possível remover o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };


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
  const sortedReports = client.reports?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


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
                    <div className="flex items-start gap-4 rounded-lg bg-background p-4 border">
                        <StatusInfo.icon className={`h-6 w-6 ${StatusInfo.className.split(' ')[1]} flex-shrink-0 mt-1`} />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Select value={client.status} onValueChange={handleStatusChange}>
                                <SelectTrigger className={`w-[140px] focus:ring-0 focus:ring-offset-0 border-0 p-0 h-auto text-md ${StatusInfo.className}`}>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusMap).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <value.icon className="h-4 w-4" />
                                                {value.text}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                {sortedReports && sortedReports.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {sortedReports.map((report) => (
                            <AccordionItem value={report.id} key={report.id}>
                                <div className="flex items-center w-full group">
                                    <AccordionTrigger className='flex-1'>
                                        <div className='flex justify-between items-center w-full pr-4'>
                                            <span className='font-semibold'>Relatório de {format(new Date(report.createdAt), 'dd/MM/yyyy')}</span>
                                            <span className='text-sm text-muted-foreground group-hover:hidden'>Clique para expandir</span>
                                        </div>
                                    </AccordionTrigger>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o relatório
                                                    de <span className="font-semibold">{format(new Date(report.createdAt), 'dd/MM/yyyy')}</span> do dossiê de {client.name}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteReport(report.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Sim, excluir relatório
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </div>
                                <AccordionContent>
                                    <div 
                                      className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/20"
                                      dangerouslySetInnerHTML={{ __html: markdownToHtml(report.analysis) }} 
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <FileText className="mx-auto h-12 w-12" />
                        <p className="mt-4">Nenhum relatório gerado ainda.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </section>

        {client.status === 'inactive' && (
          <section className="mb-8">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Zona de Perigo</CardTitle>
                <CardDescription>Ações irreversíveis relacionadas a este cliente.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Excluir Cliente Permanentemente</h3>
                  <p className="text-sm text-muted-foreground">Todo o dossiê, incluindo briefing e relatórios, será perdido para sempre.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Excluir Cliente</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente <span className="font-semibold">{client.name}</span> e todos os seus dados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteClient}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sim, excluir cliente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </section>
        )}

      </div>
    </main>
  );
}

    

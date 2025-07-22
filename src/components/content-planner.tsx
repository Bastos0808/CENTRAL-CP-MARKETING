
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, CalendarIcon, Edit, Trash2, CalendarDays } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from './ui/calendar';

interface Client {
  id: string;
  name: string;
  contentPlanner?: ContentPost[];
}

interface ContentPost {
  id: string;
  title: string;
  description: string;
  postDate: string; // YYYY-MM-DD
  status: 'idea' | 'production' | 'posted';
  type: 'arte' | 'reels' | 'carrossel';
}

const postSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  postDate: z.string().min(1, "A data de postagem é obrigatória."),
  type: z.enum(['arte', 'reels', 'carrossel'], { required_error: "O tipo é obrigatório." }),
  status: z.enum(['idea', 'production', 'posted']),
});

type PostFormValues = z.infer<typeof postSchema>;

const statusMap = {
  idea: { title: '💡 Ideias', className: 'bg-blue-500/10' },
  production: { title: '📋 Em Produção', className: 'bg-yellow-500/10' },
  posted: { title: '✅ Postado', className: 'bg-green-500/10' },
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = parseISO(`${dateString}T00:00:00`);
        return format(date, 'dd/MM/yyyy');
    } catch {
        return dateString;
    }
}

export default function ContentPlanner() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { toast } = useToast();
  const { control, handleSubmit, reset } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "", description: "", postDate: "", type: "arte", status: 'idea',
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        setClients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
      } catch (error) {
        toast({ title: "Erro ao carregar clientes", variant: "destructive" });
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [toast]);

  const handleClientChange = async (clientId: string) => {
    if (!clientId) {
      setSelectedClient(null);
      return;
    }
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    if (clientDoc.exists()) {
      setSelectedClient({ id: clientDoc.id, ...clientDoc.data() } as Client);
    }
  };
  
  const sortedPosts = useMemo(() => {
    if (!selectedClient?.contentPlanner) return {};
    return (selectedClient.contentPlanner || []).sort((a,b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime()).reduce((acc, post) => {
        const status = post.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(post);
        return acc;
    }, {} as Record<ContentPost['status'], ContentPost[]>);
  }, [selectedClient?.contentPlanner]);
  
  const scheduledDates = useMemo(() => {
      return (selectedClient?.contentPlanner || []).map(p => parseISO(`${p.postDate}T00:00:00`));
  }, [selectedClient?.contentPlanner]);

  const postsOnSelectedDate = useMemo(() => {
    if (!selectedDate || !selectedClient?.contentPlanner) return [];
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return selectedClient.contentPlanner.filter(p => p.postDate === formattedSelectedDate);
  }, [selectedDate, selectedClient?.contentPlanner]);


  const openEditDialog = (post: ContentPost) => {
    setEditingPost(post);
    reset({ ...post });
    setIsDialogOpen(true);
  };
  
  const openNewDialog = (status: ContentPost['status']) => {
      setEditingPost(null);
      reset({ title: "", description: "", postDate: "", type: "arte", status: status });
      setIsDialogOpen(true);
  }

  const onSubmit = async (data: PostFormValues) => {
    if (!selectedClient) return;
    setIsSubmitting(true);

    const clientDocRef = doc(db, 'clients', selectedClient.id);
    
    try {
        let updatedPlanner = [...(selectedClient.contentPlanner || [])];
        if (editingPost) {
            updatedPlanner = updatedPlanner.map(p => p.id === editingPost.id ? { ...editingPost, ...data } : p);
        } else {
            updatedPlanner.push({ id: crypto.randomUUID(), ...data });
        }

        await updateDoc(clientDocRef, { contentPlanner: updatedPlanner });
        setSelectedClient(prev => prev ? { ...prev, contentPlanner: updatedPlanner } : null);
        toast({ title: `Post ${editingPost ? 'Atualizado' : 'Adicionado'}!`, description: `Salvo em ${selectedClient.name}.` });
        setIsDialogOpen(false);
        reset();
    } catch (error) {
        toast({ title: "Erro ao salvar post", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDeletePost = async (postId: string) => {
      if (!selectedClient) return;
      const updatedPlanner = selectedClient.contentPlanner?.filter(p => p.id !== postId) || [];
      const clientDocRef = doc(db, 'clients', selectedClient.id);
      
      try {
          await updateDoc(clientDocRef, { contentPlanner: updatedPlanner });
          setSelectedClient(prev => prev ? { ...prev, contentPlanner: updatedPlanner } : null);
          toast({ title: "Post Excluído!", description: "O post foi removido do planner." });
      } catch (error) {
          toast({ title: "Erro ao excluir post", variant: "destructive" });
      }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Seleção de Cliente</CardTitle>
          <CardDescription>Escolha um cliente para gerenciar o planner de conteúdo.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingClients ? (<Skeleton className="h-10 w-full" />) : (
            <Select onValueChange={handleClientChange}>
              <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
              <SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}</SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {Object.entries(statusMap).map(([statusKey, statusValue]) => (
                  <Card key={statusKey} className={`min-h-[200px] flex flex-col ${statusValue.className}`}>
                      <CardHeader>
                          <CardTitle className="text-lg">{statusValue.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col">
                          <div className='flex-1 space-y-4'>
                            {(sortedPosts[statusKey as ContentPost['status']] || []).map(post => (
                              <Card key={post.id} className="p-3 bg-background/80 backdrop-blur-sm group shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start">
                                      <p className="font-semibold text-sm flex-1 pr-2">{post.title}</p>
                                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(post)}><Edit className="h-3 w-3" /></Button>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-3 w-3" /></Button>
                                      </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                                  <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <CalendarIcon className="h-3.5 w-3.5" />
                                          <span>{formatDate(post.postDate)}</span>
                                      </div>
                                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.type}</span>
                                  </div>
                              </Card> 
                            ))}
                          </div>
                          <Button variant="outline" className="w-full mt-4 bg-background/50" onClick={() => openNewDialog(statusKey as ContentPost['status'])}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Adicionar Post
                          </Button>
                      </CardContent>
                  </Card>
              ))}
          </div>

          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays /> Visão Mensal</CardTitle>
                  <CardDescription>Navegue pelo calendário para ver os posts agendados.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className='md:col-span-2'>
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border p-0"
                      locale={ptBR}
                      modifiers={{ scheduled: scheduledDates }}
                      modifiersClassNames={{ scheduled: 'bg-primary/20 rounded-md' }}
                  />
                </div>
                <div className='space-y-4'>
                  <h3 className='font-semibold'>
                      Posts para {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '...'}
                  </h3>
                  <div className='space-y-3'>
                    {postsOnSelectedDate.length > 0 ? (
                      postsOnSelectedDate.map(post => (
                          <div key={post.id} className="p-3 border rounded-md bg-muted/30">
                              <p className="font-semibold text-sm">{post.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{post.description}</p>
                              <div className='flex justify-between items-center mt-2'>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.type}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMap[post.status].className}`}>{statusMap[post.status].title}</span>
                              </div>
                          </div>
                      ))
                    ) : (
                      <p className='text-sm text-muted-foreground text-center py-4'>Nenhum post para esta data.</p>
                    )}
                  </div>
                </div>
              </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingPost ? 'Editar Post' : 'Adicionar Novo Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <Controller name="title" control={control} render={({ field }) => (<div><Label>Título</Label><Input {...field} placeholder="Ex: Lançamento da nova coleção"/></div>)} />
                <Controller name="description" control={control} render={({ field }) => (<div><Label>Descrição</Label><Textarea {...field} placeholder="Detalhes do post, texto da legenda, etc."/></div>)} />
                <Controller name="postDate" control={control} render={({ field }) => (<div><Label>Data de Postagem</Label><Input type="date" {...field} /></div>)} />
                <div className='grid grid-cols-2 gap-4'>
                    <Controller name="type" control={control} render={({ field }) => (
                        <div>
                            <Label>Tipo</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="arte">Arte</SelectItem>
                                    <SelectItem value="reels">Reels</SelectItem>
                                    <SelectItem value="carrossel">Carrossel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )} />
                    <Controller name="status" control={control} render={({ field }) => (
                        <div>
                            <Label>Status</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusMap).map(([key, val]) => (
                                        <SelectItem key={key} value={key}>{val.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingPost ? 'Salvar Alterações' : 'Adicionar Post'}
                    </Button>
                </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}

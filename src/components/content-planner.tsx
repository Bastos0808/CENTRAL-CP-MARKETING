
"use client";

import { useEffect, useState, useMemo, type DragEvent } from 'react';
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
import { PlusCircle, Loader2, CalendarIcon, Edit, Trash2, CalendarDays, Wand2 } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { generateIdeas } from '@/ai/flows/idea-generator-flow';


interface Client {
  id: string;
  name: string;
  contentPlanner?: ContentPost[];
  reports?: any[];
  briefing?: any;
}

type PostStatus = 'idea' | 'production' | 'posted';

interface ContentPost {
  id: string;
  title: string;
  description: string;
  postDate: string; // YYYY-MM-DD
  status: PostStatus;
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

const statusMap: Record<PostStatus, { title: string; className: string }> = {
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
  const [draggedPost, setDraggedPost] = useState<ContentPost | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<PostStatus | null>(null);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());


  const { toast } = useToast();
  const { control, handleSubmit, reset, setValue, watch } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "", description: "", postDate: format(new Date(), 'yyyy-MM-dd'), type: "arte", status: 'idea',
    }
  });

  const postType = watch('type');

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
    }, {} as Record<PostStatus, ContentPost[]>);
  }, [selectedClient?.contentPlanner]);
  
  const postsByDate = useMemo(() => {
      const postsMap: { [key: string]: ContentPost[] } = {};
      (selectedClient?.contentPlanner || []).forEach(post => {
          if (!postsMap[post.postDate]) {
              postsMap[post.postDate] = [];
          }
          postsMap[post.postDate].push(post);
      });
      return postsMap;
  }, [selectedClient?.contentPlanner]);


  const openEditDialog = (post: ContentPost) => {
    setEditingPost(post);
    reset({ ...post });
    setIsDialogOpen(true);
  };
  
  const openNewDialog = (status: ContentPost['status']) => {
      setEditingPost(null);
      reset({ title: "", description: "", postDate: format(new Date(), 'yyyy-MM-dd'), type: "arte", status: status });
      setIsDialogOpen(true);
  }

  const handleGenerateIdea = async () => {
      if (!selectedClient) return;
      setIsGeneratingIdea(true);
      try {
          const result = await generateIdeas({
            briefing: selectedClient.briefing,
            reports: selectedClient.reports,
            postType,
          });

          setValue('title', result.idea.title);
          setValue('description', result.idea.description);

          toast({ title: "Ideia Gerada!", description: "Os campos de título e descrição foram preenchidos." });

      } catch (error) {
          console.error(error);
          toast({ title: "Erro ao gerar ideia", description: "A IA não conseguiu gerar a ideia. Tente novamente.", variant: "destructive" });
      } finally {
          setIsGeneratingIdea(false);
      }
  };


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
  
  const DayContent = ({ date }: { date: Date }) => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const posts = postsByDate[formattedDate];
      const hasPosts = posts && posts.length > 0;

      if (!hasPosts) {
          return <div className="h-full w-full p-1 text-center">{format(date, 'd')}</div>;
      }

      return (
          <Popover>
              <PopoverTrigger asChild>
                  <div className="h-full w-full p-1 text-center cursor-pointer rounded-md hover:bg-accent relative">
                      {format(date, 'd')}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                          {posts.slice(0, 3).map(post => (
                              <div key={post.id} className="h-1.5 w-1.5 rounded-full bg-primary" />
                          ))}
                      </div>
                  </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                  <div className="space-y-4">
                      <h4 className="font-semibold">Posts para {format(date, 'dd/MM/yyyy')}</h4>
                      <div className="space-y-3">
                          {posts.map(post => (
                              <div key={post.id} className="p-3 border rounded-md bg-muted/30">
                                  <p className="font-semibold text-sm">{post.title}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{post.description}</p>
                                  <div className='flex justify-between items-center mt-2'>
                                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.type}</span>
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMap[post.status].className}`}>{statusMap[post.status].title.split(' ')[1]}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </PopoverContent>
          </Popover>
      );
  };
  
  // Drag and Drop Handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, post: ContentPost) => {
      setDraggedPost(post);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, status: PostStatus) => {
      e.preventDefault();
      setDragOverColumn(status);
  };

  const handleDragLeave = () => {
      setDragOverColumn(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, newStatus: PostStatus) => {
      e.preventDefault();
      setDragOverColumn(null);
      if (!draggedPost || !selectedClient || draggedPost.status === newStatus) {
          setDraggedPost(null);
          return;
      }

      const updatedPlanner = (selectedClient.contentPlanner || []).map(post => 
          post.id === draggedPost.id ? { ...post, status: newStatus } : post
      );
      
      // Update state immediately for better UX
      setSelectedClient(prev => prev ? { ...prev, contentPlanner: updatedPlanner } : null);
      
      const clientDocRef = doc(db, 'clients', selectedClient.id);
      try {
          await updateDoc(clientDocRef, { contentPlanner: updatedPlanner });
          toast({ title: "Status do Post Atualizado!" });
      } catch (error) {
          // Revert state if Firebase update fails
          setSelectedClient(prev => {
              if (!prev) return null;
              const revertedPlanner = (prev.contentPlanner || []).map(post => 
                  post.id === draggedPost.id ? { ...post, status: draggedPost.status } : post
              );
              return { ...prev, contentPlanner: revertedPlanner };
          });
          toast({ title: "Erro ao atualizar o post.", variant: "destructive" });
      } finally {
          setDraggedPost(null);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {(Object.keys(statusMap) as PostStatus[]).map((statusKey) => (
                  <Card 
                    key={statusKey} 
                    className={cn(
                        'min-h-[200px] flex flex-col transition-colors', 
                        statusMap[statusKey].className,
                        dragOverColumn === statusKey && 'border-primary border-2'
                    )}
                    onDragOver={(e) => handleDragOver(e, statusKey)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, statusKey)}
                  >
                      <CardHeader className="flex-row justify-between items-center">
                          <CardTitle className="text-lg">{statusMap[statusKey].title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col">
                          <div className='flex-1 space-y-4'>
                            {(sortedPosts[statusKey] || []).map(post => (
                              <Card 
                                key={post.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, post)}
                                onDragEnd={() => setDraggedPost(null)}
                                className={cn(
                                  "p-3 bg-background/80 backdrop-blur-sm group shadow-sm hover:shadow-md transition-shadow cursor-grab",
                                  draggedPost?.id === post.id && 'opacity-50'
                                )}
                              >
                                  <div className="flex justify-between items-start">
                                      <p className="font-semibold text-sm flex-1 pr-2">{post.title}</p>
                                       {post.status === 'idea' && (
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(post)}><Edit className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                      )}
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
            
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Visão Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={currentDate}
                            onSelect={setCurrentDate}
                            month={currentDate}
                            onMonthChange={setCurrentDate}
                            className="rounded-md border p-0"
                            locale={ptBR}
                            components={{
                                Day: DayContent
                            }}
                            classNames={{
                                day_cell: "h-12 w-12"
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
          </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingPost ? 'Editar Post' : 'Adicionar Novo Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <Controller name="title" control={control} render={({ field }) => (<div><Label>Título</Label><Input {...field} placeholder="Ex: Lançamento da nova coleção"/></div>)} />
                <Controller name="description" control={control} render={({ field }) => (<div><Label>Descrição</Label><Textarea {...field} placeholder="Detalhes do post, texto da legenda, etc."/></div>)} />
                <div className="flex justify-end -mt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleGenerateIdea} disabled={isGeneratingIdea}>
                       {isGeneratingIdea ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                       Gerar com IA
                    </Button>
                </div>
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
                                    {(Object.keys(statusMap) as PostStatus[]).map((key) => (
                                        <SelectItem key={key} value={key}>{statusMap[key].title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )} />
                </div>
                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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


"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';

interface Client {
  id: string;
  name: string;
  contentPlanner?: ContentPost[];
}

interface ContentPost {
  id: string;
  title: string;
  description: string;
  postDate: string;
  status: 'idea' | 'todo' | 'doing' | 'done';
  type: 'arte' | 'reels' | 'carrossel';
}

const postSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  postDate: z.string().min(1, "A data de postagem é obrigatória."),
  type: z.enum(['arte', 'reels', 'carrossel'], { required_error: "O tipo é obrigatório." }),
  status: z.enum(['idea', 'todo', 'doing', 'done']),
});

type PostFormValues = z.infer<typeof postSchema>;

const statusMap = {
  idea: { title: '💡 Ideias', className: 'bg-blue-500/10' },
  todo: { title: '📋 A Fazer', className: 'bg-yellow-500/10' },
  doing: { title: '⏳ Em Andamento', className: 'bg-orange-500/10' },
  done: { title: '✅ Concluído', className: 'bg-green-500/10' },
};

export default function ContentPlanner() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);

  const { toast } = useToast();
  const { control, handleSubmit, reset, setValue } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      postDate: "",
      type: "arte",
      status: 'idea',
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsData);
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

  const openEditDialog = (post: ContentPost) => {
    setEditingPost(post);
    reset({
        title: post.title,
        description: post.description,
        postDate: post.postDate,
        type: post.type,
        status: post.status,
    });
    setIsDialogOpen(true);
  };
  
  const openNewDialog = (status: ContentPost['status']) => {
      setEditingPost(null);
      reset({
          title: "",
          description: "",
          postDate: "",
          type: "arte",
          status: status,
      });
      setIsDialogOpen(true);
  }

  const onSubmit = async (data: PostFormValues) => {
    if (!selectedClient) return;
    setIsSubmitting(true);

    const clientDocRef = doc(db, 'clients', selectedClient.id);
    
    try {
        let updatedPlanner = [...(selectedClient.contentPlanner || [])];

        if (editingPost) { // Editing existing post
            updatedPlanner = updatedPlanner.map(p => p.id === editingPost.id ? { ...p, ...data } : p);
        } else { // Adding new post
            const newPost: ContentPost = {
                id: crypto.randomUUID(),
                ...data,
            };
            updatedPlanner.push(newPost);
        }

        await updateDoc(clientDocRef, { contentPlanner: updatedPlanner });

        // Update local state
        setSelectedClient(prev => prev ? { ...prev, contentPlanner: updatedPlanner } : null);

        toast({
            title: `Post ${editingPost ? 'Atualizado' : 'Adicionado'}!`,
            description: `O post foi salvo no planner de ${selectedClient.name}.`,
        });
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
          <CardDescription>
            Escolha um cliente para gerenciar o planner de conteúdo.
          </CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {Object.entries(statusMap).map(([statusKey, statusValue]) => (
                <Card key={statusKey} className={`min-h-[200px] ${statusValue.className}`}>
                    <CardHeader>
                        <CardTitle className="text-lg">{statusValue.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedClient.contentPlanner?.filter(p => p.status === statusKey).map(post => (
                           <Card key={post.id} className="p-3 bg-background group">
                               <div className="flex justify-between items-start">
                                    <p className="font-semibold text-sm flex-1 pr-2">{post.title}</p>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(post)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                               </div>
                               <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                               <div className="flex items-center justify-between mt-3">
                                   <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                       <CalendarIcon className="h-3 w-3" />
                                       <span>{post.postDate}</span>
                                   </div>
                                   <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.type}</span>
                               </div>
                           </Card> 
                        ))}
                        <Button variant="outline" className="w-full mt-4" onClick={() => openNewDialog(statusKey as ContentPost['status'])}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Post
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingPost ? 'Editar Post' : 'Adicionar Novo Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller name="title" control={control} render={({ field }) => (<div><Label>Título</Label><Input {...field} /></div>)} />
                <Controller name="description" control={control} render={({ field }) => (<div><Label>Descrição</Label><Textarea {...field} /></div>)} />
                <Controller name="postDate" control={control} render={({ field }) => (<div><Label>Data de Postagem</Label><Input type="date" {...field} /></div>)} />
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


"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, User, Bot, Loader2, PlusCircle, MessageSquare } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { chatWithClientData } from '@/ai/flows/client-chat-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface Conversation {
  id: string;
  startedAt: string; // ISO date string
  messages: ChatMessage[];
}

interface Client {
    id: string;
    name: string;
    briefing?: any;
    reports?: any[];
    chatConversations?: Conversation[];
}

interface ClientChatProps {
    client: Client;
    onConversationsUpdate: (conversations: Conversation[]) => void;
}


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

const initialMessage: ChatMessage = {
    role: 'model',
    content: "Olá! Sou seu assistente de IA. Como posso ajudar com os dados deste cliente hoje? Você pode pedir para eu gerar ideias de conteúdo, resumir o desafio principal ou fazer perguntas sobre o briefing."
}

export default function ClientChat({ client, onConversationsUpdate }: ClientChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingConversations = client.chatConversations || [];
    setConversations(existingConversations);
    if (existingConversations.length > 0) {
      // Select the most recent conversation
      setActiveConversationId(existingConversations.sort((a,b) => parseISO(b.startedAt).getTime() - parseISO(a.startedAt).getTime())[0].id);
    } else {
      // If no conversations, start a new one
      handleNewConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id, client.chatConversations]);


  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({
                    top: scrollAreaRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
  }, [activeConversation?.messages]);

  const handleNewConversation = () => {
    const newId = crypto.randomUUID();
    const newConversation: Conversation = {
        id: newId,
        startedAt: new Date().toISOString(),
        messages: [initialMessage]
    };
    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    setActiveConversationId(newId);
    onConversationsUpdate(updatedConversations); // Notify parent
  }
  
  const saveConversations = useCallback(async (updatedConversations: Conversation[]) => {
    try {
        const clientDocRef = doc(db, 'clients', client.id);
        await updateDoc(clientDocRef, { chatConversations: updatedConversations });
        onConversationsUpdate(updatedConversations);
    } catch (error) {
        console.error("Failed to save conversations:", error);
        toast({ title: "Erro ao Salvar", description: "Não foi possível salvar a conversa no banco de dados.", variant: "destructive" });
    }
  }, [client.id, onConversationsUpdate, toast]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeConversation) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...activeConversation.messages, userMessage];
    
    const updatedConversations = conversations.map(c => 
        c.id === activeConversationId ? { ...c, messages: updatedMessages } : c
    );
    setConversations(updatedConversations);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithClientData({
        client: client,
        history: updatedMessages,
      });
      
      const modelMessage: ChatMessage = { role: 'model', content: response.response };
      
      const finalConversations = conversations.map(c => 
        c.id === activeConversationId ? { ...c, messages: [...updatedMessages, modelMessage] } : c
      );

      setConversations(finalConversations);
      await saveConversations(finalConversations);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao Enviar',
        description: 'Não foi possível obter uma resposta da IA. Tente novamente.',
        variant: 'destructive',
      });
       const revertedConversations = conversations.map(c => 
            c.id === activeConversationId ? { ...c, messages: activeConversation.messages } : c
       );
       setConversations(revertedConversations);
    } finally {
        setIsLoading(false);
    }
  };

  const formatConversationLabel = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "'Conversa de' dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  const sortedConversations = [...conversations].sort((a,b) => parseISO(b.startedAt).getTime() - parseISO(a.startedAt).getTime());

  return (
    <div className="flex flex-col h-[calc(100svh-5rem)]">
        <div className="p-4 border-b flex items-center gap-2">
           <div className="flex-1">
             <Select value={activeConversationId || ''} onValueChange={setActiveConversationId}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conversa..." />
                </SelectTrigger>
                <SelectContent>
                    {sortedConversations.map(conv => (
                        <SelectItem key={conv.id} value={conv.id}>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                {formatConversationLabel(conv.startedAt)}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
           </div>
           <Button variant="outline" size="icon" onClick={handleNewConversation}>
               <PlusCircle className="h-5 w-5"/>
           </Button>
        </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {activeConversation?.messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-lg',
                  message.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-background border'
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: markdownToHtml(message.content) }} />
              </div>
               {message.role === 'user' && (
                <div className="bg-muted text-foreground rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                 <div className="rounded-lg px-4 py-3 bg-background border">
                   <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 flex items-start gap-2 bg-background"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem aqui..."
          className="flex-1 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}

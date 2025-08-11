
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { chatWithClientData } from '@/ai/flows/client-chat-flow';

interface Client {
    id: string;
    name: string;
    briefing?: any;
    reports?: any[];
}

interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
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

const initialMessage: Message = {
    role: 'model',
    content: "Olá! Sou seu assistente de IA. Como posso ajudar com os dados deste cliente hoje? Você pode pedir para eu gerar ideias de conteúdo, resumir o desafio principal ou fazer perguntas sobre o briefing."
}

export default function ClientChat({ client }: { client: Client }) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMessages([initialMessage]); // Reset chat when client changes
  }, [client.id]);

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
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithClientData({
        client: client,
        history: newMessages, // Send the up-to-date history
      });
      
      const modelMessage: Message = { role: 'model', content: response.response };
      setMessages(prevMessages => [...prevMessages, modelMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao Enviar',
        description: 'Não foi possível obter uma resposta da IA. Tente novamente.',
        variant: 'destructive',
      });
       setMessages(messages); // Revert to previous state on error
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100svh-5rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
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

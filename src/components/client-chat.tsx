
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithClientData } from '@/ai/flows/client-chat-flow';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Client {
    id: string;
    name: string;
    briefing?: any;
    reports?: any[];
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

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

export default function ClientChat({ client }: { client: Client }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatWithClientData({
        client,
        history: newMessages,
      });
      const aiMessage: Message = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: 'Erro no Chat',
        description: 'A IA não conseguiu responder. Tente novamente.',
        variant: 'destructive',
      });
       // Remove the user's message if the AI fails
       setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
        />
        <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}

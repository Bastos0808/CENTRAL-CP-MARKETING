
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Briefcase,
  Building,
  Target,
  Users,
  Megaphone,
  Goal,
  DollarSign,
  Send,
  PlusCircle,
  Trash2,
  Camera,
  Loader2,
  Wand2,
  FileText,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { generateBriefingFromTranscript } from "@/ai/flows/briefing-generator-flow";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";


interface Client {
    id: string;
    name: string;
}

const formSchema = z.object({
  informacoesOperacionais: z.object({
    nomeNegocio: z.string().min(1, "Nome do negócio é obrigatório."),
    planoContratado: z.string().optional(),
    observacoesPlano: z.string().optional(),
    redesSociaisAcesso: z.array(z.object({
        plataforma: z.string().min(1, "Plataforma é obrigatória"),
        login: z.string().min(1, "Login é obrigatório"),
        senha: z.string().min(1, "Senha é obrigatória"),
    })).optional(),
    possuiIdentidadeVisual: z.enum(['sim', 'nao'], { required_error: "Selecione uma opção." }).optional(),
    possuiBancoImagens: z.enum(['sim', 'nao'], { required_error: "Selecione uma opção." }).optional(),
    linksRelevantes: z.string().optional(),
  }).optional(),
  negociosPosicionamento: z.object({
    descricao: z.string().optional(),
    diferencial: z.string().optional(),
    missaoValores: z.string().optional(),
    ticketMedio: z.string().optional(),
    maiorDesafio: z.string().optional(),
    erroMercado: z.string().optional(),
  }).optional(),
  publicoPersona: z.object({
    publicoAlvo: z.string().optional(),
    persona: z.string().optional(),
    dores: z.string().optional(),
    duvidasObjecoes: z.string().optional(),
    impedimentoCompra: z.string().optional(),
    canaisUtilizados: z.string().optional(),
  }).optional(),
  concorrenciaMercado: z.object({
    principaisConcorrentes: z.array(z.object({
        name: z.string(),
        perfil: z.string(),
        detalhes: z.string().optional(),
    })).optional(),
    inspiracoesPerfis: z.array(z.object({
        name: z.string(),
        perfil: z.string(),
        detalhes: z.string().optional(),
    })).optional(),
  }).optional(),
  comunicacaoExpectativas: z.object({
    investimentoAnterior: z.string().optional(),
    conteudosPreferidos: z.string().optional(),
    naoFazer: z.string().optional(),
    tomDeVoz: z.string().optional(),
  }).optional(),
  metasObjetivos: z.object({
    objetivoPrincipal: z.string().optional(),
    metasEspecificas: z.string().optional(),
    sazonalidade: z.string().optional(),
    verbaTrafego: z.string().optional(),
  }).optional(),
  equipeMidiaSocial: z.object({
    formatoConteudo: z.string().optional(),
    temasObrigatorios: z.string().optional(),
    disponibilidadeGravacao: z.string().optional(),
    responsavelGravacao: z.string().optional(),
    principaisGatilhos: z.string().optional(),
  }).optional(),
  equipeTrafegoPago: z.object({
    principalProdutoAnunciar: z.string().optional(),
    objetivoCampanhas: z.string().optional(),
    promocaoCondicao: z.string().optional(),
    localVeiculacao: z.string().optional(),
    limiteVerba: z.string().optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  informacoesOperacionais: {
    nomeNegocio: "",
    planoContratado: "",
    observacoesPlano: "",
    redesSociaisAcesso: [],
    possuiIdentidadeVisual: "nao",
    possuiBancoImagens: "nao",
    linksRelevantes: "",
  },
  negociosPosicionamento: {
    descricao: "",
    diferencial: "",
    missaoValores: "",
    ticketMedio: "",
    maiorDesafio: "",
    erroMercado: "",
  },
  publicoPersona: {
    publicoAlvo: "",
    persona: "",
    dores: "",
    duvidasObjecoes: "",
    impedimentoCompra: "",
    canaisUtilizados: "",
  },
  concorrenciaMercado: {
    principaisConcorrentes: [],
    inspiracoesPerfis: [],
  },
  comunicacaoExpectativas: {
    investimentoAnterior: "",
    conteudosPreferidos: "",
    naoFazer: "",
    tomDeVoz: "",
  },
  metasObjetivos: {
    objetivoPrincipal: "",
    metasEspecificas: "",
    sazonalidade: "",
    verbaTrafego: "",
  },
  equipeMidiaSocial: {
    formatoConteudo: "",
    temasObrigatorios: "",
    disponibilidadeGravacao: "",
    responsavelGravacao: "",
    principaisGatilhos: "",
  },
  equipeTrafegoPago: {
    principalProdutoAnunciar: "",
    objetivoCampanhas: "",
    promocaoCondicao: "",
    localVeiculacao: "",
    limiteVerba: "",
  },
};


export default function BriefingForm() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
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
      setSelectedClientId(clientId);
      if (clientId) {
          const clientDocRef = doc(db, 'clients', clientId);
          const clientSnap = await getDoc(clientDocRef);
          if (clientSnap.exists()) {
              const clientData = clientSnap.data();
              // Populate form with existing briefing data or defaults
              const existingBriefing = clientData.briefing || {};
              const initialData = {
                  ...defaultFormValues,
                  ...existingBriefing,
                  informacoesOperacionais: {
                      ...defaultFormValues.informacoesOperacionais,
                      ...(existingBriefing.informacoesOperacionais || {}),
                      nomeNegocio: clientData.name || '',
                      planoContratado: clientData.plan || '',
                  },
                   negociosPosicionamento: {
                      ...defaultFormValues.negociosPosicionamento,
                      ...(existingBriefing.negociosPosicionamento || {}),
                  },
                  publicoPersona: {
                      ...defaultFormValues.publicoPersona,
                      ...(existingBriefing.publicoPersona || {}),
                  },
                  concorrenciaMercado: {
                      ...defaultFormValues.concorrenciaMercado,
                      ...(existingBriefing.concorrenciaMercado || { principaisConcorrentes: [], inspiracoesPerfis: [] }),
                  },
                  comunicacaoExpectativas: {
                      ...defaultFormValues.comunicacaoExpectativas,
                      ...(existingBriefing.comunicacaoExpectativas || {}),
                  },
                  metasObjetivos: {
                      ...defaultFormValues.metasObjetivos,
                      ...(existingBriefing.metasObjetivos || {}),
                  },
                   equipeMidiaSocial: {
                      ...defaultFormValues.equipeMidiaSocial,
                      ...(existingBriefing.equipeMidiaSocial || {}),
                  },
                  equipeTrafegoPago: {
                        ...defaultFormValues.equipeTrafegoPago,
                        ...(existingBriefing.equipeTrafegoPago || {}),
                  }
              };
              form.reset(initialData);
          }
      } else {
          form.reset(defaultFormValues);
      }
  };


  const handleGenerateFromTranscript = async () => {
      if (!transcript.trim()) {
          toast({ title: "Transcrição vazia", description: "Por favor, cole a transcrição da reunião.", variant: "destructive" });
          return;
      }
      setIsGenerating(true);
      setProgress(0);
      
      // Simulate progress
      progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                if(progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                return 95;
            }
            return prev + 5;
        });
      }, 500);

      try {
          const result = await generateBriefingFromTranscript({ transcript });
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setProgress(100);

          const generatedBriefing = result.briefing || {};
          
          // Get current form values to preserve name and plan
          const currentValues = form.getValues();
          
          // Merge generated data with existing data, ensuring name and plan are not overwritten
          const updatedBriefing = {
              ...currentValues, // Start with current values
              ...generatedBriefing, // Overwrite with generated data
              informacoesOperacionais: { // Ensure this section is handled correctly
                  ...currentValues.informacoesOperacionais,
                  ...generatedBriefing.informacoesOperacionais,
                  // Explicitly preserve name and plan from current values
                  nomeNegocio: currentValues.informacoesOperacionais?.nomeNegocio || '',
                  planoContratado: currentValues.informacoesOperacionais?.planoContratado || '',
              },
          };

          form.reset(updatedBriefing);
          toast({ title: "Briefing Preenchido!", description: "A IA analisou a transcrição e preencheu o formulário." });
      } catch (error) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setProgress(0);
          console.error("Error generating briefing from transcript:", error);
          toast({ title: "Erro ao gerar briefing", description: "A IA não conseguiu processar a transcrição. Tente novamente.", variant: "destructive" });
      } finally {
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 1000);
      }
  }
  
  const renderTranscriptAsChat = (text: string) => {
    return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        const match = line.match(/^([^:]+):(.*)/);
        if (match) {
            const speaker = match[1].trim();
            const message = match[2].trim();
            const isEven = (speaker.toLowerCase().includes('cliente') || speaker.toLowerCase().includes('user'));
            return (
                <div key={index} className={cn("flex w-full mb-2", isEven ? "justify-end" : "justify-start")}>
                    <div className="max-w-xl">
                        <div className={cn("px-4 py-2 rounded-lg", isEven ? "bg-primary text-primary-foreground" : "bg-muted")}>
                           <p className="font-semibold text-sm mb-1">{speaker}</p>
                           <p className="text-sm">{message}</p>
                        </div>
                    </div>
                </div>
            )
        }
        return <p key={index} className="text-sm mb-2">{line}</p>
    })
  }

  const { fields: redesSociaisFields, append: appendRedeSocial, remove: removeRedeSocial } = useFieldArray({
    control: form.control,
    name: "informacoesOperacionais.redesSociaisAcesso",
  });
  
  const { fields: concorrentesFields, append: appendConcorrente, remove: removeConcorrente } = useFieldArray({
    control: form.control,
    name: "concorrenciaMercado.principaisConcorrentes",
  });

  const { fields: inspiracoesFields, append: appendInspiracao, remove: removeInspiracao } = useFieldArray({
      control: form.control,
      name: "concorrenciaMercado.inspiracoesPerfis",
  });


  async function onSubmit(values: FormValues) {
      if (!selectedClientId) {
          toast({ title: "Nenhum cliente selecionado", variant: "destructive" });
          return;
      }

      try {
          const clientDocRef = doc(db, "clients", selectedClientId);
          await updateDoc(clientDocRef, {
              briefing: values,
              status: "active", // Change status to active after briefing is submitted
              name: values.informacoesOperacionais?.nomeNegocio,
              plan: values.informacoesOperacionais?.planoContratado,
          });
      
          toast({
              title: "Briefing Salvo com Sucesso!",
              description: `As informações de ${values.informacoesOperacionais?.nomeNegocio} foram atualizadas.`,
          });

      } catch (error) {
          console.error("Error updating document: ", error);
          toast({
              title: "Erro ao Salvar Briefing",
              description: "Houve um problema ao salvar as informações no banco de dados.",
              variant: "destructive",
          });
      }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-2">
                <FormLabel>Selecione o Cliente para o Briefing</FormLabel>
                {loadingClients ? <Skeleton className="h-10 w-full" /> : (
                    <Select onValueChange={handleClientChange} value={selectedClientId || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha um cliente..." />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map(client => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {selectedClientId && (
             <>
              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel htmlFor="transcript" className="flex items-center gap-2 text-md font-semibold text-primary"><FileText className="h-5 w-5" />Preenchimento com IA</FormLabel>
                       <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" disabled={!transcript}>
                                  <Eye className="mr-2 h-4 w-4"/>
                                  Ver Transcrição
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                <DialogTitle>Transcrição da Reunião</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[60vh] p-4 border rounded-md">
                                    {renderTranscriptAsChat(transcript)}
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <FormDescription>Cole a transcrição da reunião abaixo e clique no botão para a IA preencher o briefing automaticamente.</FormDescription>
                    <Textarea 
                        id="transcript"
                        placeholder="Cole aqui a transcrição completa da sua reunião..."
                        className="min-h-[150px] bg-background"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                    />
                </div>
                {isGenerating && (
                    <div className="space-y-2">
                        <Progress value={progress} />
                        <p className="text-sm text-muted-foreground text-center">A IA está analisando a transcrição, isso pode levar um momento...</p>
                    </div>
                )}
                <div className="flex justify-end">
                    <Button type="button" onClick={handleGenerateFromTranscript} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {isGenerating ? 'Analisando Transcrição...' : 'Preencher com IA'}
                    </Button>
                </div>
              </div>


              <Accordion type="multiple" defaultValue={['informacoesOperacionais']} className="w-full">
                
                {/* INFORMAÇÕES OPERACIONAIS */}
                <AccordionItem value="informacoesOperacionais">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Building className="h-6 w-6 text-primary" />Informações Operacionais</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="informacoesOperacionais.nomeNegocio" render={({ field }) => (<FormItem><FormLabel>Nome do negócio</FormLabel><FormControl><Input placeholder="Ex: CP Marketing Digital" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="informacoesOperacionais.planoContratado" render={({ field }) => (<FormItem><FormLabel>Plano Contratado</FormLabel><FormControl><Input placeholder="Ex: Plano Performance" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="informacoesOperacionais.observacoesPlano" render={({ field }) => (<FormItem><FormLabel>Observações sobre o Plano</FormLabel><FormControl><Textarea placeholder="Detalhes, exceções ou acordos específicos sobre o plano contratado." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    
                    <div className="space-y-4">
                      <FormLabel>Acessos a redes sociais e gerenciadores</FormLabel>
                      <div className="space-y-4 rounded-md border p-4">
                          {redesSociaisFields.map((field, index) => (
                            <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end">
                              <FormField
                                control={form.control}
                                name={`informacoesOperacionais.redesSociaisAcesso.${index}.plataforma`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Plataforma</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Instagram, Facebook, Google..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`informacoesOperacionais.redesSociaisAcesso.${index}.login`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Login</FormLabel>
                                    <FormControl>
                                      <Input placeholder="usuário ou email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`informacoesOperacionais.redesSociaisAcesso.${index}.senha`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeRedeSocial(index)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => appendRedeSocial({ plataforma: "", login: "", senha: "" })}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Rede Social
                          </Button>
                      </div>
                    </div>

                    <FormField control={form.control} name="informacoesOperacionais.possuiIdentidadeVisual" render={({ field }) => (
                      <FormItem className="space-y-3"><FormLabel>Cliente possui identidade visual?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-6">
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sim" /></FormControl><FormLabel className="font-normal">Sim</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="nao" /></FormControl><FormLabel className="font-normal">Não</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>Se sim, enviar manual da marca ou arquivos editáveis (logo, fontes, etc).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="informacoesOperacionais.possuiBancoImagens" render={({ field }) => (
                      <FormItem className="space-y-3"><FormLabel>O cliente possui banco de imagens próprio?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-6">
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sim" /></FormControl><FormLabel className="font-normal">Sim</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="nao" /></FormControl><FormLabel className="font-normal">Não</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="informacoesOperacionais.linksRelevantes" render={({ field }) => (<FormItem><FormLabel>Links de sites, landing pages ou outras plataformas relevantes</FormLabel><FormControl><Textarea placeholder="Cole os links aqui, um por linha." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                {/* NEGÓCIO E POSICIONAMENTO */}
                <AccordionItem value="negociosPosicionamento">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Briefcase className="h-6 w-6 text-primary" />Negócio e Posicionamento</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="negociosPosicionamento.descricao" render={({ field }) => (<FormItem><FormLabel>O que a empresa faz?</FormLabel><FormControl><Textarea placeholder="Descreva os produtos, serviços e o que a empresa oferece." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="negociosPosicionamento.diferencial" render={({ field }) => (<FormItem><FormLabel>Principal diferencial competitivo</FormLabel><FormControl><Textarea placeholder="O que torna sua empresa única no mercado?" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="negociosPosicionamento.missaoValores" render={({ field }) => (<FormItem><FormLabel>Missão, Visão e Valores</FormLabel><FormControl><Textarea placeholder="Qual o propósito e os princípios da marca?" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="negociosPosicionamento.ticketMedio" render={({ field }) => (<FormItem><FormLabel>Qual seu ticket médio atual?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="negociosPosicionamento.maiorDesafio" render={({ field }) => (<FormItem><FormLabel>Qual é o maior desafio do seu negócio hoje?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="negociosPosicionamento.erroMercado" render={({ field }) => (<FormItem><FormLabel>Qual é o maior erro que o seu mercado comete e você combate?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                {/* PÚBLICO E PERSONA */}
                <AccordionItem value="publicoPersona">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Target className="h-6 w-6 text-primary" />Público e Persona</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="publicoPersona.publicoAlvo" render={({ field }) => (<FormItem><FormLabel>Público-alvo</FormLabel><FormControl><Textarea placeholder="Descreva as características gerais do público (idade, gênero, localização, interesses)." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="publicoPersona.persona" render={({ field }) => (<FormItem><FormLabel>Persona ideal</FormLabel><FormControl><Textarea placeholder="Descreva em mais detalhes o cliente ideal (profissão, hábitos, estilo de vida)." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="publicoPersona.dores" render={({ field }) => (<FormItem><FormLabel>Quais dores seu cliente resolve?</FormLabel><FormControl><Textarea placeholder="Liste os principais problemas, dificuldades e necessidades que seu produto/serviço soluciona." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="publicoPersona.duvidasObjecoes" render={({ field }) => (<FormItem><FormLabel>Quais as principais dúvidas ou objeções que seu público tem?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="publicoPersona.impedimentoCompra" render={({ field }) => (<FormItem><FormLabel>O que geralmente impede o seu público de comprar de você?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="publicoPersona.canaisUtilizados" render={({ field }) => (<FormItem><FormLabel>Quais canais o seu público mais utiliza? (Instagram, TikTok, WhatsApp, YouTube...)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                {/* CONCORRÊNCIA E INSPIRAÇÕES */}
                <AccordionItem value="concorrenciaMercado">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-primary" />Concorrência e Inspirações</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">

                    <div className="space-y-4">
                        <FormLabel>Perfis de Inspiração</FormLabel>
                        <div className="space-y-4 rounded-md border p-4">
                            {inspiracoesFields.map((field, index) => (
                              <div key={field.id} className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <FormField
                                    control={form.control}
                                    name={`concorrenciaMercado.inspiracoesPerfis.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormLabel>Nome da Marca/Perfil</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Nike, Apple" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name={`concorrenciaMercado.inspiracoesPerfis.${index}.perfil`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormLabel>@ ou Link do Perfil</FormLabel>
                                        <FormControl>
                                            <Input placeholder="@nome_do_perfil" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive mt-7"
                                    onClick={() => removeInspiracao(index)}
                                    >
                                    <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`concorrenciaMercado.inspiracoesPerfis.${index}.detalhes`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>Detalhes</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="O que você admira? O que podemos aprender com este perfil?" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => appendInspiracao({ name: "", perfil: "", detalhes: "" })}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Adicionar Inspiração
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormLabel>Principais Concorrentes</FormLabel>
                        <div className="space-y-4 rounded-md border p-4">
                            {concorrentesFields.map((field, index) => (
                              <div key={field.id} className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <FormField
                                    control={form.control}
                                    name={`concorrenciaMercado.principaisConcorrentes.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormLabel>Nome do Concorrente</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome da empresa concorrente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name={`concorrenciaMercado.principaisConcorrentes.${index}.perfil`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                        <FormLabel>@ ou Link do Perfil</FormLabel>
                                        <FormControl>
                                            <Input placeholder="@nome_do_concorrente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive mt-7"
                                    onClick={() => removeConcorrente(index)}
                                    >
                                    <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`concorrenciaMercado.principaisConcorrentes.${index}.detalhes`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>Detalhes</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Pontos fortes, fracos, estratégia observada..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => appendConcorrente({ name: "", perfil: "", detalhes: "" })}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Adicionar Concorrente
                            </Button>
                        </div>
                    </div>

                  </AccordionContent>
                </AccordionItem>
                
                {/* COMUNICAÇÃO ATUAL E EXPECTATIVAS */}
                <AccordionItem value="comunicacaoExpectativas">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Megaphone className="h-6 w-6 text-primary" />Comunicação e Expectativas</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="comunicacaoExpectativas.investimentoAnterior" render={({ field }) => (<FormItem><FormLabel>Você já investiu em marketing digital antes? O que funcionou e o que não funcionou?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="comunicacaoExpectativas.conteudosPreferidos" render={({ field }) => (<FormItem><FormLabel>Quais tipos de conteúdo você mais gosta de produzir?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="comunicacaoExpectativas.naoFazer" render={({ field }) => (<FormItem><FormLabel>Existe algo que você não quer que seja feito na sua comunicação?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="comunicacaoExpectativas.tomDeVoz" render={({ field }) => (<FormItem><FormLabel>Qual tom de voz você deseja? (Formal, técnico, descontraído, provocador...)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>
                
                {/* METAS E OBJETIVOS */}
                <AccordionItem value="metasObjetivos">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Goal className="h-6 w-6 text-primary" />Metas e Objetivos</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="metasObjetivos.objetivoPrincipal" render={({ field }) => (<FormItem><FormLabel>Qual objetivo principal com o marketing nos próximos 3 meses? (Ex: vendas, autoridade, engajamento)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metasObjetivos.metasEspecificas" render={({ field }) => (<FormItem><FormLabel>Você já possui metas específicas de vendas, leads ou alcance? Quais?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metasObjetivos.sazonalidade" render={({ field }) => (<FormItem><FormLabel>Existe alguma sazonalidade ou campanha importante no ano?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metasObjetivos.verbaTrafego" render={({ field }) => (<FormItem><FormLabel>Existe verba para tráfego pago? Qual o valor médio mensal que pretende investir?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                {/* PARA O TIME DE SOCIAL MEDIA */}
                <AccordionItem value="equipeMidiaSocial">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-primary" />Para o Time de Social Media</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="equipeMidiaSocial.formatoConteudo" render={({ field }) => (<FormItem><FormLabel>Qual formato de conteúdo o cliente mais gostaria de trabalhar? (Reels, Carrossel, Story, Live, etc)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeMidiaSocial.temasObrigatorios" render={({ field }) => (<FormItem><FormLabel>Há temas que o cliente considera obrigatórios ou que não quer abordar?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeMidiaSocial.disponibilidadeGravacao" render={({ field }) => (<FormItem><FormLabel>O cliente tem disponibilidade de gravar conteúdos? Quantos por semana?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeMidiaSocial.responsavelGravacao" render={({ field }) => (<FormItem><FormLabel>Quem será o responsável pelas gravações/captações de imagem? (Proprietário, funcionário específico, etc.)</FormLabel><FormControl><Textarea placeholder="Descreva quem fará as gravações e se há alguma limitação." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeMidiaSocial.principaisGatilhos" render={({ field }) => (<FormItem><FormLabel>Quais são os principais gatilhos ou diferenças que o social media deve explorar?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

                {/* PARA O TIME DE TRÁFEGO PAGO */}
                <AccordionItem value="equipeTrafegoPago">
                  <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><DollarSign className="h-6 w-6 text-primary" />Para o Time de Tráfego Pago</div></AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField control={form.control} name="equipeTrafegoPago.principalProdutoAnunciar" render={({ field }) => (<FormItem><FormLabel>Qual o principal produto/serviço que deseja anunciar?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeTrafegoPago.objetivoCampanhas" render={({ field }) => (<FormItem><FormLabel>Qual é o objetivo das campanhas de tráfego? (Vendas, Leads, Seguidores, Reconhecimento)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeTrafegoPago.promocaoCondicao" render={({ field }) => (<FormItem><FormLabel>Existe alguma promoção, condição ou diferencial que deve ser explorado no anúncio?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeTrafegoPago.localVeiculacao" render={({ field }) => (<FormItem><FormLabel>Algum local específico para veiculação? (ex: apenas Goiânia, apenas região centro-oeste)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="equipeTrafegoPago.limiteVerba" render={({ field }) => (<FormItem><FormLabel>Algum limite de verba ou ajuste de investimento esperado?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar Briefing"}
                </Button>
              </div>
            </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

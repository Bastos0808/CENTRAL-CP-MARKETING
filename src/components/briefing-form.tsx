
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
  FileText,
  type LucideIcon,
  Palette,
  Camera,
  Link2,
  PlusCircle,
  Trash2,
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
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";


const formSchema = z.object({
  informacoesOperacionais: z.object({
    nomeNegocio: z.string().min(1, "Nome do negócio é obrigatório."),
    redesSociaisAcesso: z.array(z.object({
        plataforma: z.string().min(1, "Plataforma é obrigatória"),
        login: z.string().min(1, "Login é obrigatório"),
        senha: z.string().min(1, "Senha é obrigatória"),
    })).optional(),
    possuiIdentidadeVisual: z.enum(['sim', 'nao'], { required_error: "Selecione uma opção." }),
    possuiBancoImagens: z.enum(['sim', 'nao'], { required_error: "Selecione uma opção." }),
    linksRelevantes: z.string().optional(),
  }),
  negociosPosicionamento: z.object({
    historiaMarca: z.string().optional(),
    diferencialReal: z.string().optional(),
    ticketMedio: z.string().optional(),
    icp: z.object({
        setor: z.string().optional(),
        tamanhoEmpresa: z.string().optional(),
        cargoDecisor: z.string().optional(),
        desafios: z.string().optional(),
    }).optional(),
    maiorDesafio: z.string().optional(),
    sentimentoMarca: z.string().optional(),
    erroMercado: z.string().optional(),
  }),
  publicoPersona: z.object({
    duvidasObjecoes: z.string().optional(),
    impedimentoCompra: z.string().optional(),
    doresResolvidas: z.string().optional(),
    canaisUtilizados: z.string().optional(),
  }),
  concorrenciaMercado: z.object({
    principaisConcorrentes: z.string().optional(),
    pontosFortesConcorrencia: z.string().optional(),
    pontosFracosConcorrencia: z.string().optional(),
    inspiracoes: z.string().optional(),
  }),
  comunicacaoExpectativas: z.object({
    investimentoAnterior: z.string().optional(),
    conteudosPreferidos: z.string().optional(),
    naoFazer: z.string().optional(),
    tomDeVoz: z.string().optional(),
  }),
  metasObjetivos: z.object({
    objetivoPrincipal: z.string().optional(),
    metasEspecificas: z.string().optional(),
    sazonalidade: z.string().optional(),
    verbaTrafego: z.string().optional(),
  }),
  equipeMidiaSocial: z.object({
    formatoConteudo: z.string().optional(),
    temasObrigatorios: z.string().optional(),
    disponibilidadeGravacao: z.string().optional(),
    principaisGatilhos: z.string().optional(),
  }),
  equipeTrafegoPago: z.object({
    principalProdutoAnunciar: z.string().optional(),
    objetivoCampanhas: z.string().optional(),
    promocaoCondicao: z.string().optional(),
    localVeiculacao: z.string().optional(),
    limiteVerba: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;


export default function BriefingForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      informacoesOperacionais: {
        redesSociaisAcesso: [{plataforma: 'Instagram', login: '', senha: ''}]
      },
      negociosPosicionamento: {
        icp: {
            setor: '',
            tamanhoEmpresa: '',
            cargoDecisor: '',
            desafios: ''
        }
      },
      publicoPersona: {},
      concorrenciaMercado: {},
      comunicacaoExpectativas: {},
      metasObjetivos: {},
      equipeMidiaSocial: {},
      equipeTrafegoPago: {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "informacoesOperacionais.redesSociaisAcesso",
  });

  async function onSubmit(values: FormValues) {
    const submissionId = crypto.randomUUID();
    
    // Save to Firestore
    try {
      const clientData = {
        id: submissionId,
        name: values.informacoesOperacionais.nomeNegocio,
        responsible: "Não definido",
        plan: "Não definido", // You might want to add a field for this
        startDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending' as const,
        briefing: values, // Save the entire form
      };

      const clientDocRef = doc(db, "clients", submissionId);
      await setDoc(clientDocRef, clientData);
      
      toast({
        title: "Cliente Adicionado com Sucesso!",
        description: `${clientData.name} foi adicionado à base de dados com status pendente.`,
      });

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Erro ao Adicionar Cliente",
        description: "Houve um problema ao salvar o cliente no banco de dados.",
        variant: "destructive",
      });
      return; // Stop execution if save fails
    }

    // Reset the form
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['informacoesOperacionais']} className="w-full">
              
              {/* INFORMAÇÕES OPERACIONAIS */}
              <AccordionItem value="informacoesOperacionais">
                <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Building className="h-6 w-6 text-primary" />Informações Operacionais</div></AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <FormField control={form.control} name="informacoesOperacionais.nomeNegocio" render={({ field }) => (<FormItem><FormLabel>Nome do negócio</FormLabel><FormControl><Input placeholder="Ex: CP Marketing Digital" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  
                  <div className="space-y-4">
                    <FormLabel>Acessos a redes sociais e gerenciadores</FormLabel>
                    <div className="space-y-4 rounded-md border p-4">
                        {fields.map((field, index) => (
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
                              onClick={() => remove(index)}
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
                          onClick={() => append({ plataforma: "", login: "", senha: "" })}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Rede Social
                        </Button>
                    </div>
                  </div>

                  <FormField control={form.control} name="informacoesOperacionais.possuiIdentidadeVisual" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Cliente possui identidade visual?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-6">
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
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-6">
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
                   <FormField control={form.control} name="negociosPosicionamento.historiaMarca" render={({ field }) => (<FormItem><FormLabel>Qual a história por trás da sua marca?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="negociosPosicionamento.diferencialReal" render={({ field }) => (<FormItem><FormLabel>Qual o seu diferencial real em relação aos concorrentes?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="negociosPosicionamento.ticketMedio" render={({ field }) => (<FormItem><FormLabel>Qual seu ticket médio atual?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                   
                    <div className="space-y-4 rounded-md border p-4">
                        <FormLabel className="font-semibold text-base">Qual seu Perfil de Cliente Ideal (ICP)?</FormLabel>
                        <FormField control={form.control} name="negociosPosicionamento.icp.setor" render={({ field }) => (<FormItem><FormLabel>Setor de Atuação</FormLabel><FormControl><Input placeholder="Ex: Varejo de moda, tecnologia, saúde..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="negociosPosicionamento.icp.tamanhoEmpresa" render={({ field }) => (<FormItem><FormLabel>Tamanho da Empresa</FormLabel><FormControl><Input placeholder="Ex: Pequena (1-50), Média (51-200), Grande (200+)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="negociosPosicionamento.icp.cargoDecisor" render={({ field }) => (<FormItem><FormLabel>Cargo do Decisor</FormLabel><FormControl><Input placeholder="Ex: CEO, Gerente de Marketing, Diretor de Vendas" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="negociosPosicionamento.icp.desafios" render={({ field }) => (<FormItem><FormLabel>Principais Desafios</FormLabel><FormControl><Textarea placeholder="Ex: Aumentar a geração de leads, melhorar a presença online, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>

                   <FormField control={form.control} name="negociosPosicionamento.maiorDesafio" render={({ field }) => (<FormItem><FormLabel>Qual é o maior desafio do seu negócio hoje?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="negociosPosicionamento.sentimentoMarca" render={({ field }) => (<FormItem><FormLabel>O que você deseja que o público sinta ou pense ao ver sua marca?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="negociosPosicionamento.erroMercado" render={({ field }) => (<FormItem><FormLabel>Qual é o maior erro que o seu mercado comete e você combate?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
              </AccordionItem>
              
              {/* PÚBLICO E PERSONA */}
              <AccordionItem value="publicoPersona">
                <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Target className="h-6 w-6 text-primary" />Público e Persona</div></AccordionTrigger>
                 <AccordionContent className="pt-4 space-y-6">
                   <FormField control={form.control} name="publicoPersona.duvidasObjecoes" render={({ field }) => (<FormItem><FormLabel>Quais as principais dúvidas ou objeções que seu público tem?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="publicoPersona.impedimentoCompra" render={({ field }) => (<FormItem><FormLabel>O que geralmente impede o seu público de comprar de você?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="publicoPersona.doresResolvidas" render={({ field }) => (<FormItem><FormLabel>Quais dores seu cliente resolve?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="publicoPersona.canaisUtilizados" render={({ field }) => (<FormItem><FormLabel>Quais canais o seu público mais utiliza? (Instagram, TikTok, WhatsApp, YouTube...)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
              </AccordionItem>
              
              {/* CONCORRÊNCIA E MERCADO */}
              <AccordionItem value="concorrenciaMercado">
                <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-primary" />Concorrência e Mercado</div></AccordionTrigger>
                 <AccordionContent className="pt-4 space-y-6">
                   <FormField control={form.control} name="concorrenciaMercado.principaisConcorrentes" render={({ field }) => (<FormItem><FormLabel>Quem são seus principais concorrentes?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="concorrenciaMercado.pontosFortesConcorrencia" render={({ field }) => (<FormItem><FormLabel>O que eles fazem bem que você admira?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="concorrenciaMercado.pontosFracosConcorrencia" render={({ field }) => (<FormItem><FormLabel>O que eles deixam a desejar e que você faz melhor?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="concorrenciaMercado.inspiracoes" render={({ field }) => (<FormItem><FormLabel>Existe alguma referência de marca ou perfil que você gostaria de se inspirar?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
              </AccordionItem>
              
              {/* COMUNICAÇÃO ATUAL E EXPECTATIVAS */}
              <AccordionItem value="comunicacaoExpectativas">
                <AccordionTrigger className="text-lg hover:no-underline"><div className="flex items-center gap-3"><Megaphone className="h-6 w-6 text-primary" />Comunicação Atual e Expectativas</div></AccordionTrigger>
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
                <Send className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

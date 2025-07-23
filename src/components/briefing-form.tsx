
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";


const personaSchema = z.object({
    nome: z.string().optional(),
    idade: z.string().optional(),
    profissao: z.string().optional(),
    dores: z.string().optional(),
    objetivos: z.string().optional(),
    comoAjuda: z.string().optional(),
});

const formSchema = z.object({
  informacoesOperacionais: z.object({
    nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório."),
    website: z.string().url("URL inválida.").optional().or(z.literal('')),
    telefone: z.string().optional(),
    emailContato: z.string().email("Email inválido."),
  }),
  negociosPosicionamento: z.object({
    descricao: z.string().min(1, "Descrição é obrigatória."),
    diferencial: z.string().min(1, "Diferencial é obrigatório."),
    missaoValores: z.string().optional(),
  }),
  publicoPersona: z.object({
    // Público-alvo
    faixaEtaria: z.string().optional(),
    genero: z.string().optional(),
    localizacao: z.string().optional(),
    interesses: z.string().optional(),
    classeSocial: z.string().optional(),
    // Personas
    personas: z.array(personaSchema).optional(),
  }),
  concorrenciaMercado: z.object({
    competitors: z.array(z.object({
      name: z.string().optional(),
      website: z.string().optional(),
      strengths: z.string().optional(),
      weaknesses: z.string().optional(),
    })).optional(),
    principaisConcorrentes: z.string().optional(),
    pontosFortesFracos: z.string().optional(),
  }),
  comunicacaoExpectativas: z.object({
    canaisAtuais: z.string().optional(),
    tomDeVoz: z.string().optional(),
    expectativas: z.string().min(1, "Expectativas são obrigatórias."),
  }),
  metasObjetivos: z.object({
    principalObjetivo: z.string().min(1, "Objetivo principal é obrigatório."),
    metasEspecificas: z.string().optional(),
    planoContratado: z.string().min(1, "Plano é obrigatório."),
  }),
  equipeMidiaSocial: z.object({
    responsavel: z.string().optional(),
  }),
  equipeTrafegoPago: z.object({
    responsavel: z.string().optional(),
    orcamento: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const publicoFields: {
    name: keyof z.infer<typeof formSchema>['publicoPersona'];
    label: string;
    placeholder: string;
    type: "input" | "textarea";
}[] = [
    { name: "faixaEtaria", label: "Faixa Etária", placeholder: "Ex: 25-35 anos", type: "input" },
    { name: "genero", label: "Gênero", placeholder: "Ex: Feminino, Masculino, Ambos", type: "input" },
    { name: "localizacao", label: "Localização", placeholder: "Ex: Goiânia, GO", type: "input" },
    { name: "classeSocial", label: "Classe Social", placeholder: "Ex: A, B, C", type: "input" },
    { name: "interesses", label: "Principais Interesses", placeholder: "Ex: Tecnologia, viagens, alimentação saudável", type: "textarea" },
];

const personaFields: {
    name: keyof z.infer<typeof personaSchema>;
    label: string;
    placeholder: string;
    type: "input" | "textarea";
}[] = [
    { name: "nome", label: "Nome da Persona", placeholder: "Ex: Ana", type: "input" },
    { name: "idade", label: "Idade", placeholder: "Ex: 30 anos", type: "input" },
    { name: "profissao", label: "Profissão", placeholder: "Ex: Advogada", type: "input" },
    { name: "dores", label: "Quais são as dores e necessidades?", placeholder: "Ex: Falta de tempo para gerenciar as finanças", type: "textarea" },
    { name: "objetivos", label: "Quais são os objetivos e sonhos?", placeholder: "Ex: Alcançar independência financeira, viajar mais", type: "textarea" },
    { name: "comoAjuda", label: "Como sua empresa ajuda a persona a resolver suas dores e alcançar seus objetivos?", placeholder: "Descreva a solução que sua empresa oferece", type: "textarea" },
];


const formSections: {
  id: keyof FormValues;
  title: string;
  icon: LucideIcon;
  fields: (
    | {
        name: keyof FormValues[keyof FormValues];
        label: string;
        placeholder: string;
        type: "input" | "textarea";
      }
  )[];
}[] = [
  {
    id: "informacoesOperacionais",
    title: "Informações Operacionais",
    icon: Building,
    fields: [
      { name: "nomeEmpresa", label: "Nome da Empresa", placeholder: "Ex: CP Marketing Digital", type: "input" },
      { name: "website", label: "Website", placeholder: "https://www.cpmarketing.com.br", type: "input" },
      { name: "telefone", label: "Telefone", placeholder: "(XX) XXXXX-XXXX", type: "input" },
      { name: "emailContato", label: "Email de Contato", placeholder: "contato@cpmarketing.com.br", type: "input" },
    ],
  },
  {
    id: "negociosPosicionamento",
    title: "Negócios e Posicionamento",
    icon: Briefcase,
    fields: [
      { name: "descricao", label: "O que a empresa faz?", placeholder: "Descreva os produtos ou serviços oferecidos.", type: "textarea" },
      { name: "diferencial", label: "Qual o principal diferencial competitivo?", placeholder: "O que torna sua empresa única no mercado?", type: "textarea" },
      { name: "missaoValores", label: "Missão, Visão e Valores", placeholder: "Descreva a missão, visão e valores da empresa.", type: "textarea" },
    ],
  },
  {
    id: "concorrenciaMercado",
    title: "Concorrência e Mercado",
    icon: Users,
    fields: [
      { name: "principaisConcorrentes", label: "Principais concorrentes", placeholder: "Liste ao menos 3 concorrentes diretos e indiretos.", type: "textarea" },
      { name: "pontosFortesFracos", label: "Pontos fortes e fracos dos concorrentes", placeholder: "O que seus concorrentes fazem bem e onde falham?", type: "textarea" },
    ],
  },
  {
    id: "comunicacaoExpectativas",
    title: "Comunicação Atual e Expectativas",
    icon: Megaphone,
    fields: [
      { name: "canaisAtuais", label: "Quais canais de comunicação utilizam hoje?", placeholder: "Redes sociais, blog, email marketing, etc.", type: "textarea" },
      { name: "tomDeVoz", label: "Qual o tom de voz da marca?", placeholder: "Ex: Formal, informal, divertido, técnico.", type: "textarea" },
      { name: "expectativas", label: "O que esperam da nova estratégia de comunicação?", placeholder: "Quais são os resultados desejados?", type: "textarea" },
    ],
  },
  {
    id: "metasObjetivos",
    title: "Metas e Objetivos",
    icon: Goal,
    fields: [
      { name: "principalObjetivo", label: "Qual o principal objetivo com o marketing digital?", placeholder: "Ex: Aumentar vendas, gerar leads, fortalecer a marca.", type: "textarea" },
      { name: "metasEspecificas", label: "Metas Específicas (SMART)", placeholder: "Ex: Aumentar as vendas online em 20% em 6 meses.", type: "textarea" },
      { name: "planoContratado", label: "Plano Contratado", placeholder: "Ex: Plano Basic, Pro, Enterprise", type: "input" },
    ],
  },
  {
    id: "equipeMidiaSocial",
    title: "Equipe de Mídia Social",
    icon: Users,
    fields: [
      { name: "responsavel", label: "Quem é o responsável pela gestão de mídias sociais?", placeholder: "Nome e cargo.", type: "input" },
    ],
  },
  {
    id: "equipeTrafegoPago",
    title: "Equipe de Tráfego Pago",
    icon: DollarSign,
    fields: [
      { name: "responsavel", label: "Quem é o responsável pela gestão de tráfego pago?", placeholder: "Nome e cargo.", type: "input" },
      { name: "orcamento", label: "Qual o orçamento mensal para anúncios (Google Ads, Meta Ads, etc.)?", placeholder: "Ex: R$ 2.500,00", type: "input" },
    ],
  },
];


export default function BriefingForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      informacoesOperacionais: { nomeEmpresa: "", website: "", telefone: "", emailContato: "" },
      negociosPosicionamento: { descricao: "", diferencial: "", missaoValores: "" },
      publicoPersona: {
        faixaEtaria: "", genero: "", localizacao: "", interesses: "", classeSocial: "",
        personas: Array(3).fill({
            nome: "", idade: "", profissao: "", dores: "", objetivos: "", comoAjuda: ""
        })
      },
      concorrenciaMercado: { principaisConcorrentes: "", pontosFortesFracos: "" },
      comunicacaoExpectativas: { canaisAtuais: "", tomDeVoz: "", expectativas: "" },
      metasObjetivos: { principalObjetivo: "", metasEspecificas: "", planoContratado: "" },
      equipeMidiaSocial: { responsavel: "" },
      equipeTrafegoPago: { responsavel: "", orcamento: "" },
    },
  });

  async function onSubmit(values: FormValues) {
    const submissionId = crypto.randomUUID();
    
    // Save to Firestore
    try {
      const clientData = {
        id: submissionId,
        name: values.informacoesOperacionais.nomeEmpresa,
        responsible: values.equipeMidiaSocial.responsavel || "Não definido",
        plan: values.metasObjetivos.planoContratado,
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
            <Accordion type="multiple" defaultValue={['informacoesOperacionais', 'publicoPersona']} className="w-full">
              {formSections.map((section) => (
                <AccordionItem value={section.id} key={section.id}>
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                      <section.icon className="h-6 w-6 text-primary" />
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((fieldInfo) => (
                          <FormField
                            key={fieldInfo.name}
                            control={form.control}
                            name={`${section.id}.${fieldInfo.name}` as any}
                            render={({ field }) => (
                            <FormItem className={fieldInfo.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <FormLabel>{fieldInfo.label}</FormLabel>
                                <FormControl>
                                {fieldInfo.type === "textarea" ? (
                                    <Textarea
                                    placeholder={fieldInfo.placeholder}
                                    {...field}
                                    className="min-h-[120px]"
                                    />
                                ) : (
                                    <Input placeholder={fieldInfo.placeholder} {...field} />
                                )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
               <AccordionItem value="publicoPersona">
                    <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Target className="h-6 w-6 text-primary" />
                            Público e Persona
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <div>
                            <h3 className="text-md font-semibold text-primary/90 mb-4">
                                Público-alvo (Geral)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {publicoFields.map((fieldInfo) => (
                                    <FormField
                                        key={fieldInfo.name}
                                        control={form.control}
                                        name={`publicoPersona.${fieldInfo.name}` as any}
                                        render={({ field }) => (
                                        <FormItem className={fieldInfo.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <FormLabel>{fieldInfo.label}</FormLabel>
                                            <FormControl>
                                            {fieldInfo.type === "textarea" ? (
                                                <Textarea
                                                placeholder={fieldInfo.placeholder}
                                                {...field}
                                                className="min-h-[120px]"
                                                />
                                            ) : (
                                                <Input placeholder={fieldInfo.placeholder} {...field} />
                                            )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                             <h3 className="text-md font-semibold text-primary/90 mb-4 mt-6">
                                Personas
                            </h3>
                            <Tabs defaultValue="persona-0" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="persona-0">Persona 1</TabsTrigger>
                                    <TabsTrigger value="persona-1">Persona 2</TabsTrigger>
                                    <TabsTrigger value="persona-2">Persona 3</TabsTrigger>
                                </TabsList>
                                {[0, 1, 2].map(index => (
                                    <TabsContent value={`persona-${index}`} key={index}>
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {personaFields.map((fieldInfo) => (
                                                        <FormField
                                                            key={`persona-${index}-${fieldInfo.name}`}
                                                            control={form.control}
                                                            name={`publicoPersona.personas.${index}.${fieldInfo.name}`}
                                                            render={({ field }) => (
                                                                <FormItem className={fieldInfo.type === 'textarea' ? 'md:col-span-2' : ''}>
                                                                    <FormLabel>{fieldInfo.label}</FormLabel>
                                                                    <FormControl>
                                                                        {fieldInfo.type === 'textarea' ? (
                                                                            <Textarea placeholder={fieldInfo.placeholder} {...field} className="min-h-[100px]" />
                                                                        ) : (
                                                                            <Input placeholder={fieldInfo.placeholder} {...field} />
                                                                        )}
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
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

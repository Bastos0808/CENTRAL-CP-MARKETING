
"use client";

import { useEffect, useState, useRef, type ChangeEvent, use } from 'react';
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  type LucideIcon,
  Calendar,
  User,
  CheckCircle,
  ClipboardList,
  Info,
  FileText,
  Trash2,
  AlertTriangle,
  Frown,
  Save,
  Loader2,
  Palette,
  Type,
  ImageIcon,
  Upload,
  StickyNote,
  DollarSign,
  Camera,
  Mic,
  Package,
  Lightbulb,
  Bot,
  Clock,
  Youtube,
  Film,
  CalendarClock,
  File,
  FileUp,
  Download,
  FileJson,
  FileImage,
  FileAudio,
  FileVideo
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BackButton } from '@/components/ui/back-button';
import ClientChat from '@/components/client-chat';
import { Progress } from '@/components/ui/progress';


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

interface AnalyzedProfile {
  name: string;
  perfil: string;
  detalhes?: string;
}

interface VisualIdentity {
    logoUrl?: string;
    secondaryLogoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    primaryFont?: string;
    secondaryFont?: string;
}

interface Asset {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
}

interface Recording {
    id: string;
    date: string; // YYYY-MM-DD
}
interface PodcastPlan {
    recordingsPerMonth: number;
    accumulatedRecordings: number;
    paymentDay: number;
    recordingHistory?: Recording[];
    hoursPerEpisode?: string;
    pillsPerEpisode?: string;
    youtubeManagement?: boolean;
    recordingTime?: string;
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
  visualIdentity?: VisualIdentity;
  podcastPlan?: PodcastPlan;
  assets?: Asset[];
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

const InfoCard = ({ title, value, icon: Icon, children }: { title: string; value?: string; icon: LucideIcon, children?: React.ReactNode }) => (
    <div className="flex items-start gap-4 rounded-lg bg-background p-4 border">
        <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {value && <p className="text-md font-semibold text-foreground break-words">{value}</p>}
            {children && <div className="text-md font-semibold text-foreground">{children}</div>}
            {!value && !children && <p className="text-md font-semibold text-foreground">Não informado</p>}
        </div>
    </div>
);

const getFileIcon = (fileType: string): LucideIcon => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('audio/')) return FileAudio;
    if (fileType.startsWith('video/')) return FileVideo;
    if (fileType === 'application/pdf') return FileText;
    if (fileType === 'application/json') return FileJson;
    return File;
};


export default function ClientDossierPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const clientId = use(params).id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [personaPains, setPersonaPains] = useState('');
  const [competitors, setCompetitors] = useState<AnalyzedProfile[]>(Array(3).fill({ name: '', perfil: '', detalhes: '' }));
  const [inspirations, setInspirations] = useState<AnalyzedProfile[]>(Array(3).fill({ name: '', perfil: '', detalhes: '' }));
  const [isSaving, setIsSaving] = useState(false);
  
  // Visual Identity State
  const [visualIdentity, setVisualIdentity] = useState<VisualIdentity>({});
  const [isSavingVisual, setIsSavingVisual] = useState(false);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Asset management state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const assetFileInputRef = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      try {
        const docRef = doc(db, 'clients', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const clientData = { id: docSnap.id, ...docSnap.data() } as Client;
          setClient(clientData);
          setPersonaPains(clientData.briefing.publicoPersona?.dores || '');
          setVisualIdentity(clientData.visualIdentity || {});
          
          const fillProfiles = (profiles: any[] | undefined, setProfiles: (p: AnalyzedProfile[]) => void) => {
              if (Array.isArray(profiles) && profiles.length > 0) {
                  const filled = profiles.slice(0, 3);
                  while (filled.length < 3) {
                      filled.push({ name: '', perfil: '', detalhes: '' });
                  }
                  setProfiles(filled);
              } else {
                  setProfiles(Array(3).fill({ name: '', perfil: '', detalhes: '' }));
              }
          };

          fillProfiles(clientData.briefing.concorrenciaMercado?.principaisConcorrentes, setCompetitors);
          fillProfiles(clientData.briefing.concorrenciaMercado?.inspiracoesPerfis, setInspirations);


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
  
  const handleProfileChange = (
    index: number, 
    field: keyof AnalyzedProfile, 
    value: string, 
    type: 'competitor' | 'inspiration'
  ) => {
    if (type === 'competitor') {
        const updated = [...competitors];
        updated[index] = { ...updated[index], [field]: value };
        setCompetitors(updated);
    } else {
        const updated = [...inspirations];
        updated[index] = { ...updated[index], [field]: value };
        setInspirations(updated);
    }
  };
  
  const handleVisualIdentityChange = (field: keyof VisualIdentity, value: string) => {
    setVisualIdentity(prevState => ({...prevState, [field]: value}));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'secondaryLogoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast({
          title: "Arquivo Muito Grande",
          description: "Por favor, selecione um logo com menos de 1MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleVisualIdentityChange(fieldName, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveLogo = (fieldName: 'logoUrl' | 'secondaryLogoUrl') => {
    setVisualIdentity(prevState => ({...prevState, [fieldName]: undefined}));
  };


  const handleVisualIdentityUpdate = async () => {
      if (!client) return;
      setIsSavingVisual(true);
      const clientDocRef = doc(db, "clients", client.id);

      const dataToSave: Partial<VisualIdentity> = {};
      Object.entries(visualIdentity).forEach(([key, value]) => {
          if (value !== undefined) {
              dataToSave[key as keyof VisualIdentity] = value;
          }
      });

      try {
          await updateDoc(clientDocRef, { visualIdentity: dataToSave });
          toast({
              title: "Identidade Visual Salva!",
              description: "As informações de identidade visual foram atualizadas.",
          });
      } catch (error) {
          console.error("Error updating visual identity: ", error);
          toast({
              title: "Erro ao Salvar",
              description: "Não foi possível salvar a identidade visual. Tente novamente.",
              variant: "destructive",
          });
      } finally {
          setIsSavingVisual(false);
      }
  };


  const handleStrategicUpdate = async () => {
      if (!client) return;
      setIsSaving(true);
      const clientDocRef = doc(db, "clients", client.id);
      
      const filterEmpty = (p: AnalyzedProfile) => p.name || p.perfil || p.detalhes;

      try {
        await updateDoc(clientDocRef, {
            "briefing.publicoPersona.dores": personaPains,
            "briefing.concorrenciaMercado.principaisConcorrentes": competitors.filter(filterEmpty),
            "briefing.concorrenciaMercado.inspiracoesPerfis": inspirations.filter(filterEmpty),
        });
        toast({
            title: "Análise Estratégica Salva!",
            description: "As informações estratégicas foram atualizadas.",
        });
      } catch (error) {
          console.error("Error updating strategic analysis: ", error);
          toast({
              title: "Erro ao Salvar",
              description: "Não foi possível salvar a análise. Tente novamente.",
              variant: "destructive",
          });
      } finally {
          setIsSaving(false);
      }
  };

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
  
  const handleAssetUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!client || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    setUploadProgress(0);

    const assetId = crypto.randomUUID();
    const storageRef = ref(storage, `clients/${client.id}/assets/${assetId}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast({ title: "Erro no Upload", description: "Não foi possível enviar o arquivo.", variant: "destructive" });
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newAsset: Asset = {
          id: assetId,
          name: file.name,
          url: downloadURL,
          type: file.type,
          createdAt: new Date().toISOString(),
        };

        const clientDocRef = doc(db, "clients", client.id);
        await updateDoc(clientDocRef, {
          assets: arrayUnion(newAsset)
        });
        
        setClient(prev => {
          if (!prev) return null;
          return { ...prev, assets: [...(prev.assets || []), newAsset] };
        });

        toast({ title: "Arquivo Enviado!", description: `${file.name} foi adicionado à base de arquivos.` });
        setIsUploading(false);
        setUploadProgress(0);
      }
    );
  };
  
  const handleDeleteAsset = async (asset: Asset) => {
      if (!client) return;
      
      const clientDocRef = doc(db, "clients", client.id);
      const storageRef = ref(storage, `clients/${client.id}/assets/${asset.id}_${asset.name}`);
      
      try {
          // Create a new asset object without circular references for Firestore update
          const assetToRemove = {
              id: asset.id,
              name: asset.name,
              url: asset.url,
              type: asset.type,
              createdAt: asset.createdAt
          };

          // Delete from Firestore
          await updateDoc(clientDocRef, {
              assets: arrayRemove(assetToRemove)
          });
          
          // Delete from Storage
          await deleteObject(storageRef);

          setClient(prev => prev ? ({ ...prev, assets: prev.assets?.filter(a => a.id !== asset.id) || []}) : null);
          toast({ title: "Arquivo Excluído!", description: `${asset.name} foi removido.`});
      } catch (error) {
          console.error("Error deleting asset:", error);
          toast({ title: "Erro ao Excluir", description: "Não foi possível remover o arquivo.", variant: "destructive"});
      }
  };


  if (loading) {
    return (
        <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
            <div className="w-full">
                 <Skeleton className="h-10 w-24 mb-4" />
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
  const sortedAssets = client.assets?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const isPodcastOnly = !!client.podcastPlan && !client.briefing.negociosPosicionamento?.descricao;


  return (
    <main className="flex min-h-screen flex-col items-start p-4 sm:p-8 md:p-12">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <BackButton />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Bot className="mr-2 h-4 w-4"/>
                        Conversar com IA
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>Assistente de IA</SheetTitle>
                        <SheetDescription>
                            Faça perguntas sobre o dossiê de {client.name}.
                        </SheetDescription>
                    </SheetHeader>
                    <ClientChat client={client}/>
                </SheetContent>
            </Sheet>
        </div>
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
        
        {client.podcastPlan && (
            <section className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Plano de Podcast</CardTitle>
                        <CardDescription>Informações sobre o plano de podcast contratado.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoCard title="Episódios por Mês" value={client.podcastPlan.recordingsPerMonth.toString()} icon={Mic} />
                        <InfoCard title="Saldo de Gravações" value={client.podcastPlan.accumulatedRecordings.toString()} icon={Package} />
                        <InfoCard title="Dia de Pagamento (Referência)" value={`${client.podcastPlan.paymentDay}`} icon={Calendar} />
                        <InfoCard title="Horas por Episódio" value={client.podcastPlan.hoursPerEpisode} icon={Clock} />
                        <InfoCard title="Pílulas por Episódio" value={client.podcastPlan.pillsPerEpisode} icon={Film} />
                        <InfoCard title="Gestão de Youtube" value={client.podcastPlan.youtubeManagement ? "Sim" : "Não"} icon={Youtube} />
                        <InfoCard title="Horário de Gravação" value={client.podcastPlan.recordingTime} icon={CalendarClock} />
                    </CardContent>
                </Card>
            </section>
        )}
        
        {!isPodcastOnly && (
         <>
            <section className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Identidade Visual</CardTitle>
                        <CardDescription>Logo, cores e fontes que definem a marca do cliente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Carousel className="w-full max-w-lg mx-auto">
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="p-1">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-md font-semibold text-primary justify-center"><ImageIcon className="h-5 w-5" /> Logo Primário</Label>
                                            <div className="relative group">
                                                <div 
                                                    className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                                                    onClick={() => fileInputRef1.current?.click()}
                                                >
                                                    {visualIdentity.logoUrl ? (
                                                        <Image src={visualIdentity.logoUrl} alt="Preview do Logo Primário" layout="fill" objectFit="contain" className="p-2" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                                            <Upload className="w-8 h-8 mb-4" />
                                                            <p className="mb-2 text-sm">Clique ou arraste para enviar</p>
                                                            <p className="text-xs">PNG, JPG, SVG (MAX. 1MB)</p>
                                                        </div>
                                                    )}
                                                    <input ref={fileInputRef1} id="logo-upload-1" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleLogoUpload(e, 'logoUrl')} />
                                                </div>
                                                {visualIdentity.logoUrl && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveLogo('logoUrl'); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div className="p-1">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-md font-semibold text-primary justify-center"><ImageIcon className="h-5 w-5" /> Logo Secundário</Label>
                                             <div className="relative group">
                                                <div 
                                                    className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                                                    onClick={() => fileInputRef2.current?.click()}
                                                >
                                                    {visualIdentity.secondaryLogoUrl ? (
                                                        <Image src={visualIdentity.secondaryLogoUrl} alt="Preview do Logo Secundário" layout="fill" objectFit="contain" className="p-2" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                                            <Upload className="w-8 h-8 mb-4" />
                                                            <p className="mb-2 text-sm">Clique ou arraste para enviar</p>
                                                            <p className="text-xs">PNG, JPG, SVG (MAX. 1MB)</p>
                                                        </div>
                                                    )}
                                                    <input ref={fileInputRef2} id="logo-upload-2" type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleLogoUpload(e, 'secondaryLogoUrl')} />
                                                </div>
                                                {visualIdentity.secondaryLogoUrl && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveLogo('secondaryLogoUrl'); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious className="-left-10" />
                            <CarouselNext className="-right-10" />
                        </Carousel>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                          <div className="space-y-4">
                              <Label className="flex items-center gap-2 text-md font-semibold text-primary"><Palette className="h-5 w-5" /> Cores da Marca</Label>
                              <div className="space-y-4">
                                  <div className="space-y-1">
                                      <Label htmlFor="primaryColor">Cor Primária (Hex)</Label>
                                      <div className="flex items-center gap-2">
                                        <Input id="primaryColor" placeholder="#FFFFFF" value={visualIdentity.primaryColor || ''} onChange={(e) => handleVisualIdentityChange('primaryColor', e.target.value)} className="flex-1"/>
                                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: visualIdentity.primaryColor || 'transparent' }} />
                                      </div>
                                  </div>
                                  <div className="space-y-1">
                                      <Label htmlFor="secondaryColor">Cor Secundária (Hex)</Label>
                                      <div className="flex items-center gap-2">
                                        <Input id="secondaryColor" placeholder="#000000" value={visualIdentity.secondaryColor || ''} onChange={(e) => handleVisualIdentityChange('secondaryColor', e.target.value)} className="flex-1"/>
                                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: visualIdentity.secondaryColor || 'transparent' }} />
                                      </div>
                                  </div>
                                  <div className="space-y-1">
                                      <Label htmlFor="accentColor">Cor de Destaque (Hex)</Label>
                                      <div className="flex items-center gap-2">
                                        <Input id="accentColor" placeholder="#FF5733" value={visualIdentity.accentColor || ''} onChange={(e) => handleVisualIdentityChange('accentColor', e.target.value)} className="flex-1"/>
                                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: visualIdentity.accentColor || 'transparent' }} />
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-4">
                              <Label className="flex items-center gap-2 text-md font-semibold text-primary"><Type className="h-5 w-5" /> Fontes da Marca</Label>
                              <div className="space-y-4">
                                  <div className="space-y-1">
                                      <Label htmlFor="primaryFont">Fonte Primária</Label>
                                      <Input id="primaryFont" placeholder="Ex: Montserrat" value={visualIdentity.primaryFont || ''} onChange={(e) => handleVisualIdentityChange('primaryFont', e.target.value)}/>
                                  </div>
                                  <div className="space-y-1">
                                      <Label htmlFor="secondaryFont">Fonte Secundária</Label>
                                      <Input id="secondaryFont" placeholder="Ex: Lato" value={visualIdentity.secondaryFont || ''} onChange={(e) => handleVisualIdentityChange('secondaryFont', e.target.value)}/>
                                  </div>
                              </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleVisualIdentityUpdate} disabled={isSavingVisual}>
                                {isSavingVisual ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSavingVisual ? 'Salvando...' : 'Salvar Identidade Visual'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
            
            <section className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Base de Arquivos</CardTitle>
                        <CardDescription>Logos, PDFs, e outros materiais do cliente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div 
                            className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                            onClick={() => assetFileInputRef.current?.click()}
                        >
                             <input ref={assetFileInputRef} id="asset-upload" type="file" className="hidden" onChange={handleAssetUpload} disabled={isUploading}/>
                            {isUploading ? (
                                <div className='w-full px-8 space-y-2'>
                                    <Progress value={uploadProgress} />
                                    <p className="text-sm text-center text-muted-foreground">Enviando... {Math.round(uploadProgress)}%</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <FileUp className="w-8 h-8 mb-2" />
                                    <p className="text-sm">Clique ou arraste para enviar um arquivo</p>
                                    <p className="text-xs">PDF, PNG, JPG, ZIP, etc.</p>
                                </div>
                            )}
                        </div>

                        <div className='pt-4'>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Nome do Arquivo</TableHead>
                                    <TableHead>Data de Upload</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedAssets && sortedAssets.length > 0 ? (
                                        sortedAssets.map((asset) => {
                                            const FileIcon = getFileIcon(asset.type);
                                            return (
                                                <TableRow key={asset.id}>
                                                <TableCell className="font-medium">
                                                    <div className='flex items-center gap-2'>
                                                        <FileIcon className='h-5 w-5 text-muted-foreground' />
                                                        <span>{asset.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(asset.createdAt)}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="icon" asChild>
                                                        <a href={asset.url} target="_blank" rel="noopener noreferrer"><Download className='h-4 w-4'/></a>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="icon">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Excluir este arquivo?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. O arquivo "{asset.name}" será removido permanentemente.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteAsset(asset)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Excluir Arquivo
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        Nenhum arquivo na base.
                                        </TableCell>
                                    </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
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
                    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1']}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Building className="h-5 w-5" />Informações Operacionais</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                {client.briefing.informacoesOperacionais?.observacoesPlano && <InfoCard title="Observações sobre o Plano" value={client.briefing.informacoesOperacionais.observacoesPlano} icon={StickyNote} />}
                                {client.briefing.informacoesOperacionais?.website && <InfoCard title="Website" value={client.briefing.informacoesOperacionais.website} icon={Info} />}
                                {client.briefing.informacoesOperacionais?.telefone && <InfoCard title="Telefone" value={client.briefing.informacoesOperacionais.telefone} icon={Info} />}
                                {client.briefing.informacoesOperacionais?.emailContato && <InfoCard title="Email de Contato" value={client.briefing.informacoesOperacionais.emailContato} icon={Info} />}
                                {client.briefing.informacoesOperacionais?.possuiIdentidadeVisual && <InfoCard title="Possui Identidade Visual?" value={client.briefing.informacoesOperacionais.possuiIdentidadeVisual} icon={ImageIcon} />}
                                {client.briefing.informacoesOperacionais?.possuiBancoImagens && <InfoCard title="Possui Banco de Imagens?" value={client.briefing.informacoesOperacionais.possuiBancoImagens} icon={ImageIcon} />}
                                {client.briefing.informacoesOperacionais?.linksRelevantes && <InfoCard title="Links Relevantes" value={client.briefing.informacoesOperacionais.linksRelevantes} icon={Info} />}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Briefcase className="h-5 w-5" />Negócio e Posicionamento</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                {client.briefing.negociosPosicionamento?.descricao && <InfoCard title="O que a empresa faz?" value={client.briefing.negociosPosicionamento.descricao} icon={Megaphone} />}
                                {client.briefing.negociosPosicionamento?.diferencial && <InfoCard title="Principal diferencial competitivo" value={client.briefing.negociosPosicionamento.diferencial} icon={Target} />}
                                {client.briefing.negociosPosicionamento?.missaoValores && <InfoCard title="Missão, Visão e Valores" value={client.briefing.negociosPosicionamento.missaoValores} icon={Goal} />}
                                {client.briefing.negociosPosicionamento?.maiorDesafio && <InfoCard title="Maior desafio do negócio" value={client.briefing.negociosPosicionamento.maiorDesafio} icon={Target} />}
                                {client.briefing.negociosPosicionamento?.erroMercado && <InfoCard title="Maior erro que o mercado comete" value={client.briefing.negociosPosicionamento.erroMercado} icon={Target} />}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Target className="h-5 w-5" />Público e Persona</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                {client.briefing.publicoPersona?.publicoAlvo && <InfoCard title="Público-alvo" value={client.briefing.publicoPersona.publicoAlvo} icon={Users} />}
                                {client.briefing.publicoPersona?.persona && <InfoCard title="Persona ideal" value={client.briefing.publicoPersona.persona} icon={User} />}
                                {client.briefing.publicoPersona?.dores && <InfoCard title="Dores que resolve" value={client.briefing.publicoPersona.dores} icon={Frown} />}
                                {client.briefing.publicoPersona?.duvidasObjecoes && <InfoCard title="Dúvidas e Objeções" value={client.briefing.publicoPersona.duvidasObjecoes} icon={Info} />}
                                {client.briefing.publicoPersona?.impedimentoCompra && <InfoCard title="Impedimento de Compra" value={client.briefing.publicoPersona.impedimentoCompra} icon={Info} />}
                                {client.briefing.publicoPersona?.canaisUtilizados && <InfoCard title="Canais Utilizados" value={client.briefing.publicoPersona.canaisUtilizados} icon={Megaphone} />}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-7">
                           <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Megaphone className="h-5 w-5" />Comunicação e Expectativas</h3></AccordionTrigger>
                           <AccordionContent className="space-y-4 pt-4">
                               {client.briefing.comunicacaoExpectativas?.investimentoAnterior && <InfoCard title="Investimento Anterior em Marketing" value={client.briefing.comunicacaoExpectativas.investimentoAnterior} icon={Info} />}
                               {client.briefing.comunicacaoExpectativas?.conteudosPreferidos && <InfoCard title="Conteúdos Preferidos" value={client.briefing.comunicacaoExpectativas.conteudosPreferidos} icon={Info} />}
                               {client.briefing.comunicacaoExpectativas?.naoFazer && <InfoCard title="O que não fazer" value={client.briefing.comunicacaoExpectativas.naoFazer} icon={Info} />}
                               {client.briefing.comunicacaoExpectativas?.tomDeVoz && <InfoCard title="Tom de Voz" value={client.briefing.comunicacaoExpectativas.tomDeVoz} icon={Info} />}
                           </AccordionContent>
                       </AccordionItem>
                         <AccordionItem value="item-4">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Goal className="h-5 w-5" />Metas e Objetivos</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               {client.briefing.metasObjetivos?.objetivoPrincipal && <InfoCard title="Objetivo Principal (Próximos 3 meses)" value={client.briefing.metasObjetivos.objetivoPrincipal} icon={Target} />}
                               {client.briefing.metasObjetivos?.metasEspecificas && <InfoCard title="Metas Específicas" value={client.briefing.metasObjetivos.metasEspecificas} icon={CheckCircle} />}
                               {client.briefing.metasObjetivos?.sazonalidade && <InfoCard title="Sazonalidade / Campanhas Importantes" value={client.briefing.metasObjetivos.sazonalidade} icon={Calendar} />}
                               {client.briefing.metasObjetivos?.verbaTrafego && <InfoCard title="Verba para Tráfego Pago" value={client.briefing.metasObjetivos.verbaTrafego} icon={Users} />}
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-5">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><Users className="h-5 w-5" />Equipe de Mídia Social</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               {client.briefing.equipeMidiaSocial?.formatoConteudo && <InfoCard title="Formato de Conteúdo Preferido" value={client.briefing.equipeMidiaSocial.formatoConteudo} icon={Info} />}
                               {client.briefing.equipeMidiaSocial?.temasObrigatorios && <InfoCard title="Temas Obrigatórios ou a Evitar" value={client.briefing.equipeMidiaSocial.temasObrigatorios} icon={Info} />}
                               {client.briefing.equipeMidiaSocial?.disponibilidadeGravacao && <InfoCard title="Disponibilidade para Gravação" value={client.briefing.equipeMidiaSocial.disponibilidadeGravacao} icon={Camera} />}
                               {client.briefing.equipeMidiaSocial?.responsavelGravacao && <InfoCard title="Responsável pela Gravação" value={client.briefing.equipeMidiaSocial.responsavelGravacao} icon={User} />}
                               {client.briefing.equipeMidiaSocial?.principaisGatilhos && <InfoCard title="Principais Gatilhos a Explorar" value={client.briefing.equipeMidiaSocial.principaisGatilhos} icon={Target} />}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger><h3 className="flex items-center gap-2 text-xl font-semibold text-primary"><DollarSign className="h-5 w-5" />Equipe de Tráfego Pago</h3></AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               {client.briefing.equipeTrafegoPago?.principalProdutoAnunciar && <InfoCard title="Principal Produto/Serviço a Anunciar" value={client.briefing.equipeTrafegoPago.principalProdutoAnunciar} icon={Info} />}
                               {client.briefing.equipeTrafegoPago?.objetivoCampanhas && <InfoCard title="Objetivo das Campanhas" value={client.briefing.equipeTrafegoPago.objetivoCampanhas} icon={Target} />}
                               {client.briefing.equipeTrafegoPago?.promocaoCondicao && <InfoCard title="Promoção ou Condição Especial" value={client.briefing.equipeTrafegoPago.promocaoCondicao} icon={Info} />}
                               {client.briefing.equipeTrafegoPago?.localVeiculacao && <InfoCard title="Local de Veiculação" value={client.briefing.equipeTrafegoPago.localVeiculacao} icon={Info} />}
                               {client.briefing.equipeTrafegoPago?.limiteVerba && <InfoCard title="Limite de Verba / Ajustes" value={client.briefing.equipeTrafegoPago.limiteVerba} icon={Info} />}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Análise Estratégica (Interno)</CardTitle>
                        <CardDescription>Principais dores da persona e análise de concorrentes. Editável pela equipe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="personaPains" className="flex items-center gap-2 text-md font-semibold text-primary"><Frown className="h-5 w-5" /> Principais Dores da Persona (Compilado)</Label>
                            <Textarea
                                id="personaPains"
                                placeholder="Ex: Dificuldade em encontrar fornecedores confiáveis, falta de tempo para gerenciar redes sociais, baixo retorno sobre o investimento em marketing..."
                                value={personaPains}
                                onChange={(e) => setPersonaPains(e.target.value)}
                                className="min-h-[120px]"
                            />
                        </div>

                        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['competitors']}>
                            <AccordionItem value="competitors">
                                <AccordionTrigger>
                                    <Label className="flex items-center gap-2 text-md font-semibold text-primary"><Users className="h-5 w-5" /> Análise de Concorrentes</Label>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    {competitors.map((competitor, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                            <h4 className="font-semibold text-foreground">Concorrente {index + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`competitor-name-${index}`}>Nome do Concorrente</Label>
                                                    <Input id={`competitor-name-${index}`} value={competitor.name} onChange={(e) => handleProfileChange(index, 'name', e.target.value, 'competitor')} placeholder="Nome da empresa concorrente" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`competitor-perfil-${index}`}>@ ou Link</Label>
                                                    <Input id={`competitor-perfil-${index}`} value={competitor.perfil} onChange={(e) => handleProfileChange(index, 'perfil', e.target.value, 'competitor')} placeholder="@concorrente" />
                                                </div>
                                            </div>
                                             <div className="space-y-1">
                                                <Label htmlFor={`competitor-detalhes-${index}`}>Detalhes</Label>
                                                <Textarea id={`competitor-detalhes-${index}`} value={competitor.detalhes || ''} onChange={(e) => handleProfileChange(index, 'detalhes', e.target.value, 'competitor')} placeholder="Pontos fortes, fracos, estratégia observada..." />
                                            </div>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="inspirations">
                                <AccordionTrigger>
                                    <Label className="flex items-center gap-2 text-md font-semibold text-primary"><Lightbulb className="h-5 w-5" /> Inspirações</Label>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    {inspirations.map((inspiration, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                            <h4 className="font-semibold text-foreground">Inspiração {index + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`inspiration-name-${index}`}>Nome do Perfil/Marca</Label>
                                                    <Input id={`inspiration-name-${index}`} value={inspiration.name} onChange={(e) => handleProfileChange(index, 'name', e.target.value, 'inspiration')} placeholder="Nome do perfil" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`inspiration-perfil-${index}`}>@ ou Link</Label>
                                                    <Input id={`inspiration-perfil-${index}`} value={inspiration.perfil} onChange={(e) => handleProfileChange(index, 'perfil', e.target.value, 'inspiration')} placeholder="@inspiracao" />
                                                </div>
                                            </div>
                                             <div className="space-y-1">
                                                <Label htmlFor={`inspiration-detalhes-${index}`}>Detalhes</Label>
                                                <Textarea id={`inspiration-detalhes-${index}`} value={inspiration.detalhes || ''} onChange={(e) => handleProfileChange(index, 'detalhes', e.target.value, 'inspiration')} placeholder="O que você admira? O que podemos aprender?" />
                                            </div>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>


                        <div className="flex justify-end">
                            <Button onClick={handleStrategicUpdate} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSaving ? 'Salvando...' : 'Salvar Análise Estratégica'}
                            </Button>
                        </div>
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
                                    <div className="flex items-center justify-between w-full group pr-4">
                                        <AccordionTrigger className="flex-1 py-4">
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold">Relatório de {format(new Date(report.createdAt), 'dd/MM/yyyy')}</span>
                                                <span className="text-sm text-muted-foreground group-hover:hidden [.group:not(:hover)]:[data-state=closed]:inline [.group:not(:hover)]:[data-state=open]:hidden">Clique para expandir</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2">
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
        </>
        )}
        

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

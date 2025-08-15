
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Calendar as CalendarIcon, AlertTriangle, Info, User, Instagram, BookOpen } from "lucide-react";
import { Separator } from "./ui/separator";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { addDays, format, getDay, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, writeBatch, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
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


export type { PodcastData };

interface PodcastTabProps {
    podcastData?: PodcastData;
    onPodcastChange: (podcastId: keyof PodcastData, guestIndex: number, field: 'guestName' | 'instagram', value: string) => void;
    onPodcastCheck: (podcastId: keyof PodcastData, checked: boolean) => void;
}

type EpisodeConfig = {
    id: string;
    title: string;
    type: 'saude_estetica' | 'empresario' | 'geral';
    guestCount: number;
    dayOfWeek: number; // 1 (Mon) to 5 (Fri)
};

const weeklyEpisodeConfig: EpisodeConfig[] = [
    { id: 'podcast2', title: 'EPISÓDIO 2 - EMPRESÁRIO', type: 'empresario', guestCount: 1, dayOfWeek: 1 }, // Monday
    { id: 'podcast1', title: 'EPISÓDIO 1 - SAÚDE E ESTÉTICA', type: 'saude_estetica', guestCount: 2, dayOfWeek: 2 }, // Tuesday
    { id: 'podcast3', title: 'EPISÓDIO 3 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 3 }, // Wednesday - Assuming GERAL here now
    { id: 'podcast4', title: 'EPISÓDIO 4 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 4 }, // Thursday
    { id: 'podcast5', title: 'EPISÓDIO 5 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 5 }, // Friday
];

export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<Record<string, ScheduledEpisode>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen to schedule changes in real-time
  useEffect(() => {
    const scheduleColRef = collection(db, 'podcast_schedule');
    const unsubscribe = onSnapshot(scheduleColRef, (snapshot) => {
        const newSchedule: Record<string, ScheduledEpisode> = {};
        snapshot.forEach(doc => {
            newSchedule[doc.id] = doc.data() as ScheduledEpisode;
        });
        setSchedule(newSchedule);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching schedule:", error);
        toast({ title: "Erro ao carregar agendamentos", variant: "destructive" });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        setSelectedDate(date);
    }
  };

  const handleGuestChange = async (episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
      const scheduledEpisode = schedule[episodeId];
      if (!scheduledEpisode || !user?.uid) return;
      
      const newGuests = [...scheduledEpisode.guests];
      newGuests[guestIndex] = { ...newGuests[guestIndex], [field]: value };
      
      const isFilled = newGuests.every(g => g.guestName.trim() !== '');

      const updatedSchedule: ScheduledEpisode = {
          ...scheduledEpisode,
          guests: newGuests,
          isFilled: isFilled,
      };

      // If the episode doesn't exist yet in the schedule (i.e., it's a new booking)
      if (!schedule[episodeId]) {
          updatedSchedule.sdrId = user.uid;
          updatedSchedule.sdrName = user.displayName || user.email || 'SDR';
      }

      setSchedule(prev => ({ ...prev, [episodeId]: updatedSchedule }));
  };
  
  const handleSaveWeek = async () => {
      if (!user) {
          toast({ title: "Usuário não autenticado", variant: "destructive" });
          return;
      }
      setIsSubmitting(true);
      const batch = writeBatch(db);

      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      
      const episodesInView = weeklyEpisodeConfig.map(config => {
        const dateForDay = addDays(start, config.dayOfWeek - 1);
        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
        return schedule[episodeId];
      }).filter(Boolean);


      try {
          episodesInView.forEach(episode => {
              if (episode.guests.some(g => g.guestName.trim() !== '')) { // Only save if there's at least one guest
                const docRef = doc(db, 'podcast_schedule', episode.id);
                batch.set(docRef, episode);
              }
          });
          
          await batch.commit();
          toast({ title: "Agendamentos Salvos!", description: `Os dados da semana foram salvos.`});
      } catch (error) {
          console.error("Error saving schedule:", error);
          toast({ title: "Erro ao salvar", description: "Não foi possível salvar as alterações.", variant: "destructive" });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    setIsSubmitting(true);
     try {
        await deleteDoc(doc(db, "podcast_schedule", episodeId));
        
        // Optimistic UI update
        setSchedule(prev => {
            const newState = {...prev};
            delete newState[episodeId];
            return newState;
        });

        toast({title: "Agendamento Excluído", description: "O episódio foi removido da agenda."})
    } catch(error) {
        console.error("Error deleting episode", error);
        toast({title: "Erro ao excluir", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarIcon /> Calendário da Semana</CardTitle>
                    <CardDescription>Selecione um dia para navegar entre as semanas.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        locale={ptBR}
                        disabled={(date) => getDay(date) === 0 || getDay(date) === 6} // Disable weekends
                         modifiers={{
                            scheduled: (date) => Object.values(schedule).some(ep => isSameDay(new Date(ep.date + "T00:00:00"), date))
                        }}
                        modifiersStyles={{
                            scheduled: {
                                fontWeight: 'bold',
                                color: 'hsl(var(--primary))',
                                border: '2px solid hsl(var(--primary))',
                            }
                        }}
                    />
                </CardContent>
            </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                       Agenda da Semana de {format(startOfSelectedWeek, 'dd/MM')}
                    </CardTitle>
                    <CardDescription>Preencha os convidados para os episódios da semana. O agendamento é colaborativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {weeklyEpisodeConfig.map(config => {
                        const dateForDay = addDays(startOfSelectedWeek, config.dayOfWeek - 1);
                        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
                        const episodeData = schedule[episodeId] || {
                            id: episodeId,
                            date: format(dateForDay, 'yyyy-MM-dd'),
                            episodeType: config.type,
                            episodeTitle: config.title,
                            guests: Array(config.guestCount).fill({ guestName: '', instagram: '' }),
                            sdrId: user?.uid || '',
                            sdrName: user?.displayName || user?.email || 'SDR',
                            isFilled: false,
                        };
                        const isScheduledByOther = schedule[episodeId] && schedule[episodeId].sdrId !== user?.uid;
                        
                        return (
                            <Card key={episodeId} className="bg-card/50">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="font-headline flex items-center text-primary text-base">
                                        <Mic className="mr-3 h-5 w-5" />
                                        {`${config.title} - ${format(dateForDay, 'dd/MM/yyyy')}`}
                                        </CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${episodeId}-filled`}
                                                checked={episodeData.isFilled}
                                                disabled // This is now read-only
                                                className={cn("h-5 w-5 rounded-md border-2", episodeData.isFilled ? "border-green-500 data-[state=checked]:bg-green-500" : "border-primary")}
                                            />
                                            <Label htmlFor={`${episodeId}-filled`} className="font-normal cursor-pointer">
                                                Preenchido
                                            </Label>
                                        </div>
                                    </div>
                                    {schedule[episodeId] && <CardDescription className="text-xs">Agendado por: {episodeData.sdrName}</CardDescription>}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {episodeData.guests.map((guest, index) => (
                                    <div key={index} className="space-y-2">
                                    <Label className="text-sm">Convidado {index + 1}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                              value={guest.guestName} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'guestName', e.target.value)} 
                                              placeholder="Nome do convidado" 
                                              className="pl-10"
                                              disabled={isScheduledByOther}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                              value={guest.instagram} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'instagram', e.target.value)} 
                                              placeholder="@instagram" 
                                              className="pl-10"
                                              disabled={isScheduledByOther}
                                            />
                                        </div>
                                    </div>
                                    </div>
                                ))}
                                {schedule[episodeId] && !isScheduledByOther && (
                                     <div className="flex justify-end pt-2">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" disabled={isSubmitting}>Excluir</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação removerá o agendamento deste episódio, liberando o horário.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteEpisode(episodeId)} className="bg-destructive hover:bg-destructive/90">Sim, excluir</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSaveWeek} disabled={isSubmitting} size="lg">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : null}
                    Salvar Alterações da Semana
                </Button>
            </div>
        </div>
    </div>
  );
}


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
import { addDays, format, getDay, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";


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
};

const episodeConfigs: EpisodeConfig[] = [
    { id: 'podcast1', title: 'EPISÓDIO 1 - SAÚDE E ESTÉTICA', type: 'saude_estetica', guestCount: 2 },
    { id: 'podcast2', title: 'EPISÓDIO 2 - EMPRESÁRIO', type: 'empresario', guestCount: 1 },
    { id: 'podcast3', title: 'EPISÓDIO 3 - GERAL', type: 'geral', guestCount: 3 },
    { id: 'podcast4', title: 'EPISÓDIO 4 - GERAL', type: 'geral', guestCount: 3 },
    { id: 'podcast5', title: 'EPISÓDIO 5 - GERAL', type: 'geral', guestCount: 3 },
];

export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  const handleGuestChange = (date: string, episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
      const scheduledEpisode = schedule[episodeId];
      if (!scheduledEpisode) return;
      
      const updatedGuests = [...scheduledEpisode.guests];
      updatedGuests[guestIndex] = { ...updatedGuests[guestIndex], [field]: value };
      
      const isFilled = updatedGuests.every(g => g.guestName.trim() !== '');

      const updatedSchedule: ScheduledEpisode = {
          ...scheduledEpisode,
          guests: updatedGuests,
          isFilled: isFilled
      };

      setSchedule(prev => ({ ...prev, [episodeId]: updatedSchedule }));
  };
  
  const handleSaveDay = async (date: string) => {
      if (!user) {
          toast({ title: "Usuário não autenticado", variant: "destructive" });
          return;
      }
      setIsSubmitting(true);
      const batch = writeBatch(db);

      const episodesForDay = Object.values(schedule).filter(ep => ep.date === date);

      try {
          episodesForDay.forEach(episode => {
              const docRef = doc(db, 'podcast_schedule', episode.id);
              batch.set(docRef, episode);
          });
          
          await batch.commit();
          toast({ title: "Agendamento salvo!", description: `Os dados para ${format(new Date(date + "T00:00:00"), 'dd/MM/yyyy')} foram salvos.`});
      } catch (error) {
          console.error("Error saving schedule:", error);
          toast({ title: "Erro ao salvar", description: "Não foi possível salvar as alterações.", variant: "destructive" });
      } finally {
          setIsSubmitting(false);
      }
  };


  const availableEpisodesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = getDay(selectedDate); // Sunday = 0, Monday = 1...
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const scheduledOnDay = Object.values(schedule).filter(ep => ep.date === dateStr).map(ep => ep.episodeTitle);

    let allowedTypes: ('saude_estetica' | 'empresario' | 'geral')[] = [];
    if (dayOfWeek === 2 || dayOfWeek === 3) { // Tuesday, Wednesday
        allowedTypes = ['saude_estetica'];
    } else if ([1, 4, 5].includes(dayOfWeek)) { // Monday, Thursday, Friday
        allowedTypes = ['empresario', 'geral'];
    }
    
    return episodeConfigs.filter(config => 
        allowedTypes.includes(config.type) && !scheduledOnDay.includes(config.title)
    );
  }, [selectedDate, schedule]);
  
  const handleBookEpisode = async (date: Date, config: EpisodeConfig) => {
      if (!user || !user.uid) return;
      
      const dateStr = format(date, 'yyyy-MM-dd');
      const episodeId = `${dateStr}-${config.id}`;
      
      const newEpisode: ScheduledEpisode = {
          id: episodeId,
          date: dateStr,
          episodeType: config.type,
          episodeTitle: config.title,
          guests: Array(config.guestCount).fill({ guestName: '', instagram: '' }),
          sdrId: user.uid,
          sdrName: user.displayName || user.email || 'SDR',
          isFilled: false,
      };

      // Optimistic update
      setSchedule(prev => ({...prev, [episodeId]: newEpisode}));

      // Persist to Firestore
      try {
          const docRef = doc(db, 'podcast_schedule', episodeId);
          await writeBatch(db).set(docRef, newEpisode).commit();
          toast({title: "Episódio agendado!", description: `${config.title} agendado para ${format(date, 'dd/MM/yyyy')}`})
      } catch (error) {
          console.error("Error booking episode", error);
          toast({title: "Erro ao agendar", variant: "destructive"});
          // Revert optimistic update
          setSchedule(prev => {
              const newState = {...prev};
              delete newState[episodeId];
              return newState;
          });
      }
  }

  const weeklyEpisodes = useMemo(() => {
    if (!selectedDate) return [];
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
    
    return Object.values(schedule)
        .filter(ep => {
            const epDate = new Date(ep.date + "T00:00:00");
            return epDate >= start && epDate <= end;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedDate, schedule]);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const scheduledForSelectedDay = Object.values(schedule).filter(ep => ep.date === dateStr).sort((a,b) => a.episodeTitle.localeCompare(b.episodeTitle));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarIcon /> Calendário</CardTitle>
                    <CardDescription>Selecione um dia para ver ou agendar os episódios.</CardDescription>
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
                            scheduled: (date) => Object.values(schedule).some(ep => ep.date === format(date, 'yyyy-MM-dd'))
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
                        Agendamentos para {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : 'Nenhum dia selecionado'}
                    </CardTitle>
                    <CardDescription>Preencha os convidados para os episódios agendados neste dia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {scheduledForSelectedDay.length > 0 ? scheduledForSelectedDay.map(ep => (
                        <Card key={ep.id} className="bg-card/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-headline flex items-center text-primary text-base">
                                    <Mic className="mr-3 h-5 w-5" />
                                    {ep.episodeTitle}
                                    </CardTitle>
                                     <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${ep.id}-filled`}
                                            checked={ep.isFilled}
                                            disabled // This is now read-only
                                            className={cn("h-5 w-5 rounded-md border-2", ep.isFilled ? "border-green-500 data-[state=checked]:bg-green-500" : "border-primary")}
                                        />
                                        <Label htmlFor={`${ep.id}-filled`} className="font-normal cursor-pointer">
                                            Preenchido
                                        </Label>
                                    </div>
                                </div>
                                <CardDescription className="text-xs">Agendado por: {ep.sdrName}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               {ep.guests.map((guest, index) => (
                                <div key={index} className="space-y-2">
                                  <Label className="text-sm">Convidado {index + 1}</Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                     <div className="relative">
                                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                         <Input value={guest.guestName} onChange={(e) => handleGuestChange(ep.date, ep.id, index, 'guestName', e.target.value)} placeholder="Nome do convidado" className="pl-10"/>
                                     </div>
                                      <div className="relative">
                                         <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                         <Input value={guest.instagram} onChange={(e) => handleGuestChange(ep.date, ep.id, index, 'instagram', e.target.value)} placeholder="@instagram" className="pl-10"/>
                                     </div>
                                  </div>
                                </div>
                               ))}
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="text-center text-muted-foreground p-6">Nenhum episódio agendado para este dia.</div>
                    )}
                    
                    {selectedDate && scheduledForSelectedDay.length > 0 && (
                        <div className="flex justify-end pt-4">
                            <Button onClick={() => handleSaveDay(dateStr)} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : null}
                                Salvar Agendamentos do Dia
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>

             {selectedDate && (
                <Card>
                    <CardHeader>
                        <CardTitle>Agendar Novo Episódio</CardTitle>
                        <CardDescription>Escolha um episódio disponível para agendar em {format(selectedDate, 'dd/MM/yyyy')}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {availableEpisodesForSelectedDate.length > 0 ? availableEpisodesForSelectedDate.map(config => (
                            <div key={config.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                <span>{config.title}</span>
                                <Button size="sm" onClick={() => handleBookEpisode(selectedDate, config)}>Agendar</Button>
                            </div>
                        )) : (
                            <div className="text-center text-muted-foreground p-4">
                                <Info className="mx-auto h-6 w-6 mb-2"/>
                                <p>Nenhum tipo de episódio disponível para este dia ou todos já foram agendados.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen/> Agenda da Semana</CardTitle>
                    <CardDescription>Visão geral dos episódios agendados para esta semana.</CardDescription>
                </CardHeader>
                <CardContent>
                    {weeklyEpisodes.length > 0 ? (
                        <div className="space-y-4">
                            {weeklyEpisodes.map(ep => (
                                <div key={ep.id} className="p-4 border rounded-lg bg-card/50">
                                    <h4 className="font-bold text-primary flex justify-between items-center">
                                        <span>{format(new Date(ep.date + 'T00:00'), "eeee, dd/MM", { locale: ptBR })}</span>
                                        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", ep.isFilled ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700")}>
                                            {ep.isFilled ? "Completo" : "Pendente"}
                                        </span>
                                    </h4>
                                    <p className="text-sm font-semibold mb-2">{ep.episodeTitle}</p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        {ep.guests.map((guest, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <User className="h-4 w-4"/> {guest.guestName || <i className='opacity-70'>Convidado {index+1}...</i>}
                                                <Instagram className="h-4 w-4"/> {guest.instagram || <i className='opacity-70'>@instagram...</i>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-6">Nenhum episódio agendado para esta semana.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

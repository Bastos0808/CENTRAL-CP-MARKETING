
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Calendar as CalendarIcon, AlertTriangle, Info, User, Instagram, BookOpen, Trash2, Palette, Users, MinusCircle, PlusCircle, Check } from "lucide-react";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { produce } from "immer";

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
    dayName: string;
};

const weeklyEpisodeConfig: EpisodeConfig[] = [
    { id: 'podcast1', title: 'EPISÓDIO 1 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 1, dayName: 'SEGUNDA' },
    { id: 'podcast2', title: 'EPISÓDIO 2 - SAÚDE E ESTÉTICA', type: 'saude_estetica', guestCount: 2, dayOfWeek: 2, dayName: 'TERÇA' },
    { id: 'podcast3', title: 'EPISÓDIO 3 - EMPRESÁRIO', type: 'empresario', guestCount: 1, dayOfWeek: 3, dayName: 'QUARTA' },
    { id: 'podcast4', title: 'EPISÓDIO 4 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 4, dayName: 'QUINTA' },
    { id: 'podcast5', title: 'EPISÓDIO 5 - GERAL', type: 'geral', guestCount: 3, dayOfWeek: 5, dayName: 'SEXTA' },
];

const generateWeeks = (baseDate: Date): Date[] => {
    const startOfCurrentWeek = startOfWeek(baseDate, { weekStartsOn: 1 });
    return Array.from({ length: 4 }).map((_, i) => addDays(startOfCurrentWeek, i * 7));
};

const sdrUserDisplayMap: Record<string, string> = {
    "Vandiego": "Van Diego",
    "heloysa.santos": "Heloysa",
    "debora.moura": "Débora",
};

const sdrUserColorMap: Record<string, string> = {
    "Vandiego": "text-orange-400",
    "heloysa.santos": "text-blue-400",
    "debora.moura": "text-purple-400",
}


export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [weeks, setWeeks] = useState(generateWeeks(new Date()));
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(weeks[0]);
  const [schedule, setSchedule] = useState<Record<string, ScheduledEpisode>>({});
  const [isLoading, setIsLoading] = useState(true);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
        const baseDate = new Date();
        const currentWeeks = generateWeeks(baseDate);
        setWeeks(currentWeeks);
        if (!currentWeeks.some(week => isSameDay(week, selectedWeekStart))) {
            setSelectedWeekStart(currentWeeks[0]);
        }
    }, 60000 * 60);

    return () => clearInterval(timer);
  }, [selectedWeekStart]);


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
  
 const handleGuestChange = useCallback((episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string, config: EpisodeConfig) => {
    if (!user?.uid || !user.displayName) return;

    const sdrName = user.displayName;
    const sdrId = user.uid;

    setSchedule(prevSchedule => {
        const newSchedule = produce(prevSchedule, draft => {
            if (!draft[episodeId]) {
                const dateForDay = addDays(selectedWeekStart, config.dayOfWeek - 1);
                const newGuests: GuestInfo[] = [];
                for (let i = 0; i < config.guestCount; i++) {
                    newGuests.push({ guestName: '', instagram: '' });
                }

                draft[episodeId] = {
                    id: episodeId,
                    date: format(dateForDay, 'yyyy-MM-dd'),
                    episodeType: config.type,
                    episodeTitle: `${config.title} - ${config.dayName} - ${format(dateForDay, 'dd/MM/yyyy')}`,
                    guests: newGuests,
                    isFilled: false,
                };
            }
            
            const episode = draft[episodeId];
            
            const guest = episode.guests[guestIndex];
            
            const canEdit = !guest.sdrId || guest.sdrId === sdrId;
            if (!canEdit) {
                 toast({ title: "Acesso Negado", description: "Você só pode editar os convidados que você mesmo agendou.", variant: "destructive" });
                 return;
            }

            guest[field] = value;
            
            if (value.trim() !== '' || (field === 'guestName' && (guest.instagram || '').trim() !== '') || (field === 'instagram' && (guest.guestName || '').trim() !== '')) {
                guest.sdrId = sdrId;
                guest.sdrName = sdrName;
            } else if ((guest.guestName || '').trim() === '' && (guest.instagram || '').trim() === '') {
                 delete guest.sdrId;
                 delete guest.sdrName;
            }

            episode.isFilled = episode.guests.every(g => g && g.sdrName);
        });

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
            const episodeToSave = newSchedule[episodeId];
            if (episodeToSave) {
                try {
                    const docRef = doc(db, 'podcast_schedule', episodeId);
                    await setDoc(docRef, episodeToSave, { merge: true });
                } catch (error) {
                    console.error("Error auto-saving schedule:", error);
                    toast({ title: "Erro de Sincronização", description: "Não foi possível salvar a alteração.", variant: "destructive" });
                }
            }
        }, 1000);

        return newSchedule;
    });
  }, [user, toast, selectedWeekStart]);


  const weeklySdrCount = useMemo(() => {
    const counts: Record<string, number> = {};
    
    Object.values(sdrUserDisplayMap).forEach(displayName => {
        counts[displayName] = 0;
    });

    weeklyEpisodeConfig.forEach(config => {
        const dateForDay = addDays(selectedWeekStart, config.dayOfWeek - 1);
        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
        const episodeData = schedule[episodeId];

        if (episodeData) {
            episodeData.guests.forEach(guest => {
                if (guest.sdrName) {
                    const displayName = sdrUserDisplayMap[guest.sdrName];
                    if (displayName) {
                        counts[displayName]++;
                    }
                }
            });
        }
    });

    return counts;
  }, [schedule, selectedWeekStart]);
  
  const checkWeekIsFilled = useCallback((weekStartDate: Date) => {
    return weeklyEpisodeConfig.every(config => {
        const dateForDay = addDays(weekStartDate, config.dayOfWeek - 1);
        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
        const episodeData = schedule[episodeId];
        return episodeData?.isFilled ?? false;
    });
  }, [schedule]);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Agendamentos da Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {Object.values(sdrUserDisplayMap).map((displayName, index) => (
                   <div key={displayName} className="flex justify-between items-center text-lg p-2 rounded-md bg-muted/50">
                       <span className="font-semibold">{index + 1}- {displayName}</span>
                       <span className="font-bold text-xl text-primary bg-background border px-3 py-1 rounded-md">
                         {weeklySdrCount[displayName] || 0}
                       </span>
                   </div>
                ))}
            </CardContent>
        </Card>
      <Card>
          <CardHeader>
              <CardTitle>
                  Agenda da Semana
              </CardTitle>
              <CardDescription>Preencha os convidados para os episódios da semana. O agendamento é colaborativo e salvo automaticamente.</CardDescription>
              <div className="flex items-center gap-2 pt-2">
                  {weeks.map((weekStart, index) => {
                      const isFilled = checkWeekIsFilled(weekStart);
                      const isSelected = isSameDay(selectedWeekStart, weekStart);

                      return (
                      <Button
                          key={weekStart.toISOString()}
                          variant={isFilled ? "secondary" : (isSelected ? 'default' : 'outline')}
                          onClick={() => setSelectedWeekStart(weekStart)}
                          className={cn({
                              'bg-green-600/80 border-green-500 text-white hover:bg-green-600': isFilled,
                              'bg-primary text-primary-foreground': isSelected && !isFilled,
                          })}
                      >
                         {isFilled && <Check className="mr-2 h-4 w-4" />}
                          {`Semana ${index + 1} (${format(weekStart, 'dd/MM')} - ${format(endOfWeek(weekStart, {weekStartsOn: 1}), 'dd/MM')})`}
                      </Button>
                  )})}
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
              {weeklyEpisodeConfig.map(config => {
                  const dateForDay = addDays(selectedWeekStart, config.dayOfWeek - 1);
                  const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
                  const episodeData = schedule[episodeId] || {
                      id: episodeId,
                      date: format(dateForDay, 'yyyy-MM-dd'),
                      episodeType: config.type,
                      episodeTitle: `${config.title} - ${config.dayName} - ${format(dateForDay, 'dd/MM/yyyy')}`,
                      guests: Array.from({ length: config.guestCount }, () => ({ guestName: '', instagram: '' })),
                      isFilled: false,
                  };
                  
                  return (
                      <Card key={episodeId} className="bg-card/50">
                          <CardHeader>
                              <div className="flex items-center justify-between">
                                  <CardTitle className={cn("font-headline flex items-center text-base", episodeData.isFilled && "text-green-400")}>
                                      <Mic className="mr-3 h-5 w-5" />
                                      {episodeData.episodeTitle}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2">
                                      <Checkbox
                                          id={`${episodeId}-filled`}
                                          checked={episodeData.isFilled}
                                          disabled
                                          className={cn("h-6 w-6 rounded-md border-2", episodeData.isFilled ? "border-green-400 data-[state=checked]:bg-green-400" : "border-primary")}
                                      />
                                      <Label htmlFor={`${episodeId}-filled`} className="font-normal cursor-pointer text-base">
                                          Preenchido
                                      </Label>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          {Array.from({ length: config.guestCount }).map((_, index) => {
                              const guest = episodeData.guests[index] || { guestName: '', instagram: '' };
                              const guestSdrName = guest.sdrName;
                              const isGuestFilled = guest && (guest.guestName || guest.instagram);
                              const sdrColorClass = guestSdrName ? sdrUserColorMap[guestSdrName] || 'text-muted-foreground' : 'text-muted-foreground';

                              return (
                              <div key={`${episodeId}-guest-${index}-name`} className="space-y-2 p-3 rounded-lg border border-muted/30 bg-muted/30">
                                  <div className="flex justify-between items-center">
                                      <Label htmlFor={`${episodeId}-guest-${index}-name`} className={cn("text-sm", isGuestFilled ? "text-green-400" : "text-muted-foreground")}>
                                          Convidado {index + 1}
                                           {guestSdrName && (
                                            <span className={cn("font-semibold ml-2", sdrColorClass)}>
                                                (Agendado por: {sdrUserDisplayMap[guestSdrName] || guestSdrName})
                                            </span>
                                          )}
                                      </Label>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div className="relative">
                                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input 
                                              key={`${episodeId}-guest-${index}-name`}
                                              id={`${episodeId}-guest-${index}-name`}
                                              value={guest?.guestName || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'guestName', e.target.value, config)} 
                                              placeholder="Nome do convidado" 
                                              className="pl-10"
                                              disabled={guest.sdrId && guest.sdrId !== user?.uid}
                                          />
                                      </div>
                                      <div className="relative">
                                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input 
                                              key={`${episodeId}-guest-${index}-instagram`}
                                              value={guest?.instagram || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'instagram', e.target.value, config)} 
                                              placeholder="@instagram" 
                                              className="pl-10"
                                              disabled={guest.sdrId && guest.sdrId !== user?.uid}
                                          />
                                      </div>
                                  </div>
                              </div>
                              )
                          })}
                          </CardContent>
                      </Card>
                  )
              })}
          </CardContent>
      </Card>
    </div>
  );
}

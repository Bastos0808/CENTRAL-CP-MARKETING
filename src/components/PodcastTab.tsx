
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Check } from "lucide-react";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { User, Instagram } from "lucide-react";

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
  
 const handleGuestChange = useCallback(async (episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
    if (!user?.uid || !user.displayName) return;

    const sdrName = user.displayName;
    const sdrId = user.uid;

    const episodeToUpdate = schedule[episodeId];
    if (!episodeToUpdate) return;
    
    const guestToUpdate = episodeToUpdate.guests[guestIndex];
    if (guestToUpdate && guestToUpdate.sdrId && guestToUpdate.sdrId !== sdrId) {
        toast({ title: "Acesso Negado", description: "Você só pode editar os convidados que você mesmo agendou.", variant: "destructive" });
        return;
    }

    const updatedGuests = [...episodeToUpdate.guests];
    const updatedGuest: GuestInfo = { ...updatedGuests[guestIndex] };

    updatedGuest[field] = value;
    
    const hasName = field === 'guestName' ? value.trim() !== '' : (updatedGuest.guestName || '').trim() !== '';
    const hasInsta = field === 'instagram' ? value.trim() !== '' : (updatedGuest.instagram || '').trim() !== '';

    if (hasName || hasInsta) {
        updatedGuest.sdrId = sdrId;
        updatedGuest.sdrName = sdrName;
    } else {
        delete updatedGuest.sdrId;
        delete updatedGuest.sdrName;
    }
    updatedGuests[guestIndex] = updatedGuest;
    
    const isNowFilled = updatedGuests.every(g => g && g.sdrName);

    const updatedEpisode: ScheduledEpisode = {
        ...episodeToUpdate,
        guests: updatedGuests,
        isFilled: isNowFilled,
    };
    
    // Optimistic UI update
    setSchedule(prev => ({ ...prev, [episodeId]: updatedEpisode }));
    
    try {
        const docRef = doc(db, 'podcast_schedule', episodeId);
        await setDoc(docRef, updatedEpisode, { merge: true });
    } catch (error) {
        console.error("Error saving schedule:", error);
        toast({ title: "Erro de Sincronização", description: "Não foi possível salvar a alteração.", variant: "destructive" });
        // Revert optimistic update on error
        setSchedule(prev => ({ ...prev, [episodeId]: episodeToUpdate }));
    }

  }, [user, toast, schedule]);


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
                if (guest && guest.sdrName) {
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
  
  const calculateVacanciesForWeek = useCallback((weekStartDate: Date): number => {
    const totalSlots = 12;
    let filledSlots = 0;

    weeklyEpisodeConfig.forEach(config => {
        const dateForDay = addDays(weekStartDate, config.dayOfWeek - 1);
        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
        const episodeData = schedule[episodeId];

        if (episodeData) {
            episodeData.guests.forEach(guest => {
                if (guest && guest.sdrName) {
                    filledSlots++;
                }
            });
        }
    });
    return totalSlots - filledSlots;
  }, [schedule]);
  
  const checkWeekIsFilled = useCallback((weekStartDate: Date) => {
    return calculateVacanciesForWeek(weekStartDate) === 0;
  }, [calculateVacanciesForWeek]);


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
                <CardTitle className="flex items-center gap-2">Agendamentos da Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {Object.entries(sdrUserDisplayMap)
                    .sort(([keyA, nameA], [keyB, nameB]) => nameA.localeCompare(nameB))
                    .map(([sdrKey, displayName], index) => (
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
                      const vacancies = calculateVacanciesForWeek(weekStart);

                      return (
                      <Button
                          key={weekStart.toISOString()}
                          variant={'outline'}
                          onClick={() => setSelectedWeekStart(weekStart)}
                          className={cn("h-auto flex-col p-3", {
                              'bg-green-600 border-green-500 text-white hover:bg-green-700': isFilled && !isSelected,
                              'bg-green-700 border-green-600 text-white ring-2 ring-white ring-offset-2 ring-offset-background': isFilled && isSelected,
                              'bg-primary text-primary-foreground hover:bg-primary/90': isSelected && !isFilled,
                          })}
                      >
                         <div className="flex items-center gap-2">
                            {isFilled && <Check className="h-4 w-4" />}
                            {`Semana ${index + 1} (${format(weekStart, 'dd/MM')} - ${format(endOfWeek(weekStart, {weekStartsOn: 1}), 'dd/MM')})`}
                         </div>
                         <span className="text-xs font-normal mt-1 opacity-80">
                            {vacancies} vagas disponíveis
                         </span>
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
                              const isGuestFilled = guest && (guest.guestName && guest.guestName.trim() !== '');
                              const sdrColorClass = guestSdrName ? sdrUserColorMap[guestSdrName] || 'text-muted-foreground' : 'text-muted-foreground';

                              return (
                              <div key={`${episodeId}-guest-${index}`} className="space-y-2 p-3 rounded-lg border border-muted/30 bg-muted/30">
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
                                              id={`${episodeId}-guest-${index}-name`}
                                              value={guest?.guestName || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'guestName', e.target.value)} 
                                              placeholder="Nome do convidado" 
                                              className="pl-10"
                                              disabled={guest.sdrId && guest.sdrId !== user?.uid}
                                          />
                                      </div>
                                      <div className="relative">
                                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input 
                                              id={`${episodeId}-guest-${index}-instagram`}
                                              value={guest?.instagram || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'instagram', e.target.value)} 
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

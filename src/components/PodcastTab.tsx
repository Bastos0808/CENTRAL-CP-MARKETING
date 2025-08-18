
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Check, Trash2, User, Instagram, Users } from "lucide-react";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { addDays, format, startOfWeek, isSameDay, getDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
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
    // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const today = getDay(baseDate);
    
    // If it's Saturday (6) or Sunday (0), start from next Monday.
    // Otherwise, start from the current week's Monday.
    let startOfCurrentWeek = startOfWeek(baseDate, { weekStartsOn: 1 });
    if (today === 6 || today === 0) {
      startOfCurrentWeek = addDays(startOfCurrentWeek, 7);
    }
    
    return Array.from({ length: 4 }).map((_, i) => addDays(startOfCurrentWeek, i * 7));
};


const sdrUserDisplayMap: Record<string, { name: string; color: string }> = {
    "vandiego": { name: "Van Diego", color: "text-orange-400" },
    "debora.moura": { name: "Débora", color: "text-purple-400" },
    "heloysa.santos": { name: "Heloysa", color: "text-blue-400" },
    "comercial01": { name: "Van Diego", color: "text-orange-400" },
    "comercial02": { name: "Heloysa", color: "text-blue-400" },
    "comercial03": { name: "Débora", color: "text-purple-400" },
};

const sdrOrder = ["Van Diego", "Heloysa", "Débora"];


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
  
  const handleUpdateEpisode = useCallback(async (episodeId: string, updatedEpisode: ScheduledEpisode) => {
    try {
        const docRef = doc(db, 'podcast_schedule', episodeId);
        await setDoc(docRef, updatedEpisode, { merge: true });
    } catch (error) {
        console.error("Error saving schedule:", error);
        toast({ title: "Erro de Sincronização", description: "Não foi possível salvar a alteração.", variant: "destructive" });
    }
  }, [toast]);

 const handleGuestChange = useCallback(async (episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
    if (!user?.uid || !user.displayName) return;

    const sdrName = user.displayName;
    const sdrId = user.uid;

    const episodeToUpdate = schedule[episodeId] || {
        id: episodeId,
        date: episodeId.split('-')[0],
        episodeType: weeklyEpisodeConfig.find(c => c.id === episodeId.split('-').pop())?.type || 'geral',
        episodeTitle: '',
        guests: [],
        isFilled: false,
    };
    
    const guestToUpdate = episodeToUpdate.guests[guestIndex];
    if (guestToUpdate && guestToUpdate.sdrId && guestToUpdate.sdrId !== sdrId) {
        toast({ title: "Acesso Negado", description: "Você só pode editar os convidados que você mesmo agendou.", variant: "destructive" });
        return;
    }

    const updatedGuests = [...episodeToUpdate.guests];
    while (updatedGuests.length <= guestIndex) {
        updatedGuests.push({ guestName: '', instagram: '' });
    }
    
    const updatedGuest: GuestInfo = { ...updatedGuests[guestIndex] };

    updatedGuest[field] = value;
    
    const hasName = (field === 'guestName' ? value.trim() !== '' : (updatedGuest.guestName || '').trim() !== '');
    const hasInsta = (field === 'instagram' ? value.trim() !== '' : (updatedGuest.instagram || '').trim() !== '');

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
    
    await handleUpdateEpisode(episodeId, updatedEpisode);

  }, [user, toast, schedule, handleUpdateEpisode]);

  const handleDeleteGuest = useCallback(async (episodeId: string, guestIndex: number) => {
    if (!user?.uid) return;
    
    const episodeToUpdate = schedule[episodeId];
    if (!episodeToUpdate) return;
    
    const guestToDelete = episodeToUpdate.guests[guestIndex];
    if (!guestToDelete || (guestToDelete.sdrId && guestToDelete.sdrId !== user.uid)) {
        toast({ title: "Ação não permitida", description: "Você não pode apagar o agendamento de outro SDR.", variant: "destructive" });
        return;
    }
    
    const updatedGuests = [...episodeToUpdate.guests];
    updatedGuests[guestIndex] = { guestName: '', instagram: '' }; // Clear the slot

    const isNowFilled = updatedGuests.every(g => g && g.sdrName);
    
    const updatedEpisode: ScheduledEpisode = {
        ...episodeToUpdate,
        guests: updatedGuests,
        isFilled: isNowFilled
    };

    await handleUpdateEpisode(episodeId, updatedEpisode);

  }, [user, toast, schedule, handleUpdateEpisode]);
  
    const weeklyBookingCount = useMemo(() => {
    const counts: Record<string, number> = {};
    sdrOrder.forEach(name => {
      counts[name] = 0;
    });

    if (!selectedWeekStart || !schedule) {
      return counts;
    }

    const weekStartStr = format(selectedWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(addDays(selectedWeekStart, 6), 'yyyy-MM-dd');

    Object.values(schedule).forEach(episode => {
      if (episode.date >= weekStartStr && episode.date <= weekEndStr) {
        episode.guests.forEach(guest => {
          if (guest?.sdrName) {
            const sdrNameLower = guest.sdrName.toLowerCase();
            let matchedSdr: string | null = null;
            
            // Check against the display map to normalize names
            for (const key in sdrUserDisplayMap) {
                if (sdrNameLower.includes(key)) {
                    matchedSdr = sdrUserDisplayMap[key].name;
                    break;
                }
            }

            if (matchedSdr && counts.hasOwnProperty(matchedSdr)) {
              counts[matchedSdr]++;
            }
          }
        });
      }
    });

    return counts;
  }, [schedule, selectedWeekStart]);


  const calculateVacanciesForWeek = useCallback((weekStartDate: Date): number => {
    const totalSlots = weeklyEpisodeConfig.reduce((acc, curr) => acc + curr.guestCount, 0);
    let filledSlots = 0;

    weeklyEpisodeConfig.forEach(config => {
        const dateForDay = addDays(weekStartDate, config.dayOfWeek - 1);
        const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
        const episodeData = schedule[episodeId];

        if (episodeData) {
            episodeData.guests.forEach(guest => {
                if (guest && (guest.guestName.trim() || guest.instagram.trim())) {
                    filledSlots++;
                }
            });
        }
    });
    return totalSlots - filledSlots;
  }, [schedule]);
  
  const checkWeekIsFilled = useCallback((weekStartDate: Date) => {
    return calculateVacanciesForWeek(weekStartDate) <= 0;
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
              <CardTitle>
                  Agenda da Semana
              </CardTitle>
              <CardDescription>Preencha os convidados para os episódios da semana. O agendamento é colaborativo e salvo automaticamente.</CardDescription>
              <div className="flex items-center gap-2 pt-2">
                  {weeks.map((weekStart, index) => {
                      const weekEnd = addDays(weekStart, 4); // Monday to Friday
                      const isFilled = checkWeekIsFilled(weekStart);
                      const isSelected = isSameDay(selectedWeekStart, weekStart);
                      const vacancies = calculateVacanciesForWeek(weekStart);

                      return (
                      <Button
                          key={weekStart.toISOString()}
                          variant={'outline'}
                          onClick={() => setSelectedWeekStart(weekStart)}
                           className={cn("h-auto flex-col p-3 transition-all", {
                              'bg-green-600 border-green-500 text-white hover:bg-green-700 hover:text-white': isFilled,
                              'bg-primary text-primary-foreground hover:bg-primary/90': isSelected && !isFilled,
                              'ring-2 ring-primary ring-offset-2 ring-offset-background': isSelected && !isFilled,
                              'hover:!bg-green-600/90': isFilled && !isSelected,
                           })}
                      >
                         <div className="flex items-center gap-2">
                            {isFilled && <Check className="h-4 w-4" />}
                            {`Semana ${index + 1} (${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')})`}
                         </div>
                         <span className="text-xs font-normal mt-1 opacity-80">
                            {vacancies > 0 ? `${vacancies} vagas disponíveis` : `Semana Cheia`}
                         </span>
                      </Button>
                  )})}
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Agendamentos da Semana</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                        {sdrOrder.map((sdrName) => {
                             const sdrInfo = Object.values(sdrUserDisplayMap).find(info => info.name === sdrName) || { color: 'text-foreground' };
                             const count = weeklyBookingCount[sdrName] || 0;
                             return (
                                <div key={sdrName} className="p-4 border rounded-lg bg-muted/50 flex flex-col items-center justify-center">
                                    <Label className={cn("text-lg font-bold", sdrInfo.color)}>{sdrName}</Label>
                                    <p className="text-3xl font-bold">{count}</p>
                                </div>
                             )
                        })}
                  </CardContent>
              </Card>

              {weeklyEpisodeConfig.map(config => {
                  const dateForDay = addDays(selectedWeekStart, config.dayOfWeek - 1);
                  const episodeId = `${format(dateForDay, 'yyyy-MM-dd')}-${config.id}`;
                  
                  const existingData = schedule[episodeId];
                  const episodeTitle = `${config.title} - ${config.dayName} - ${format(dateForDay, 'dd/MM/yyyy')}`;
                  const episodeData: ScheduledEpisode = {
                        id: episodeId,
                        date: format(dateForDay, 'yyyy-MM-dd'),
                        episodeType: config.type,
                        episodeTitle: episodeTitle,
                        guests: existingData?.guests || Array.from({ length: config.guestCount }, () => ({ guestName: '', instagram: '' })),
                        isFilled: existingData?.isFilled || false,
                  };
                  
                  const isEpisodeFilled = episodeData.guests.every(g => g && (g.guestName.trim() || g.instagram.trim()));

                  return (
                      <Card key={episodeId} className="bg-card/50">
                          <CardHeader>
                              <div className="flex items-center justify-between">
                                  <CardTitle className={cn("font-headline flex items-center text-base", isEpisodeFilled && "text-green-400")}>
                                      <Mic className="mr-3 h-5 w-5" />
                                      {episodeData.episodeTitle}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2">
                                      <Checkbox
                                          id={`${episodeId}-filled`}
                                          checked={isEpisodeFilled}
                                          disabled
                                          className={cn("h-6 w-6 rounded-md border-2", isEpisodeFilled ? "border-green-400 data-[state=checked]:bg-green-400" : "border-primary")}
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
                              const isBookedByCurrentUser = guest.sdrId === user?.uid;
                              const isBooked = !!guest.sdrId;

                              const sdrInfo = Object.values(sdrUserDisplayMap).find(info => {
                                  const normalizedSdrName = guestSdrName?.toLowerCase().replace(/\s+/g, '').replace('@cpmarketing.com.br', '');
                                  return normalizedSdrName ? Object.keys(sdrUserDisplayMap).some(key => normalizedSdrName.includes(key) && sdrUserDisplayMap[key].name === info.name) : false;
                              }) || {};

                              const sdrColorClass = sdrInfo.color || 'text-muted-foreground';
                              const displayName = sdrInfo.name || guestSdrName;


                              return (
                              <div key={`${episodeId}-guest-${index}`} className="space-y-2 p-3 rounded-lg border border-muted/30 bg-muted/30">
                                  <div className="flex justify-between items-center">
                                      <Label htmlFor={`${episodeId}-guest-${index}-name`} className={cn("text-sm", isBooked ? "text-green-400" : "text-muted-foreground")}>
                                          Convidado {index + 1}
                                           {displayName && (
                                            <span className={cn("font-semibold ml-2", sdrColorClass)}>
                                                (Agendado por: {displayName})
                                            </span>
                                          )}
                                      </Label>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div className="relative flex items-center">
                                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input 
                                              id={`${episodeId}-guest-${index}-name`}
                                              value={guest?.guestName || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'guestName', e.target.value)} 
                                              placeholder="Nome do convidado" 
                                              className="pl-10 flex-1"
                                              disabled={isBooked && !isBookedByCurrentUser}
                                          />
                                      </div>
                                      <div className="relative flex items-center">
                                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input 
                                              id={`${episodeId}-guest-${index}-instagram`}
                                              value={guest?.instagram || ''} 
                                              onChange={(e) => handleGuestChange(episodeId, index, 'instagram', e.target.value)} 
                                              placeholder="@instagram" 
                                              className="pl-10 flex-1"
                                              disabled={isBooked && !isBookedByCurrentUser}
                                          />
                                           {isBookedByCurrentUser && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeleteGuest(episodeId, index)}
                                                    aria-label="Apagar convidado"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
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

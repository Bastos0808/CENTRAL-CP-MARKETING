
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Calendar as CalendarIcon, AlertTriangle, Info, User, Instagram, BookOpen, Trash2, Palette } from "lucide-react";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
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

const sdrColorsMap: Record<string, { bg: string, text: string, border: string }> = {
    'Van Diego': { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-400/50' },
    'Heloysa':   { bg: 'bg-pink-900/30', text: 'text-pink-300', border: 'border-pink-400/50' },
    'Débora':    { bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-400/50' },
};


export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [weeks, setWeeks] = useState(generateWeeks(new Date('2025-08-18T12:00:00Z')));
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(weeks[0]);
  const [schedule, setSchedule] = useState<Record<string, ScheduledEpisode>>({});
  const [isLoading, setIsLoading] = useState(true);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
        const baseDate = new Date();
        const currentWeeks = generateWeeks(new Date('2025-08-18T12:00:00Z'));
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
  
  const handleGuestChange = useCallback((episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
    if (!user?.uid || !user.displayName) return;

    // Optimistic UI update using Immer for safety
    setSchedule(prevSchedule => {
        const newSchedule = produce(prevSchedule, draft => {
            const episode = draft[episodeId];
            if (!episode) return;
    
            const guest = episode.guests[guestIndex];
            guest[field] = value;
    
            const sdrName = user.displayName || '';
    
            // Check if either field has content to assign the SDR
            if (guest.guestName.trim() !== '' || guest.instagram.trim() !== '') {
                guest.sdrId = user.uid;
                guest.sdrName = sdrName;
            } else {
                // If both are empty, clear the SDR info
                delete guest.sdrId;
                delete guest.sdrName;
            }
    
            episode.isFilled = episode.guests.every(g => g && g.guestName.trim() !== '');
        });

        // Debounced Firestore Update
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
                    // Optionally revert state here, though optimistic UI often doesn't
                }
            }
        }, 1000); // 1-second debounce

        return newSchedule;
    });
}, [user, toast]);


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
                <div className="flex items-center gap-4 pt-2">
                    <Label className="flex items-center gap-2 text-sm"><Palette className="h-4 w-4" /> Legenda:</Label>
                    {Object.entries(sdrColorsMap).map(([name, {bg, text, border}]) => (
                        <div key={name} className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center border", bg, text, border)}>
                            <User className="mr-2 h-3 w-3" />
                            {name}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                    {weeks.map((weekStart, index) => (
                        <Button
                            key={weekStart.toISOString()}
                            variant={isSameDay(selectedWeekStart, weekStart) ? 'default' : 'outline'}
                            onClick={() => setSelectedWeekStart(weekStart)}
                        >
                            {`Semana ${index + 1} (${format(weekStart, 'dd/MM')} - ${format(endOfWeek(weekStart, {weekStartsOn: 1}), 'dd/MM')})`}
                        </Button>
                    ))}
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
                        guests: Array(config.guestCount).fill({ guestName: '', instagram: '' }),
                        isFilled: false,
                    };
                    
                    return (
                        <Card key={episodeId} className="bg-card/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-headline flex items-center text-primary text-base">
                                    <Mic className="mr-3 h-5 w-5" />
                                    {episodeData.episodeTitle}
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${episodeId}-filled`}
                                            checked={episodeData.isFilled}
                                            disabled
                                            className={cn("h-5 w-5 rounded-md border-2", episodeData.isFilled ? "border-green-500 data-[state=checked]:bg-green-500" : "border-primary")}
                                        />
                                        <Label htmlFor={`${episodeId}-filled`} className="font-normal cursor-pointer">
                                            Preenchido
                                        </Label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {episodeData.guests.map((guest, index) => {
                                const guestSdrName = guest?.sdrName;
                                const sdrStyle = guestSdrName ? sdrColorsMap[guestSdrName] : null;

                                return (
                                <div key={index} className={cn("space-y-2 p-3 rounded-lg border transition-colors", sdrStyle ? `${sdrStyle.border} ${sdrStyle.bg}` : 'border-muted/30 bg-muted/30')}>
                                    <Label className={cn("text-sm", sdrStyle ? sdrStyle.text : 'text-muted-foreground')}>Convidado {index + 1}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                value={guest?.guestName || ''} 
                                                onChange={(e) => handleGuestChange(episodeId, index, 'guestName', e.target.value)} 
                                                placeholder="Nome do convidado" 
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                value={guest?.instagram || ''} 
                                                onChange={(e) => handleGuestChange(episodeId, index, 'instagram', e.target.value)} 
                                                placeholder="@instagram" 
                                                className="pl-10"
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

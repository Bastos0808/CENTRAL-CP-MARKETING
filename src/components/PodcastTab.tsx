
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Loader2, Calendar as CalendarIcon, AlertTriangle, Info, User, Instagram, BookOpen, Trash2 } from "lucide-react";
import type { GuestInfo, PodcastData, ScheduledEpisode } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from "date-fns";
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


export function PodcastTab({ podcastData, onPodcastChange, onPodcastCheck }: PodcastTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [weeks, setWeeks] = useState(generateWeeks(new Date('2025-08-18T12:00:00Z')));
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(weeks[0]);
  const [schedule, setSchedule] = useState<Record<string, ScheduledEpisode>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
        // Use a fixed date to prevent automatic updates for now, as requested.
        const baseDate = new Date('2025-08-18T12:00:00Z');
        const newWeeks = generateWeeks(baseDate);
        setWeeks(newWeeks);
        if (!newWeeks.some(week => isSameDay(week, selectedWeekStart))) {
            setSelectedWeekStart(newWeeks[0]);
        }
    }, 60000 * 60); // Check every hour

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
  
  const handleGuestChange = async (episodeId: string, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
      if (!user?.uid) return;

      const currentEpisode = schedule[episodeId] || {
          id: episodeId,
          date: episodeId.split('-')[0],
          episodeType: weeklyEpisodeConfig.find(c => c.id === episodeId.split('-').pop())?.type || 'geral',
          episodeTitle: weeklyEpisodeConfig.find(c => c.id === episodeId.split('-').pop())?.title || 'Episódio',
          guests: Array(weeklyEpisodeConfig.find(c => c.id === episodeId.split('-').pop())?.guestCount || 1).fill({ guestName: '', instagram: '' }),
          sdrId: user.uid,
          sdrName: user.displayName || user.email || 'SDR',
          isFilled: false,
      };

      const newGuests = [...currentEpisode.guests];
      if (!newGuests[guestIndex]) {
          newGuests[guestIndex] = { guestName: '', instagram: '' };
      }
      newGuests[guestIndex] = { ...newGuests[guestIndex], [field]: value };
      
      const isFilled = newGuests.every(g => g && g.guestName.trim() !== '');

      const updatedEpisode: ScheduledEpisode = {
          ...currentEpisode,
          guests: newGuests,
          isFilled: isFilled,
          sdrId: currentEpisode.sdrId || user.uid, // Persist original SDR
          sdrName: currentEpisode.sdrName || (user.displayName || user.email || 'SDR'),
      };
      
      setSchedule(prevSchedule => ({ ...prevSchedule, [episodeId]: updatedEpisode }));
      
      // Auto-save to Firestore
      try {
          const docRef = doc(db, 'podcast_schedule', episodeId);
          await writeBatch(db).set(docRef, updatedEpisode).commit();
      } catch (error) {
          console.error("Error auto-saving schedule:", error);
          toast({ title: "Erro de Sincronização", description: "Não foi possível salvar a alteração.", variant: "destructive" });
      }
  };


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
                <CardDescription>Preencha os convidados para os episódios da semana. O agendamento é colaborativo.</CardDescription>
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
                        sdrId: '',
                        sdrName: '',
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
                            ))}
                            </CardContent>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    </div>
  );
}

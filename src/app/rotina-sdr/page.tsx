

"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from 'next/image';
import {
  BarChart,
  CalendarDays,
  Check,
  ClipboardCheck,
  Lightbulb,
  ListChecks,
  Loader2,
  Target,
  Wand2,
  ListPlus,
  CalendarX2,
  Mic,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  User,
  Users,
  Trophy,
  CheckCircle,
  Circle,
  Save,
  Phone,
  MessageSquare,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { getWeekOfMonth, startOfMonth, getDate, getDay, getMonth, format, addDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { allTasks, WEEKLY_MEETING_GOAL, ptDays, AnyTask, weeklyGoals, ptMonths, scoreWeights, maxScorePerDay } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { PodcastTab, PodcastData } from "@/components/PodcastTab";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { produce } from 'immer';
import type { YearData, MonthlyData, ExtraTask, WeeklyData } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScoreIndicator } from "@/components/ScoreIndicator";


const FUNCTION_TABS = ['Podcast', 'Progresso Semanal', 'Progresso Mensal'];
const ADMIN_TABS = ['Visão Geral'];


interface SdrUser {
    id: string;
    name: string;
    email: string;
    username?: string;
}

// Sub-component for Counter Tasks to isolate state
const CounterTaskInput = ({
  value,
  onSave,
  goal,
  ...props
}: {
  value: string;
  onSave: (newValue: string) => void;
  goal?: number;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur'>) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    onSave(localValue);
  };

  return (
      <div className="flex items-center gap-3">
        <Input 
            value={localValue} 
            onChange={(e) => setLocalValue(e.target.value)} 
            onBlur={handleBlur} 
            {...props} 
        />
        {goal !== undefined && (
             <span className="text-sm font-semibold text-muted-foreground w-12 text-right">
                / {goal}
             </span>
        )}
      </div>
  );
};


// Sub-component for Extra Tasks to isolate state
const ExtraTasksTextarea = ({
  value,
  onSave,
  ...props
}: {
  value: ExtraTask[];
  onSave: (newTasks: ExtraTask[]) => void;
} & Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur'>) => {
  
  const [newExtraTaskText, setNewExtraTaskText] = useState("");

  const handleAddExtraTask = () => {
    if (!newExtraTaskText.trim()) return;
    const newTasks = [...value, { id: crypto.randomUUID(), text: newExtraTaskText, completed: false }];
    onSave(newTasks);
    setNewExtraTaskText("");
  };

  const handleRemoveExtraTask = (taskId: string) => {
    const newTasks = value.filter(task => task.id !== taskId);
    onSave(newTasks);
  };

  return (
    <div className="p-4 rounded-lg bg-card/50">
        <Label>Organizar as tarefas para o dia seguinte</Label>
        <div className="flex items-center gap-2 mt-2">
            <Input 
                value={newExtraTaskText}
                onChange={(e) => setNewExtraTaskText(e.target.value)}
                placeholder="Digite uma nova tarefa..."
                className="bg-input border-2 border-primary/50"
            />
            <Button onClick={handleAddExtraTask} size="icon"><Plus/></Button>
        </div>
        <div className="space-y-2 mt-3">
            {value.map(task => (
                <div key={task.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex-1">- {task.text}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveExtraTask(task.id)}>
                        <Trash2 className="h-4 w-4 text-destructive/70"/>
                    </Button>
                </div>
            ))}
        </div>
    </div>
  )
};


const createInitialPodcastData = (): PodcastData => ({
  podcast1: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast2: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast3: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast4: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
});

const createInitialWeeklyData = (): WeeklyData => ({
  checkedTasks: {}, counterTasks: {}, extraTasks: {}, holidays: {}, meetingsBooked: 0
})

const createInitialMonthlyData = (): MonthlyData => ({
  semana1: createInitialWeeklyData(),
  semana2: createInitialWeeklyData(),
  semana3: createInitialWeeklyData(),
  semana4: createInitialWeeklyData(),
  podcasts: createInitialPodcastData(),
});

const createInitialYearData = (): YearData => ptMonths.reduce((acc, month) => {
    acc[month] = createInitialMonthlyData();
    return acc;
}, {} as YearData);


export default function RotinaSDRPage() {
  const { toast } = useToast();
  const { user, loading: authLoading, logout } = useAuth();
  
  const [sdrList, setSdrList] = useState<SdrUser[]>([]);
  const [allSdrData, setAllSdrData] = useState<Record<string, YearData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(''); 
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const isAdmin = user?.role === 'admin';
  const effectiveUserId = user?.uid;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const yearData = useMemo(() => {
    if (!effectiveUserId) return createInitialYearData();
    return allSdrData[effectiveUserId] || createInitialYearData();
  }, [allSdrData, effectiveUserId]);

  // Effect to save data with debounce
  useEffect(() => {
    if (isDirty && !isAdmin && user?.uid) {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus('saving');
            const dataToSave = allSdrData[user.uid];
            if (dataToSave) {
                try {
                    const docRef = doc(db, 'sdr_performance', user.uid);
                    await setDoc(docRef, dataToSave, { merge: true });
                    setSaveStatus('saved');
                    setIsDirty(false);
                    setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                } catch (error) {
                    console.error("Error saving data:", error);
                    setSaveStatus('idle'); // Or an error state
                    toast({title: "Erro ao salvar", description: "Não foi possível salvar os dados.", variant: "destructive"})
                }
            }
        }, 2000); // 2-second debounce
    }
    // Cleanup timeout on unmount or when dependencies change
    return () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [allSdrData, isDirty, isAdmin, user?.uid, toast]);


   useEffect(() => {
    const fetchAllData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            if (isAdmin) {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('role', '==', 'comercial'));
                const usersSnapshot = await getDocs(q);
                
                const fetchedSdrList: SdrUser[] = [];
                 usersSnapshot.forEach(userDoc => {
                    const userData = userDoc.data();
                    let displayName = userData.username || userData.displayName || '';
                    if (!displayName && userData.email) {
                        displayName = userData.email.split('@')[0];
                    }
                    // This is the definitive filter
                    if (userData.email !== 'comercial04@cpmarketing.com.br') {
                        fetchedSdrList.push({ id: userDoc.id, name: displayName, email: userData.email, username: userData.username });
                    }
                });

                setSdrList(fetchedSdrList);
                
                const performanceDataPromises = fetchedSdrList.map(sdr => 
                    getDoc(doc(db, 'sdr_performance', sdr.id))
                );
                const performanceDocs = await Promise.all(performanceDataPromises);

                const newAllSdrData = fetchedSdrList.reduce((acc, sdr, index) => {
                    const perfDoc = performanceDocs[index];
                    acc[sdr.id] = perfDoc.exists() ? (perfDoc.data() as YearData) : createInitialYearData();
                    return acc;
                }, {} as Record<string, YearData>);
                
                setAllSdrData(newAllSdrData);

            } else if (user?.uid) { // Fetch only current user's data if not admin
                const userPerfDoc = await getDoc(doc(db, 'sdr_performance', user.uid));
                const data = userPerfDoc.exists() ? userPerfDoc.data() : createInitialYearData();

                 // Deep merge with initial data to ensure new structure is applied
                const mergedData = produce(createInitialYearData(), draft => {
                    Object.keys(data).forEach(monthKey => {
                        if (draft[monthKey]) {
                            Object.assign(draft[monthKey], data[monthKey]);
                            if (!data[monthKey].podcasts) {
                                draft[monthKey].podcasts = createInitialPodcastData();
                            }
                        } else {
                            draft[monthKey] = data[monthKey];
                        }
                    });
                });
                
                setAllSdrData({ [user.uid]: mergedData as YearData });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ title: "Erro ao buscar dados", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!authLoading) {
        fetchAllData();
    }
  }, [user, isAdmin, authLoading, toast]);
  
  const currentWeek = useMemo(() => Math.min(4, Math.max(1, Math.ceil(getDate(currentDate) / 7))), [currentDate]);
  const currentMonth = useMemo(() => ptMonths[getMonth(currentDate)], [currentDate]);
  const currentDay = useMemo(() => {
    const dayOfWeek = getDay(currentDate);
    return dayOfWeek >= 1 && dayOfWeek <= 6 ? ptDays[dayOfWeek - 1] : ptDays[0];
  }, [currentDate]);
  

  useEffect(() => {
    if (isAdmin) {
      setActiveTab("Visão Geral");
    } else {
      setActiveTab(currentDay);
    }
  }, [isAdmin, currentDay]);

  const monthlyData = yearData[currentMonth];
  const activeWeekKey = `semana${currentWeek}` as keyof MonthlyData;
  const activeDay = ptDays.includes(activeTab) ? activeTab : currentDay;
  
  const isHoliday = monthlyData?.[activeWeekKey]?.holidays[activeDay] || false;

  const previousDay = useMemo(() => {
    const activeDayIndex = ptDays.indexOf(activeDay);
    return activeDayIndex > 0 ? ptDays[activeDayIndex - 1] : ptDays[ptDays.length - 1];
  }, [activeDay]);
  
  const previousDayTasks = useMemo(() => {
    if (!effectiveUserId) return [];
    let prevWeekKey = activeWeekKey;
    let prevMonth = currentMonth;
    
    if (activeDay === 'Segunda-feira') {
        if(currentWeek > 1) {
            prevWeekKey = `semana${currentWeek - 1}` as keyof MonthlyData;
        } else {
            const currentMonthIndex = ptMonths.indexOf(currentMonth);
            if (currentMonthIndex > 0) {
                prevMonth = ptMonths[currentMonthIndex - 1];
                prevWeekKey = 'semana4';
            } else {
                return [];
            }
        }
    }
    
    const tasks = allSdrData[effectiveUserId]?.[prevMonth]?.[prevWeekKey]?.extraTasks?.[previousDay];
    return Array.isArray(tasks) ? tasks : [];
  }, [activeDay, currentWeek, allSdrData, currentMonth, previousDay, activeWeekKey, effectiveUserId]);

  const handleUpdateYearData = (updater: (draft: YearData) => void) => {
    if (!effectiveUserId) return;
    setIsDirty(true);
    setSaveStatus('idle');
    setAllSdrData(prev => produce(prev, draft => {
        if (!draft[effectiveUserId]) {
            draft[effectiveUserId] = createInitialYearData();
        }
        updater(draft[effectiveUserId]);
    }));
  };

  const handleTaskCheck = (taskId: string, isChecked: boolean) => {
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.checkedTasks[activeDay]) weekData.checkedTasks[activeDay] = {};
        weekData.checkedTasks[activeDay][taskId] = isChecked;
    });
  };
  
  const handleCounterChange = (taskId: string, value: string) => {
      handleUpdateYearData(draft => {
          const weekData = draft[currentMonth][activeWeekKey];
          if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
          weekData.counterTasks[activeDay][taskId] = value;

          if (taskId === 'daily_meetings') {
            let totalMeetings = 0;
            ptDays.forEach(day => {
                totalMeetings += Number(weekData.counterTasks?.[day]?.['daily_meetings'] || 0);
            });
            weekData.meetingsBooked = totalMeetings;
          }
      });
  };

  const handleExtraTasksChange = (tasks: ExtraTask[]) => {
      handleUpdateYearData(draft => {
          const weekData = draft[currentMonth][activeWeekKey];
          if (!weekData.extraTasks) weekData.extraTasks = {};
          weekData.extraTasks[activeDay] = tasks;
      });
  };


  const handleTogglePreviousDayTask = (taskId: string) => {
     handleUpdateYearData(draft => {
        let prevWeekKey = activeWeekKey;
        let prevMonth = currentMonth;
        
        if (activeDay === 'Segunda-feira') {
            if(currentWeek > 1) {
                prevWeekKey = `semana${currentWeek - 1}` as keyof MonthlyData;
            } else {
                const currentMonthIndex = ptMonths.indexOf(currentMonth);
                if (currentMonthIndex > 0) {
                    prevMonth = ptMonths[currentMonthIndex - 1];
                    prevWeekKey = 'semana4';
                }
            }
        }

        const tasks = draft[prevMonth]?.[prevWeekKey]?.extraTasks?.[previousDay];
        if (tasks) {
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
            }
        }
    });
  };


  const handleHolidayToggle = (isHoliday: boolean) => {
    handleUpdateYearData(draft => {
      const weekData = draft[currentMonth][activeWeekKey];
      if (!weekData.holidays) weekData.holidays = {};
      weekData.holidays[activeDay] = isHoliday;
    });
  }
  
  const handlePodcastChange = (podcastId: keyof PodcastData, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
    handleUpdateYearData(draft => {
        if (!draft[currentMonth].podcasts) draft[currentMonth].podcasts = createInitialPodcastData();
        draft[currentMonth].podcasts[podcastId].guests[guestIndex][field] = value;
    });
  };

  const handlePodcastCheck = (podcastId: keyof PodcastData, isChecked: boolean) => {
      handleUpdateYearData(draft => {
          if (!draft[currentMonth].podcasts) draft[currentMonth].podcasts = createInitialPodcastData();
          draft[currentMonth].podcasts[podcastId].done = isChecked;
      });
  };
  
    const SaveStatusIndicator = () => {
        if (isAdmin) return null;

        return (
            <div className="fixed bottom-4 right-4 z-50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background border rounded-full px-4 py-2 shadow-lg">
                    {saveStatus === 'saving' && <> <Loader2 className="h-4 w-4 animate-spin"/>Salvando...</>}
                    {saveStatus === 'saved' && lastSaved && <> <CheckCircle className="h-4 w-4 text-green-500"/>Salvo às {lastSaved}</>}
                    {saveStatus === 'idle' && isDirty && <> <Save className="h-4 w-4"/>Alterações não salvas</>}
                </div>
            </div>
        )
    }

  const HeaderKpis = () => {
    const weekData = monthlyData?.[activeWeekKey];
    if (!weekData) return null;

    const kpis = [
      { id: 'a-3', label: 'Ligações', icon: Phone },
      { id: 'm-4', label: 'Leads Instagram', icon: MessageSquare },
      { id: 'daily_meetings', label: 'Agendamentos', icon: CalendarDays },
    ];
    
    return (
      <div className="hidden sm:flex items-center gap-2">
        {kpis.map(kpi => {
           const goal = weeklyGoals[kpi.id as keyof typeof weeklyGoals]?.goal || (kpi.id === 'daily_meetings' ? WEEKLY_MEETING_GOAL : 0);
           let current = 0;

            if (kpi.id === 'daily_meetings') {
                current = weekData.meetingsBooked || 0;
            } else {
                 current = ptDays.reduce((acc, day) => {
                    const count = Number(weekData.counterTasks?.[day]?.[kpi.id] || 0);
                    return acc + count;
                }, 0);
            }

          return (
            <div key={kpi.id} className="flex items-center gap-2 p-2 rounded-lg border bg-card text-xs">
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
              <div className="font-semibold">
                <span className={cn("font-bold", current >= goal ? 'text-green-500' : 'text-primary')}>{current}</span>
                <span className="text-muted-foreground">/{goal}</span>
              </div>
            </div>
          )
        })}
      </div>
    );
  };
  
    const TeamRanking = () => {
        const month = ptMonths[getMonth(new Date())];
        
        const rankedSdrs = sdrList
            .map(sdr => {
                const sdrMonthData = allSdrData[sdr.id]?.[month];
                let totalMeetings = 0;
                if (sdrMonthData) {
                    totalMeetings = (['semana1', 'semana2', 'semana3', 'semana4'] as const)
                        .reduce((acc, weekKey) => acc + (sdrMonthData[weekKey]?.meetingsBooked || 0), 0);
                }
                return { ...sdr, totalMeetings };
            })
            .sort((a, b) => b.totalMeetings - a.totalMeetings);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy /> Ranking de Agendamentos (Mês)</CardTitle>
                    <CardDescription>Performance dos consultores no mês de {month}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Posição</TableHead>
                                <TableHead>Consultor</TableHead>
                                <TableHead className="text-right">Agendamentos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankedSdrs.map((sdr, index) => (
                                <TableRow key={sdr.id}>
                                    <TableCell className="font-bold text-lg">{index + 1}º</TableCell>
                                    <TableCell>{sdr.name}</TableCell>
                                    <TableCell className="text-right font-bold text-lg">{sdr.totalMeetings}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }


  const AdminView = () => {
    const [selectedSdr, setSelectedSdr] = useState('all');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: startOfMonth(new Date()),
      to: new Date(),
    });
    
    const calculateScoreForRange = (sdrId: string, range: DateRange | undefined) => {
        if (!range?.from) return 0;
        
        const sdrYearData = allSdrData[sdrId];
        if (!sdrYearData) return 0;

        const start = range.from;
        const end = range.to || range.from;
        const intervalDays = eachDayOfInterval({ start, end });
        
        let totalScore = 0;

        intervalDays.forEach(day => {
            const monthKey = ptMonths[getMonth(day)];
            const weekOfMonth = Math.min(4, Math.max(1, Math.ceil(day.getDate() / 7)));
            const weekKey = `semana${weekOfMonth}` as const;
            const dayIndex = getDay(day);
            const dayKey = dayIndex > 0 ? ptDays[dayIndex - 1] : ptDays[5];

            const weeklyData = sdrYearData[monthKey]?.[weekKey];
            if (!weeklyData || weeklyData.holidays?.[dayKey]) return;

            const dailyCounters = weeklyData.counterTasks?.[dayKey] || {};
            let score = 0;
            
            Object.keys(dailyCounters).forEach(taskId => {
                const weight = scoreWeights[taskId];
                const value = Number(dailyCounters[taskId] || '0');
                if (weight) {
                    score += value * weight;
                }
            });
            totalScore += score;
        });

        return Math.round(totalScore);
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (sdrList.length === 0) {
      return <p>Nenhum SDR encontrado.</p>;
    }

    const filteredSdrList = selectedSdr === 'all'
      ? sdrList
      : sdrList.filter(sdr => sdr.id === selectedSdr);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filtros de Performance</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <Label>Filtrar por Consultor</Label>
                        <Select value={selectedSdr} onValueChange={setSelectedSdr}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um SDR" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os SDRs</SelectItem>
                                {sdrList.map(sdr => (
                                    <SelectItem key={sdr.id} value={sdr.id}>{sdr.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex-1 space-y-2">
                        <Label>Filtrar por Período</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Escolha um período</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>
            
            <TeamRanking />

            <div className="space-y-6">
                 {filteredSdrList.map(sdr => {
                    const sdrYearData = allSdrData[sdr.id];
                    if (!sdrYearData) return null;
                    
                    const performanceScore = calculateScoreForRange(sdr.id, dateRange);

                    return (
                        <Card key={sdr.id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>{sdr.name}</CardTitle>
                                    <div className="flex items-center gap-2 text-lg">
                                        <span className="font-semibold text-muted-foreground">Nota de Performance:</span>
                                        <span className="font-bold text-primary">{performanceScore}</span>
                                    </div>
                                </div>
                                <CardDescription>Performance no período selecionado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WeeklyProgress 
                                    sdrId={sdr.id}
                                    yearData={sdrYearData}
                                    dateRange={dateRange}
                                    isMonthlyView={false} // Force calculation based on range
                                />
                            </CardContent>
                        </Card>
                    )
                 })}
            </div>
        </div>
    );
  };


  const SDRView = () => {
    const weekData = monthlyData?.[activeWeekKey];
    if(!weekData) return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    const isSaturday = activeDay === 'Sábado';
    
    const counterTasks = allTasks.filter(task => task.type === 'counter');
    const checkboxTasks = allTasks.filter(task => task.type === 'checkbox' && task.id !== 'a-7');
    
    const extraTasksForToday = weekData?.extraTasks?.[activeDay] || [];
    
    const dailyScore = useMemo(() => {
        const weeklyData = yearData[currentMonth]?.[activeWeekKey];
        if (!weeklyData) return 0;
        
        const dailyCounters = weeklyData.counterTasks?.[activeDay] || {};
        let score = 0;
        
        Object.keys(dailyCounters).forEach(taskId => {
            const weight = scoreWeights[taskId];
            const value = Number(dailyCounters[taskId] || '0');
            if (weight) {
            score += value * weight;
            }
        });

        return Math.min(score, maxScorePerDay);
    }, [yearData, currentMonth, activeWeekKey, activeDay]);


    return(
      <div className="space-y-6">
          <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold font-headline text-primary flex items-center">
                          <CalendarDays className="mr-3 h-6 w-6" />
                          {activeDay}
                      </h3>
                      <div className="flex items-center gap-2">
                          <Label htmlFor="holiday-switch">É feriado?</Label>
                          <Switch id="holiday-switch" checked={isHoliday} onCheckedChange={handleHolidayToggle} />
                      </div>
                  </div>
                  
                  {previousDayTasks && Array.isArray(previousDayTasks) && previousDayTasks.length > 0 && !isSaturday && !isHoliday && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-headline flex items-center text-md">
                          <ListPlus className="mr-3 h-5 w-5" />
                          Tarefas Planejadas (do dia anterior)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {previousDayTasks.map(task => (
                          <div
                            key={task.id}
                            onClick={() => handleTogglePreviousDayTask(task.id)}
                            className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 cursor-pointer transition-colors hover:bg-muted/70"
                          >
                            <div className={cn(
                              "h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center border-2",
                              task.completed ? "bg-green-500 border-green-500" : "border-primary"
                            )}>
                              {task.completed && <Check className="h-4 w-4 text-white" />}
                            </div>
                            <span className={cn("flex-1 text-base font-normal", task.completed && "line-through text-muted-foreground")}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}


                  {isHoliday ? (
                      <div className="text-center py-12 text-muted-foreground">
                          <CalendarX2 className="h-12 w-12 mx-auto mb-4" />
                          <p className="font-semibold">Este dia foi marcado como feriado.</p>
                          <p>As metas e tarefas estão desativadas.</p>
                      </div>
                  ) : isSaturday ? (
                     <>
                      <WeeklyProgress sdrId={effectiveUserId!} yearData={yearData} week={currentWeek} month={currentMonth} />
                   </>
                  ) : (
                    <div className="space-y-4">
                        {counterTasks.map((task) => (
                             <div key={task.id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card/50">
                                <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">{task.label}</Label>
                                <div className="flex items-center gap-3">
                                    <CounterTaskInput
                                        type="text"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        id={`${activeDay}-${task.id}`}
                                        value={weekData?.counterTasks?.[activeDay]?.[task.id] || ''}
                                        onSave={(value) => handleCounterChange(task.id, value)}
                                        className="w-24 h-11 text-base text-center font-bold bg-input border-2 border-primary/50"
                                        placeholder="0"
                                        goal={task.goal}
                                    />
                                </div>
                            </div>
                        ))}
                            
                          {/* Checkbox Tasks */}
                        <div className="space-y-4 pt-4">
                            {checkboxTasks.map(task => {
                                const isChecked = weekData.checkedTasks?.[activeDay]?.[task.id] || false;
                                return (
                                  <div
                                      key={task.id}
                                      onClick={() => handleTaskCheck(task.id, !isChecked)}
                                      className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 cursor-pointer transition-colors hover:bg-card/70"
                                  >
                                      <div className={cn(
                                          "h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center border-2",
                                          isChecked ? "bg-green-500 border-green-500" : "border-primary"
                                      )}>
                                          {isChecked && <Check className="h-4 w-4 text-white" />}
                                      </div>
                                      <span className={cn("flex-1 text-base font-normal", isChecked && "line-through text-muted-foreground")}>
                                          {task.label}
                                      </span>
                                  </div>
                              )
                            })}
                             <ExtraTasksTextarea 
                                value={extraTasksForToday}
                                onSave={handleExtraTasksChange}
                             />
                        </div>
                    </div>
                  )}
              </CardContent>
          </Card>
          
          {!isSaturday && !isHoliday && (
            <div className="space-y-6">
                <Card className="flex-1 mt-6">
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm font-medium text-center">Nota de Performance (Dia)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 flex justify-center">
                        <ScoreIndicator score={dailyScore} />
                    </CardContent>
                </Card>
                <TeamRanking />
            </div>
          )}

      </div>
    );
  }

  if (authLoading || isLoading) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const renderTabContent = () => {
    if (isAdmin) {
      if (activeTab === 'Visão Geral') return <AdminView />;
    }
    
    if (FUNCTION_TABS.includes(activeTab)) {
        if (activeTab === 'Podcast') {
            return <PodcastTab podcastData={monthlyData?.podcasts} onPodcastChange={handlePodcastChange} onPodcastCheck={handlePodcastCheck} />;
        }
        if (activeTab === 'Progresso Semanal' || activeTab === 'Progresso Mensal') {
            return <WeeklyProgress 
              sdrId={effectiveUserId!} 
              yearData={yearData} 
              week={currentWeek} 
              month={currentMonth}
              isMonthlyView={activeTab === 'Progresso Mensal'}
            />;
        }
    }

    return <SDRView />;
  };
  
    const renderNavButton = (tab: string, type: 'function') => {
        const isActive = activeTab === tab;
        const functionClasses = {
            'Podcast': isActive ? "bg-purple-600 text-white shadow-lg" : "bg-purple-600/10 text-purple-400 hover:bg-purple-600/20",
            'Progresso Semanal': isActive ? "bg-green-600 text-white shadow-lg" : "bg-green-600/10 text-green-400 hover:bg-green-600/20",
            'Progresso Mensal': isActive ? "bg-blue-600 text-white shadow-lg" : "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20",
        };
        const functionIcons = {
            'Podcast': <Mic className="h-4 w-4" />,
            'Progresso Semanal': <BarChart className="h-4 w-4" />,
            'Progresso Mensal': <BarChart className="h-4 w-4" />,
        }

        return (
            <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 text-sm py-2.5 px-3 transition-all duration-300 rounded-md flex items-center justify-center gap-2", 
                  functionClasses[tab as keyof typeof functionClasses])
                }
            >
                {functionIcons[tab as keyof typeof functionIcons]}
                {tab}
            </Button>
        );
    };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" passHref>
                <Button variant="outline" size="icon" className="h-8 w-8"><Home className="h-4 w-4" /></Button>
            </Link>
            <h1 className="text-xl font-semibold font-headline text-primary">Rotina SDR</h1>
        </div>
        <div className="flex items-center gap-4">
            {user && (<div className="flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" /><span>{user.displayName || user.email}</span></div>)}
            <Button onClick={logout} variant="outline" size="sm"><LogOut className="mr-2 h-4 w-4" />Sair</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div className="flex items-center gap-4">
             <div className="flex flex-col items-start p-2 rounded-lg border bg-card">
                <h2 className="text-xl font-bold text-primary">{currentMonth}</h2>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Semana {currentWeek}</p>
                    {FUNCTION_TABS.includes(activeTab) && !isAdmin && (
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => setActiveTab(currentDay)}>
                           <ArrowLeft className="mr-1 h-3 w-3"/>
                           Voltar para a Semana
                        </Button>
                    )}
                </div>
             </div>
           </div>
           
           <div className="flex flex-col gap-2 w-full sm:w-auto">
                {isAdmin ? (
                     <Button
                        key="Visão Geral"
                        variant="ghost"
                        onClick={() => setActiveTab('Visão Geral')}
                        className={cn(
                            "flex-1 text-sm py-2.5 px-3 transition-all duration-300 rounded-md flex items-center justify-center gap-2",
                            activeTab === 'Visão Geral' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-card/50 hover:text-card-foreground'
                        )}
                    >
                        <Users className="h-4 w-4" />
                        Visão Geral
                    </Button>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {FUNCTION_TABS.map(tab => renderNavButton(tab, 'function'))}
                    </div>
                )}
           </div>
        </div>

        <Separator className="my-6" />
        
        {renderTabContent()}

        <SaveStatusIndicator />
      </main>
    </div>
  );
}

    

    

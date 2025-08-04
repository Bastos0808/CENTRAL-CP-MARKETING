"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { getWeekOfMonth, startOfMonth, getDate, getDay, getMonth } from 'date-fns';

import { dailyRoutine, allTasks, WEEKLY_MEETING_GOAL, ptDays, AnyTask, weeklyGoals, ptMonths } from "@/lib/tasks";
import { PrioritizeTasksOutput, prioritizeTasks } from "@/ai/flows/prioritize-tasks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { PodcastTab, PodcastData } from "@/components/PodcastTab";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";


const TABS_ORDER = ['Visão Geral', ...ptDays, 'Podcast', 'Progresso Semanal', 'Progresso Mensal'];


type CheckedTasksState = Record<string, boolean>;
type CounterTasksState = Record<string, number>;
type ExtraTasksState = Record<string, string>;
type HolidaysState = Record<string, boolean>;

type WeeklyData = {
  checkedTasks: Record<string, CheckedTasksState>;
  counterTasks: Record<string, CounterTasksState>;
  extraTasks: Record<string, ExtraTasksState>;
  holidays: HolidaysState;
  meetingsBooked: number;
  podcasts: PodcastData;
};
type MonthlyData = {
  semana1: WeeklyData;
  semana2: WeeklyData;
  semana3: WeeklyData;
  semana4: WeeklyData;
};
type YearData = Record<string, MonthlyData>;


const createInitialPodcastData = (): PodcastData => ({
  podcast1: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast2: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast3: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast4: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
});


const initialWeeklyData: WeeklyData = {
  checkedTasks: {},
  counterTasks: {},
  extraTasks: {},
  holidays: {},
  meetingsBooked: 0,
  podcasts: createInitialPodcastData(),
};
const initialMonthlyData: MonthlyData = {
  semana1: JSON.parse(JSON.stringify(initialWeeklyData)),
  semana2: JSON.parse(JSON.stringify(initialWeeklyData)),
  semana3: JSON.parse(JSON.stringify(initialWeeklyData)),
  semana4: JSON.parse(JSON.stringify(initialWeeklyData)),
};
const initialYearData: YearData = ptMonths.reduce((acc, month) => {
    acc[month] = JSON.parse(JSON.stringify(initialMonthlyData));
    return acc;
}, {} as YearData);

interface SdrUser {
    id: string;
    name: string;
    email: string;
}

export default function RotinaSDRPage() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const [sdrList, setSdrList] = useState<SdrUser[]>([]);
  const [selectedSdrId, setSelectedSdrId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(TABS_ORDER[1]); // Default to Monday
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(ptMonths[new Date().getMonth()]);
  const [yearData, setYearData] = useState<YearData>(initialYearData);
  
  const [aiResponse, setAiResponse] = useState<PrioritizeTasksOutput | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  const effectiveUserId = isAdmin && selectedSdrId ? selectedSdrId : user?.uid;

  // Load data from Firestore
  useEffect(() => {
    if (!effectiveUserId) {
        if (!isAdmin) setIsLoading(false);
        return;
    }

    const fetchData = async () => {
        setIsLoading(true);
        const docRef = doc(db, 'sdr_performance', effectiveUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Basic merge to ensure new fields are added if schema changes
            const cloudData = docSnap.data();
            const mergedData = JSON.parse(JSON.stringify(initialYearData));
            Object.keys(cloudData).forEach(month => {
                if (mergedData[month]) {
                    Object.keys(cloudData[month]).forEach(week => {
                       if (mergedData[month][week]) {
                           mergedData[month][week] = { ...mergedData[month][week], ...cloudData[month][week] };
                       }
                    });
                }
            });
            setYearData(mergedData);
        } else {
            setYearData(initialYearData);
        }
        setIsLoading(false);
    };

    fetchData();
  }, [effectiveUserId, isAdmin]);

  // Save data to Firestore on change
  useEffect(() => {
    // Do not save if admin is just viewing, or if there's no user, or if it's still loading.
    if (isAdmin || !effectiveUserId || isLoading) return;

    const saveData = async () => {
        const docRef = doc(db, 'sdr_performance', effectiveUserId);
        await setDoc(docRef, yearData, { merge: true });
    };

    const handler = setTimeout(() => {
        saveData();
    }, 2000); // Debounce saves

    return () => {
        clearTimeout(handler);
    };
  }, [yearData, effectiveUserId, isLoading, isAdmin]);
  
  // Fetch SDR list for admin view
  useEffect(() => {
      if (isAdmin) {
          const fetchSdrList = async () => {
              setIsLoading(true);
              try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('role', '==', 'comercial'));
                const querySnapshot = await getDocs(q);
                const sdrs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().displayName || doc.data().email,
                    email: doc.data().email,
                }));
                setSdrList(sdrs);
              } catch(e) {
                  console.error("Failed to fetch SDRs:", e);
                  toast({ title: "Erro ao buscar SDRs", variant: "destructive" });
              } finally {
                  setIsLoading(false);
              }
          };
          fetchSdrList();
      }
  }, [isAdmin, toast]);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = getDay(today); // Sunday = 0, Monday = 1
    const dayOfMonth = getDate(today);
    const week = Math.min(4, Math.max(1, Math.ceil(dayOfMonth / 7)));
    const month = getMonth(today);

    setCurrentWeek(week);
    setCurrentMonth(ptMonths[month]);

    if(isAdmin) {
        setActiveTab("Visão Geral");
    } else if (dayOfWeek >= 1 && dayOfWeek <= 6) { 
        setActiveTab(ptDays[dayOfWeek - 1]);
    } else {
        setActiveTab(ptDays[0]); // Default to Monday on weekends for non-admins
    }
  }, [isAdmin]);

  const monthlyData = yearData[currentMonth];
  const activeWeekKey = `semana${currentWeek}` as keyof MonthlyData;
  const activeDay = ptDays.includes(activeTab) ? activeTab : ptDays[0];
  
  const isHoliday = monthlyData?.[activeWeekKey]?.holidays[activeDay] || false;

  const previousDay = useMemo(() => {
    const activeDayIndex = ptDays.indexOf(activeDay);
    return activeDayIndex > 0 ? ptDays[activeDayIndex - 1] : ptDays[ptDays.length - 1];
  }, [activeDay]);
  
  const previousDayTasks = useMemo(() => {
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
                return ""; // No previous month data in this year
            }
        }
    }
    
    return yearData[prevMonth]?.[prevWeekKey]?.extraTasks[previousDay] || "";
  }, [activeDay, currentWeek, yearData, currentMonth, previousDay, activeWeekKey]);

  const handleUpdateYearData = useCallback((updater: (draft: YearData) => void) => {
    setYearData(currentData => {
        const draft = JSON.parse(JSON.stringify(currentData));
        updater(draft);
        return draft;
    });
  }, []);

  const handleTaskCheck = (taskId: string, isChecked: boolean) => {
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.checkedTasks[activeDay]) weekData.checkedTasks[activeDay] = {};
        weekData.checkedTasks[activeDay][taskId] = isChecked;
    });
  };
  
  const handleCounterChange = (taskId: string, value: string) => {
    const numValue = parseInt(value, 10);
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
        weekData.counterTasks[activeDay][taskId] = isNaN(numValue) || numValue < 0 ? 0 : numValue;
    });
  };

  const handleExtraTasksChange = (value: string) => {
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.extraTasks) weekData.extraTasks = {};
        weekData.extraTasks[activeDay] = value;
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
        const weekData = draft[currentMonth][activeWeekKey];
        weekData.podcasts[podcastId].guests[guestIndex][field] = value;
    });
  };

  const handlePodcastCheck = (podcastId: keyof PodcastData, isChecked: boolean) => {
      handleUpdateYearData(draft => {
          const weekData = draft[currentMonth][activeWeekKey];
          weekData.podcasts[podcastId].done = isChecked;
      });
  };

  const handleDailyMeetingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const meetings = isNaN(value) || value < 0 ? 0 : value;
        handleUpdateYearData(draft => {
            const weekData = draft[currentMonth][activeWeekKey];
            if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
            weekData.counterTasks[activeDay]['daily_meetings'] = meetings;
            
            let totalMeetings = 0;
            ptDays.forEach(day => {
                totalMeetings += weekData.counterTasks[day]?.['daily_meetings'] || 0;
            });
            weekData.meetingsBooked = totalMeetings;
        });
    };

  const { completedTasksCount } = useMemo(() => {
    const weekData = monthlyData?.[activeWeekKey];
    if (!weekData) return { completedTasksCount: 0 };

    const counterTasksList = allTasks.filter(t => t.type === 'counter' && !t.saturdayOnly);
    const checkedTasksForToday = weekData.checkedTasks?.[activeDay] || {};
    const counterTasksForToday = weekData.counterTasks?.[activeDay] || {};

    const completedCheckbox = Object.values(checkedTasksForToday).filter(Boolean).length;
    
    const completedCounters = counterTasksList.reduce((acc, task) => {
        if (task.type === 'counter') {
            const count = counterTasksForToday[task.id] || 0;
            if (count >= task.dailyGoal) acc++;
        }
        return acc;
    }, 0);

    return {
      completedTasksCount: completedCheckbox + completedCounters,
    };
  }, [activeDay, monthlyData, activeWeekKey]);

  const handlePrioritize = async () => {
    setIsLoadingAI(true);
    setAiResponse(null);
    try {
      const weekData = monthlyData[activeWeekKey];
      const checkedTasksForToday = weekData.checkedTasks[activeDay] || {};
      const counterTasksForToday = weekData.counterTasks[activeDay] || {};

      const remainingTaskLabels = allTasks
        .filter(task => {
            if (isHoliday || task.saturdayOnly) return false;
            if (task.type === 'checkbox') {
                return !checkedTasksForToday[task.id];
            }
            if (task.type === 'counter') {
                return (counterTasksForToday[task.id] || 0) < task.dailyGoal;
            }
            return false;
        })
        .map((task) => task.label);

      if (remainingTaskLabels.length === 0) {
        toast({ title: "Tudo pronto por hoje!", description: "Você já completou todas as tarefas do dia." });
        setIsLoadingAI(false);
        return;
      }
      
      const result = await prioritizeTasks({
        weeklyGoal: WEEKLY_MEETING_GOAL,
        meetingsBooked: weekData.meetingsBooked,
        tasksCompleted: completedTasksCount,
        tasksRemaining: remainingTaskLabels,
      });
      setAiResponse(result);
    } catch (error) {
      console.error("Error prioritizing tasks:", error);
      toast({ title: "Erro ao priorizar tarefas", variant: "destructive" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleMonthChange = (direction: 'next' | 'prev') => {
      const currentMonthIndex = ptMonths.indexOf(currentMonth);
      let nextMonthIndex = direction === 'next' ? currentMonthIndex + 1 : currentMonthIndex - 1;
      if (nextMonthIndex >= ptMonths.length) nextMonthIndex = 0;
      if (nextMonthIndex < 0) nextMonthIndex = ptMonths.length - 1;
      setCurrentMonth(ptMonths[nextMonthIndex]);
  }
  
  const AdminView = () => (
    <Card>
        <CardHeader>
            <CardTitle>Visão Geral do Time de SDRs</CardTitle>
            <CardDescription>Selecione um SDR para ver sua performance.</CardDescription>
        </CardHeader>
        <CardContent>
             <Select onValueChange={setSelectedSdrId} value={selectedSdrId || undefined}>
                <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Selecione um SDR..." />
                </SelectTrigger>
                <SelectContent>
                    {sdrList.map(sdr => (
                        <SelectItem key={sdr.id} value={sdr.id}>{sdr.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {!selectedSdrId && (
                 <div className="text-center text-muted-foreground p-8">
                    <Users className="h-10 w-10 mx-auto mb-4"/>
                    <p>Selecione um SDR para começar.</p>
                </div>
            )}
            {isLoading && selectedSdrId && (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {!isLoading && selectedSdrId && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-bold mb-4">Performance de {sdrList.find(s => s.id === selectedSdrId)?.name}</h3>
                    <WeeklyProgress monthlyData={yearData[currentMonth]} isMonthlyView={true} />
                </div>
            )}
        </CardContent>
    </Card>
  );

  const SDRView = () => {
    const weekData = monthlyData?.[activeWeekKey];
    if(!weekData) return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    const dailyMeetings = weekData.counterTasks[activeDay]?.['daily_meetings'] || 0;
    const isSaturday = activeTab === 'Sábado';
    const totalWeeklyMeetings = weekData.meetingsBooked;
    const isWeeklyGoalMet = totalWeeklyMeetings >= WEEKLY_MEETING_GOAL;
    
    return(
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="bg-card p-6 rounded-lg shadow-sm w-full lg:col-span-2 mb-4 flex justify-between items-center">
                  <h3 className="text-2xl font-bold font-headline text-primary flex items-center">
                      <CalendarDays className="mr-3 h-6 w-6" />
                      {activeTab}
                  </h3>
                  {activeTab !== 'Sábado' && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="holiday-switch">É feriado?</Label>
                      <Switch id="holiday-switch" checked={isHoliday} onCheckedChange={handleHolidayToggle} />
                    </div>
                  )}
                  {isHoliday && <p className="text-accent-foreground mt-2 font-semibold bg-accent p-2 rounded-md">Este dia foi marcado como feriado. As metas não serão contabilizadas.</p>}
              </div>

              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-4">
                     {allTasks
                        .filter(task => isSaturday ? task.saturdayOnly : !task.saturdayOnly)
                        .map((task) => (
                            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50">
                                {task.type === 'checkbox' ? (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                                id={`${activeDay}-${task.id}`}
                                                checked={weekData.checkedTasks[activeDay]?.[task.id] || false}
                                                onCheckedChange={(checked) => handleTaskCheck(task.id, !!checked)}
                                                className="h-6 w-6 rounded-md border-2 border-primary"
                                                disabled={isHoliday}
                                            />
                                            <Label htmlFor={`${activeDay}-${task.id}`} className="flex-1 text-base font-normal cursor-pointer">{task.label}</Label>
                                        </div>
                                        {task.id === 'a-7' && (
                                             <Textarea
                                                placeholder="Digite as tarefas para o dia seguinte aqui..."
                                                value={weekData.extraTasks[activeDay] || ''}
                                                onChange={(e) => handleExtraTasksChange(e.target.value)}
                                                className="w-full sm:w-1/2 bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                                                disabled={isHoliday}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">{task.label}</Label>
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <Input type="number" id={`${activeDay}-${task.id}`} value={weekData.counterTasks[activeDay]?.[task.id] || ''} onChange={(e) => handleCounterChange(task.id, e.target.value)} className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50" placeholder="0" disabled={isHoliday} />
                                            <span className={cn("text-lg font-semibold", (weekData.counterTasks[activeDay]?.[task.id] || 0) >= task.dailyGoal ? "text-green-500" : "text-red-500")}>/ {task.dailyGoal}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    }
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50">
                        <Label htmlFor={`consultorias-${activeDay}`} className="text-base font-medium flex-1 flex items-center"><Briefcase className="mr-2 h-5 w-5" />Consultorias Realizadas</Label>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Input type="number" id={`consultorias-${activeDay}`} value={dailyMeetings || ''} onChange={handleDailyMeetingsChange} className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50" placeholder="0" disabled={isHoliday || isSaturday} />
                            {!isSaturday && <span className="text-lg font-semibold text-muted-foreground">diárias</span>}
                            {isSaturday && (
                                <div className="text-right">
                                    <p className={cn("text-lg font-bold", isWeeklyGoalMet ? 'text-green-500' : 'text-red-500')}>{totalWeeklyMeetings} / {WEEKLY_MEETING_GOAL}</p>
                                    <p className={cn("text-sm font-semibold", isWeeklyGoalMet ? 'text-green-500' : 'text-red-500')}>{isWeeklyGoalMet ? 'Meta atingida!' : `Faltam ${Math.max(0, WEEKLY_MEETING_GOAL - totalWeeklyMeetings)}`}</p>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

               {previousDayTasks && !isSaturday && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center"><ListPlus className="mr-3 h-6 w-6" />Tarefas Planejadas (do dia anterior)</CardTitle>
                  </CardHeader>
                  <CardContent><div className="whitespace-pre-wrap p-4 bg-muted rounded-md text-muted-foreground">{previousDayTasks}</div></CardContent>
                </Card>
              )}
            </div>

            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader><CardTitle className="font-headline flex items-center"><Wand2 className="mr-2 text-accent" />Priorizador com IA</CardTitle><CardDescription>Deixe a IA analisar seu progresso e sugerir as próximas tarefas.</CardDescription></CardHeader>
                <CardContent>
                  <Button onClick={handlePrioritize} disabled={isLoadingAI || isSaturday || isHoliday} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">{isLoadingAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}Priorizar Tarefas</Button>
                  {isLoadingAI && (<div className="mt-4 space-y-4"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>)}
                  {aiResponse && (
                    <Alert className="mt-4 bg-secondary">
                      <ListChecks className="h-4 w-4 text-primary"/><AlertTitle className="font-headline text-primary">Tarefas Priorizadas</AlertTitle>
                      <AlertDescription className="space-y-2 text-foreground/80">
                        <p className="font-semibold mt-2">Próximos passos:</p>
                        <ul className="list-disc pl-5 space-y-1">{aiResponse.prioritizedTasks.map((task, i) => <li key={i}>{task}</li>)}</ul>
                        <p className="font-semibold pt-2">Justificativa:</p><p>{aiResponse.reasoning}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
        </div>
    );
  }

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
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}><ChevronLeft className="h-4 w-4" /></Button>
              <div className="flex flex-col items-center">
                  <Select value={currentMonth} onValueChange={setCurrentMonth}>
                      <SelectTrigger className="w-[180px] text-lg font-bold"><SelectValue placeholder="Mês" /></SelectTrigger>
                      <SelectContent>{ptMonths.map(month => (<SelectItem key={month} value={month}>{month}</SelectItem>))}</SelectContent>
                  </Select>
                  <Select value={String(currentWeek)} onValueChange={(val) => setCurrentWeek(Number(val))}>
                      <SelectTrigger className="w-[140px] text-sm mt-2"><SelectValue placeholder="Semana" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="1">Semana 1</SelectItem>
                          <SelectItem value="2">Semana 2</SelectItem>
                          <SelectItem value="3">Semana 3</SelectItem>
                          <SelectItem value="4">Semana 4</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto self-start sm:self-center">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto flex-wrap gap-2 bg-transparent p-0">
                  {TABS_ORDER.filter(tab => isAdmin || tab !== 'Visão Geral').map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="w-full text-base py-3 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-lg">
                      {tab === 'Visão Geral' && <Users className="mr-2 h-4 w-4" />}
                      {ptDays.includes(tab) && <CalendarDays className="mr-2 h-4 w-4" />}
                      {tab === 'Podcast' && <Mic className="mr-2 h-4 w-4" />}
                      {tab.includes('Progresso') && <BarChart className="mr-2 h-4 w-4" />}
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
            </Tabs>
        </div>

         <Separator />
        
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsContent value="Visão Geral" className="mt-0">{isAdmin ? <AdminView /> : <p>Você não tem permissão para ver esta área.</p>}</TabsContent>
            {ptDays.map(day => (<TabsContent key={day} value={day} className="mt-0"><SDRView/></TabsContent>))}
            <TabsContent value="Podcast" className="mt-0">
                <PodcastTab podcastData={monthlyData?.[activeWeekKey]?.podcasts} onPodcastChange={handlePodcastChange} onPodcastCheck={handlePodcastCheck} />
            </TabsContent>
            <TabsContent value="Progresso Semanal" className="mt-0">
                <WeeklyProgress monthlyData={monthlyData} />
             </TabsContent>
             <TabsContent value="Progresso Mensal" className="mt-0">
                <WeeklyProgress monthlyData={yearData[currentMonth]} isMonthlyView={true} />
             </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

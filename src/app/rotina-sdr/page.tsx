

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
} from "lucide-react";
import { getWeekOfMonth, startOfMonth, getDate, getDay, getMonth } from 'date-fns';

import { allTasks, WEEKLY_MEETING_GOAL, ptDays, AnyTask, weeklyGoals, ptMonths } from "@/lib/tasks";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { produce } from 'immer';


const TABS_ORDER = ['Visão Geral', ...ptDays, 'Podcast', 'Progresso Semanal', 'Progresso Mensal'];
const DAY_TABS = ptDays;
const FUNCTION_TABS = ['Podcast', 'Progresso Semanal', 'Progresso Mensal'];
const ADMIN_TABS = ['Visão Geral'];


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
export type YearData = Record<string, MonthlyData>;


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
const createInitialYearData = (): YearData => ptMonths.reduce((acc, month) => {
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
  const { user, loading: authLoading, logout } = useAuth();
  
  const [sdrList, setSdrList] = useState<SdrUser[]>([]);
  const [allSdrData, setAllSdrData] = useState<Record<string, YearData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(TABS_ORDER[1]); // Default to Monday
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(ptMonths[new Date().getMonth()]);
  
  const [localCounters, setLocalCounters] = useState<Record<string, string>>({});
  const [localExtraTasks, setLocalExtraTasks] = useState<string>("");
  
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

  const triggerSave = useCallback(() => {
    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(async () => {
        if (!isAdmin && user?.uid) {
            const dataToSave = allSdrData[user.uid];
            if (dataToSave) {
                const docRef = doc(db, 'sdr_performance', user.uid);
                await setDoc(docRef, dataToSave, { merge: true });
                setSaveStatus('saved');
                setIsDirty(false);
                setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            }
        } else {
           setSaveStatus('idle');
        }
    }, 2000);
  }, [allSdrData, isAdmin, user?.uid]);


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
                    let displayName = userData.displayName || '';
                    if (!displayName && userData.email) {
                        displayName = userData.email.split('@')[0];
                    }
                    fetchedSdrList.push({ id: userDoc.id, name: displayName, email: userData.email });
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
                setAllSdrData({ [user.uid]: userPerfDoc.exists() ? (userPerfDoc.data() as YearData) : createInitialYearData() });
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
        setActiveTab(ptDays[0]);
    }
  }, [isAdmin]);

  const monthlyData = yearData[currentMonth];
  const activeWeekKey = `semana${currentWeek}` as keyof MonthlyData;
  const activeDay = ptDays.includes(activeTab) ? activeTab : ptDays[0];
  
  useEffect(() => {
    const weekData = monthlyData?.[activeWeekKey];
    const counterTasksForDay = weekData?.counterTasks?.[activeDay] || {};
    const newLocalCounters: Record<string, string> = {};
    for (const taskId in counterTasksForDay) {
        newLocalCounters[taskId] = String(counterTasksForDay[taskId]);
    }
    setLocalCounters(newLocalCounters);
    
    const extraTasksForDay = weekData?.extraTasks?.[activeDay] || "";
    setLocalExtraTasks(extraTasksForDay);

  }, [activeDay, activeWeekKey, monthlyData]);

  const isHoliday = monthlyData?.[activeWeekKey]?.holidays[activeDay] || false;

  const previousDay = useMemo(() => {
    const activeDayIndex = ptDays.indexOf(activeDay);
    return activeDayIndex > 0 ? ptDays[activeDayIndex - 1] : ptDays[ptDays.length - 1];
  }, [activeDay]);
  
  const previousDayTasks = useMemo(() => {
    if (!effectiveUserId) return "";
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
                return "";
            }
        }
    }
    
    return allSdrData[effectiveUserId]?.[prevMonth]?.[prevWeekKey]?.extraTasks[previousDay] || "";
  }, [activeDay, currentWeek, allSdrData, currentMonth, previousDay, activeWeekKey, effectiveUserId]);

  const handleUpdateYearData = (updater: (draft: YearData) => void) => {
    if (!effectiveUserId) return;
    setIsDirty(true);
    setSaveStatus('idle');
    const newState = produce(allSdrData, draft => {
        if (!draft[effectiveUserId]) {
            draft[effectiveUserId] = createInitialYearData();
        }
        updater(draft[effectiveUserId]);
    });
    setAllSdrData(newState);
    triggerSave();
  };

  const handleTaskCheck = (taskId: string, isChecked: boolean) => {
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.checkedTasks[activeDay]) weekData.checkedTasks[activeDay] = {};
        weekData.checkedTasks[activeDay][taskId] = isChecked;
    });
  };
  
  const handleCounterChange = (taskId: string, value: string) => {
    setLocalCounters(prev => ({...prev, [taskId]: value}));
  };
  
  const handleCounterBlur = (taskId: string) => {
      const value = localCounters[taskId] || '';
      const numValue = value === '' ? 0 : parseInt(value, 10);
      if (isNaN(numValue)) return;

      handleUpdateYearData(draft => {
          const weekData = draft[currentMonth][activeWeekKey];
          if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
          weekData.counterTasks[activeDay][taskId] = numValue < 0 ? 0 : numValue;
      });
  };

  const handleExtraTasksChange = (value: string) => {
    setLocalExtraTasks(value);
  };
  
  const handleExtraTasksBlur = () => {
    handleUpdateYearData(draft => {
        const weekData = draft[currentMonth][activeWeekKey];
        if (!weekData.extraTasks) weekData.extraTasks = {};
        weekData.extraTasks[activeDay] = localExtraTasks;
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
    setLocalCounters(prev => ({...prev, ['daily_meetings']: e.target.value}));
  };
  
  const handleDailyMeetingsBlur = () => {
        const value = parseInt(localCounters['daily_meetings'], 10);
        const meetings = isNaN(value) || value < 0 ? 0 : value;
        
        handleUpdateYearData(draft => {
            const weekData = draft[currentMonth][activeWeekKey];
            if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
            weekData.counterTasks[activeDay]['daily_meetings'] = meetings;
            
            let totalMeetings = 0;
            ptDays.forEach(day => {
                totalMeetings += weekData.counterTasks?.[day]?.['daily_meetings'] || 0;
            });
            weekData.meetingsBooked = totalMeetings;
        });
  };

  const { completedTasksCount, weeklyProgress } = useMemo(() => {
    const weekData = monthlyData?.[activeWeekKey];
    if (!weekData) return { completedTasksCount: 0, weeklyProgress: {} };

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
    
    const weeklyTotals: Record<string, number> = {};
    const weekDays = ptDays.slice(0, 6); // Mon-Sat
    
    counterTasksList.forEach(task => {
        weeklyTotals[task.id] = 0;
        weekDays.forEach(day => {
            const dayCount = weekData.counterTasks?.[day]?.[task.id] || 0;
            weeklyTotals[task.id] += dayCount;
        });
    });


    return {
      completedTasksCount: completedCheckbox + completedCounters,
      weeklyProgress: weeklyTotals,
    };
  }, [activeDay, monthlyData, activeWeekKey]);

  const handleMonthChange = (direction: 'next' | 'prev') => {
      const currentMonthIndex = ptMonths.indexOf(currentMonth);
      let nextMonthIndex = direction === 'next' ? currentMonthIndex + 1 : currentMonthIndex - 1;
      if (nextMonthIndex >= ptMonths.length) nextMonthIndex = 0;
      if (nextMonthIndex < 0) nextMonthIndex = ptMonths.length - 1;
      setCurrentMonth(ptMonths[nextMonthIndex]);
  }

  const TeamRanking = ({ sdrList, allSdrData, currentMonth }: { sdrList: SdrUser[], allSdrData: Record<string, YearData>, currentMonth: string }) => {
    const ranking = useMemo(() => {
      return sdrList
        .map(sdr => {
          const monthData = allSdrData[sdr.id]?.[currentMonth];
          let totalMeetings = 0;
          if (monthData) {
            (['semana1', 'semana2', 'semana3', 'semana4'] as const).forEach(weekKey => {
              totalMeetings += monthData[weekKey]?.meetingsBooked || 0;
            });
          }
          return { name: sdr.name, meetings: totalMeetings, id: sdr.id };
        })
        .sort((a, b) => b.meetings - a.meetings);
    }, [sdrList, allSdrData, currentMonth]);
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy />
            Ranking de Agendamentos do Mês
          </CardTitle>
          <CardDescription>Quem mais agendou reuniões em {currentMonth}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>SDR</TableHead>
                <TableHead className="text-right">Reuniões Agendadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((sdr, index) => (
                <TableRow key={sdr.id}>
                  <TableCell className="font-bold">{index + 1}º</TableCell>
                  <TableCell>{sdr.name}</TableCell>
                  <TableCell className="text-right font-bold text-lg">{sdr.meetings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
    const SaveStatusIndicator = () => {
        if (isAdmin) return null;

        return (
            <div className="fixed bottom-4 right-4 z-50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background border rounded-full px-4 py-2 shadow-lg">
                    {saveStatus === 'saving' && <> <Loader2 className="h-4 w-4 animate-spin"/>Salvando...</>}
                    {saveStatus === 'saved' && <> <CheckCircle className="h-4 w-4 text-green-500"/>Salvo às {lastSaved}</>}
                    {saveStatus === 'idle' && isDirty && <> <Save className="h-4 w-4"/>Alterações não salvas</>}
                </div>
            </div>
        )
    }


  const AdminView = () => {
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

    const sdrsToDisplay = sdrList.filter(sdr => 
        sdr.name.includes('comercial02') || 
        sdr.name.includes('comercial03') || 
        sdr.name.includes('comercial04')
      );

    return (
        <div className="space-y-6">
            <TeamRanking sdrList={sdrList} allSdrData={allSdrData} currentMonth={currentMonth} />

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {sdrsToDisplay.map(sdr => {
                    const sdrMonthlyData = allSdrData[sdr.id]?.[currentMonth];
                    if (!sdrMonthlyData) return null;
                    return (
                        <Card key={sdr.id}>
                            <CardHeader>
                                <CardTitle>{sdr.name}</CardTitle>
                                <CardDescription>Performance de {currentMonth}</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <WeeklyProgress monthlyData={sdrMonthlyData} isMonthlyView={true} />
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

    const isSaturday = activeTab === 'Sábado';
    
    // Logic for Saturday Catch-up
    const pendingGoals = allTasks.filter((task): task is AnyTask & {type: 'counter'} => {
        if (task.type !== 'counter' || task.saturdayOnly) return false;
        const weeklyTotal = weeklyProgress[task.id] || 0;
        return weeklyTotal < task.weeklyGoal;
    });
    
    const counterTasks = allTasks.filter(task => task.type === 'counter' && !task.saturdayOnly);
    const checkboxTasks = allTasks.filter(task => task.type === 'checkbox' && !task.saturdayOnly && task.id !== 'a-7');
    const extraTask = allTasks.find(task => task.id === 'a-7');
    
    return(
      <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold font-headline text-primary flex items-center">
                      <CalendarDays className="mr-3 h-6 w-6" />
                      {activeTab}
                  </h3>
                  <div className="flex items-center gap-2">
                      <Label htmlFor="holiday-switch">É feriado?</Label>
                      <Switch id="holiday-switch" checked={isHoliday} onCheckedChange={handleHolidayToggle} />
                  </div>
              </div>

              {isHoliday ? (
                  <div className="text-center py-12 text-muted-foreground">
                      <CalendarX2 className="h-12 w-12 mx-auto mb-4" />
                      <p className="font-semibold">Este dia foi marcado como feriado.</p>
                      <p>As metas e tarefas estão desativadas.</p>
                  </div>
              ) : isSaturday ? (
                 <>
                  {pendingGoals.length > 0 ? (
                      pendingGoals.map(task => {
                          const weeklyTotal = weeklyProgress[task.id] || 0;
                          const isGoalMet = weeklyTotal >= task.weeklyGoal;
                          const currentSaturdayValue = localCounters[task.id] || '';
                          return (
                              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50 mb-4">
                                  <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">{task.label}</Label>
                                  <div className="flex items-center gap-3 w-full sm:w-auto">
                                      <Input 
                                          type="text"
                                          pattern="[0-9]*"
                                          inputMode="numeric"
                                          id={`${activeDay}-${task.id}`} 
                                          value={currentSaturdayValue} 
                                          onChange={(e) => handleCounterChange(task.id, e.target.value)} 
                                          onBlur={() => handleCounterBlur(task.id)}
                                          className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50" placeholder="0" 
                                      />
                                      <div className="text-right">
                                          <p className={cn("text-lg font-bold", isGoalMet ? 'text-green-500' : 'text-red-500')}>
                                              {weeklyTotal} / {task.weeklyGoal}
                                          </p>
                                          <p className={cn("text-sm font-semibold", isGoalMet ? 'text-green-500' : 'text-red-500')}>
                                              {isGoalMet ? 'Meta atingida!' : `Faltam ${Math.max(0, task.weeklyGoal - weeklyTotal)}`}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          )
                      })
                  ) : (
                      <div className="text-center py-12">
                          <Trophy className="h-12 w-12 mx-auto text-green-500" />
                          <p className="mt-4 text-lg font-semibold">Parabéns! Todas as metas da semana foram atingidas.</p>
                          <p className="text-muted-foreground">Bom descanso!</p>
                      </div>
                  )}
                  {renderConsultorias()}
               </>
              ) : (
                <div className="space-y-6">
                     <div className="space-y-4">
                       {counterTasks.map((task) => (
                           <div key={task.id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card/50">
                                <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">{task.label}</Label>
                                <div className="flex items-center gap-3">
                                    <Input 
                                        type="text" 
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        id={`${activeDay}-${task.id}`} 
                                        value={localCounters[task.id] || ''} 
                                        onChange={(e) => handleCounterChange(task.id, e.target.value)} 
                                        onBlur={() => handleCounterBlur(task.id)}
                                        className="w-24 h-11 text-base text-center font-bold bg-input border-2 border-primary/50" 
                                        placeholder="0" 
                                    />
                                    <span className={cn("text-base font-semibold", (parseInt(localCounters[task.id] || '0', 10) >= task.dailyGoal) ? "text-green-500" : "text-red-500")}>/ {task.dailyGoal}</span>
                                </div>
                            </div>
                      ))}
                      {renderConsultorias()}
                    </div>
                  
                  {/* Checkbox Tasks */}
                  <div className="space-y-4">
                    {checkboxTasks.map(task => {
                        const isChecked = weekData.checkedTasks?.[activeDay]?.[task.id] || false;
                        return (
                          <div
                              key={task.id}
                              onClick={() => handleTaskCheck(task.id, !isChecked)}
                              className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 cursor-pointer transition-colors hover:bg-card/70"
                          >
                              {isChecked ? (
                                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                              ) : (
                                  <Circle className="h-6 w-6 text-primary flex-shrink-0" />
                              )}
                              <span className={cn("flex-1 text-base font-normal", isChecked && "line-through text-muted-foreground")}>
                                  {task.label}
                              </span>
                          </div>
                      )
                    })}
                    {extraTask && (
                       <div className="p-4 rounded-lg bg-card/50">
                          <div onClick={() => handleTaskCheck(extraTask.id, !weekData.checkedTasks?.[activeDay]?.[extraTask.id])} className="flex items-center space-x-4 cursor-pointer">
                              {weekData.checkedTasks?.[activeDay]?.[extraTask.id] ? (
                                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                              ) : (
                                  <Circle className="h-6 w-6 text-primary flex-shrink-0" />
                              )}
                              <span className={cn("flex-1 text-base font-normal", weekData.checkedTasks?.[activeDay]?.[extraTask.id] && "line-through text-muted-foreground")}>
                                  {extraTask.label}
                              </span>
                          </div>
                          <Textarea
                              placeholder="Digite as tarefas para o dia seguinte aqui..."
                              value={localExtraTasks}
                              onChange={(e) => handleExtraTasksChange(e.target.value)}
                              onBlur={handleExtraTasksBlur}
                              className="w-full mt-2 bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary ml-10"
                              style={{width: 'calc(100% - 2.5rem)'}}
                          />
                       </div>
                    )}
                  </div>
                </div>
              )}
          </CardContent>
      </Card>
    );
  }

  const renderConsultorias = () => {
    const weekData = monthlyData?.[activeWeekKey];
    const dailyMeetings = localCounters['daily_meetings'] || '';
    const isSaturday = activeTab === 'Sábado';
    const totalWeeklyMeetings = weekData?.meetingsBooked || 0;
    const isWeeklyGoalMet = totalWeeklyMeetings >= WEEKLY_MEETING_GOAL;
    
    return (
         <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card/50">
            <Label htmlFor={`consultorias-${activeDay}`} className="text-base font-medium flex-1">
                Consultorias Realizadas
            </Label>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    id={`consultorias-${activeDay}`}
                    value={dailyMeetings}
                    onChange={handleDailyMeetingsChange}
                    onBlur={handleDailyMeetingsBlur}
                    className="w-24 h-11 text-base text-center font-bold bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="0"
                    disabled={isHoliday || isSaturday}
                />
                {!isSaturday && (
                     <span className={cn(
                        "text-base font-semibold", 
                        (parseInt(dailyMeetings || '0', 10) >= 2) ? 'text-green-500' : 'text-red-500'
                     )}>
                        / 2
                    </span>
                )}
                {isSaturday && (
                     <div className="text-right">
                        <p className={cn(
                            "text-lg font-bold", 
                            isWeeklyGoalMet ? 'text-green-500' : 'text-red-500'
                        )}>
                            {totalWeeklyMeetings} / {WEEKLY_MEETING_GOAL}
                        </p>
                        <p className={cn("text-sm font-semibold", isWeeklyGoalMet ? 'text-green-500' : 'text-red-500')}>
                            {isWeeklyGoalMet ? 'Meta atingida!' : `Faltam ${Math.max(0, WEEKLY_MEETING_GOAL - totalWeeklyMeetings)}`}
                        </p>
                    </div>
                )}
            </div>
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
    if (ptDays.includes(activeTab)) {
      return <SDRView />;
    }
    if (activeTab === 'Podcast') {
      return <PodcastTab podcastData={monthlyData?.[activeWeekKey]?.podcasts} onPodcastChange={handlePodcastChange} onPodcastCheck={handlePodcastCheck} />;
    }
    if (activeTab === 'Progresso Semanal') {
      return <WeeklyProgress weeklyData={monthlyData?.[activeWeekKey]} />;
    }
    if (activeTab === 'Progresso Mensal') {
      return <WeeklyProgress monthlyData={yearData[currentMonth]} isMonthlyView={true} />;
    }
    return null;
  };
  
  const renderNavButton = (tab: string, type: 'day' | 'function') => {
        const isActive = activeTab === tab;
        const baseClasses = "flex-1 text-sm py-2.5 px-3 transition-all duration-300 rounded-md flex items-center justify-center gap-2";
        const dayClasses = isActive ? "bg-card text-card-foreground shadow-md" : "text-muted-foreground hover:bg-card/50 hover:text-card-foreground";
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
                className={cn(baseClasses, type === 'day' ? dayClasses : functionClasses[tab as keyof typeof functionClasses])}
            >
                {type === 'day' ? <CalendarDays className="h-4 w-4" /> : functionIcons[tab as keyof typeof functionIcons]}
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
             <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}><ChevronLeft className="h-4 w-4" /></Button>
             <div className="flex flex-col items-center">
                 <Select value={currentMonth} onValueChange={setCurrentMonth}>
                     <SelectTrigger className="w-[180px] text-lg font-bold"><SelectValue placeholder="Mês" /></SelectTrigger>
                     <SelectContent>{ptMonths.map(month => (<SelectItem key={month} value={month}>{month}</SelectItem>))}</SelectContent>
                 </Select>
                {!isAdmin && (
                    <Select value={String(currentWeek)} onValueChange={(val) => setCurrentWeek(Number(val))}>
                       <SelectTrigger className="w-[140px] text-sm mt-2"><SelectValue placeholder="Semana" /></SelectTrigger>
                       <SelectContent>
                           <SelectItem value="1">Semana 1</SelectItem>
                           <SelectItem value="2">Semana 2</SelectItem>
                           <SelectItem value="3">Semana 3</SelectItem>
                           <SelectItem value="4">Semana 4</SelectItem>
                       </SelectContent>
                   </Select>
                )}
             </div>
             <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}><ChevronRight className="h-4 w-4" /></Button>
           </div>
           
           <div className="flex flex-col gap-2 w-full max-w-lg">
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
                    <>
                        <div className="grid grid-cols-3 gap-2">
                            {DAY_TABS.slice(0,3).map(day => renderNavButton(day, 'day'))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {DAY_TABS.slice(3,6).map(day => renderNavButton(day, 'day'))}
                        </div>
                    </>
                )}
                <div className="grid grid-cols-3 gap-2">
                    {FUNCTION_TABS.map(tab => renderNavButton(tab, 'function'))}
                </div>
           </div>
        </div>

        <Separator className="my-6" />
        
        {renderTabContent()}

        <SaveStatusIndicator />
      </main>
    </div>
  );
}

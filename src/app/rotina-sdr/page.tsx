
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { YearData, MonthlyData } from "@/lib/types";


const FUNCTION_TABS = ['Podcast', 'Progresso Semanal', 'Progresso Mensal'];
const ADMIN_TABS = ['Visão Geral'];


interface SdrUser {
    id: string;
    name: string;
    email: string;
}

// Sub-component for Counter Tasks to isolate state
const CounterTaskInput = ({
  value,
  onSave,
  ...props
}: {
  value: string;
  onSave: (newValue: string) => void;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur'>) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    onSave(localValue);
  };

  return <Input value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} {...props} />;
};


// Sub-component for Extra Tasks to isolate state
const ExtraTasksTextarea = ({
  value,
  onSave,
  ...props
}: {
  value: string;
  onSave: (newValue: string) => void;
} & Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur'>) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    onSave(localValue);
  };

  return <Textarea value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} {...props} />;
};

const createInitialPodcastData = (): PodcastData => ({
  podcast1: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast2: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast3: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
  podcast4: { guests: Array(6).fill({ guestName: '', instagram: '' }), done: false },
});

const createInitialWeeklyData = () => ({
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
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(ptMonths[new Date().getMonth()]);
  
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

  const [currentDay, setCurrentDay] = useState(ptDays[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = getDay(today); // Sunday = 0, Monday = 1
    const dayOfMonth = getDate(today);
    const week = Math.min(4, Math.max(1, Math.ceil(dayOfMonth / 7)));
    const month = getMonth(today);

    setCurrentWeek(week);
    setCurrentMonth(ptMonths[month]);
    
    let todayName = '';
    if (dayOfWeek >= 1 && dayOfWeek <= 6) { 
        todayName = ptDays[dayOfWeek - 1];
    } else {
        todayName = ptDays[0]; // Default to Monday on Sunday
    }

    setCurrentDay(todayName);
    
    if(isAdmin) {
        setActiveTab("Visão Geral");
    } else {
        setActiveTab(todayName);
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
  
  const handleDailyMeetingsChange = (value: string) => {
        handleUpdateYearData(draft => {
            const weekData = draft[currentMonth][activeWeekKey];
            if (!weekData.counterTasks[activeDay]) weekData.counterTasks[activeDay] = {};
            weekData.counterTasks[activeDay]['daily_meetings'] = value;
            
            let totalMeetings = 0;
            ptDays.forEach(day => {
                totalMeetings += Number(weekData.counterTasks?.[day]?.['daily_meetings'] || 0);
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
            const count = Number(counterTasksForToday[task.id] || 0);
            if (count >= task.dailyGoal) acc++;
        }
        return acc;
    }, 0);
    
    const weeklyTotals: Record<string, number> = {};
    const weekDays = ptDays.slice(0, 6); // Mon-Sat
    
    counterTasksList.forEach(task => {
        weeklyTotals[task.id] = 0;
        weekDays.forEach(day => {
            const dayCount = Number(weekData.counterTasks?.[day]?.[task.id] || 0);
            weeklyTotals[task.id] += dayCount;
        });
    });


    return {
      completedTasksCount: completedCheckbox + completedCounters,
      weeklyProgress: weeklyTotals,
    };
  }, [activeDay, monthlyData, activeWeekKey]);

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
      { id: 'm-4', label: 'Prospecção', icon: MessageSquare },
      { id: 'daily_meetings', label: 'Agendamentos', icon: CalendarDays },
    ];
    
    return (
      <div className="hidden sm:flex items-center gap-2">
        {kpis.map(kpi => {
           const goal = weeklyGoals[kpi.id]?.goal || (kpi.id === 'daily_meetings' ? WEEKLY_MEETING_GOAL : 0);
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

    const isSaturday = activeDay === 'Sábado';
    
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
              
              {previousDayTasks && !isSaturday && !isHoliday && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center text-md">
                      <ListPlus className="mr-3 h-5 w-5" />
                      Tarefas Planejadas (do dia anterior)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap p-4 bg-muted rounded-md text-muted-foreground">
                      {previousDayTasks}
                    </div>
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
                  {pendingGoals.length > 0 ? (
                      pendingGoals.map(task => {
                          const weeklyTotal = weeklyProgress[task.id] || 0;
                          const isGoalMet = weeklyTotal >= task.weeklyGoal;
                          return (
                              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50 mb-4">
                                  <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">{task.label}</Label>
                                  <div className="flex items-center gap-3 w-full sm:w-auto">
                                      <CounterTaskInput
                                          type="text"
                                          pattern="[0-9]*"
                                          inputMode="numeric"
                                          id={`${activeDay}-${task.id}`}
                                          value={weekData?.counterTasks?.[activeDay]?.[task.id] || ''}
                                          onSave={(value) => handleCounterChange(task.id, value)}
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
                                />
                                <span className={cn("text-base font-semibold w-10 text-right", (Number(weekData?.counterTasks?.[activeDay]?.[task.id] || 0) >= task.dailyGoal) ? "text-green-500" : "text-red-500")}>
                                    / {task.dailyGoal}
                                </span>
                            </div>
                        </div>
                    ))}
                    {renderConsultorias()}
                    
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
                    {extraTask && (
                       <div className="p-4 rounded-lg bg-card/50">
                          <div onClick={() => handleTaskCheck(extraTask.id, !weekData.checkedTasks?.[activeDay]?.[extraTask.id])} className="flex items-center space-x-4 cursor-pointer">
                              <div className={cn(
                                "h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center border-2",
                                weekData.checkedTasks?.[activeDay]?.[extraTask.id] ? "bg-green-500 border-green-500" : "border-primary"
                              )}>
                                {weekData.checkedTasks?.[activeDay]?.[extraTask.id] && <Check className="h-4 w-4 text-white" />}
                              </div>
                              <span className={cn("flex-1 text-base font-normal", weekData.checkedTasks?.[activeDay]?.[extraTask.id] && "line-through text-muted-foreground")}>
                                  {extraTask.label}
                              </span>
                          </div>
                          <ExtraTasksTextarea
                              placeholder="Digite as tarefas para o dia seguinte aqui..."
                              value={weekData?.extraTasks?.[activeDay] || ''}
                              onSave={(value) => handleExtraTasksChange(value)}
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
    const dailyMeetings = weekData?.counterTasks?.[activeDay]?.['daily_meetings'] || '';
    const isSaturday = activeDay === 'Sábado';
    const totalWeeklyMeetings = weekData?.meetingsBooked || 0;
    const isWeeklyGoalMet = totalWeeklyMeetings >= WEEKLY_MEETING_GOAL;
    
    return (
         <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card/50">
            <Label htmlFor={`consultorias-${activeDay}`} className="text-base font-medium flex-1">
                Consultorias Realizadas
            </Label>
            <div className="flex items-center gap-3">
                <CounterTaskInput
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    id={`consultorias-${activeDay}`}
                    value={String(dailyMeetings)}
                    onSave={(value) => handleDailyMeetingsChange(value)}
                    className="w-24 h-11 text-base text-center font-bold bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="0"
                    disabled={isHoliday || isSaturday}
                />
                {!isSaturday && (
                     <span className={cn(
                        "text-base font-semibold w-10 text-right", 
                        (Number(dailyMeetings) >= 2) ? 'text-green-500' : 'text-red-500'
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
    
    if (FUNCTION_TABS.includes(activeTab)) {
        if (activeTab === 'Podcast') {
            return <PodcastTab podcastData={monthlyData?.podcasts} onPodcastChange={handlePodcastChange} onPodcastCheck={handlePodcastCheck} />;
        }
        if (activeTab === 'Progresso Semanal') {
            return <WeeklyProgress weeklyData={monthlyData?.[activeWeekKey]} />;
        }
        if (activeTab === 'Progresso Mensal') {
            return <WeeklyProgress monthlyData={yearData[currentMonth]} isMonthlyView={true} />;
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
              {!isAdmin && <HeaderKpis />}
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

    
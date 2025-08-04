"use client";

import { useState, useMemo, useEffect } from "react";
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


const TABS = [...ptDays, 'Podcast', 'Progresso Semanal', 'Progresso Mensal'];

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

export default function RotinaSDRPage() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(ptMonths[new Date().getMonth()]);
  const [yearData, setYearData] = useState<YearData>(initialYearData);
  
  const [aiResponse, setAiResponse] = useState<PrioritizeTasksOutput | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = getDay(today);
    const dayOfMonth = getDate(today);
    const week = Math.ceil(dayOfMonth / 7);
    const month = getMonth(today);

    setCurrentWeek(Math.min(4, Math.max(1, week)));
    setCurrentMonth(ptMonths[month]);

    if (dayOfWeek >= 1 && dayOfWeek <= 6) { 
        setActiveTab(ptDays[dayOfWeek - 1]);
    } else {
        setActiveTab(ptDays[0]);
    }
  }, []);

  const monthlyData = yearData[currentMonth];
  const activeWeekKey = `semana${currentWeek}` as keyof MonthlyData;
  const activeDay = ptDays.includes(activeTab) ? activeTab : ptDays[0];
  const activeDayIndex = ptDays.indexOf(activeDay);

  const isHoliday = !!monthlyData[activeWeekKey]?.holidays[activeDay];

  const previousDay = activeDayIndex > 0 ? ptDays[activeDayIndex - 1] : ptDays[ptDays.length - 1];
  
  const previousDayTasks = useMemo(() => {
    let prevWeekKey = activeWeekKey;
    let prevMonth = currentMonth;
    let prevDay = previousDay;

    if (activeDay === 'Segunda-feira') {
        if(currentWeek > 1) {
            prevWeekKey = `semana${currentWeek - 1}` as keyof MonthlyData;
        } else {
            // Previous month logic
            const currentMonthIndex = ptMonths.indexOf(currentMonth);
            if (currentMonthIndex > 0) {
                prevMonth = ptMonths[currentMonthIndex - 1];
                prevWeekKey = 'semana4'; // Last week of previous month
            }
        }
    }
    
    return yearData[prevMonth][prevWeekKey]?.extraTasks[prevDay] || "";
  }, [activeDay, currentWeek, yearData, currentMonth, previousDay, activeWeekKey]);

  const handleTaskCheck = (taskId: string, isChecked: boolean) => {
    setYearData(prev => {
        const newYearData = JSON.parse(JSON.stringify(prev));
        const monthData = newYearData[currentMonth];
        const weekData = monthData[activeWeekKey];
        if (!weekData.checkedTasks[activeDay]) {
            weekData.checkedTasks[activeDay] = {};
        }
        weekData.checkedTasks[activeDay][taskId] = isChecked;
        return newYearData;
    });
  };
  
  const handleCounterChange = (taskId: string, value: string) => {
    const numValue = parseInt(value, 10);
    setYearData(prev => {
        const newYearData = JSON.parse(JSON.stringify(prev));
        const monthData = newYearData[currentMonth];
        const weekData = monthData[activeWeekKey];
        if (!weekData.counterTasks[activeDay]) {
            weekData.counterTasks[activeDay] = {};
        }
        weekData.counterTasks[activeDay][taskId] = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        return newYearData;
    });
  };

  const handleExtraTasksChange = (value: string) => {
    setYearData(prev => {
        const newYearData = JSON.parse(JSON.stringify(prev));
        const monthData = newYearData[currentMonth];
        const weekData = monthData[activeWeekKey];
        if (!weekData.extraTasks) {
            weekData.extraTasks = {};
        }
        weekData.extraTasks[activeDay] = value;
        return newYearData;
    });
  };

  const handleHolidayToggle = (isHoliday: boolean) => {
    setYearData(prev => {
      const newYearData = JSON.parse(JSON.stringify(prev));
      const monthData = newYearData[currentMonth];
      const weekData = monthData[activeWeekKey];
      if (!weekData.holidays) {
        weekData.holidays = {};
      }
      weekData.holidays[activeDay] = isHoliday;
      return newYearData;
    })
  }
  
  const handlePodcastChange = (podcastId: keyof PodcastData, guestIndex: number, field: 'guestName' | 'instagram', value: string) => {
    setYearData(prev => {
        const newYearData = JSON.parse(JSON.stringify(prev));
        const monthData = newYearData[currentMonth];
        const weekData = monthData[activeWeekKey];
        weekData.podcasts[podcastId].guests[guestIndex][field] = value;
        return newYearData;
    });
  };

  const handlePodcastCheck = (podcastId: keyof PodcastData, isChecked: boolean) => {
      setYearData(prev => {
          const newYearData = JSON.parse(JSON.stringify(prev));
          const monthData = newYearData[currentMonth];
          const weekData = monthData[activeWeekKey];
          weekData.podcasts[podcastId].done = isChecked;
          
          // Also update the correct month's data
          newYearData[currentMonth].semana1.podcasts[podcastId].done = isChecked;

          return newYearData;
      });
  };


  const handleMeetingsChange = (e: React.ChangeEvent<HTMLInputElement>, weekKey?: keyof MonthlyData, month?: string) => {
    const value = parseInt(e.target.value, 10);
    const meetings = isNaN(value) || value < 0 ? 0 : value;
    const targetMonth = month || currentMonth;
    const targetWeekKey = weekKey || activeWeekKey;
    
    setYearData(prev => {
        const newYearData = JSON.parse(JSON.stringify(prev));
        const monthData = newYearData[targetMonth];
        const weekData = monthData[targetWeekKey];
        weekData.meetingsBooked = meetings;
        return newYearData;
    });
  };
  
    const handleDailyMeetingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const meetings = isNaN(value) || value < 0 ? 0 : value;
        setYearData(prev => {
            const newYearData = JSON.parse(JSON.stringify(prev));
            const monthData = newYearData[currentMonth];
            const weekData = monthData[activeWeekKey];
            if (!weekData.counterTasks[activeDay]) {
                weekData.counterTasks[activeDay] = {};
            }
            weekData.counterTasks[activeDay]['daily_meetings'] = meetings;
            
            let totalMeetings = 0;
            ptDays.forEach(day => {
                totalMeetings += weekData.counterTasks[day]?.['daily_meetings'] || 0;
            });
            weekData.meetingsBooked = totalMeetings;
            
            return newYearData;
        });
    };

  const {
    completedTasksCount,
    weeklyProgress,
  } = useMemo(() => {
    const tasksForToday = allTasks;
    const weekData = monthlyData[activeWeekKey];
    const checkedTasksForToday = weekData.checkedTasks[activeDay] || {};
    const counterTasksForToday = weekData.counterTasks[activeDay] || {};

    const checkboxTasks = tasksForToday.filter(t => t.type === 'checkbox');
    const counterTasksList = tasksForToday.filter(t => t.type === 'counter');

    const completedCheckbox = Object.values(checkedTasksForToday).filter(Boolean).length;
    
    let completedCounters = 0;
    counterTasksList.forEach(task => {
        if(task.type === 'counter'){
            const count = counterTasksForToday[task.id] || 0;
            if(count >= task.dailyGoal) {
                completedCounters++;
            }
        }
    });
    
    const completed = completedCheckbox + completedCounters;

    const weeklyTotals: Record<string, number> = {};
    counterTasksList.forEach(task => {
      weeklyTotals[task.id] = 0;
      ptDays.forEach(day => { 
        const dayCount = weekData.counterTasks[day]?.[task.id] || 0;
        weeklyTotals[task.id] += dayCount;
      });
    });

    return {
      completedTasksCount: completed,
      weeklyProgress: weeklyTotals,
    };
  }, [activeDay, monthlyData, activeWeekKey]);

  const handlePrioritize = async () => {
    setIsLoadingAI(true);
    setAiResponse(null);
    try {
      const tasksForToday = allTasks;
      const weekData = monthlyData[activeWeekKey];
      const checkedTasksForToday = weekData.checkedTasks[activeDay] || {};
      const counterTasksForToday = weekData.counterTasks[activeDay] || {};

      const remainingTaskLabels = tasksForToday
        .filter((task) => {
            if (isHoliday) return false;
            if (task.type === 'checkbox') {
                return !checkedTasksForToday[task.id];
            }
            if (task.type === 'counter' && !('saturdayOnly' in task)) {
                const count = counterTasksForToday[task.id] || 0;
                return count < task.dailyGoal;
            }
            return true;
        })
        .map((task) => task.label);

      if (remainingTaskLabels.length === 0) {
        toast({
          title: "Tudo pronto por hoje!",
          description: "Você já completou todas as tarefas do dia.",
        });
        setIsLoadingAI(false);
        return;
      }
      
      const input = {
        weeklyGoal: WEEKLY_MEETING_GOAL,
        meetingsBooked: weekData.meetingsBooked,
        tasksCompleted: completedTasksCount,
        tasksRemaining: remainingTaskLabels,
      };
      const result = await prioritizeTasks(input);
      setAiResponse(result);
    } catch (error) {
      console.error("Error prioritizing tasks:", error);
      toast({
        title: "Erro ao priorizar tarefas",
        description: "Houve um problema ao contatar a IA. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const renderTask = (task: AnyTask) => {
    const isSaturday = activeTab === 'Sábado';
    const weekData = monthlyData[activeWeekKey];
    let currentCount = 0;

    if(task.type === 'counter') {
        currentCount = weekData?.counterTasks[activeDay]?.[task.id] || 0;
    }

    if (task.type === 'counter' && !task.saturdayOnly) {
      const weeklyTotal = weeklyProgress[task.id] || 0;
      const isDailyGoalMet = currentCount >= task.dailyGoal;
      const isWeeklyGoalMetOnSaturday = weeklyTotal >= task.weeklyGoal;
      
      const weeklyTotalUntilFriday = ptDays.slice(0, 5).reduce((acc, day) => {
        return acc + (weekData?.counterTasks[day]?.[task.id] || 0);
      }, 0);

      const remainingForWeek = Math.max(0, task.weeklyGoal - weeklyTotalUntilFriday);
      
      const displayWeekly = isSaturday && !task.saturdayOnly;
      const displayDaily = !isSaturday;

      return (
        <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50">
          <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">
            {task.label}
          </Label>
          <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                type="number"
                id={`${activeDay}-${task.id}`}
                value={currentCount || ''}
                onChange={(e) => handleCounterChange(task.id, e.target.value)}
                className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                placeholder="0"
                disabled={isHoliday}
              />
              {displayDaily && (
                <span className={cn(
                    "text-lg font-semibold",
                    isDailyGoalMet ? "text-green-500" : "text-red-500"
                  )}
                >
                  / {task.dailyGoal}
                </span>
              )}
               {displayWeekly && (
                <div className="text-right">
                  <p className={cn(
                      "text-lg font-bold", 
                      isWeeklyGoalMetOnSaturday ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                      {weeklyTotal} / {task.weeklyGoal}
                  </p>
                  <p className={cn("text-sm font-semibold", isWeeklyGoalMetOnSaturday ? 'text-green-500' : 'text-red-500')}>
                    {isWeeklyGoalMetOnSaturday ? 'Meta atingida!' : `Faltam ${Math.max(0, task.weeklyGoal - weeklyTotal)}`}
                  </p>
                </div>
              )}
          </div>
        </div>
      );
    }
    
    if (task.type === 'counter' && task.saturdayOnly) {
        if (activeTab !== 'Sábado') return null;
        
        return (
            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50">
              <Label htmlFor={`${activeDay}-${task.id}`} className="text-base font-medium flex-1">
                {task.label}
              </Label>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Input
                    type="number"
                    id={`${activeDay}-${task.id}`}
                    value={currentCount || ''}
                    onChange={(e) => handleCounterChange(task.id, e.target.value)}
                    className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="0"
                  />
                  <span className="text-lg font-semibold">/ {task.dailyGoal}</span>
              </div>
            </div>
        )
    }

    if (task.id === 'a-7') {
      return (
        <div key={task.id} className="p-4 rounded-lg bg-card/50">
          <div className="flex items-center space-x-4">
            <Checkbox
              id={`${activeDay}-${task.id}`}
              checked={weekData?.checkedTasks[activeDay]?.[task.id] || false}
              onCheckedChange={(checked) => handleTaskCheck(task.id, !!checked)}
              aria-label={task.label}
              className="h-6 w-6 rounded-md border-2 border-primary"
              disabled={isHoliday}
            />
            <Label htmlFor={`${activeDay}-${task.id}`} className="flex-1 text-base font-normal cursor-pointer">
              {task.label}
            </Label>
          </div>
          <div className="mt-4 pl-10">
            <Textarea
              placeholder="Digite as tarefas para o dia seguinte aqui..."
              value={weekData?.extraTasks[activeDay] || ''}
              onChange={(e) => handleExtraTasksChange(e.target.value)}
              className="w-full bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
              disabled={isHoliday}
            />
          </div>
        </div>
      )
    }
    
    if (task.type === 'checkbox' && (task.saturdayOnly ? activeTab === 'Sábado' : activeTab !== 'Sábado')) {
         return (
          <div key={task.id} className="p-4 rounded-lg bg-card/50">
            <div className="flex items-center space-x-4">
              <Checkbox
                id={`${activeDay}-${task.id}`}
                checked={weekData?.checkedTasks[activeDay]?.[task.id] || false}
                onCheckedChange={(checked) => handleTaskCheck(task.id, !!checked)}
                aria-label={task.label}
                className="h-6 w-6 rounded-md border-2 border-primary"
                disabled={isHoliday}
              />
              <Label htmlFor={`${activeDay}-${task.id}`} className="flex-1 text-base font-normal cursor-pointer">
                {task.label}
              </Label>
            </div>
          </div>
        );
    }

    return null;

  };

  const renderConsultorias = () => {
    const weekData = monthlyData[activeWeekKey];
    const dailyMeetings = weekData?.counterTasks[activeDay]?.['daily_meetings'] || 0;
    const isSaturday = activeTab === 'Sábado';
    const totalWeeklyMeetings = weekData.meetingsBooked;
    const isWeeklyGoalMet = totalWeeklyMeetings >= WEEKLY_MEETING_GOAL;
    
    return (
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-card/50">
            <Label htmlFor={`consultorias-${activeDay}`} className="text-base font-medium flex-1 flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Consultorias Realizadas
            </Label>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Input
                    type="number"
                    id={`consultorias-${activeDay}`}
                    value={dailyMeetings || ''}
                    onChange={handleDailyMeetingsChange}
                    className="w-28 h-12 text-lg text-center font-bold bg-input border-2 border-primary/50 focus:border-primary focus:ring-primary"
                    placeholder="0"
                    disabled={isHoliday || isSaturday}
                />
                {!isSaturday && (
                     <span className="text-lg font-semibold text-muted-foreground">
                        diárias
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

  const handleMonthChange = (direction: 'next' | 'prev') => {
      const currentMonthIndex = ptMonths.indexOf(currentMonth);
      if (direction === 'next') {
          const nextMonthIndex = (currentMonthIndex + 1) % ptMonths.length;
          setCurrentMonth(ptMonths[nextMonthIndex]);
      } else {
          const prevMonthIndex = (currentMonthIndex - 1 + ptMonths.length) % ptMonths.length;
          setCurrentMonth(ptMonths[prevMonthIndex]);
      }
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" passHref>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Home className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-xl font-semibold font-headline text-primary">
                Rotina SDR
            </h1>
        </div>
        <div className="flex items-center gap-4">
            {user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{user.displayName || user.email}</span>
                </div>
            )}
            <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}>
                  <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col items-center">
                  <Select value={currentMonth} onValueChange={setCurrentMonth}>
                      <SelectTrigger className="w-[180px] text-lg font-bold">
                          <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                          {ptMonths.map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Select value={String(currentWeek)} onValueChange={(val) => setCurrentWeek(Number(val))}>
                      <SelectTrigger className="w-[140px] text-sm mt-2">
                          <SelectValue placeholder="Selecione a semana" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="1">Semana 1</SelectItem>
                          <SelectItem value="2">Semana 2</SelectItem>
                          <SelectItem value="3">Semana 3</SelectItem>
                          <SelectItem value="4">Semana 4</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}>
                  <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto self-start sm:self-center">
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 w-full sm:w-auto h-auto flex-wrap gap-2 bg-transparent p-0">
                {ptDays.slice(0, 3).map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="w-full text-base py-3 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-lg">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {tab}
                    </TabsTrigger>
                ))}
                </TabsList>
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 w-full sm:w-auto h-auto flex-wrap mt-2 gap-2 bg-transparent p-0">
                {ptDays.slice(3, 6).map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="w-full text-base py-3 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-lg">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {tab}
                    </TabsTrigger>
                ))}
                </TabsList>
            </Tabs>
        </div>

         <Separator />
        
        <Tabs value={activeTab} className="w-full">
            <TabsContent value={activeTab} className="mt-0">
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
                        {allTasks.filter(t => t.type === 'counter').map(renderTask)}
                        
                        {dailyRoutine.flatMap(g => g.tasks.filter(t => t.type === 'checkbox' && !['a-7'].includes(t.id))).map(renderTask)}

                        {renderConsultorias()}
                        
                        {allTasks.filter(t => t.type === 'checkbox' && t.saturdayOnly).map(renderTask)}

                        {dailyRoutine.flatMap(g => g.tasks.filter(t => t.id === 'a-7')).map(renderTask)}

                      </div>
                    </CardContent>
                  </Card>

                   {previousDayTasks && activeTab !== 'Sábado' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                          <ListPlus className="mr-3 h-6 w-6" />
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
                </div>

                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
                  <Card className="sticky top-20">
                    <CardHeader>
                      <CardTitle className="font-headline flex items-center"><Wand2 className="mr-2 text-accent" />Priorizador com IA</CardTitle>
                      <CardDescription>Deixe a IA analisar seu progresso e sugerir as próximas tarefas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handlePrioritize} disabled={isLoadingAI || activeTab === 'Sábado' || isHoliday} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                        {isLoadingAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                        Priorizar Tarefas
                      </Button>
                      
                      {isLoadingAI && (
                        <div className="mt-4 space-y-4">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                      )}

                      {aiResponse && (
                        <Alert className="mt-4 bg-secondary">
                          <ListChecks className="h-4 w-4 text-primary"/>
                          <AlertTitle className="font-headline text-primary">Tarefas Priorizadas</AlertTitle>
                          <AlertDescription className="space-y-2 text-foreground/80">
                            <p className="font-semibold mt-2">Próximos passos recomendados:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {aiResponse.prioritizedTasks.map((task, i) => <li key={i}>{task}</li>)}
                            </ul>
                            <p className="font-semibold pt-2">Justificativa:</p>
                            <p>{aiResponse.reasoning}</p>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                   <Tabs defaultValue="semanal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="podcast">Podcast</TabsTrigger>
                      <TabsTrigger value="semanal">Semanal</TabsTrigger>
                      <TabsTrigger value="mensal">Mensal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="podcast" className="mt-4">
                      <PodcastTab
                          podcastData={monthlyData[activeWeekKey].podcasts}
                          onPodcastChange={handlePodcastChange}
                          onPodcastCheck={handlePodcastCheck}
                      />
                    </TabsContent>
                    <TabsContent value="semanal" className="mt-4">
                       <WeeklyProgress monthlyData={monthlyData} onMeetingsChange={handleMeetingsChange} />
                    </TabsContent>
                    <TabsContent value="mensal" className="mt-4">
                      <WeeklyProgress monthlyData={yearData[currentMonth]} isMonthlyView={true} onMeetingsChange={handleMeetingsChange} />
                    </TabsContent>
                  </Tabs>

                </div>
              </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

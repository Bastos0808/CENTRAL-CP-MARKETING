
"use client";

import { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { allTasks, AnyTask, ptDays, weeklyGoals as weeklyGoalsDef, WEEKLY_MEETING_GOAL } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { ScoreIndicator } from './ScoreIndicator';
import { PodcastData } from './PodcastTab';

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

interface WeeklyProgressProps {
  monthlyData: MonthlyData;
  isMonthlyView?: boolean;
  onMeetingsChange: (e: React.ChangeEvent<HTMLInputElement>, weekKey?: keyof MonthlyData, month?: string) => void;
}

export function WeeklyProgress({ monthlyData, isMonthlyView = false, onMeetingsChange }: WeeklyProgressProps) {
  const [activeWeekTab, setActiveWeekTab] = useState('semana1');

  const calculateProgress = (data: MonthlyData) => {
    const counterTasksList = allTasks.filter((t): t is AnyTask & { type: 'counter' } => t.type === 'counter');
    const weeklyGoals = JSON.parse(JSON.stringify(weeklyGoalsDef));

    let progressItems;

    if (isMonthlyView) {
        // Monthly calculation
        const monthlyTotals: Record<string, number> = {};
        let totalMeetingsBooked = 0;
        let totalHolidays = 0;
        let totalPodcastsDone = 0;
        
        let totalMonthlyGoals = JSON.parse(JSON.stringify(weeklyGoals));
        Object.keys(totalMonthlyGoals).forEach(key => {
            totalMonthlyGoals[key].goal *= 4;
        })

        Object.keys(data).forEach(weekKeyStr => {
            const weekKey = weekKeyStr as keyof MonthlyData;
            const weekData = data[weekKey];
            if (!weekData) return;

            totalMeetingsBooked += weekData.meetingsBooked;
            const holidaysInWeek = Object.keys(weekData.holidays || {}).filter(day => weekData.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
            totalHolidays += holidaysInWeek;

            if (weekData.podcasts) {
                totalPodcastsDone += Object.values(weekData.podcasts).filter(p => p.done).length;
            }

            counterTasksList.forEach(task => {
                ptDays.forEach(day => {
                    const dailyCounters = weekData.counterTasks[day] || {};
                    if (dailyCounters[task.id]) {
                        if (!monthlyTotals[task.id]) monthlyTotals[task.id] = 0;
                        monthlyTotals[task.id] += dailyCounters[task.id];
                    }
                });
            });
        });
        
        counterTasksList.forEach(task => {
            const dailyGoal = task.dailyGoal || 0;
            totalMonthlyGoals[task.id].goal -= dailyGoal * totalHolidays;
        });

        const dailyMeetingGoal = WEEKLY_MEETING_GOAL / 5;
        totalMonthlyGoals['meetings'].goal -= dailyMeetingGoal * totalHolidays;

        monthlyTotals['meetings'] = totalMeetingsBooked;
        monthlyTotals['podcasts'] = totalPodcastsDone;

        progressItems = Object.entries(totalMonthlyGoals).map(([key, { label, goal }]) => {
            const current = monthlyTotals[key] || 0;
            const progress = goal > 0 ? (current / goal) * 100 : 0;
            const achieved = current >= goal;
            return { id: key, label, current, goal, progress: Math.min(100, progress), achieved };
        });

    } else {
        const weekData = data[activeWeekTab as keyof MonthlyData];
        if (!weekData) {
             return { progressItems: [], overallScore: 0 };
        }
        // Weekly calculation
        const weeklyTotals: Record<string, number> = {};
        weeklyTotals['meetings'] = weekData.meetingsBooked;
        weeklyTotals['podcasts'] = weekData.podcasts ? Object.values(weekData.podcasts).filter(p => p.done).length : 0;

        const holidaysInWeek = Object.keys(weekData.holidays || {}).filter(day => weekData.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
        
        const adjustedWeeklyGoals = JSON.parse(JSON.stringify(weeklyGoals));
        counterTasksList.forEach(task => {
             const dailyGoal = task.dailyGoal || 0;
            adjustedWeeklyGoals[task.id].goal = task.weeklyGoal - (dailyGoal * holidaysInWeek);
        });
        
        const dailyMeetingGoal = WEEKLY_MEETING_GOAL / 5;
        adjustedWeeklyGoals['meetings'].goal -= dailyMeetingGoal * holidaysInWeek;

        ptDays.forEach(day => {
            const dailyCounters = weekData.counterTasks[day] || {};
            counterTasksList.forEach(task => {
                if (dailyCounters[task.id]) {
                    if (!weeklyTotals[task.id]) weeklyTotals[task.id] = 0;
                    weeklyTotals[task.id] += dailyCounters[task.id];
                }
            });
        });

        progressItems = Object.entries(adjustedWeeklyGoals).map(([key, { label, goal }]) => {
            const current = weeklyTotals[key] || 0;
            const progress = goal > 0 ? (current / goal) * 100 : 0;
            const achieved = current >= goal;
            return { id: key, label, current, goal, progress: Math.min(100, progress), achieved };
        });
    }

    const totalProgress = progressItems.reduce((acc, item) => acc + item.progress, 0);
    const overallScore = progressItems.length > 0 ? totalProgress / progressItems.length : 0;
    
    return { progressItems, overallScore };
  }

  const getWeekKey = (weekNumber: number): keyof MonthlyData => `semana${weekNumber}` as keyof MonthlyData;

  const weeklyReports = useMemo(() => {
    return [1, 2, 3, 4].map(weekNum => {
      const weekKey = getWeekKey(weekNum);
      const weeklyDataForCalc = { [weekKey]: monthlyData[weekKey]} as MonthlyData;
      const { progressItems, overallScore } = calculateProgress(weeklyDataForCalc);
      return {
        week: weekNum,
        weekKey,
        progress: progressItems,
        meetingsBooked: monthlyData[weekKey]?.meetingsBooked || 0,
        score: overallScore,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyData, activeWeekTab]);

  const monthlyProgress = useMemo(() => {
    return calculateProgress(monthlyData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyData]);


  if (isMonthlyView) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 lg:col-span-2">
                <CardHeader>
                <CardTitle className="font-headline flex items-center text-primary">
                    <BarChart className="mr-2" />
                    Progresso e Metas Mensais
                </CardTitle>
                <CardDescription>
                    Acompanhe seu progresso em direção às metas do mês. Os feriados são descontados das metas.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthlyProgress.progressItems.map(item => (
                    <div key={item.id} className="p-4 rounded-lg bg-secondary">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{item.label}</span>
                           <span className={cn("text-sm font-bold", item.achieved ? "text-green-500" : "text-red-500")}>
                            {item.current} / {Math.round(item.goal)}
                          </span>
                        </div>
                        <Progress value={item.progress} className={cn(item.achieved ? '[&>div]:bg-green-500' : '[&>div]:bg-primary')} />
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Nota de Performance</CardTitle>
                    <CardDescription>Sua pontuação geral para o mês.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <ScoreIndicator score={monthlyProgress.overallScore} />
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <Card className="bg-card/50">
        <CardHeader>
            <CardTitle className="font-headline flex items-center text-primary">
            <BarChart className="mr-2" />
            Progresso e Metas Semanais
            </CardTitle>
            <CardDescription>
            Acompanhe seu progresso em direção às metas da semana. Selecione a semana para ver ou atualizar os dados.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="semana1" className="w-full" onValueChange={(val) => setActiveWeekTab(val)}>
                <TabsList className="grid w-full grid-cols-4 gap-2 bg-secondary/50 p-1">
                    <TabsTrigger value="semana1">Semana 1</TabsTrigger>
                    <TabsTrigger value="semana2">Semana 2</TabsTrigger>
                    <TabsTrigger value="semana3">Semana 3</TabsTrigger>
                    <TabsTrigger value="semana4">Semana 4</TabsTrigger>
                </TabsList>
                {[1,2,3,4].map(weekNum => {
                    const weekKey = getWeekKey(weekNum);
                    const report = weeklyReports[weekNum - 1];
                    return (
                        <TabsContent value={weekKey} key={weekKey} className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {report.progress.map(item => (
                                            <div key={item.id} className="p-4 rounded-lg bg-secondary">
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className="text-sm font-medium">{item.label}</span>
                                                  <span className={cn("text-sm font-bold", item.achieved ? "text-green-500" : "text-red-500")}>
                                                    {item.current} / {Math.round(item.goal)}
                                                  </span>
                                              </div>
                                              <Progress value={item.progress} className={cn(item.achieved ? '[&>div]:bg-green-500' : '[&>div]:bg-primary')} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-headline text-primary">Nota de Performance</CardTitle>
                                             <CardDescription>Sua pontuação geral para a Semana {weekNum}.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-center">
                                            <ScoreIndicator score={report.score} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    )
                })}
            </Tabs>
        </CardContent>
    </Card>
  );
}

    
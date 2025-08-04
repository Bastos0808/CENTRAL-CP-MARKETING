
"use client";

import { useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { allTasks, AnyTask, ptDays, weeklyGoals as weeklyGoalsDef, WEEKLY_MEETING_GOAL } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { ScoreIndicator } from './ScoreIndicator';
import type { MonthlyData, WeeklyData } from '@/lib/types';


interface WeeklyProgressProps {
  monthlyData?: MonthlyData;
  weeklyData?: WeeklyData;
  isMonthlyView?: boolean;
  teamMultiplier?: number;
}

export function WeeklyProgress({ monthlyData, weeklyData, isMonthlyView = false, teamMultiplier = 1 }: WeeklyProgressProps) {
  
  const { progressItems, overallScore } = useMemo(() => {
    const counterTasksList = allTasks.filter((t): t is AnyTask & { type: 'counter' } => t.type === 'counter' && !t.saturdayOnly);
    
    if (isMonthlyView) {
      if (!monthlyData) return { progressItems: [], overallScore: 0 };
      
      const monthlyTotals: Record<string, number> = {};
      let totalMeetingsBooked = 0;
      let totalHolidays = 0;
      let totalPodcastsDone = 0;
      
      let totalMonthlyGoals = JSON.parse(JSON.stringify(weeklyGoalsDef));
      Object.keys(totalMonthlyGoals).forEach(key => {
          totalMonthlyGoals[key].goal *= (4 * teamMultiplier);
      });

      (['semana1', 'semana2', 'semana3', 'semana4'] as const).forEach(weekKey => {
          const week = monthlyData[weekKey];
          if (!week) return;

          totalMeetingsBooked += week.meetingsBooked || 0;
          const holidaysInWeek = Object.keys(week.holidays || {}).filter(day => week.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
          totalHolidays += holidaysInWeek;

          if (week.podcasts) {
              totalPodcastsDone += Object.values(week.podcasts).filter(p => p.done).length;
          }

          counterTasksList.forEach(task => {
              ptDays.forEach(day => {
                  const dailyCounters = week.counterTasks?.[day] || {};
                  if (dailyCounters?.[task.id]) {
                      if (!monthlyTotals[task.id]) monthlyTotals[task.id] = 0;
                      monthlyTotals[task.id] += dailyCounters[task.id];
                  }
              });
          });
      });
      
      counterTasksList.forEach(task => {
          const dailyGoal = task.dailyGoal || 0;
          if (totalMonthlyGoals[task.id]) {
            totalMonthlyGoals[task.id].goal -= dailyGoal * totalHolidays * teamMultiplier;
          }
      });

      const dailyMeetingGoal = WEEKLY_MEETING_GOAL / 5;
      if(totalMonthlyGoals['meetings']) {
        totalMonthlyGoals['meetings'].goal -= dailyMeetingGoal * totalHolidays * teamMultiplier;
      }


      monthlyTotals['meetings'] = totalMeetingsBooked;
      monthlyTotals['podcasts'] = totalPodcastsDone;

      const items = Object.entries(totalMonthlyGoals).map(([key, { label, goal }]) => {
          const current = monthlyTotals[key] || 0;
          const progress = goal > 0 ? (current / goal) * 100 : 0;
          return { id: key, label, current, goal: Math.round(goal), progress: Math.min(100, progress), achieved: current >= Math.round(goal) };
      });
      
      const totalProgress = items.reduce((acc, item) => acc + item.progress, 0);
      const score = items.length > 0 ? totalProgress / items.length : 0;
      return { progressItems: items, overallScore: score };

    } else {
        if (!weeklyData) return { progressItems: [], overallScore: 0 };

        const weeklyTotals: Record<string, number> = {};
        weeklyTotals['meetings'] = weeklyData.meetingsBooked || 0;
        weeklyTotals['podcasts'] = weeklyData.podcasts ? Object.values(weeklyData.podcasts).filter(p => p.done).length : 0;

        const holidaysInWeek = Object.keys(weeklyData.holidays || {}).filter(day => weeklyData.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
        
        const adjustedWeeklyGoals = JSON.parse(JSON.stringify(weeklyGoalsDef));
        counterTasksList.forEach(task => {
            const dailyGoal = task.dailyGoal || 0;
             if (adjustedWeeklyGoals[task.id]) {
                adjustedWeeklyGoals[task.id].goal = task.weeklyGoal - (dailyGoal * holidaysInWeek);
             }
        });
        
        const dailyMeetingGoal = WEEKLY_MEETING_GOAL / 5;
        if(adjustedWeeklyGoals['meetings']) {
            adjustedWeeklyGoals['meetings'].goal -= dailyMeetingGoal * holidaysInWeek;
        }


        ptDays.forEach(day => {
            const dailyCounters = weeklyData.counterTasks?.[day] || {};
            counterTasksList.forEach(task => {
                if (dailyCounters[task.id]) {
                    if (!weeklyTotals[task.id]) weeklyTotals[task.id] = 0;
                    weeklyTotals[task.id] += dailyCounters[task.id];
                }
            });
        });

        const items = Object.entries(adjustedWeeklyGoals).map(([key, { label, goal }]) => {
            const current = weeklyTotals[key] || 0;
            const progress = goal > 0 ? (current / goal) * 100 : 0;
            return { id: key, label, current, goal: Math.round(goal), progress: Math.min(100, progress), achieved: current >= Math.round(goal) };
        });

        const totalProgress = items.reduce((acc, item) => acc + item.progress, 0);
        const score = items.length > 0 ? totalProgress / items.length : 0;
        return { progressItems: items, overallScore: score };
    }
  }, [monthlyData, weeklyData, isMonthlyView, teamMultiplier]);
  
  const getProgressColor = (progress: number) => {
    if (progress < 40) return 'bg-red-500';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-card/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline flex items-center text-primary">
            <BarChart className="mr-2" />
            Progresso e Metas
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso em direção às metas. Os feriados são descontados das metas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressItems.map(item => (
              <div key={item.id} className="p-4 rounded-lg bg-secondary">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={cn("text-sm font-bold", item.achieved ? "text-green-500" : "text-foreground/80")}>
                    {item.current} / {item.goal}
                  </span>
                </div>
                <Progress value={item.progress} className={cn('[&>div]:transition-all [&>div]:duration-500', `[&>div]:${getProgressColor(item.progress)}`)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-primary">Nota de Performance</CardTitle>
          <CardDescription>Pontuação geral para o período.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ScoreIndicator score={overallScore} />
        </CardContent>
      </Card>
    </div>
  );
}

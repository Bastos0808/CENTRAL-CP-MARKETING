

"use client";

import { useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { allTasks, AnyTask, ptDays, weeklyGoals as weeklyGoalsDef, WEEKLY_MEETING_GOAL, ptMonths } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { ScoreIndicator } from './ScoreIndicator';
import type { YearData, CounterTasksState, CheckedTasksState } from '@/lib/types';
import { eachDayOfInterval, getDay, getMonth, getWeek, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';


interface WeeklyProgressProps {
  sdrId: string;
  yearData: YearData;
  week?: number;
  month?: string;
  dateRange?: DateRange;
  isMonthlyView?: boolean;
}

export function WeeklyProgress({ sdrId, yearData, week, month, dateRange, isMonthlyView = false }: WeeklyProgressProps) {
  
  const { progressItems, overallScore } = useMemo(() => {
    const counterTasksList = allTasks.filter((t): t is AnyTask & { type: 'counter' } => t.type === 'counter' && !t.saturdayOnly);
    
    // Date Range View
    if (dateRange && dateRange.from) {
      const start = dateRange.from;
      const end = dateRange.to || dateRange.from;
      const intervalDays = eachDayOfInterval({ start, end });
      let workDaysCount = 0;

      const rangeTotals: Record<string, number> = {};
      
      intervalDays.forEach(day => {
          const monthKey = ptMonths[getMonth(day)];
          const weekOfMonth = Math.min(4, Math.max(1, Math.ceil(day.getDate() / 7)));
          const weekKey = `semana${weekOfMonth}` as const;
          const dayIndex = getDay(day);
          // Sunday is 0, Monday is 1, etc. We map to ptDays index.
          const dayKey = dayIndex > 0 ? ptDays[dayIndex - 1] : ptDays[5];

          const weeklyData = yearData[monthKey]?.[weekKey];
          if (!weeklyData) return;

          const isHoliday = weeklyData.holidays?.[dayKey] || false;
          // Count as a workday if it's Monday-Friday and not a holiday
          if (dayIndex >= 1 && dayIndex <= 5 && !isHoliday) {
              workDaysCount++;
          }
          
          counterTasksList.forEach(task => {
              const value = Number(weeklyData.counterTasks?.[dayKey]?.[task.id] || '0');
              if (!rangeTotals[task.id]) rangeTotals[task.id] = 0;
              rangeTotals[task.id] += value;
          });
           const meetings = Number(weeklyData.counterTasks?.[dayKey]?.['daily_meetings'] || '0');
           if (!rangeTotals['meetings']) rangeTotals['meetings'] = 0;
           rangeTotals['meetings'] += meetings;
      });
      
      const rangeGoals: Record<string, {label: string, goal: number}> = {};
      counterTasksList.forEach(task => {
          rangeGoals[task.id] = { label: task.label, goal: task.dailyGoal * workDaysCount };
      });
      rangeGoals['meetings'] = { label: 'Consultorias', goal: 2 * workDaysCount };

      const items = Object.entries(rangeGoals).map(([key, { label, goal }]) => {
          const current = rangeTotals[key] || 0;
          const progress = goal > 0 ? (current / goal) * 100 : 0;
          return { id: key, label, current, goal, progress: Math.min(100, progress), achieved: current >= goal };
      });

      const totalProgress = items.reduce((acc, item) => acc + item.progress, 0);
      const score = items.length > 0 ? totalProgress / items.length : 0;
      return { progressItems: items, overallScore: score };
    }
    
    // Monthly View
    if (isMonthlyView && month && yearData[month]) {
      const monthlyData = yearData[month];
      const monthlyTotals: Record<string, number> = {};
      let totalMeetingsBooked = 0;
      let totalHolidays = 0;
      
      let totalPodcastsDone = 0;
      if (monthlyData.podcasts) {
          totalPodcastsDone += Object.values(monthlyData.podcasts).filter(p => p.done).length;
      }

      (['semana1', 'semana2', 'semana3', 'semana4'] as const).forEach(weekKey => {
          const week = monthlyData[weekKey];
          if (!week) return;

          totalMeetingsBooked += week.meetingsBooked || 0;
          const holidaysInWeek = Object.keys(week.holidays || {}).filter(day => week.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
          totalHolidays += holidaysInWeek;

          counterTasksList.forEach(task => {
              ptDays.forEach(day => {
                  const dailyCounters = week.counterTasks?.[day] || {};
                  const value = Number(dailyCounters[task.id] || '0');
                  if (!monthlyTotals[task.id]) monthlyTotals[task.id] = 0;
                  monthlyTotals[task.id] += value;
              });
          });
      });
      
      const adjustedMonthlyGoals = JSON.parse(JSON.stringify(weeklyGoalsDef));
       Object.keys(adjustedMonthlyGoals).forEach(key => {
          if(adjustedMonthlyGoals[key]) {
            adjustedMonthlyGoals[key].goal *= 4;
            const taskDef = counterTasksList.find(t => t.id === key);
            if (taskDef) {
               adjustedMonthlyGoals[key].goal -= taskDef.dailyGoal * totalHolidays;
            }
          }
      });
      
      const dailyMeetingGoal = WEEKLY_MEETING_GOAL / 5;
      if(adjustedMonthlyGoals['meetings']) {
        adjustedMonthlyGoals['meetings'].goal = (WEEKLY_MEETING_GOAL * 4) - (dailyMeetingGoal * totalHolidays);
      }

      monthlyTotals['meetings'] = totalMeetingsBooked;
      monthlyTotals['podcasts'] = totalPodcastsDone;
      
      const items = Object.entries(adjustedMonthlyGoals).map(([key, { label, goal }]) => {
          const current = monthlyTotals[key] || 0;
          const progress = goal > 0 ? (current / goal) * 100 : 0;
          return { id: key, label, current, goal: Math.round(goal), progress: Math.min(100, progress), achieved: current >= Math.round(goal) };
      });
      
      const totalProgress = items.reduce((acc, item) => acc + item.progress, 0);
      const score = items.length > 0 ? totalProgress / items.length : 0;
      return { progressItems: items, overallScore: score };

    } 
    
    // Weekly View
    else if (week && month && yearData[month]) {
        const weekKey = `semana${week}` as const;
        const weeklyData = yearData[month]?.[weekKey];
        if (!weeklyData) return { progressItems: [], overallScore: 0 };

        const weeklyTotals: Record<string, number> = {};
        weeklyTotals['meetings'] = weeklyData.meetingsBooked || 0;
        
        let podcastsDone = 0;
        if(yearData[month]?.podcasts) {
           podcastsDone = Object.values(yearData[month]!.podcasts).filter(p => p.done).length;
        }
        weeklyTotals['podcasts'] = podcastsDone; // Note: This shows monthly podcast progress in weekly view


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
                const value = Number(dailyCounters[task.id] || '0');
                if (!weeklyTotals[task.id]) weeklyTotals[task.id] = 0;
                weeklyTotals[task.id] += value;
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
    
    return { progressItems: [], overallScore: 0 };

  }, [yearData, week, month, dateRange, isMonthlyView]);
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressItems.map(item => (
              <div key={item.id} className="p-3 rounded-lg bg-secondary/50 border">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  <span className={cn("text-xs font-bold", item.achieved ? "text-green-500" : "text-foreground/80")}>
                    {item.current} / {item.goal}
                  </span>
                </div>
                <Progress value={item.progress} className={cn('h-2', `[&>div]:${getProgressColor(item.progress)}`)} />
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

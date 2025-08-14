

"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Trophy, UserCheck } from "lucide-react";
import { allTasks, AnyTask, ptDays, weeklyGoals as weeklyGoalsDef, WEEKLY_MEETING_GOAL, ptMonths, scoreWeights, maxScorePerDay } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { ScoreIndicator } from './ScoreIndicator';
import type { YearData } from '@/lib/types';
import { eachDayOfInterval, getDay, getMonth, getWeek, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';


interface WeeklyProgressProps {
  sdrId: string;
  yearData: YearData;
  week?: number;
  month?: string;
  day?: string;
  dateRange?: DateRange;
  isMonthlyView?: boolean;
}

export function WeeklyProgress({ sdrId, yearData, week, month, day, dateRange, isMonthlyView = false }: WeeklyProgressProps) {
  
  const { progressItems, overallScore, achievedGoals, totalGoals } = useMemo(() => {
    const counterTasksList = allTasks.filter((t): t is AnyTask & { type: 'counter' } => t.type === 'counter');
    
    // Daily View
    if (day && week && month && yearData[month]) {
      const weekKey = `semana${week}` as const;
      const weeklyData = yearData[month]?.[weekKey];
      if (!weeklyData) return { progressItems: [], overallScore: 0, achievedGoals: 0, totalGoals: 0 };
      
      const dailyCounters = weeklyData.counterTasks?.[day] || {};
      let score = 0;
      
      Object.keys(dailyCounters).forEach(taskId => {
        const weight = scoreWeights[taskId];
        const value = Number(dailyCounters[taskId] || '0');
        if (weight) {
          score += value * weight;
        }
      });

      return { progressItems: [], overallScore: Math.min(score, maxScorePerDay), achievedGoals: 0, totalGoals: 0 };
    }


    // Date Range View for Admin
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
          const dayKey = dayIndex > 0 ? ptDays[dayIndex - 1] : ptDays[5];

          const weeklyData = yearData[monthKey]?.[weekKey];
          if (!weeklyData) return;

          const isHoliday = weeklyData.holidays?.[dayKey] || false;
          // Consider only weekdays for goal calculations
          if (dayIndex >= 1 && dayIndex <= 5 && !isHoliday) {
              workDaysCount++;
          }
          
          counterTasksList.forEach(task => {
              const value = Number(weeklyData.counterTasks?.[dayKey]?.[task.id] || '0');
              if (!rangeTotals[task.id]) rangeTotals[task.id] = 0;
              rangeTotals[task.id] += value;
          });
      });
      
      const rangeGoals: Record<string, {label: string, goal: number}> = {};
       const weeklyGoalsForRange = { ...weeklyGoalsDef };

        Object.entries(weeklyGoalsForRange).forEach(([key, value]) => {
            const dailyEquivalent = value.goal / 5; // Goals are per 5-day week
            rangeGoals[key] = { label: value.label, goal: dailyEquivalent * workDaysCount };
        });
        
      const items = Object.entries(rangeGoals).map(([key, { label, goal }]) => {
          const current = rangeTotals[key] || 0;
          return { id: key, label, current, goal: Math.round(goal), achieved: current >= Math.round(goal) };
      });
      
      return { progressItems: items, overallScore: 0, achievedGoals: items.filter(i => i.achieved).length, totalGoals: items.length };
    }
    
    // Monthly View
    if (isMonthlyView && month && yearData[month]) {
      const monthlyData = yearData[month];
      const monthlyTotals: Record<string, number> = {};
      let totalHolidays = 0;
      
      let totalPodcastsDone = 0;
      if (monthlyData.podcasts) {
          totalPodcastsDone += Object.values(monthlyData.podcasts).filter(p => p.done).length;
      }

      (['semana1', 'semana2', 'semana3', 'semana4'] as const).forEach(weekKey => {
          const week = monthlyData[weekKey];
          if (!week) return;

          const holidaysInWeek = Object.keys(week.holidays || {}).filter(day => week.holidays[day] && ptDays.slice(0, 5).includes(day)).length;
          totalHolidays += holidaysInWeek;

          counterTasksList.forEach(task => {
              ptDays.slice(0, 5).forEach(day => { // Only count Mon-Fri
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
            const weeklyGoal = adjustedMonthlyGoals[key].goal;
            adjustedMonthlyGoals[key].goal = (weeklyGoal * 4); // 4 weeks in a month
          }
      });
      
      monthlyTotals['podcasts'] = totalPodcastsDone;
      
      const items = Object.entries(adjustedMonthlyGoals).map(([key, { label, goal }]) => {
          const current = monthlyTotals[key] || 0;
          return { id: key, label, current, goal, achieved: current >= goal };
      });
      
      return { progressItems: items, overallScore: 0, achievedGoals: items.filter(i => i.achieved).length, totalGoals: items.length };

    } 
    
    // Weekly View (Saturday)
    else if (week && month && yearData[month]) {
        const weekKey = `semana${week}` as const;
        const weeklyData = yearData[month]?.[weekKey];
        if (!weeklyData) return { progressItems: [], overallScore: 0, achievedGoals: 0, totalGoals: 0 };

        const weeklyTotals: Record<string, number> = {};
        
        let podcastsDone = 0;
        if(yearData[month]?.podcasts) {
           podcastsDone = Object.values(yearData[month]!.podcasts).filter(p => p.done).length;
           // This seems to be monthly, let's assume it should be weekly.
           // This logic might need refinement based on how podcast goals are tracked.
        }
        
        ptDays.slice(0, 5).forEach(day => { // Only count Mon-Fri for weekly total
          const dailyCounters = weeklyData.counterTasks?.[day] || {};
          counterTasksList.forEach(task => {
              if(!weeklyTotals[task.id]) weeklyTotals[task.id] = 0;
              weeklyTotals[task.id] += Number(dailyCounters[task.id] || '0');
          });
        });

        // Sum up podcast confirmations for the week
        weeklyTotals['podcasts'] = ptDays.slice(0, 5).reduce((acc, day) => acc + Number(weeklyData.counterTasks?.[day]?.['podcasts'] || '0'), 0);

        const items = Object.entries(weeklyGoalsDef).map(([key, { label, goal }]) => {
            const current = weeklyTotals[key] || 0;
            return { id: key, label, current, goal, achieved: current >= goal };
        });

        return { progressItems: items, overallScore: 0, achievedGoals: items.filter(i => i.achieved).length, totalGoals: items.length };
    }
    
    return { progressItems: [], overallScore: 0, achievedGoals: 0, totalGoals: 0 };

  }, [yearData, week, month, day, dateRange, isMonthlyView]);
  

  if (day) { // Daily score view
     return (
        <div className="flex items-center gap-4">
            <Card className="flex-1">
                <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium text-center">Nota de Performance (Dia)</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 flex justify-center">
                    <ScoreIndicator score={overallScore} />
                </CardContent>
            </Card>
        </div>
     )
  }

  // Weekly, Monthly, or DateRange view
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-primary">
          <BarChart className="mr-2" />
          Progresso e Metas
        </CardTitle>
        <CardDescription>
            {`Metas alcançadas: ${achievedGoals} de ${totalGoals}.`} As metas são baseadas em 5 dias úteis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         {progressItems.length > 0 ? progressItems.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground col-span-1">{item.label}</span>
                 <div className="col-span-3 flex items-center gap-2">
                    <div className="flex-1 rounded-full h-3 bg-muted overflow-hidden">
                        <div 
                           className={cn("h-full rounded-full", item.achieved ? "bg-green-500" : "bg-primary")}
                           style={{ width: item.goal > 0 ? `${Math.min(100, (item.current / item.goal) * 100)}%` : '0%'}}
                        />
                    </div>
                    <span className={cn("text-xs font-bold w-20 text-right", item.achieved ? "text-green-500" : "text-foreground/80")}>
                        {item.current} / {item.goal}
                    </span>
                 </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-4">Sem dados para o período selecionado.</p>
            )}
      </CardContent>
       {isMonthlyView && (
            <CardContent className="pt-0">
                <Card className="bg-green-950/50 border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2"><Trophy/> Resumo de Metas do Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white">{`Você alcançou ${achievedGoals} de ${totalGoals} metas este mês!`}</p>
                    </CardContent>
                </Card>
            </CardContent>
        )}
    </Card>
  );
}

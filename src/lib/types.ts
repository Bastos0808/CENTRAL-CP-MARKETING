

export type GuestInfo = {
  guestName: string;
  instagram: string;
};

export type PodcastEpisode = {
  guests: GuestInfo[];
  done: boolean;
};

export type PodcastData = {
  podcast1: PodcastEpisode;
  podcast2: PodcastEpisode;
  podcast3: PodcastEpisode;
  podcast4: PodcastEpisode;
  podcast5: PodcastEpisode;
};

export type ExtraTask = {
  id: string;
  text: string;
  completed: boolean;
};

export type CheckedTasksState = Record<string, boolean>;
export type CounterTasksState = Record<string, string>;
export type ExtraTasksState = Record<string, ExtraTask[]>;
export type HolidaysState = Record<string, boolean>;

export type WeeklyData = {
  checkedTasks: Record<string, CheckedTasksState>;
  counterTasks: Record<string, CounterTasksState>;
  extraTasks: ExtraTasksState;
  holidays: HolidaysState;
  meetingsBooked: number;
};

export type MonthlyData = {
  semana1: WeeklyData;
  semana2: WeeklyData;
  semana3: WeeklyData;
  semana4: WeeklyData;
  podcasts: PodcastData;
};

export type YearData = Record<string, MonthlyData>;


export interface ClientData {
  id: string;
  clientName: string;
}

export interface KpiCardData {
  title: string;
  value: string;
  description?: string;
}

export interface CategoryReportData {
  categoryName: string;
  totalInvestment: string;
  kpiCards: KpiCardData[];
}

export interface ReportData {
  reportTitle: string;
  reportPeriod: string;
  categories: CategoryReportData[];
}

// New types for Shared Podcast Schedule
export type EpisodeType = 'saude_estetica' | 'empresario' | 'geral';

export interface ScheduledEpisode {
    id: string; // YYYY-MM-DD-episodeType
    date: string; // YYYY-MM-DD
    episodeType: EpisodeType;
    episodeTitle: string;
    guests: GuestInfo[];
    sdrId: string;
    sdrName: string;
    isFilled: boolean;
}

export type PodcastSchedule = Record<string, ScheduledEpisode>;

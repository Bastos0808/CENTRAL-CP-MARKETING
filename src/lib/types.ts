
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
};

export type CheckedTasksState = Record<string, boolean>;
export type CounterTasksState = Record<string, number>;
export type ExtraTasksState = Record<string, string>;
export type HolidaysState = Record<string, boolean>;

export type WeeklyData = {
  checkedTasks: Record<string, CheckedTasksState>;
  counterTasks: Record<string, CounterTasksState>;
  extraTasks: Record<string, ExtraTasksState>;
  holidays: HolidaysState;
  meetingsBooked: number;
  podcasts: PodcastData;
};

export type MonthlyData = {
  semana1: WeeklyData;
  semana2: WeeklyData;
  semana3: WeeklyData;
  semana4: WeeklyData;
};

export type YearData = Record<string, MonthlyData>;

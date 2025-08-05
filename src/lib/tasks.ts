

export const WEEKLY_MEETING_GOAL = 8;

export const ptDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export const ptMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

type Task = {
  id: string;
  label: string;
  type: 'checkbox';
  saturdayOnly?: boolean;
};

type CounterTask = {
  id: string;
  label: string;
  type: 'counter';
  dailyGoal: number;
  weeklyGoal: number;
  saturdayOnly?: boolean;
}

export type AnyTask = Task | CounterTask;


export const allTasks: AnyTask[] = [
    // Counter Tasks
    { id: "m-1-gmaps", label: "Leads (Google Maps)", type: 'counter', dailyGoal: 10, weeklyGoal: 50 },
    { id: "m-1-exact", label: "Leads (Exact Spotter)", type: 'counter', dailyGoal: 30, weeklyGoal: 150 },
    { id: "m-3", label: "Conexões no LinkedIn", type: 'counter', dailyGoal: 20, weeklyGoal: 100 },
    { id: "m-4", label: "Prospecção (Instagram/WhatsApp)", type: 'counter', dailyGoal: 40, weeklyGoal: 200 },
    { id: "m-5", label: "E-mail Marketing", type: 'counter', dailyGoal: 20, weeklyGoal: 100 },
    { id: "a-3", label: "Ligações", type: 'counter', dailyGoal: 5, weeklyGoal: 25 },

    // Checkbox Tasks
    { id: "a-1", label: "Responder a todas as mensagens e e-mails recebidos.", type: 'checkbox' },
    { id: "a-2", label: "Fazer follow-up com leads em negociação para agendamento.", type: 'checkbox' },
    { id: "a-4", label: "Atualizar o CRM, contatar e qualificar os leads que chegaram.", type: 'checkbox' },
    { id: "a-5", label: "Priorizar agendamento de convidados para o podcast (de acordo com a área).", type: 'checkbox' },
    { id: "m-2", label: "Revisar leads no CRM (RD Station) que precisam de follow-up prioritário.", type: 'checkbox' },
    { id: "a-7", label: "Organizar as tarefas para o dia seguinte.", type: 'checkbox' },
];


export const weeklyGoals: Record<string, { label: string; goal: number }> = {
  "meetings": { label: "Consultorias", goal: 8 },
  "podcasts": { label: "Podcasts Concluídos", goal: 4 },
  "m-1-exact": { label: "Leads (Exact Spotter)", goal: 150 },
  "m-3": { label: "Conexões no LinkedIn", goal: 100 },
  "m-4": { label: "Prospecção (Instagram/WhatsApp)", goal: 200 },
  "a-3": { label: "Ligações", goal: 25 },
  "m-1-gmaps": { label: "Leads (Google Maps)", goal: 50 },
  "m-5": { label: "E-mail Marketing", goal: 100 },
};

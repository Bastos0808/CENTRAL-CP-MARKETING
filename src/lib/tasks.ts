
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
  saturdayOnly?: boolean;
}

export type AnyTask = Task | CounterTask;


export const allTasks: AnyTask[] = [
    // Counter Tasks
    { id: "m-1-empresas", label: "Leads (Empresas)", type: 'counter' },
    { id: "m-1-trafego", label: "Leads Tráfego (pago e orgânico)", type: 'counter' },
    { id: "m-4", label: "Leads Instagram", type: 'counter' },
    { id: "a-3", label: "Ligações", type: 'counter' },

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
  "podcasts": { label: "Confirmado para o Podcast", goal: 4 },
  "m-1-empresas": { label: "Leads (Empresas)", goal: 200 },
  "m-1-trafego": { label: "Leads Tráfego", goal: 50 },
  "m-4": { label: "Leads Instagram", goal: 200 },
  "a-3": { label: "Ligações", goal: 25 },
};

// New scoring system
export const scoreWeights: Record<string, number> = {
    "m-1-empresas": 0.2, // 20 leads = 4 points
    "m-1-trafego": 0.5, // 10 leads = 5 points
    "m-4": 0.1, // 40 prospecções = 4 points
    "a-3": 1, // 5 ligações = 5 points
    "daily_meetings": 20, // 1 agendamento = 20 points
};

export const maxScorePerDay = 100;

export const sdrUsers = [
    { id: "HELOYSA_ID", name: "Heloysa" },
    { id: "DEBORA_ID", name: "Débora" },
    { id: "VANDIEGO_ID", name: "Van Diego" }
]

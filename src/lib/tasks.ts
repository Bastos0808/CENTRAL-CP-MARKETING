

export const WEEKLY_MEETING_GOAL = 10;

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
  goal?: number;
}

export type AnyTask = Task | CounterTask;


export const allTasks: AnyTask[] = [
    { id: "m-4", label: "Leads Instagram", type: 'counter', goal: 50 },
    { id: "m-1-empresas", label: "Leads (Empresas)", type: 'counter', goal: 30 },
    { id: "m-1-trafego", label: "Leads Tráfego (pago e orgânico)", type: 'counter', goal: 10 },
    { id: "m-5", label: "Leads (Automação)", type: 'counter', goal: 100 },
    { id: "a-3", label: "Ligações", type: 'counter', goal: 12 },
    { id: "daily_meetings", label: "Consultorias", type: 'counter', goal: 2 },
    { id: "podcasts", label: "Confirmado para o Podcast", type: 'counter', goal: 4 },
    
    // Checkbox Tasks (ordem pode ser mantida ou ajustada se necessário)
    { id: "a-1", label: "Responder a todas as mensagens e e-mails recebidos.", type: 'checkbox' },
    { id: "a-2", label: "Fazer follow-up com leads em negociação para agendamento.", type: 'checkbox' },
    { id: "a-4", label: "Atualizar o CRM, contatar e qualificar os leads que chegaram.", type: 'checkbox' },
    { id: "a-5", label: "Priorizar agendamento de convidados para o podcast (de acordo com a área).", type: 'checkbox' },
    { id: "m-2", label: "Revisar leads no CRM (RD Station) que precisam de follow-up prioritário.", type: 'checkbox' },
    { id: "a-7", label: "Organizar as tarefas para o dia seguinte.", type: 'checkbox' },
];


export const weeklyGoals: Record<string, { label: string; goal: number }> = {
  "m-4": { label: "Leads Instagram", goal: 250 }, 
  "m-1-empresas": { label: "Leads (Empresas)", goal: 150 }, 
  "m-1-trafego": { label: "Leads Tráfego (pago e orgânico)", goal: 50 }, 
  "m-5": { label: "Leads (Automação)", goal: 500 }, 
  "a-3": { label: "Ligações", goal: 60 },
  "podcasts": { label: "Confirmado para o Podcast", goal: 4 },
  "daily_meetings": { label: "Consultorias", goal: 10 },
};

// New scoring system
export const scoreWeights: Record<string, number> = {
    "m-4": 0.1, 
    "m-1-empresas": 0.2, 
    // "m-1-trafego": 0, // Removido do cálculo da nota
    "m-5": 0.1,
    "a-3": 1,
    "podcasts": 15,
    "daily_meetings": 20, 
};

export const maxScorePerDay = 100;

export const sdrUsers = [
    { id: "HELOYSA_ID", name: "Heloysa" },
    { id: "DEBORA_ID", name: "Débora" },
    { id: "VANDIEGO_ID", name: "Van Diego" }
]

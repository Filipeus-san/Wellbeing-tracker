// Datové modely pro wellbeing tracker

export type ScoreValue = 1 | 2 | 3 | 4 | 5;

export type MoodValue = 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';

export const MOODS = {
  very_bad: { emoji: '😢', label: 'Velmi špatná', color: '#ef4444' },
  bad: { emoji: '😟', label: 'Špatná', color: '#f97316' },
  neutral: { emoji: '😐', label: 'Neutrální', color: '#eab308' },
  good: { emoji: '🙂', label: 'Dobrá', color: '#84cc16' },
  very_good: { emoji: '😊', label: 'Velmi dobrá', color: '#10b981' },
} as const;

// Oblasti podle psychologických modelů
export const WellbeingCategory = {
  // Maslow
  PHYSIOLOGICAL: 'physiological',
  SAFETY: 'safety',
  BELONGING_MASLOW: 'belonging_maslow',
  ESTEEM: 'esteem',
  SELF_ACTUALIZATION: 'self_actualization',

  // SDT
  AUTONOMY: 'autonomy',
  COMPETENCE: 'competence',
  BELONGING_SDT: 'belonging_sdt',

  // PERMA
  POSITIVE_EMOTIONS: 'positive_emotions',
  ENGAGEMENT: 'engagement',
  RELATIONSHIPS: 'relationships',
  MEANING: 'meaning',
  ACCOMPLISHMENT: 'accomplishment',
} as const;

export type WellbeingCategory = typeof WellbeingCategory[keyof typeof WellbeingCategory];

export interface Question {
  id: string;
  category: WellbeingCategory;
  text: string;
  model: 'maslow' | 'sdt' | 'perma';
}

export interface DailyScore {
  date: string; // ISO date string
  scores: Record<string, ScoreValue>; // questionId -> score
  mood?: MoodValue; // Nálada v daný den
  notes?: string;
  aiSummary?: string; // AI shrnutí od Claude
  microActions?: MicroAction[]; // Doporučené mikro-akce pro zítřek
}

export interface WeeklySummary {
  weekStart: string; // ISO date string
  weekEnd: string; // ISO date string
  averages: Record<string, number>; // questionId -> average score
  criticalAreas: Array<{
    questionId: string;
    score: number;
  }>;
  microActions: MicroAction[];
  claudeSummary?: string;
}

export interface MicroAction {
  id: string;
  title: string;
  description: string;
  category: WellbeingCategory;
  priority: 'high' | 'medium' | 'low';
}

export type AIProvider = 'claude' | 'codex';

export interface AppSettings {
  claudeApiKey?: string;
  enableClaudeIntegration: boolean;
  aiProvider?: AIProvider; // claude nebo codex
}

// Pomocné typy pro výpočty
export interface CategoryAverage {
  category: WellbeingCategory;
  average: number;
  questionsCount: number;
}

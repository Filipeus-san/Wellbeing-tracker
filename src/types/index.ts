// Datové modely pro wellbeing tracker

export type ScoreValue = 1 | 2 | 3 | 4 | 5;

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
  notes?: string;
  aiSummary?: string; // AI shrnutí od Claude
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

export interface AppSettings {
  claudeApiKey?: string;
  enableClaudeIntegration: boolean;
}

// Pomocné typy pro výpočty
export interface CategoryAverage {
  category: WellbeingCategory;
  average: number;
  questionsCount: number;
}

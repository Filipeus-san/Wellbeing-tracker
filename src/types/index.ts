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

// Škály emocí a duševního stavu (0-10)
export type AnxietyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type DepressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type JoyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type AngerLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type GratitudeLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const getAnxietyLabel = (level: AnxietyLevel): string => {
  if (level === 0) return 'Žádná úzkost';
  if (level <= 3) return 'Mírná úzkost';
  if (level <= 6) return 'Střední úzkost';
  if (level <= 8) return 'Silná úzkost';
  return 'Extrémní úzkost';
};

export const getDepressionLabel = (level: DepressionLevel): string => {
  if (level === 0) return 'Žádná deprese';
  if (level <= 3) return 'Mírná deprese';
  if (level <= 6) return 'Střední deprese';
  if (level <= 8) return 'Silná deprese';
  return 'Extrémní deprese';
};

export const getAnxietyColor = (level: AnxietyLevel): string => {
  if (level === 0) return '#10b981'; // zelená
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#eab308'; // žlutá
  if (level <= 8) return '#f97316'; // oranžová
  return '#ef4444'; // červená
};

export const getDepressionColor = (level: DepressionLevel): string => {
  if (level === 0) return '#10b981'; // zelená
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#eab308'; // žlutá
  if (level <= 8) return '#f97316'; // oranžová
  return '#ef4444'; // červená
};

export const getJoyLabel = (level: JoyLevel): string => {
  if (level === 0) return 'Žádná radost';
  if (level <= 3) return 'Mírná radost';
  if (level <= 6) return 'Střední radost';
  if (level <= 8) return 'Silná radost';
  return 'Extrémní radost';
};

export const getJoyColor = (level: JoyLevel): string => {
  if (level === 0) return '#9ca3af'; // šedá
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#10b981'; // zelená
  if (level <= 8) return '#06b6d4'; // tyrkysová
  return '#8b5cf6'; // fialová
};

export const getAngerLabel = (level: AngerLevel): string => {
  if (level === 0) return 'Žádný vztek';
  if (level <= 3) return 'Mírný vztek';
  if (level <= 6) return 'Střední vztek';
  if (level <= 8) return 'Silný vztek';
  return 'Extrémní vztek';
};

export const getAngerColor = (level: AngerLevel): string => {
  if (level === 0) return '#10b981'; // zelená
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#eab308'; // žlutá
  if (level <= 8) return '#f97316'; // oranžová
  return '#ef4444'; // červená
};

export const getGratitudeLabel = (level: GratitudeLevel): string => {
  if (level === 0) return 'Žádná vděčnost';
  if (level <= 3) return 'Mírná vděčnost';
  if (level <= 6) return 'Střední vděčnost';
  if (level <= 8) return 'Silná vděčnost';
  return 'Hluboká vděčnost';
};

export const getGratitudeColor = (level: GratitudeLevel): string => {
  if (level === 0) return '#9ca3af'; // šedá
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#10b981'; // zelená
  if (level <= 8) return '#0891b2'; // modrá
  return '#6366f1'; // indigo
};

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

  // Praktické oblasti
  CLEANING: 'cleaning',
  HYGIENE: 'hygiene',
  EXERCISE: 'exercise',
  ADDICTION: 'addiction',
  ILLNESS: 'illness',
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
  anxiety?: AnxietyLevel; // Míra úzkosti (0-10)
  depression?: DepressionLevel; // Míra deprese (0-10)
  joy?: JoyLevel; // Míra radosti (0-10)
  anger?: AngerLevel; // Míra vzteku (0-10)
  gratitude?: GratitudeLevel; // Míra vděčnosti (0-10)
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

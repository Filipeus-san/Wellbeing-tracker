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

export const getMoodLabel = (mood: MoodValue, lang: Language = 'cs'): string => {
  const labels = {
    cs: { very_bad: 'Velmi špatná', bad: 'Špatná', neutral: 'Neutrální', good: 'Dobrá', very_good: 'Velmi dobrá' },
    en: { very_bad: 'Terrible', bad: 'Bad', neutral: 'Okay', good: 'Good', very_good: 'Amazing' }
  };
  return labels[lang][mood];
};

// Škály emocí a duševního stavu (0-10)
export type AnxietyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type DepressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type JoyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type AngerLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type GratitudeLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const getAnxietyLabel = (level: AnxietyLevel, lang: Language = 'cs'): string => {
  const labels = lang === 'en'
    ? { 0: 'None', 3: 'Mild', 6: 'Moderate', 8: 'Severe', 10: 'Extreme' }
    : { 0: 'Žádná úzkost', 3: 'Mírná úzkost', 6: 'Střední úzkost', 8: 'Silná úzkost', 10: 'Extrémní úzkost' };
  if (level === 0) return labels[0];
  if (level <= 3) return labels[3];
  if (level <= 6) return labels[6];
  if (level <= 8) return labels[8];
  return labels[10];
};

export const getDepressionLabel = (level: DepressionLevel, lang: Language = 'cs'): string => {
  const labels = lang === 'en'
    ? { 0: 'None', 3: 'Mild', 6: 'Moderate', 8: 'Severe', 10: 'Extreme' }
    : { 0: 'Žádná deprese', 3: 'Mírná deprese', 6: 'Střední deprese', 8: 'Silná deprese', 10: 'Extrémní deprese' };
  if (level === 0) return labels[0];
  if (level <= 3) return labels[3];
  if (level <= 6) return labels[6];
  if (level <= 8) return labels[8];
  return labels[10];
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

export const getJoyLabel = (level: JoyLevel, lang: Language = 'cs'): string => {
  const labels = lang === 'en'
    ? { 0: 'None', 3: 'Mild', 6: 'Moderate', 8: 'High', 10: 'Extreme' }
    : { 0: 'Žádná radost', 3: 'Mírná radost', 6: 'Střední radost', 8: 'Silná radost', 10: 'Extrémní radost' };
  if (level === 0) return labels[0];
  if (level <= 3) return labels[3];
  if (level <= 6) return labels[6];
  if (level <= 8) return labels[8];
  return labels[10];
};

export const getJoyColor = (level: JoyLevel): string => {
  if (level === 0) return '#9ca3af'; // šedá
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#10b981'; // zelená
  if (level <= 8) return '#06b6d4'; // tyrkysová
  return '#8b5cf6'; // fialová
};

export const getAngerLabel = (level: AngerLevel, lang: Language = 'cs'): string => {
  const labels = lang === 'en'
    ? { 0: 'None', 3: 'Mild', 6: 'Moderate', 8: 'High', 10: 'Extreme' }
    : { 0: 'Žádný vztek', 3: 'Mírný vztek', 6: 'Střední vztek', 8: 'Silný vztek', 10: 'Extrémní vztek' };
  if (level === 0) return labels[0];
  if (level <= 3) return labels[3];
  if (level <= 6) return labels[6];
  if (level <= 8) return labels[8];
  return labels[10];
};

export const getAngerColor = (level: AngerLevel): string => {
  if (level === 0) return '#10b981'; // zelená
  if (level <= 3) return '#84cc16'; // světle zelená
  if (level <= 6) return '#eab308'; // žlutá
  if (level <= 8) return '#f97316'; // oranžová
  return '#ef4444'; // červená
};

export const getGratitudeLabel = (level: GratitudeLevel, lang: Language = 'cs'): string => {
  const labels = lang === 'en'
    ? { 0: 'None', 3: 'Mild', 6: 'Moderate', 8: 'High', 10: 'Deep' }
    : { 0: 'Žádná vděčnost', 3: 'Mírná vděčnost', 6: 'Střední vděčnost', 8: 'Silná vděčnost', 10: 'Hluboká vděčnost' };
  if (level === 0) return labels[0];
  if (level <= 3) return labels[3];
  if (level <= 6) return labels[6];
  if (level <= 8) return labels[8];
  return labels[10];
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
export type Language = 'cs' | 'en';

export interface AppSettings {
  claudeApiKey?: string;
  enableClaudeIntegration: boolean;
  aiProvider?: AIProvider; // claude nebo codex
  language?: Language; // Jazyk aplikace
}

// Pomocné typy pro výpočty
export interface CategoryAverage {
  category: WellbeingCategory;
  average: number;
  questionsCount: number;
}

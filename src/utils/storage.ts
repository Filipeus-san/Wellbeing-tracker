import type { DailyScore, WeeklySummary, AppSettings } from '../types';

const STORAGE_KEYS = {
  DAILY_SCORES: 'wellbeing_daily_scores',
  WEEKLY_SUMMARIES: 'wellbeing_weekly_summaries',
  SETTINGS: 'wellbeing_settings',
} as const;

// Daily Scores
export const saveDailyScore = (score: DailyScore): void => {
  const scores = getDailyScores();
  const existingIndex = scores.findIndex((s) => s.date === score.date);

  if (existingIndex >= 0) {
    scores[existingIndex] = score;
  } else {
    scores.push(score);
  }

  // Seřadit podle data
  scores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  localStorage.setItem(STORAGE_KEYS.DAILY_SCORES, JSON.stringify(scores));
};

export const getDailyScores = (): DailyScore[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_SCORES);
  return data ? JSON.parse(data) : [];
};

export const getDailyScore = (date: string): DailyScore | undefined => {
  const scores = getDailyScores();
  return scores.find((s) => s.date === date);
};

export const getDailyScoresInRange = (startDate: string, endDate: string): DailyScore[] => {
  const scores = getDailyScores();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return scores.filter((score) => {
    const scoreDate = new Date(score.date).getTime();
    return scoreDate >= start && scoreDate <= end;
  });
};

// Weekly Summaries
export const saveWeeklySummary = (summary: WeeklySummary): void => {
  const summaries = getWeeklySummaries();
  const existingIndex = summaries.findIndex(
    (s) => s.weekStart === summary.weekStart && s.weekEnd === summary.weekEnd
  );

  if (existingIndex >= 0) {
    summaries[existingIndex] = summary;
  } else {
    summaries.push(summary);
  }

  // Seřadit podle data
  summaries.sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime());

  localStorage.setItem(STORAGE_KEYS.WEEKLY_SUMMARIES, JSON.stringify(summaries));
};

export const getWeeklySummaries = (): WeeklySummary[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_SUMMARIES);
  return data ? JSON.parse(data) : [];
};

export const getWeeklySummary = (weekStart: string): WeeklySummary | undefined => {
  const summaries = getWeeklySummaries();
  return summaries.find((s) => s.weekStart === weekStart);
};

// Settings
export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data
    ? JSON.parse(data)
    : {
        enableClaudeIntegration: false,
      };
};

// Export/Import
export const exportData = (): string => {
  const data = {
    dailyScores: getDailyScores(),
    weeklySummaries: getWeeklySummaries(),
    settings: getSettings(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);

    if (data.dailyScores) {
      localStorage.setItem(STORAGE_KEYS.DAILY_SCORES, JSON.stringify(data.dailyScores));
    }
    if (data.weeklySummaries) {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_SUMMARIES, JSON.stringify(data.weeklySummaries));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.DAILY_SCORES);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY_SUMMARIES);
  // Nemazat settings, aby uživatel neztratil API klíč
};

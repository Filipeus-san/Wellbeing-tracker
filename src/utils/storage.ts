import type { DailyScore, WeeklySummary, AppSettings } from '../types';

// Definice Electron API (pro TypeScript)
interface ElectronAPI {
  getDailyScores: () => Promise<{ success: boolean; data: DailyScore[]; error?: string }>;
  getDailyScore: (date: string) => Promise<{ success: boolean; data: DailyScore | null; error?: string }>;
  saveDailyScore: (score: DailyScore) => Promise<{ success: boolean; data: DailyScore; error?: string }>;
  getWeeklySummaries: () => Promise<{ success: boolean; data: WeeklySummary[]; error?: string }>;
  getWeeklySummary: (weekStart: string) => Promise<{ success: boolean; data: WeeklySummary | null; error?: string }>;
  saveWeeklySummary: (summary: WeeklySummary) => Promise<{ success: boolean; data: WeeklySummary; error?: string }>;
  getSettings: () => Promise<{ success: boolean; data: AppSettings; error?: string }>;
  saveSettings: (settings: AppSettings) => Promise<{ success: boolean; data: AppSettings; error?: string }>;
  exportData: () => Promise<{ success: boolean; data: any; error?: string }>;
  importData: (data: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  clearData: () => Promise<{ success: boolean; message?: string; error?: string }>;
  claudeSummary: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string; details?: string }>;
  claudeTest: () => Promise<{ success: boolean; version?: string; message?: string; error?: string; details?: string }>;
  codexSummary: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string; details?: string }>;
  codexTest: () => Promise<{ success: boolean; version?: string; message?: string; error?: string; details?: string }>;
  copilotSummary: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string; details?: string }>;
  copilotTest: () => Promise<{ success: boolean; version?: string; message?: string; error?: string; details?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// Helper function for Electron IPC calls
async function ipcCall<T>(method: keyof ElectronAPI, ...args: any[]): Promise<T> {
  try {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available');
    }

    const result = await (window.electronAPI[method] as any)(...args);

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  } catch (error) {
    console.error('IPC Error:', error);
    throw error;
  }
}

// Daily Scores
export const saveDailyScore = async (score: DailyScore): Promise<void> => {
  await ipcCall<DailyScore>('saveDailyScore', score);
};

export const getDailyScores = async (): Promise<DailyScore[]> => {
  try {
    return await ipcCall<DailyScore[]>('getDailyScores');
  } catch (error) {
    console.error('Error fetching daily scores:', error);
    return [];
  }
};

export const getDailyScore = async (date: string): Promise<DailyScore | undefined> => {
  try {
    const data = await ipcCall<DailyScore | null>('getDailyScore', date);
    return data === null ? undefined : data;
  } catch (error) {
    console.error('Error fetching daily score:', error);
    return undefined;
  }
};

export const getDailyScoresInRange = async (
  startDate: string,
  endDate: string
): Promise<DailyScore[]> => {
  const scores = await getDailyScores();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return scores.filter((score) => {
    const scoreDate = new Date(score.date).getTime();
    return scoreDate >= start && scoreDate <= end;
  });
};

// Weekly Summaries
export const saveWeeklySummary = async (summary: WeeklySummary): Promise<void> => {
  await ipcCall<WeeklySummary>('saveWeeklySummary', summary);
};

export const getWeeklySummaries = async (): Promise<WeeklySummary[]> => {
  try {
    return await ipcCall<WeeklySummary[]>('getWeeklySummaries');
  } catch (error) {
    console.error('Error fetching weekly summaries:', error);
    return [];
  }
};

export const getWeeklySummary = async (weekStart: string): Promise<WeeklySummary | undefined> => {
  try {
    const data = await ipcCall<WeeklySummary | null>('getWeeklySummary', weekStart);
    return data === null ? undefined : data;
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    return undefined;
  }
};

// Settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await ipcCall<AppSettings>('saveSettings', settings);
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    return await ipcCall<AppSettings>('getSettings');
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      enableClaudeIntegration: false,
    };
  }
};

// Export/Import
export const exportData = async (): Promise<string> => {
  const data = await ipcCall<{
    dailyScores: DailyScore[];
    weeklySummaries: WeeklySummary[];
    settings: AppSettings;
    exportDate: string;
  }>('exportData');
  return JSON.stringify(data, null, 2);
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);
    await ipcCall('importData', data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await ipcCall('clearData');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

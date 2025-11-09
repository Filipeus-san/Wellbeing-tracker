import type { DailyScore, WeeklySummary, AppSettings } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Daily Scores
export const saveDailyScore = async (score: DailyScore): Promise<void> => {
  await apiCall<DailyScore>('/data/daily-scores', {
    method: 'POST',
    body: JSON.stringify(score),
  });
};

export const getDailyScores = async (): Promise<DailyScore[]> => {
  try {
    return await apiCall<DailyScore[]>('/data/daily-scores');
  } catch (error) {
    console.error('Error fetching daily scores:', error);
    return [];
  }
};

export const getDailyScore = async (date: string): Promise<DailyScore | undefined> => {
  try {
    return await apiCall<DailyScore | null>(`/data/daily-scores/${date}`).then((data) =>
      data === null ? undefined : data
    );
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
  await apiCall<WeeklySummary>('/data/weekly-summaries', {
    method: 'POST',
    body: JSON.stringify(summary),
  });
};

export const getWeeklySummaries = async (): Promise<WeeklySummary[]> => {
  try {
    return await apiCall<WeeklySummary[]>('/data/weekly-summaries');
  } catch (error) {
    console.error('Error fetching weekly summaries:', error);
    return [];
  }
};

export const getWeeklySummary = async (weekStart: string): Promise<WeeklySummary | undefined> => {
  try {
    return await apiCall<WeeklySummary | null>(`/data/weekly-summaries/${weekStart}`).then((data) =>
      data === null ? undefined : data
    );
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    return undefined;
  }
};

// Settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await apiCall<AppSettings>('/data/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    return await apiCall<AppSettings>('/data/settings');
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      enableClaudeIntegration: false,
    };
  }
};

// Export/Import
export const exportData = async (): Promise<string> => {
  const data = await apiCall<{
    dailyScores: DailyScore[];
    weeklySummaries: WeeklySummary[];
    settings: AppSettings;
    exportDate: string;
  }>('/data/export');
  return JSON.stringify(data, null, 2);
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);
    await apiCall('/data/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await apiCall('/data/clear', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

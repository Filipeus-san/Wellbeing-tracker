/// <reference types="vite/client" />

interface ElectronAPI {
  // Daily Scores
  getDailyScores: () => Promise<{ success: boolean; data: any[] }>;
  getDailyScore: (date: string) => Promise<{ success: boolean; data: any }>;
  saveDailyScore: (score: any) => Promise<{ success: boolean; data: any }>;

  // Weekly Summaries
  getWeeklySummaries: () => Promise<{ success: boolean; data: any[] }>;
  getWeeklySummary: (weekStart: string) => Promise<{ success: boolean; data: any }>;
  saveWeeklySummary: (summary: any) => Promise<{ success: boolean; data: any }>;

  // Settings
  getSettings: () => Promise<{ success: boolean; data: any }>;
  saveSettings: (settings: any) => Promise<{ success: boolean; data: any }>;

  // Export/Import
  exportData: () => Promise<{ success: boolean; data: any }>;
  importData: (data: any) => Promise<{ success: boolean; message: string }>;
  clearData: () => Promise<{ success: boolean; message: string }>;

  // Claude CLI
  claudeSummary: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  claudeTest: () => Promise<{ success: boolean; version?: string; message?: string; error?: string }>;

  // Codex CLI
  codexSummary: (prompt: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  codexTest: () => Promise<{ success: boolean; version?: string; message?: string; error?: string }>;
}

interface Window {
  electronAPI: ElectronAPI;
}

const { contextBridge, ipcRenderer } = require('electron');

console.log('🔧 Preload script is loading...');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Daily Scores
  getDailyScores: () => ipcRenderer.invoke('get-daily-scores'),
  getDailyScore: (date) => ipcRenderer.invoke('get-daily-score', date),
  saveDailyScore: (score) => ipcRenderer.invoke('save-daily-score', score),

  // Weekly Summaries
  getWeeklySummaries: () => ipcRenderer.invoke('get-weekly-summaries'),
  getWeeklySummary: (weekStart) => ipcRenderer.invoke('get-weekly-summary', weekStart),
  saveWeeklySummary: (summary) => ipcRenderer.invoke('save-weekly-summary', summary),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // Habits
  getHabits: () => ipcRenderer.invoke('get-habits'),
  saveHabit: (habit) => ipcRenderer.invoke('save-habit', habit),
  deleteHabit: (habitId) => ipcRenderer.invoke('delete-habit', habitId),

  // Export/Import
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data) => ipcRenderer.invoke('import-data', data),
  clearData: () => ipcRenderer.invoke('clear-data'),

  // Claude CLI
  claudeSummary: (prompt) => ipcRenderer.invoke('claude-summary', prompt),
  claudeTest: () => ipcRenderer.invoke('claude-test'),

  // Codex CLI
  codexSummary: (prompt) => ipcRenderer.invoke('codex-summary', prompt),
  codexTest: () => ipcRenderer.invoke('codex-test'),

  // Copilot CLI
  copilotSummary: (prompt) => ipcRenderer.invoke('copilot-summary', prompt),
  copilotTest: () => ipcRenderer.invoke('copilot-test'),
});

console.log('✅ Preload script loaded, electronAPI exposed');

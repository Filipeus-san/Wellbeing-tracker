/**
 * Type definitions for Electron update checker API exposed via preload
 */

export interface UpdateInfo {
  available: boolean;
  version?: string;
  url?: string;
  notes?: string;
  downloadUrl?: string;
}

export interface ElectronUpdateAPI {
  checkForUpdates: () => Promise<UpdateInfo>;
  openExternal: (url: string) => Promise<{ success: boolean }>;
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => () => void;
}

declare global {
  interface Window {
    electron?: ElectronUpdateAPI;
  }
}

export {};

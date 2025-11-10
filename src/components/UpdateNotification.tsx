import { useState, useEffect } from 'react';
import './UpdateNotification.css';

interface UpdateInfo {
  available: boolean;
  version?: string;
  url?: string;
  notes?: string;
}

export default function UpdateNotification() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    console.log('UpdateNotification mounted');

    // @ts-ignore - window.electron is defined in preload
    if (!window.electron) {
      console.error('❌ window.electron is not available');
      return;
    }

    console.log('✅ window.electron is available:', Object.keys(window.electron));

    // Listen for update notifications from main process
    const handleUpdateAvailable = (info: UpdateInfo) => {
      console.log('📢 Update notification received:', info);
      if (info && info.available) {
        setUpdateInfo(info);
        setDismissed(false);
      }
    };

    // @ts-ignore - window.electron is defined in preload
    const removeListener = window.electron.onUpdateAvailable(handleUpdateAvailable);

    // Check for updates on mount
    console.log('🔍 Checking for updates manually...');
    // @ts-ignore
    window.electron.checkForUpdates().then((info: UpdateInfo) => {
      console.log('✅ Update check result:', info);
      if (info && info.available) {
        console.log('📢 Setting update info:', info);
        setUpdateInfo(info);
      }
    }).catch((err: any) => {
      console.error('❌ Error checking for updates:', err);
    });

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, []);

  const handleDownload = () => {
    if (updateInfo?.url) {
      // @ts-ignore
      window.electron?.openExternal(updateInfo.url);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  console.log('UpdateNotification render - updateInfo:', updateInfo, 'dismissed:', dismissed);

  if (!updateInfo?.available || dismissed) {
    return null;
  }

  console.log('🎉 Rendering update notification!');

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <div className="update-notification-header">
          <span className="update-notification-icon">🎉</span>
          <h3>Nová verze k dispozici!</h3>
          <button
            className="update-notification-close"
            onClick={handleDismiss}
            aria-label="Zavřít"
          >
            ✕
          </button>
        </div>

        <div className="update-notification-body">
          <p className="update-version">
            <strong>Verze {updateInfo.version}</strong> je nyní dostupná
          </p>

          {updateInfo.notes && (
            <details className="update-notes">
              <summary>Co je nového?</summary>
              <div className="update-notes-content">
                {updateInfo.notes.split('\n').slice(0, 5).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </details>
          )}

          <div className="update-notification-actions">
            <button
              className="update-button-primary"
              onClick={handleDownload}
            >
              📥 Stáhnout aktualizaci
            </button>
            <button
              className="update-button-secondary"
              onClick={handleDismiss}
            >
              Později
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

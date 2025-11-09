import { useState } from 'react';
import { getSettings, saveSettings, exportData, importData, clearAllData } from '../utils/storage';
import { testClaudeApiKey } from '../utils/claudeApi';
import type { AppSettings } from '../types';
import './Settings.css';

interface SettingsProps {
  onUpdate?: () => void;
}

export const Settings = ({ onUpdate }: SettingsProps) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isTestingCLI, setIsTestingCLI] = useState(false);
  const [cliTestResult, setCliTestResult] = useState<'success' | 'error' | null>(null);
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSaveSettings = async () => {
    const newSettings: AppSettings = {
      enableClaudeIntegration: settings.enableClaudeIntegration,
    };

    saveSettings(newSettings);
    setSettings(newSettings);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);

    if (onUpdate) onUpdate();
  };

  const handleTestCLI = async () => {
    setIsTestingCLI(true);
    setCliTestResult(null);

    try {
      const isValid = await testClaudeApiKey();
      setCliTestResult(isValid ? 'success' : 'error');
    } catch (error) {
      setCliTestResult('error');
    } finally {
      setIsTestingCLI(false);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellbeing-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('Data byla úspěšně importována!');
        if (onUpdate) onUpdate();
      } else {
        alert('Chyba při importu dat. Zkontrolujte formát souboru.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Opravdu chcete smazat všechna data? Tato akce je nevratná!\n\n(API klíč zůstane zachován)'
      )
    ) {
      clearAllData();
      alert('Data byla smazána.');
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div className="settings">
      <h2>Nastavení</h2>

      {/* Claude CLI Integration */}
      <div className="settings-section">
        <h3>🤖 Claude AI Integrace</h3>
        <p className="section-description">
          Zapněte integraci s lokálně nainstalovaným Claude CLI pro personalizovaná shrnutí a
          doporučení. Vyžaduje běžící backend server.
        </p>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.enableClaudeIntegration}
              onChange={(e) =>
                setSettings({ ...settings, enableClaudeIntegration: e.target.checked })
              }
            />
            Povolit Claude AI integraci
          </label>
        </div>

        {settings.enableClaudeIntegration && (
          <div className="api-key-section">
            <p className="help-text">
              Aplikace používá lokálně nainstalovaný <strong>Claude CLI</strong> přes backend
              proxy server (port 3001).
            </p>

            <div className="api-key-actions">
              <button
                className="test-key-btn"
                onClick={handleTestCLI}
                disabled={isTestingCLI}
              >
                {isTestingCLI ? 'Testuji...' : 'Test Claude CLI'}
              </button>

              {cliTestResult === 'success' && (
                <span className="test-result success">✓ Claude CLI je dostupné</span>
              )}
              {cliTestResult === 'error' && (
                <span className="test-result error">
                  ✗ Claude CLI není dostupné (zkontrolujte server)
                </span>
              )}
            </div>

            <p className="help-text">
              Ujistěte se, že backend server běží:{' '}
              <code>cd server && npm install && npm start</code>
            </p>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3>💾 Správa dat</h3>

        <div className="data-actions">
          <button className="action-btn export-btn" onClick={handleExport}>
            📤 Exportovat data (JSON)
          </button>

          <label className="action-btn import-btn">
            📥 Importovat data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>

          <button className="action-btn danger-btn" onClick={handleClearData}>
            🗑️ Smazat všechna data
          </button>
        </div>

        <p className="help-text">
          Exportujte svá data jako zálohu nebo je importujte z předchozího exportu.
        </p>
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button className="save-settings-btn" onClick={handleSaveSettings}>
          Uložit nastavení
        </button>

        {saveMessage && <div className="save-message">✓ Nastavení bylo uloženo</div>}
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h3>ℹ️ O aplikaci</h3>
        <p>
          <strong>React Wellbeing Tracker</strong>
        </p>
        <p>
          Aplikace pro sledování duševní pohody založená na psychologických modelech Maslow,
          SDT a PERMA.
        </p>
        <p>Data jsou ukládána lokálně ve vašem prohlížeči (LocalStorage).</p>
      </div>
    </div>
  );
};

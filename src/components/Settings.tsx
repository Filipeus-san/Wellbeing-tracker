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
  const [apiKey, setApiKey] = useState(settings.claudeApiKey || '');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<'success' | 'error' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSaveSettings = async () => {
    const newSettings: AppSettings = {
      claudeApiKey: apiKey.trim() || undefined,
      enableClaudeIntegration: settings.enableClaudeIntegration && !!apiKey.trim(),
    };

    saveSettings(newSettings);
    setSettings(newSettings);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);

    if (onUpdate) onUpdate();
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyTestResult('error');
      return;
    }

    setIsTestingKey(true);
    setKeyTestResult(null);

    try {
      const isValid = await testClaudeApiKey(apiKey.trim());
      setKeyTestResult(isValid ? 'success' : 'error');
    } catch (error) {
      setKeyTestResult('error');
    } finally {
      setIsTestingKey(false);
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

      {/* Claude API Integration */}
      <div className="settings-section">
        <h3>🤖 Claude AI Integrace</h3>
        <p className="section-description">
          Zapněte integraci s Claude AI pro personalizovaná shrnutí a doporučení. Budete
          potřebovat API klíč z Anthropic.
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
            <label htmlFor="apiKey">Claude API Klíč</label>
            <div className="api-key-input-group">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="api-key-input"
              />
              <button
                className="toggle-visibility-btn"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="api-key-actions">
              <button
                className="test-key-btn"
                onClick={handleTestApiKey}
                disabled={isTestingKey || !apiKey.trim()}
              >
                {isTestingKey ? 'Testuji...' : 'Test klíče'}
              </button>

              {keyTestResult === 'success' && (
                <span className="test-result success">✓ Klíč je platný</span>
              )}
              {keyTestResult === 'error' && (
                <span className="test-result error">✗ Klíč je neplatný</span>
              )}
            </div>

            <p className="help-text">
              Získejte API klíč na{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                console.anthropic.com
              </a>
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

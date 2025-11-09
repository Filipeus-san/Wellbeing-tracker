import { useState, useEffect } from 'react';
import { getSettings, saveSettings, exportData, importData, clearAllData } from '../utils/storage';
import { testAiCLI } from '../utils/claudeApi';
import type { AppSettings, Language } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import './Settings.css';

interface SettingsProps {
  onUpdate?: () => void;
}

export const Settings = ({ onUpdate }: SettingsProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<AppSettings>({
    enableClaudeIntegration: false,
    aiProvider: 'claude',
    language: language
  });
  const [isTestingCLI, setIsTestingCLI] = useState(false);
  const [cliTestResult, setCliTestResult] = useState<'success' | 'error' | null>(null);
  const [saveMessage, setSaveMessage] = useState(false);

  // Načíst nastavení při načtení komponenty
  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
    };
    loadSettings();
  }, []);

  const handleLanguageChange = async (newLang: Language) => {
    setSettings({ ...settings, language: newLang });
    setLanguage(newLang);
  };

  const handleSaveSettings = async () => {
    try {
      const newSettings: AppSettings = {
        enableClaudeIntegration: settings.enableClaudeIntegration,
        aiProvider: settings.aiProvider || 'claude',
        language: settings.language,
      };

      await saveSettings(newSettings);
      setSettings(newSettings);
      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 3000);

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const handleTestCLI = async () => {
    setIsTestingCLI(true);
    setCliTestResult(null);

    try {
      // Testovat aktuálně vybraného poskytovatele
      const provider = settings.aiProvider || 'claude';
      const isValid = await testAiCLI(provider);
      setCliTestResult(isValid ? 'success' : 'error');
    } catch (error) {
      setCliTestResult('error');
    } finally {
      setIsTestingCLI(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellbeing-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Chyba při exportu dat.');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const success = await importData(content);
        if (success) {
          alert('Data byla úspěšně importována!');
          if (onUpdate) onUpdate();
        } else {
          alert('Chyba při importu dat. Zkontrolujte formát souboru.');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Chyba při importu dat. Zkontrolujte formát souboru.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        'Opravdu chcete smazat všechna data? Tato akce je nevratná!\n\n(Nastavení zůstane zachováno)'
      )
    ) {
      try {
        await clearAllData();
        alert('Data byla smazána.');
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Chyba při mazání dat.');
      }
    }
  };

  return (
    <div className="settings">
      <h2>{t.settings.title}</h2>

      {/* Language Settings */}
      <div className="settings-section">
        <h3>🌍 {t.settings.language}</h3>
        <p className="section-description">
          {t.settings.selectLanguage}
        </p>

        <div className="setting-item">
          <label htmlFor="language-select">{t.settings.language}:</label>
          <select
            id="language-select"
            value={settings.language || language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            style={{
              marginLeft: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              backgroundColor: 'white',
            }}
          >
            <option value="cs">{t.settings.czech}</option>
            <option value="en">{t.settings.english}</option>
          </select>
        </div>
      </div>

      {/* AI Integration */}
      <div className="settings-section">
        <h3>🤖 {t.settings.aiIntegration}</h3>
        <p className="section-description">
          Zapněte integraci s AI pro personalizovaná shrnutí a doporučení.
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
            Povolit AI integraci
          </label>
        </div>

        {settings.enableClaudeIntegration && (
          <div className="api-key-section">
            <div className="setting-item">
              <label htmlFor="ai-provider">Vyberte AI poskytovatele:</label>
              <select
                id="ai-provider"
                value={settings.aiProvider || 'claude'}
                onChange={(e) =>
                  setSettings({ ...settings, aiProvider: e.target.value as 'claude' | 'codex' })
                }
                style={{
                  marginLeft: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                <option value="claude">Claude CLI (Anthropic)</option>
                <option value="codex">Codex CLI (OpenAI)</option>
              </select>
            </div>

            <p className="help-text">
              Aplikace používá lokálně nainstalovaný{' '}
              <strong>{settings.aiProvider === 'codex' ? 'Codex CLI' : 'Claude CLI'}</strong> volaný přímo z Electronu.
            </p>

            <div className="api-key-actions">
              <button
                className="test-key-btn"
                onClick={handleTestCLI}
                disabled={isTestingCLI}
              >
                {isTestingCLI ? 'Testuji...' : `Test ${settings.aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI`}
              </button>

              {cliTestResult === 'success' && (
                <span className="test-result success">
                  ✓ {settings.aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI je dostupné
                </span>
              )}
              {cliTestResult === 'error' && (
                <span className="test-result error">
                  ✗ {settings.aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI není dostupné (nainstalujte {settings.aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI)
                </span>
              )}
            </div>

            <p className="help-text">
              {settings.aiProvider === 'codex' ? (
                <>
                  Pokud Codex CLI není nainstalované, nainstalujte ho pomocí:{' '}
                  <code>npm install -g @openai/codex-cli</code>
                </>
              ) : (
                <>
                  Pokud Claude CLI není nainstalované, nainstalujte ho pomocí:{' '}
                  <code>npm install -g @anthropic-ai/claude-cli</code>
                </>
              )}
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
          <strong>Wellbeing Tracker - Desktop Aplikace</strong>
        </p>
        <p>
          Aplikace pro sledování duševní pohody založená na psychologických modelech Maslow,
          SDT a PERMA.
        </p>
        <p>Data jsou ukládána lokálně na vašem počítači v uživatelské složce.</p>
      </div>
    </div>
  );
};

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
      alert(language === 'cs' ? 'Chyba při ukládání nastavení' : 'Error saving settings');
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
      alert(language === 'cs' ? 'Chyba při exportu dat.' : 'Error exporting data.');
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
          alert(t.settings.dataImported);
          if (onUpdate) onUpdate();
        } else {
          alert(language === 'cs' ? 'Chyba při importu dat. Zkontrolujte formát souboru.' : 'Error importing data. Check the file format.');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert(language === 'cs' ? 'Chyba při importu dat. Zkontrolujte formát souboru.' : 'Error importing data. Check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (window.confirm(t.settings.confirmClearData)) {
      try {
        await clearAllData();
        alert(t.settings.dataCleared);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert(language === 'cs' ? 'Chyba při mazání dat.' : 'Error clearing data.');
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
          {t.settings.aiIntegrationDescription}
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
            {t.settings.enableAi}
          </label>
        </div>

        {settings.enableClaudeIntegration && (
          <div className="api-key-section">
            <div className="setting-item">
              <label htmlFor="ai-provider">{t.settings.selectAiProvider}:</label>
              <select
                id="ai-provider"
                value={settings.aiProvider || 'claude'}
                onChange={(e) =>
                  setSettings({ ...settings, aiProvider: e.target.value as 'claude' | 'codex' | 'copilot' })
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
                <option value="claude">{t.settings.claude}</option>
                <option value="codex">{t.settings.codex}</option>
                <option value="copilot">{t.settings.copilot}</option>
              </select>
            </div>

            <p className="help-text">
              {t.settings.cliUsesLocal}{' '}
              <strong>
                {settings.aiProvider === 'codex' ? t.settings.codex :
                 settings.aiProvider === 'copilot' ? t.settings.copilot :
                 t.settings.claude}
              </strong> {language === 'cs' ? 'volaný přímo z Electronu' : 'called directly from Electron'}.
            </p>

            <div className="api-key-actions">
              <button
                className="test-key-btn"
                onClick={handleTestCLI}
                disabled={isTestingCLI}
              >
                {isTestingCLI ? t.settings.testing : `${language === 'cs' ? 'Test' : 'Test'} ${settings.aiProvider === 'codex' ? 'Codex' : settings.aiProvider === 'copilot' ? 'Copilot' : 'Claude'} CLI`}
              </button>

              {cliTestResult === 'success' && (
                <span className="test-result success">
                  ✓ {settings.aiProvider === 'codex' ? 'Codex' : settings.aiProvider === 'copilot' ? 'Copilot' : 'Claude'} {t.settings.connectionSuccessful}
                </span>
              )}
              {cliTestResult === 'error' && (
                <span className="test-result error">
                  ✗ {settings.aiProvider === 'codex' ? 'Codex' : settings.aiProvider === 'copilot' ? 'Copilot' : 'Claude'} {t.settings.connectionFailed} ({t.settings.cliNotAvailable} {settings.aiProvider === 'codex' ? 'Codex' : settings.aiProvider === 'copilot' ? 'Copilot' : 'Claude'} CLI)
                </span>
              )}
            </div>

            <p className="help-text">
              {settings.aiProvider === 'codex' ? (
                <>
                  {t.settings.installCodex}:{' '}
                  <code>npm install -g @openai/codex-cli</code>
                </>
              ) : settings.aiProvider === 'copilot' ? (
                <>
                  {t.settings.installCopilot}:{' '}
                  <code>gh extension install github/gh-copilot</code>
                </>
              ) : (
                <>
                  {t.settings.installClaude}:{' '}
                  <code>npm install -g @anthropic-ai/claude-cli</code>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3>💾 {t.settings.dataManagement}</h3>

        <div className="data-actions">
          <button className="action-btn export-btn" onClick={handleExport}>
            📤 {t.settings.exportData}
          </button>

          <label className="action-btn import-btn">
            📥 {t.settings.importData}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>

          <button className="action-btn danger-btn" onClick={handleClearData}>
            🗑️ {t.settings.clearAllData}
          </button>
        </div>

        <p className="help-text">
          {t.settings.exportDescription}
        </p>
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button className="save-settings-btn" onClick={handleSaveSettings}>
          {t.settings.saveSettings}
        </button>

        {saveMessage && <div className="save-message">✓ {t.settings.settingsSaved}</div>}
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h3>ℹ️ {t.settings.aboutApp}</h3>
        <p>
          <strong>{t.settings.appName}</strong>
        </p>
        <p>
          {t.settings.appDescription}
        </p>
        <p>{t.settings.dataStoredLocally}</p>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { getSettings, saveSettings, exportData, importData, clearAllData } from '../utils/storage';
import { testAiCLI } from '../utils/claudeApi';
import type { AppSettings, Language } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { GoogleDriveGuide } from './GoogleDriveGuide';
import { AiCliGuide } from './AiCliGuide';
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

  // Google Drive state
  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [gdriveSyncEnabled, setGdriveSyncEnabled] = useState(false);
  const [gdriveClientId, setGdriveClientId] = useState('');
  const [gdriveClientSecret, setGdriveClientSecret] = useState('');
  const [gdriveAuthCode, setGdriveAuthCode] = useState('');
  const [gdriveAuthenticating, setGdriveAuthenticating] = useState(false);
  const [gdriveSyncing, setGdriveSyncing] = useState(false);
  const [gdriveSyncMessage, setGdriveSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showAiGuide, setShowAiGuide] = useState(false);

  // Načíst nastavení při načtení komponenty
  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
    };
    loadSettings();

    // Zkontrolovat Google Drive připojení
    checkGdriveConnection();
  }, []);

  const checkGdriveConnection = async () => {
    try {
      const result = await window.electronAPI.gdriveIsConnected();
      if (result.success) {
        setGdriveConnected(result.connected);
        setGdriveSyncEnabled(result.syncEnabled);
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
    }
  };

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

  // Google Drive handlers
  const handleConnectGoogleDrive = async () => {
    if (!gdriveClientId || !gdriveClientSecret) {
      alert(language === 'cs' ? 'Zadejte Client ID a Client Secret' : 'Enter Client ID and Client Secret');
      return;
    }

    try {
      const result = await window.electronAPI.gdriveGetAuthUrl(gdriveClientId, gdriveClientSecret);
      if (result.success && result.authUrl) {
        // Otevřít autorizační URL v browseru
        await window.electronAPI.gdriveOpenAuthUrl(result.authUrl);
        alert(language === 'cs'
          ? 'Autorizační stránka byla otevřena v browseru. Po autorizaci zkopírujte kód z URL (část za "code=") a vložte ho níže.'
          : 'Authorization page has been opened in your browser. After authorizing, copy the code from the URL (the part after "code=") and paste it below.');
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      alert(language === 'cs' ? 'Chyba při získávání autorizační URL' : 'Error getting authorization URL');
    }
  };

  const handleAuthenticate = async () => {
    if (!gdriveAuthCode) {
      alert(language === 'cs' ? 'Zadejte autorizační kód' : 'Enter authorization code');
      return;
    }

    setGdriveAuthenticating(true);
    try {
      const result = await window.electronAPI.gdriveAuthenticate(gdriveAuthCode);
      if (result.success) {
        setGdriveConnected(true);
        setGdriveAuthCode('');
        alert(t.settings.authenticationSuccessful);
      } else {
        alert(`${t.settings.authenticationFailed}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error authenticating:', error);
      alert(t.settings.authenticationFailed);
    } finally {
      setGdriveAuthenticating(false);
    }
  };

  const handleDisconnectGoogleDrive = async () => {
    if (!window.confirm(language === 'cs' ? 'Opravdu chcete odpojit Google Drive?' : 'Are you sure you want to disconnect Google Drive?')) {
      return;
    }

    try {
      const result = await window.electronAPI.gdriveDisconnect();
      if (result.success) {
        setGdriveConnected(false);
        setGdriveSyncEnabled(false);
        setGdriveClientId('');
        setGdriveClientSecret('');
        alert(language === 'cs' ? 'Google Drive odpojen' : 'Google Drive disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert(language === 'cs' ? 'Chyba při odpojování' : 'Error disconnecting');
    }
  };

  const handleToggleAutoSync = async (enabled: boolean) => {
    try {
      const result = await window.electronAPI.gdriveSetSyncEnabled(enabled);
      if (result.success) {
        setGdriveSyncEnabled(enabled);
      }
    } catch (error) {
      console.error('Error toggling sync:', error);
    }
  };

  const handleUploadToGoogleDrive = async () => {
    setGdriveSyncing(true);
    setGdriveSyncMessage(null);
    try {
      const result = await window.electronAPI.gdriveUpload();
      if (result.success) {
        setGdriveSyncMessage({ type: 'success', text: t.settings.syncSuccessful });
        setTimeout(() => setGdriveSyncMessage(null), 3000);
      } else {
        setGdriveSyncMessage({ type: 'error', text: `${t.settings.syncFailed}: ${result.error}` });
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setGdriveSyncMessage({ type: 'error', text: t.settings.syncFailed });
    } finally {
      setGdriveSyncing(false);
    }
  };

  const handleDownloadFromGoogleDrive = async () => {
    if (!window.confirm(language === 'cs'
      ? 'Stažení dat z Google Drive přepíše lokální data. Pokračovat?'
      : 'Downloading data from Google Drive will overwrite local data. Continue?')) {
      return;
    }

    setGdriveSyncing(true);
    setGdriveSyncMessage(null);
    try {
      const result = await window.electronAPI.gdriveDownload();
      if (result.success) {
        setGdriveSyncMessage({ type: 'success', text: t.settings.syncSuccessful });
        setTimeout(() => setGdriveSyncMessage(null), 3000);
        if (onUpdate) onUpdate();
      } else {
        setGdriveSyncMessage({ type: 'error', text: `${t.settings.syncFailed}: ${result.error}` });
      }
    } catch (error) {
      console.error('Error downloading:', error);
      setGdriveSyncMessage({ type: 'error', text: t.settings.syncFailed });
    } finally {
      setGdriveSyncing(false);
    }
  };

  return (
    <>
      {showGuide && <GoogleDriveGuide onClose={() => setShowGuide(false)} />}
      {showAiGuide && <AiCliGuide onClose={() => setShowAiGuide(false)} />}

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

        <button
          className="action-btn"
          onClick={() => setShowAiGuide(true)}
          style={{
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
          }}
        >
          📖 {language === 'cs' ? 'Zobrazit podrobný návod na nastavení AI' : 'Show detailed AI setup guide'}
        </button>

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

      {/* Google Drive Sync */}
      <div className="settings-section">
        <h3>☁️ {t.settings.googleDriveSync}</h3>
        <p className="section-description">
          {t.settings.googleDriveSyncDescription}
        </p>

        <button
          className="action-btn"
          onClick={() => setShowGuide(true)}
          style={{
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
          }}
        >
          📖 {language === 'cs' ? 'Zobrazit podrobný návod na nastavení' : 'Show detailed setup guide'}
        </button>

        {!gdriveConnected ? (
          <>
            <p className="help-text">
              {t.settings.googleDriveInstructions}
            </p>

            <div className="setting-item">
              <label htmlFor="gdrive-client-id">{t.settings.clientId}:</label>
              <input
                id="gdrive-client-id"
                type="text"
                value={gdriveClientId}
                onChange={(e) => setGdriveClientId(e.target.value)}
                placeholder={t.settings.clientIdPlaceholder}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
              />
            </div>

            <div className="setting-item">
              <label htmlFor="gdrive-client-secret">{t.settings.clientSecret}:</label>
              <input
                id="gdrive-client-secret"
                type="password"
                value={gdriveClientSecret}
                onChange={(e) => setGdriveClientSecret(e.target.value)}
                placeholder={t.settings.clientSecretPlaceholder}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              className="action-btn"
              onClick={handleConnectGoogleDrive}
              style={{ marginTop: '10px' }}
            >
              {t.settings.connectGoogleDrive}
            </button>

            <div className="setting-item" style={{ marginTop: '20px' }}>
              <label htmlFor="gdrive-auth-code">{t.settings.enterAuthCode}:</label>
              <input
                id="gdrive-auth-code"
                type="text"
                value={gdriveAuthCode}
                onChange={(e) => setGdriveAuthCode(e.target.value)}
                placeholder={t.settings.authCodePlaceholder}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              className="action-btn"
              onClick={handleAuthenticate}
              disabled={gdriveAuthenticating}
              style={{ marginTop: '10px' }}
            >
              {gdriveAuthenticating ? t.settings.authenticating : t.settings.authenticate}
            </button>
          </>
        ) : (
          <>
            <div className="setting-item">
              <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                ✓ {t.settings.googleDriveConnected}
              </p>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={gdriveSyncEnabled}
                  onChange={(e) => handleToggleAutoSync(e.target.checked)}
                />
                {t.settings.enableAutoSync}
              </label>
            </div>

            <div className="data-actions" style={{ marginTop: '20px' }}>
              <button
                className="action-btn export-btn"
                onClick={handleUploadToGoogleDrive}
                disabled={gdriveSyncing}
              >
                {gdriveSyncing ? t.settings.syncing : `📤 ${t.settings.uploadToGoogleDrive}`}
              </button>

              <button
                className="action-btn import-btn"
                onClick={handleDownloadFromGoogleDrive}
                disabled={gdriveSyncing}
              >
                {gdriveSyncing ? t.settings.syncing : `📥 ${t.settings.downloadFromGoogleDrive}`}
              </button>

              <button
                className="action-btn danger-btn"
                onClick={handleDisconnectGoogleDrive}
              >
                {t.settings.disconnectGoogleDrive}
              </button>
            </div>

            {gdriveSyncMessage && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: gdriveSyncMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: gdriveSyncMessage.type === 'success' ? '#065f46' : '#991b1b',
              }}>
                {gdriveSyncMessage.type === 'success' ? '✓' : '✗'} {gdriveSyncMessage.text}
              </div>
            )}
          </>
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
    </div>
    </>
  );
};

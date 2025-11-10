import { useLanguage } from '../i18n/LanguageContext';
import type { AIProvider } from '../types';
import './AiCliGuide.css';

interface AiCliGuideProps {
  onClose: () => void;
  aiProvider: AIProvider;
}

export const AiCliGuide = ({ onClose, aiProvider }: AiCliGuideProps) => {
  const { language, t } = useLanguage();

  const renderClaudeGuide = () => (
    <>
      {language === 'cs' ? (
        <section className="guide-section">
          <h3>🔧 Integrace Claude CLI</h3>

          <h4>Krok 1: Instalace Claude Code</h4>
          <ol className="guide-steps">
            <li>
              <strong>Vyberte instalační metodu podle vašeho systému:</strong>

              <div style={{ marginTop: '12px' }}>
                <strong>macOS/Linux (doporučeno):</strong>
                <div className="guide-code-block">
                  <code>brew install --cask claude-code</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>macOS/Linux/WSL (alternativa):</strong>
                <div className="guide-code-block">
                  <code>curl -fsSL https://claude.ai/install.sh | bash</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>Windows PowerShell:</strong>
                <div className="guide-code-block">
                  <code>irm https://claude.ai/install.ps1 | iex</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>NPM (vyžaduje Node.js 18+):</strong>
                <div className="guide-code-block">
                  <code>npm install -g @anthropic-ai/claude-code</code>
                </div>
              </div>
            </li>
          </ol>

          <h4>Krok 2: První spuštění a autentizace</h4>
          <ol className="guide-steps">
            <li>
              <strong>Spusťte Claude Code:</strong>
              <div className="guide-code-block">
                <code>claude</code>
              </div>
              <p>CLI se spustí a automaticky otevře prohlížeč pro OAuth autentizaci.</p>
            </li>
            <li>
              <strong>V prohlížeči:</strong>
              <ul>
                <li>Přihlaste se do svého Anthropic účtu (nebo se zaregistrujte)</li>
                <li>Potvrďte přístup pro Claude Code</li>
                <li>Autentizace proběhne automaticky přes OAuth</li>
              </ul>
              <div className="guide-note">
                💡 <strong>Poznámka:</strong> Potřebujete aktivní billing na console.anthropic.com nebo Claude Pro/Max předplatné.
              </div>
            </li>
          </ol>

          <h4>Krok 3: Aktivace v aplikaci</h4>
          <ol className="guide-steps">
            <li>
              <strong>V Nastavení Wellbeing Tracker:</strong>
              <ul>
                <li>Zaškrtněte "Povolit AI integraci"</li>
                <li>Vyberte "Claude" z dropdown menu</li>
                <li>Klikněte "Test Claude CLI"</li>
                <li>Pokud vše funguje, uvidíte zelené ✓</li>
              </ul>
            </li>
            <li>
              <strong>Klikněte "Uložit nastavení"</strong>
            </li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Hotovo!</strong> Claude Code je připravený. Aplikace bude používat CLI pro generování shrnutí.
          </div>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 Claude CLI Integration</h3>

          <h4>Step 1: Install Claude Code</h4>
          <ol className="guide-steps">
            <li>
              <strong>Choose installation method for your system:</strong>

              <div style={{ marginTop: '12px' }}>
                <strong>macOS/Linux (recommended):</strong>
                <div className="guide-code-block">
                  <code>brew install --cask claude-code</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>macOS/Linux/WSL (alternative):</strong>
                <div className="guide-code-block">
                  <code>curl -fsSL https://claude.ai/install.sh | bash</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>Windows PowerShell:</strong>
                <div className="guide-code-block">
                  <code>irm https://claude.ai/install.ps1 | iex</code>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong>NPM (requires Node.js 18+):</strong>
                <div className="guide-code-block">
                  <code>npm install -g @anthropic-ai/claude-code</code>
                </div>
              </div>
            </li>
          </ol>

          <h4>Step 2: First Launch and Authentication</h4>
          <ol className="guide-steps">
            <li>
              <strong>Launch Claude Code:</strong>
              <div className="guide-code-block">
                <code>claude</code>
              </div>
              <p>The CLI will launch and automatically open your browser for OAuth authentication.</p>
            </li>
            <li>
              <strong>In your browser:</strong>
              <ul>
                <li>Sign in to your Anthropic account (or sign up)</li>
                <li>Confirm access for Claude Code</li>
                <li>Authentication happens automatically via OAuth</li>
              </ul>
              <div className="guide-note">
                💡 <strong>Note:</strong> You need active billing at console.anthropic.com or a Claude Pro/Max subscription.
              </div>
            </li>
          </ol>

          <h4>Step 3: Activate in App</h4>
          <ol className="guide-steps">
            <li>
              <strong>In Wellbeing Tracker Settings:</strong>
              <ul>
                <li>Check "Enable AI integration"</li>
                <li>Select "Claude" from dropdown</li>
                <li>Click "Test Claude CLI"</li>
                <li>If everything works, you'll see green ✓</li>
              </ul>
            </li>
            <li>
              <strong>Click "Save Settings"</strong>
            </li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Done!</strong> Claude Code is ready. The app will use the CLI to generate summaries.
          </div>
        </section>
      )}
    </>
  );

  const renderCodexGuide = () => (
    <>
      {language === 'cs' ? (
        <section className="guide-section">
          <h3>🔧 Integrace OpenAI Codex CLI</h3>

          <h4>Krok 1: Instalace Codex CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Instalace pomocí npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @openai/codex@latest</code>
              </div>
              <div className="guide-note">
                💡 Vyžaduje Node.js. Pokud ho nemáte, nainstalujte z <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>
              </div>
            </li>
          </ol>

          <h4>Krok 2: První spuštění a autentizace</h4>
          <ol className="guide-steps">
            <li>
              <strong>Spusťte Codex CLI poprvé:</strong>
              <div className="guide-code-block">
                <code>codex</code>
              </div>
              <p>CLI automaticky spustí průvodce nastavením.</p>
            </li>
            <li>
              <strong>Vyberte autentizační metodu:</strong>
              <ul>
                <li><strong>Varianta A - ChatGPT účet (doporučeno):</strong> Přihlaste se přes OAuth s ChatGPT Plus/Pro/Business účtem</li>
                <li><strong>Varianta B - API klíč:</strong> Použijte OpenAI API klíč z <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
              </ul>
              <div className="guide-note">
                💡 <strong>OAuth metoda:</strong> CLI automaticky otevře prohlížeč pro přihlášení. Stačí potvrdit přístup.
              </div>
            </li>
          </ol>

          <h4>Krok 3: Aktivace v aplikaci</h4>
          <ol className="guide-steps">
            <li>V Nastavení vyberte "Codex"</li>
            <li>Klikněte "Test Codex CLI"</li>
            <li>Uložte nastavení</li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Hotovo!</strong> Codex CLI je připravený k použití.
          </div>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 OpenAI Codex CLI Integration</h3>

          <h4>Step 1: Install Codex CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Install using npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @openai/codex@latest</code>
              </div>
              <div className="guide-note">
                💡 Requires Node.js. If you don't have it, install from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>
              </div>
            </li>
          </ol>

          <h4>Step 2: First Launch and Authentication</h4>
          <ol className="guide-steps">
            <li>
              <strong>Launch Codex CLI for the first time:</strong>
              <div className="guide-code-block">
                <code>codex</code>
              </div>
              <p>The CLI automatically starts the setup wizard.</p>
            </li>
            <li>
              <strong>Choose authentication method:</strong>
              <ul>
                <li><strong>Option A - ChatGPT account (recommended):</strong> Sign in via OAuth with ChatGPT Plus/Pro/Business account</li>
                <li><strong>Option B - API key:</strong> Use OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
              </ul>
              <div className="guide-note">
                💡 <strong>OAuth method:</strong> CLI automatically opens browser for login. Just confirm access.
              </div>
            </li>
          </ol>

          <h4>Step 3: Activate in App</h4>
          <ol className="guide-steps">
            <li>In Settings, select "Codex"</li>
            <li>Click "Test Codex CLI"</li>
            <li>Save settings</li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Done!</strong> Codex CLI is ready to use.
          </div>
        </section>
      )}
    </>
  );

  const renderCopilotGuide = () => (
    <>
      {language === 'cs' ? (
        <section className="guide-section">
          <h3>🔧 Integrace GitHub Copilot CLI</h3>

          <h4>Předpoklady</h4>
          <div className="guide-info-box">
            ✅ Aktivní GitHub Copilot subscription (Pro, Pro+, Business nebo Enterprise)<br/>
            ✅ Node.js 22+ a npm 10+
          </div>

          <h4>Krok 1: Instalace</h4>
          <ol className="guide-steps">
            <li>
              <strong>Instalace přes npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @github/copilot</code>
              </div>
            </li>
          </ol>

          <h4>Krok 2: První spuštění a přihlášení</h4>
          <ol className="guide-steps">
            <li>
              <strong>Spusťte Copilot CLI:</strong>
              <div className="guide-code-block">
                <code>copilot</code>
              </div>
            </li>
            <li>
              <strong>Přihlaste se:</strong>
              <p>Pokud nejste přihlášeni, CLI vás vyzve k použití příkazu:</p>
              <div className="guide-code-block">
                <code>/login</code>
              </div>
              <ul>
                <li>Postupujte podle instrukcí na obrazovce</li>
                <li>Autentizace proběhne přes OAuth v prohlížeči</li>
                <li>Přihlaste se svým GitHub účtem s aktivním Copilot předplatným</li>
              </ul>
            </li>
          </ol>

          <h4>Krok 3: Aktivace v aplikaci</h4>
          <ol className="guide-steps">
            <li>V Nastavení vyberte "Copilot"</li>
            <li>Klikněte "Test Copilot CLI"</li>
            <li>Uložte nastavení</li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Hotovo!</strong> GitHub Copilot CLI je připravený.
          </div>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 GitHub Copilot CLI Integration</h3>

          <h4>Prerequisites</h4>
          <div className="guide-info-box">
            ✅ Active GitHub Copilot subscription (Pro, Pro+, Business, or Enterprise)<br/>
            ✅ Node.js 22+ and npm 10+
          </div>

          <h4>Step 1: Installation</h4>
          <ol className="guide-steps">
            <li>
              <strong>Install via npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @github/copilot</code>
              </div>
            </li>
          </ol>

          <h4>Step 2: First Launch and Login</h4>
          <ol className="guide-steps">
            <li>
              <strong>Launch Copilot CLI:</strong>
              <div className="guide-code-block">
                <code>copilot</code>
              </div>
            </li>
            <li>
              <strong>Log in:</strong>
              <p>If not logged in, CLI will prompt you to use the command:</p>
              <div className="guide-code-block">
                <code>/login</code>
              </div>
              <ul>
                <li>Follow on-screen instructions</li>
                <li>Authentication happens via OAuth in browser</li>
                <li>Sign in with your GitHub account with active Copilot subscription</li>
              </ul>
            </li>
          </ol>

          <h4>Step 3: Activate in App</h4>
          <ol className="guide-steps">
            <li>In Settings, select "Copilot"</li>
            <li>Click "Test Copilot CLI"</li>
            <li>Save settings</li>
          </ol>

          <div className="guide-info-box">
            <strong>✅ Done!</strong> GitHub Copilot CLI is ready.
          </div>
        </section>
      )}
    </>
  );

  const renderTroubleshooting = () => (
    <>
      {language === 'cs' ? (
        <section className="guide-section">
          <h3>🔧 Časté problémy a řešení</h3>
          <div className="guide-troubleshooting">
            <div className="guide-problem">
              <strong>❌ "CLI is not available"</strong>
              <p>
                <strong>Řešení:</strong><br/>
                • Zkontrolujte, že je CLI nainstalované globálně s <code>-g</code> flagem<br/>
                • Restartujte terminál<br/>
                • Restartujte aplikaci
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Not authenticated" nebo "Authentication failed"</strong>
              <p>
                <strong>Řešení:</strong><br/>
                • Spusťte CLI manuálně v terminálu a dokončete OAuth autentizaci<br/>
                • Ujistěte se, že máte aktivní předplatné/billing<br/>
                • Zkuste se odhlásit a znovu přihlásit
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Command not found"</strong>
              <p>
                <strong>Řešení:</strong><br/>
                • Zkontrolujte npm global path: <code>npm config get prefix</code><br/>
                • Ujistěte se, že npm bin je v PATH<br/>
                • Zkuste reinstalaci s <code>npm install -g</code>
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ AI generuje špatné odpovědi</strong>
              <p>
                <strong>Řešení:</strong><br/>
                • Vyplňte denní dotazník kompletně (všech 18 otázek)<br/>
                • Přidejte více kontextu do poznámek<br/>
                • Zkuste jiného AI poskytovatele
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 Common Issues and Solutions</h3>
          <div className="guide-troubleshooting">
            <div className="guide-problem">
              <strong>❌ "CLI is not available"</strong>
              <p>
                <strong>Solution:</strong><br/>
                • Check that CLI is installed globally with <code>-g</code> flag<br/>
                • Restart terminal<br/>
                • Restart the app
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Not authenticated" or "Authentication failed"</strong>
              <p>
                <strong>Solution:</strong><br/>
                • Run CLI manually in terminal and complete OAuth authentication<br/>
                • Make sure you have active subscription/billing<br/>
                • Try logging out and logging back in
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Command not found"</strong>
              <p>
                <strong>Solution:</strong><br/>
                • Check npm global path: <code>npm config get prefix</code><br/>
                • Make sure npm bin is in PATH<br/>
                • Try reinstalling with <code>npm install -g</code>
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ AI generates poor responses</strong>
              <p>
                <strong>Solution:</strong><br/>
                • Fill daily questionnaire completely (all 18 questions)<br/>
                • Add more context in notes<br/>
                • Try different AI provider
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );

  return (
    <div className="guide-overlay">
      <div className="guide-container">
        <div className="guide-header">
          <h2>{t.aiGuide.title}</h2>
          <button className="guide-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="guide-content">
          {aiProvider === 'claude' && renderClaudeGuide()}
          {aiProvider === 'codex' && renderCodexGuide()}
          {aiProvider === 'copilot' && renderCopilotGuide()}

          {renderTroubleshooting()}

          {language === 'cs' ? (
            <section className="guide-section">
              <h3>🔒 Bezpečnost a soukromí</h3>
              <ul className="guide-security">
                <li>
                  ✅ <strong>Bezpečná OAuth autentizace</strong> - Moderní a bezpečný způsob přihlášení
                </li>
                <li>
                  ✅ <strong>Lokální zpracování</strong> - CLI běží na vašem počítači
                </li>
                <li>
                  ✅ <strong>Přímá komunikace</strong> - Aplikace komunikuje přímo s AI přes CLI
                </li>
                <li>
                  ✅ <strong>HTTPS šifrování</strong> - Veškerá komunikace je šifrovaná
                </li>
                <li>
                  ✅ <strong>Žádné logování</strong> - Aplikace neloguje vaše dotazy ani odpovědi
                </li>
              </ul>
            </section>
          ) : (
            <section className="guide-section">
              <h3>🔒 Security and Privacy</h3>
              <ul className="guide-security">
                <li>
                  ✅ <strong>Secure OAuth authentication</strong> - Modern and secure login method
                </li>
                <li>
                  ✅ <strong>Local processing</strong> - CLI runs on your computer
                </li>
                <li>
                  ✅ <strong>Direct communication</strong> - App communicates directly with AI via CLI
                </li>
                <li>
                  ✅ <strong>HTTPS encryption</strong> - All communication is encrypted
                </li>
                <li>
                  ✅ <strong>No logging</strong> - App doesn't log your queries or responses
                </li>
              </ul>
            </section>
          )}
        </div>

        <div className="guide-footer">
          <button className="guide-close-footer-btn" onClick={onClose}>
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};

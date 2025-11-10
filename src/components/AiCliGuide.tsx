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

          <h4>Krok 1: Vytvoření účtu na Anthropic</h4>
          <ol className="guide-steps">
            <li>
              <strong>Zaregistrujte se na Anthropic:</strong>
              <ul>
                <li>Jděte na <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                <li>Klikněte na "Sign Up"</li>
                <li>Vyplňte email a heslo (nebo se přihlaste přes Google)</li>
              </ul>
              <div className="guide-note">
                💡 Nový účet dostane $5 kreditu zdarma pro testování.
              </div>
            </li>
            <li>
              <strong>Získejte API klíč:</strong>
              <ul>
                <li>Po přihlášení jděte na <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Settings → API Keys</a></li>
                <li>Klikněte na "Create Key"</li>
                <li>Pojmenujte klíč (např. "Wellbeing Tracker")</li>
                <li>Zkopírujte klíč a uložte si ho (zobrazí se pouze jednou!)</li>
              </ul>
              <div className="guide-warning-box">
                ⚠️ <strong>Důležité:</strong> API klíč se zobrazí pouze jednou. Uložte si ho na bezpečné místo!
              </div>
            </li>
          </ol>

          <h4>Krok 2: Instalace Claude CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Instalace pomocí npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @anthropic-ai/claude-cli</code>
              </div>
              <div className="guide-note">
                💡 Vyžaduje Node.js a npm. Pokud je nemáte, nainstalujte z <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>
              </div>
            </li>
            <li>
              <strong>Ověření instalace:</strong>
              <div className="guide-code-block">
                <code>claude --version</code>
              </div>
              <p>Mělo by zobrazit číslo verze.</p>
            </li>
          </ol>

          <h4>Krok 3: Konfigurace API klíče</h4>
          <ol className="guide-steps">
            <li>
              <strong>Nastavení API klíče:</strong>
              <div className="guide-code-block">
                <code>export ANTHROPIC_API_KEY="váš-api-klíč"</code>
              </div>
              <div className="guide-note">
                💡 <strong>Trvalé nastavení:</strong><br/>
                Přidejte tento řádek do <code>~/.bashrc</code> nebo <code>~/.zshrc</code>:<br/>
                <code>export ANTHROPIC_API_KEY="váš-api-klíč"</code>
              </div>
            </li>
            <li>
              <strong>Test připojení:</strong>
              <div className="guide-code-block">
                <code>echo "Hello" | claude --print</code>
              </div>
              <p>Claude by měl odpovědět na váš pozdrav.</p>
            </li>
          </ol>

          <h4>Krok 4: Aktivace v aplikaci</h4>
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
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 Claude CLI Integration</h3>

          <h4>Step 1: Create Anthropic Account</h4>
          <ol className="guide-steps">
            <li>
              <strong>Sign up on Anthropic:</strong>
              <ul>
                <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                <li>Click "Sign Up"</li>
                <li>Fill in email and password (or sign in with Google)</li>
              </ul>
              <div className="guide-note">
                💡 New accounts get $5 credit for free testing.
              </div>
            </li>
            <li>
              <strong>Get API key:</strong>
              <ul>
                <li>After login, go to <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Settings → API Keys</a></li>
                <li>Click "Create Key"</li>
                <li>Name the key (e.g., "Wellbeing Tracker")</li>
                <li>Copy the key and save it (shown only once!)</li>
              </ul>
              <div className="guide-warning-box">
                ⚠️ <strong>Important:</strong> API key is shown only once. Save it in a secure place!
              </div>
            </li>
          </ol>

          <h4>Step 2: Install Claude CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Install using npm:</strong>
              <div className="guide-code-block">
                <code>npm install -g @anthropic-ai/claude-cli</code>
              </div>
              <div className="guide-note">
                💡 Requires Node.js and npm. If you don't have them, install from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>
              </div>
            </li>
            <li>
              <strong>Verify installation:</strong>
              <div className="guide-code-block">
                <code>claude --version</code>
              </div>
              <p>Should display version number.</p>
            </li>
          </ol>

          <h4>Step 3: Configure API Key</h4>
          <ol className="guide-steps">
            <li>
              <strong>Set API key:</strong>
              <div className="guide-code-block">
                <code>export ANTHROPIC_API_KEY="your-api-key"</code>
              </div>
              <div className="guide-note">
                💡 <strong>Permanent setup:</strong><br/>
                Add this line to <code>~/.bashrc</code> or <code>~/.zshrc</code>:<br/>
                <code>export ANTHROPIC_API_KEY="your-api-key"</code>
              </div>
            </li>
            <li>
              <strong>Test connection:</strong>
              <div className="guide-code-block">
                <code>echo "Hello" | claude --print</code>
              </div>
              <p>Claude should respond to your greeting.</p>
            </li>
          </ol>

          <h4>Step 4: Activate in App</h4>
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
        </section>
      )}
    </>
  );

  const renderCodexGuide = () => (
    <>
      {language === 'cs' ? (
        <section className="guide-section">
          <h3>🔧 Integrace OpenAI Codex CLI</h3>

          <h4>Krok 1: Získání OpenAI API klíče</h4>
          <ol className="guide-steps">
            <li>
              <strong>Zaregistrujte se na OpenAI:</strong>
              <ul>
                <li>Jděte na <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
                <li>Klikněte na "Sign up"</li>
                <li>Vyplňte registrační formulář</li>
              </ul>
            </li>
            <li>
              <strong>Vytvořte API klíč:</strong>
              <ul>
                <li>Jděte na <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API Keys</a></li>
                <li>Klikněte "Create new secret key"</li>
                <li>Pojmenujte klíč a zkopírujte ho</li>
              </ul>
            </li>
            <li>
              <strong>Přidejte platební metodu:</strong>
              <ul>
                <li>Jděte na Billing → Payment methods</li>
                <li>Přidejte kreditní kartu</li>
              </ul>
              <div className="guide-note">
                💡 OpenAI nevyžaduje měsíční poplatek, platíte pouze za použití.
              </div>
            </li>
          </ol>

          <h4>Krok 2: Instalace Codex CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Instalace:</strong>
              <div className="guide-code-block">
                <code>npm install -g @openai/codex-cli</code>
              </div>
            </li>
            <li>
              <strong>Konfigurace API klíče:</strong>
              <div className="guide-code-block">
                <code>export OPENAI_API_KEY="váš-api-klíč"</code>
              </div>
            </li>
            <li>
              <strong>Test:</strong>
              <div className="guide-code-block">
                <code>codex --version</code>
              </div>
            </li>
          </ol>

          <h4>Krok 3: Aktivace v aplikaci</h4>
          <ol className="guide-steps">
            <li>V Nastavení vyberte "Codex"</li>
            <li>Klikněte "Test Codex CLI"</li>
            <li>Uložte nastavení</li>
          </ol>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 OpenAI Codex CLI Integration</h3>

          <h4>Step 1: Get OpenAI API Key</h4>
          <ol className="guide-steps">
            <li>
              <strong>Sign up on OpenAI:</strong>
              <ul>
                <li>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
                <li>Click "Sign up"</li>
                <li>Fill in registration form</li>
              </ul>
            </li>
            <li>
              <strong>Create API key:</strong>
              <ul>
                <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API Keys</a></li>
                <li>Click "Create new secret key"</li>
                <li>Name the key and copy it</li>
              </ul>
            </li>
            <li>
              <strong>Add payment method:</strong>
              <ul>
                <li>Go to Billing → Payment methods</li>
                <li>Add credit card</li>
              </ul>
              <div className="guide-note">
                💡 OpenAI doesn't require monthly fee, you only pay for usage.
              </div>
            </li>
          </ol>

          <h4>Step 2: Install Codex CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Installation:</strong>
              <div className="guide-code-block">
                <code>npm install -g @openai/codex-cli</code>
              </div>
            </li>
            <li>
              <strong>Configure API key:</strong>
              <div className="guide-code-block">
                <code>export OPENAI_API_KEY="your-api-key"</code>
              </div>
            </li>
            <li>
              <strong>Test:</strong>
              <div className="guide-code-block">
                <code>codex --version</code>
              </div>
            </li>
          </ol>

          <h4>Step 3: Activate in App</h4>
          <ol className="guide-steps">
            <li>In Settings, select "Codex"</li>
            <li>Click "Test Codex CLI"</li>
            <li>Save settings</li>
          </ol>
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
            ✅ Aktivní GitHub Copilot subscription ($10/měsíc)<br/>
            ✅ GitHub CLI nainstalované
          </div>

          <h4>Krok 1: Instalace GitHub CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Linux (Ubuntu/Debian):</strong>
              <div className="guide-code-block">
                <code>sudo apt install gh</code>
              </div>
            </li>
            <li>
              <strong>macOS:</strong>
              <div className="guide-code-block">
                <code>brew install gh</code>
              </div>
            </li>
            <li>
              <strong>Windows:</strong>
              <div className="guide-code-block">
                <code>winget install GitHub.cli</code>
              </div>
            </li>
          </ol>

          <h4>Krok 2: Instalace Copilot extension</h4>
          <ol className="guide-steps">
            <li>
              <strong>Přihlášení do GitHub:</strong>
              <div className="guide-code-block">
                <code>gh auth login</code>
              </div>
              <p>Postupujte podle instrukcí v terminálu.</p>
            </li>
            <li>
              <strong>Instalace Copilot extension:</strong>
              <div className="guide-code-block">
                <code>gh extension install github/gh-copilot</code>
              </div>
            </li>
            <li>
              <strong>Test:</strong>
              <div className="guide-code-block">
                <code>gh copilot --version</code>
              </div>
            </li>
          </ol>

          <h4>Krok 3: Aktivace v aplikaci</h4>
          <ol className="guide-steps">
            <li>V Nastavení vyberte "Copilot"</li>
            <li>Klikněte "Test Copilot CLI"</li>
            <li>Uložte nastavení</li>
          </ol>
        </section>
      ) : (
        <section className="guide-section">
          <h3>🔧 GitHub Copilot CLI Integration</h3>

          <h4>Prerequisites</h4>
          <div className="guide-info-box">
            ✅ Active GitHub Copilot subscription ($10/month)<br/>
            ✅ GitHub CLI installed
          </div>

          <h4>Step 1: Install GitHub CLI</h4>
          <ol className="guide-steps">
            <li>
              <strong>Linux (Ubuntu/Debian):</strong>
              <div className="guide-code-block">
                <code>sudo apt install gh</code>
              </div>
            </li>
            <li>
              <strong>macOS:</strong>
              <div className="guide-code-block">
                <code>brew install gh</code>
              </div>
            </li>
            <li>
              <strong>Windows:</strong>
              <div className="guide-code-block">
                <code>winget install GitHub.cli</code>
              </div>
            </li>
          </ol>

          <h4>Step 2: Install Copilot Extension</h4>
          <ol className="guide-steps">
            <li>
              <strong>Login to GitHub:</strong>
              <div className="guide-code-block">
                <code>gh auth login</code>
              </div>
              <p>Follow instructions in terminal.</p>
            </li>
            <li>
              <strong>Install Copilot extension:</strong>
              <div className="guide-code-block">
                <code>gh extension install github/gh-copilot</code>
              </div>
            </li>
            <li>
              <strong>Test:</strong>
              <div className="guide-code-block">
                <code>gh copilot --version</code>
              </div>
            </li>
          </ol>

          <h4>Step 3: Activate in App</h4>
          <ol className="guide-steps">
            <li>In Settings, select "Copilot"</li>
            <li>Click "Test Copilot CLI"</li>
            <li>Save settings</li>
          </ol>
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
                <strong>Příčina:</strong> CLI není nainstalované nebo není v PATH.<br/>
                <strong>Řešení:</strong><br/>
                • Zkontrolujte instalaci<br/>
                • Znovu nainstalujte s <code>-g</code> flagem<br/>
                • Restartujte terminál a aplikaci
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "API key not found"</strong>
              <p>
                <strong>Příčina:</strong> API klíč není nastaven v environment variables.<br/>
                <strong>Řešení:</strong> Nastavte správný environment variable podle vašeho poskytovatele
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Command not found"</strong>
              <p>
                <strong>Příčina:</strong> CLI není v PATH nebo není nainstalované globálně.<br/>
                <strong>Řešení:</strong><br/>
                • Použijte <code>-g</code> flag při instalaci<br/>
                • Zkontrolujte npm global path: <code>npm config get prefix</code><br/>
                • Ujistěte se, že npm bin je v PATH
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
                <strong>Cause:</strong> CLI is not installed or not in PATH.<br/>
                <strong>Solution:</strong><br/>
                • Check installation<br/>
                • Reinstall with <code>-g</code> flag<br/>
                • Restart terminal and app
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "API key not found"</strong>
              <p>
                <strong>Cause:</strong> API key is not set in environment variables.<br/>
                <strong>Solution:</strong> Set the correct environment variable for your provider
              </p>
            </div>

            <div className="guide-problem">
              <strong>❌ "Command not found"</strong>
              <p>
                <strong>Cause:</strong> CLI is not in PATH or not globally installed.<br/>
                <strong>Solution:</strong><br/>
                • Use <code>-g</code> flag during installation<br/>
                • Check npm global path: <code>npm config get prefix</code><br/>
                • Make sure npm bin is in PATH
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
                  ✅ <strong>Lokální zpracování</strong> - API klíč zůstává pouze na vašem počítači
                </li>
                <li>
                  ✅ <strong>Přímá komunikace</strong> - Aplikace komunikuje přímo s AI, žádný prostředník
                </li>
                <li>
                  ✅ <strong>HTTPS šifrování</strong> - Veškerá komunikace je šifrovaná
                </li>
                <li>
                  ✅ <strong>Žádné logování</strong> - Aplikace neloguje vaše dotazy ani odpovědi
                </li>
                <li>
                  ⚠️ <strong>AI provider policy</strong> - Zkontrolujte privacy policy vašeho AI poskytovatele
                </li>
              </ul>
            </section>
          ) : (
            <section className="guide-section">
              <h3>🔒 Security and Privacy</h3>
              <ul className="guide-security">
                <li>
                  ✅ <strong>Local processing</strong> - API key stays only on your computer
                </li>
                <li>
                  ✅ <strong>Direct communication</strong> - App communicates directly with AI, no middleman
                </li>
                <li>
                  ✅ <strong>HTTPS encryption</strong> - All communication is encrypted
                </li>
                <li>
                  ✅ <strong>No logging</strong> - App doesn't log your queries or responses
                </li>
                <li>
                  ⚠️ <strong>AI provider policy</strong> - Check privacy policy of your AI provider
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

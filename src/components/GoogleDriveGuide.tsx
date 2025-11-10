import { useLanguage } from '../i18n/LanguageContext';
import './GoogleDriveGuide.css';

interface GoogleDriveGuideProps {
  onClose: () => void;
}

export const GoogleDriveGuide = ({ onClose }: GoogleDriveGuideProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="guide-overlay">
      <div className="guide-container">
        <div className="guide-header">
          <h2>{t.guide.title}</h2>
          <button className="guide-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="guide-content">
          {language === 'cs' ? (
            <>
              <section className="guide-section">
                <h3>📋 Přehled</h3>
                <p>
                  Pro propojení aplikace Wellbeing Tracker s Google Diskem je potřeba vytvořit vlastní
                  Google Cloud projekt a získat OAuth2 přihlašovací údaje. Tento návod vás provede
                  celým procesem krok za krokem.
                </p>
                <div className="guide-info-box">
                  <strong>⏱️ Odhadovaný čas:</strong> 10-15 minut<br/>
                  <strong>💰 Cena:</strong> Zdarma (Google Cloud free tier)<br/>
                  <strong>🔒 Bezpečnost:</strong> Vaše credentials zůstávají pouze u vás
                </div>
              </section>

              <section className="guide-section">
                <h3>🚀 Krok 1: Vytvoření Google Cloud projektu</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Otevřete Google Cloud Console:</strong>
                    <br/>
                    Jděte na <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                      console.cloud.google.com
                    </a>
                    <div className="guide-note">
                      💡 Pokud se přihlašujete poprvé, budete muset přijmout Terms of Service.
                    </div>
                  </li>
                  <li>
                    <strong>Vytvořte nový projekt:</strong>
                    <ul>
                      <li>Klikněte na dropdown se jménem projektu v horní liště (vedle "Google Cloud")</li>
                      <li>Klikněte na <code>NEW PROJECT</code> v pravém horním rohu dialogu</li>
                      <li>Zadejte název projektu: <code>Wellbeing Tracker</code> (nebo jakýkoliv jiný)</li>
                      <li>Organization můžete nechat jako "No organization"</li>
                      <li>Klikněte na <code>CREATE</code></li>
                    </ul>
                    <div className="guide-note">
                      ⏳ Vytvoření projektu může trvat několik sekund.
                    </div>
                  </li>
                  <li>
                    <strong>Vyberte nově vytvořený projekt:</strong>
                    <br/>
                    Ujistěte se, že v horní liště je vybrán váš nový projekt.
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔌 Krok 2: Povolení Google Drive API</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Otevřete API Library:</strong>
                    <ul>
                      <li>V levém menu (☰) klikněte na <code>APIs & Services</code></li>
                      <li>Poté klikněte na <code>Library</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Najděte Google Drive API:</strong>
                    <ul>
                      <li>Do vyhledávacího pole zadejte: <code>Google Drive API</code></li>
                      <li>Klikněte na <strong>Google Drive API</strong> v výsledcích</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Povolte API:</strong>
                    <ul>
                      <li>Klikněte na modré tlačítko <code>ENABLE</code></li>
                      <li>Počkejte, než se API povolí (pár sekund)</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔐 Krok 3: Konfigurace OAuth Consent Screen</h3>
                <div className="guide-warning-box">
                  ⚠️ <strong>Důležité:</strong> Tento krok je nutný před vytvořením credentials.
                </div>
                <ol className="guide-steps">
                  <li>
                    <strong>Otevřete OAuth consent screen:</strong>
                    <ul>
                      <li>V levém menu jděte na <code>APIs & Services</code> → <code>OAuth consent screen</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Vyberte User Type:</strong>
                    <ul>
                      <li>Zvolte <code>External</code> (pokud nemáte Google Workspace)</li>
                      <li>Klikněte na <code>CREATE</code></li>
                    </ul>
                    <div className="guide-note">
                      💡 External typ umožňuje používat aplikaci s jakýmkoliv Google účtem.
                    </div>
                  </li>
                  <li>
                    <strong>Vyplňte OAuth consent screen (stránka 1/4):</strong>
                    <div className="guide-form">
                      <label>App name:</label>
                      <code>Wellbeing Tracker</code>
                      <label>User support email:</label>
                      <code>[váš email]</code>
                      <label>Developer contact information:</label>
                      <code>[váš email]</code>
                    </div>
                    <ul>
                      <li>Ostatní pole můžete nechat prázdná</li>
                      <li>Klikněte na <code>SAVE AND CONTINUE</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Přidejte Scopes (stránka 2/4):</strong>
                    <ul>
                      <li>Klikněte na <code>ADD OR REMOVE SCOPES</code></li>
                      <li>Do filtru zadejte: <code>/auth/drive.file</code></li>
                      <li>Zaškrtněte scope: <code>.../auth/drive.file</code></li>
                      <li>Klikněte na <code>UPDATE</code></li>
                      <li>Klikněte na <code>SAVE AND CONTINUE</code></li>
                    </ul>
                    <div className="guide-note">
                      🔒 Tento scope dává aplikaci přístup pouze k souborům, které sama vytvoří.
                      Aplikace neuvidí vaše ostatní soubory na Google Drive.
                    </div>
                  </li>
                  <li>
                    <strong>Přidejte Test Users (stránka 3/4):</strong>
                    <ul>
                      <li>Klikněte na <code>+ ADD USERS</code></li>
                      <li>Zadejte svůj Google email, který budete používat pro synchronizaci</li>
                      <li>Klikněte na <code>ADD</code></li>
                      <li>Klikněte na <code>SAVE AND CONTINUE</code></li>
                    </ul>
                    <div className="guide-warning-box">
                      ⚠️ <strong>Důležité:</strong> Bez přidání test usera nebudete moci aplikaci autorizovat!
                    </div>
                  </li>
                  <li>
                    <strong>Shrnutí (stránka 4/4):</strong>
                    <ul>
                      <li>Zkontrolujte zadané informace</li>
                      <li>Klikněte na <code>BACK TO DASHBOARD</code></li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔑 Krok 4: Vytvoření OAuth2 Credentials</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Otevřete Credentials:</strong>
                    <ul>
                      <li>V levém menu jděte na <code>APIs & Services</code> → <code>Credentials</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Vytvořte nové credentials:</strong>
                    <ul>
                      <li>Klikněte na <code>+ CREATE CREDENTIALS</code> v horní části</li>
                      <li>Vyberte <code>OAuth client ID</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Vyberte Application Type:</strong>
                    <ul>
                      <li>Application type: <code>Desktop app</code></li>
                      <li>Name: <code>Wellbeing Tracker Desktop</code> (nebo jakýkoliv jiný)</li>
                      <li>Klikněte na <code>CREATE</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Zkopírujte credentials:</strong>
                    <ul>
                      <li>Zobrazí se dialog s "OAuth client created"</li>
                      <li>Zkopírujte <strong>Client ID</strong> (dlouhý řetězec končící na <code>.apps.googleusercontent.com</code>)</li>
                      <li>Zkopírujte <strong>Client Secret</strong></li>
                    </ul>
                    <div className="guide-note">
                      💡 Tyto údaje můžete kdykoliv znovu zobrazit v Credentials sekci.
                    </div>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>💻 Krok 5: Konfigurace v aplikaci Wellbeing Tracker</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Otevřete Nastavení:</strong>
                    <ul>
                      <li>V aplikaci Wellbeing Tracker jděte do sekce <code>Nastavení</code></li>
                      <li>Najděte sekci <strong>☁️ Synchronizace s Google Diskem</strong></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Vložte credentials:</strong>
                    <ul>
                      <li>Do pole <strong>Client ID</strong> vložte zkopírovaný Client ID</li>
                      <li>Do pole <strong>Client Secret</strong> vložte zkopírovaný Client Secret</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Spusťte autorizaci:</strong>
                    <ul>
                      <li>Klikněte na tlačítko <code>Připojit Google Drive</code></li>
                      <li>Otevře se okno browseru s Google přihlášením</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Přihlaste se a povolte přístup:</strong>
                    <ul>
                      <li>Přihlaste se Google účtem (ten, který jste přidali jako test user)</li>
                      <li>Zobrazí se upozornění "Google hasn't verified this app" - to je v pořádku</li>
                      <li>Klikněte na <code>Continue</code> (může být pod "Advanced")</li>
                      <li>Povolte přístup kliknutím na <code>Allow</code></li>
                    </ul>
                    <div className="guide-note">
                      🔒 Upozornění "unverified app" je normální - jde o váš vlastní projekt.
                    </div>
                  </li>
                  <li>
                    <strong>Zkopírujte autorizační kód:</strong>
                    <ul>
                      <li>Po povolení budete přesměrováni na URL: <code>http://localhost/?code=...</code></li>
                      <li>Zkopírujte <strong>celý kód</strong> za <code>code=</code> (všechno až do <code>&</code> nebo konce URL)</li>
                    </ul>
                    <div className="guide-example">
                      <strong>Příklad URL:</strong><br/>
                      <code style={{fontSize: '11px'}}>http://localhost/?code=<span style={{background: '#fef3c7'}}>4/0AeanS0...</span>&scope=...</code><br/>
                      <strong>Zkopírujte pouze:</strong> <code>4/0AeanS0...</code>
                    </div>
                  </li>
                  <li>
                    <strong>Dokončete autentikaci:</strong>
                    <ul>
                      <li>Vraťte se do aplikace Wellbeing Tracker</li>
                      <li>Vložte kód do pole <strong>Zadejte autorizační kód</strong></li>
                      <li>Klikněte na <code>Autentikovat</code></li>
                      <li>Po úspěšné autentikaci se zobrazí ✓ <strong>Google Drive připojen</strong></li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>✅ Krok 6: Použití synchronizace</h3>
                <p>Po úspěšném připojení máte k dispozici následující možnosti:</p>
                <div className="guide-features">
                  <div className="guide-feature">
                    <strong>🔄 Povolit automatickou synchronizaci</strong>
                    <p>
                      Zaškrtněte tuto volbu a data se budou automaticky nahrávat na Google Drive
                      při každé změně (přidání denního záznamu, návyku, atd.).
                    </p>
                  </div>
                  <div className="guide-feature">
                    <strong>📤 Nahrát na Google Drive</strong>
                    <p>
                      Manuálně nahrajte aktuální data na Google Drive. Užitečné, pokud nechcete
                      automatickou synchronizaci, ale chcete občas vytvořit zálohu.
                    </p>
                  </div>
                  <div className="guide-feature">
                    <strong>📥 Stáhnout z Google Drive</strong>
                    <p>
                      Stáhněte data z Google Drive. Toto přepíše vaše lokální data daty z cloudu.
                      Užitečné při přechodu na nové zařízení.
                    </p>
                  </div>
                </div>
              </section>

              <section className="guide-section">
                <h3>🔧 Časté problémy a řešení</h3>
                <div className="guide-troubleshooting">
                  <div className="guide-problem">
                    <strong>❌ Chyba: "redirect_uri_mismatch"</strong>
                    <p>
                      <strong>Příčina:</strong> Špatná konfigurace redirect URI.<br/>
                      <strong>Řešení:</strong> Ujistěte se, že jste vybrali application type "Desktop app"
                      (ne "Web application"). Desktop app automaticky nastaví správné redirect URIs.
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Chyba: "Access blocked: This app's request is invalid"</strong>
                    <p>
                      <strong>Příčina:</strong> Nepřidali jste se jako test user.<br/>
                      <strong>Řešení:</strong> Vraťte se do OAuth consent screen → Test users
                      a přidejte svůj email.
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Autentikace selhala</strong>
                    <p>
                      <strong>Možné příčiny:</strong><br/>
                      • Špatně zkopírovaný autorizační kód (zkopírujte celý kód)<br/>
                      • Kód už byl použit (kódy jsou jednorázové - zkuste autorizaci znovu)<br/>
                      • Špatné Client ID nebo Client Secret
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Data se nesynchronizují automaticky</strong>
                    <p>
                      <strong>Řešení:</strong><br/>
                      • Zkontrolujte, že máte zaškrtnutou volbu "Povolit automatickou synchronizaci"<br/>
                      • Zkontrolujte připojení k internetu<br/>
                      • Zkuste manuální upload pro ověření, že připojení funguje
                    </p>
                  </div>
                </div>
              </section>

              <section className="guide-section">
                <h3>🔒 Bezpečnost a soukromí</h3>
                <ul className="guide-security">
                  <li>
                    ✅ <strong>Vaše credentials zůstávají pouze u vás</strong> - Client ID a Secret
                    jsou uloženy pouze lokálně ve vaší aplikaci
                  </li>
                  <li>
                    ✅ <strong>Omezený přístup</strong> - Aplikace má přístup pouze k souborům,
                    které sama vytvoří (scope <code>drive.file</code>)
                  </li>
                  <li>
                    ✅ <strong>Šifrovaná komunikace</strong> - Veškerá komunikace s Google probíhá
                    přes HTTPS
                  </li>
                  <li>
                    ✅ <strong>Kontrola nad daty</strong> - Můžete kdykoli odpojit Google Drive
                    nebo smazat soubor přímo ve svém Google Drive
                  </li>
                  <li>
                    ✅ <strong>Token storage</strong> - Přístupový token je uložen v
                    <code>~/.config/wellbeing-tracker/google-credentials/</code>
                  </li>
                </ul>
              </section>

              <section className="guide-section">
                <h3>❓ Další otázky</h3>
                <p>
                  Pokud máte problémy s nastavením nebo další otázky, můžete:
                </p>
                <ul>
                  <li>Zkontrolovat oficiální dokumentaci Google OAuth: <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noopener noreferrer">developers.google.com/identity/protocols/oauth2</a></li>
                  <li>Projít tento návod znovu a ověřit každý krok</li>
                  <li>Zkusit vytvořit nový Google Cloud projekt od začátku</li>
                </ul>
              </section>
            </>
          ) : (
            // English version
            <>
              <section className="guide-section">
                <h3>📋 Overview</h3>
                <p>
                  To connect the Wellbeing Tracker app with Google Drive, you need to create your own
                  Google Cloud project and obtain OAuth2 credentials. This guide will walk you through
                  the entire process step by step.
                </p>
                <div className="guide-info-box">
                  <strong>⏱️ Estimated time:</strong> 10-15 minutes<br/>
                  <strong>💰 Cost:</strong> Free (Google Cloud free tier)<br/>
                  <strong>🔒 Security:</strong> Your credentials stay only with you
                </div>
              </section>

              <section className="guide-section">
                <h3>🚀 Step 1: Create a Google Cloud Project</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Open Google Cloud Console:</strong>
                    <br/>
                    Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                      console.cloud.google.com
                    </a>
                    <div className="guide-note">
                      💡 If signing in for the first time, you'll need to accept the Terms of Service.
                    </div>
                  </li>
                  <li>
                    <strong>Create a new project:</strong>
                    <ul>
                      <li>Click on the project dropdown in the top bar (next to "Google Cloud")</li>
                      <li>Click <code>NEW PROJECT</code> in the top right corner of the dialog</li>
                      <li>Enter project name: <code>Wellbeing Tracker</code> (or any other name)</li>
                      <li>You can leave Organization as "No organization"</li>
                      <li>Click <code>CREATE</code></li>
                    </ul>
                    <div className="guide-note">
                      ⏳ Project creation may take a few seconds.
                    </div>
                  </li>
                  <li>
                    <strong>Select your newly created project:</strong>
                    <br/>
                    Make sure your new project is selected in the top bar.
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔌 Step 2: Enable Google Drive API</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Open API Library:</strong>
                    <ul>
                      <li>In the left menu (☰), click <code>APIs & Services</code></li>
                      <li>Then click <code>Library</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Find Google Drive API:</strong>
                    <ul>
                      <li>In the search box, type: <code>Google Drive API</code></li>
                      <li>Click on <strong>Google Drive API</strong> in the results</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Enable the API:</strong>
                    <ul>
                      <li>Click the blue <code>ENABLE</code> button</li>
                      <li>Wait for the API to be enabled (a few seconds)</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔐 Step 3: Configure OAuth Consent Screen</h3>
                <div className="guide-warning-box">
                  ⚠️ <strong>Important:</strong> This step is required before creating credentials.
                </div>
                <ol className="guide-steps">
                  <li>
                    <strong>Open OAuth consent screen:</strong>
                    <ul>
                      <li>In the left menu, go to <code>APIs & Services</code> → <code>OAuth consent screen</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Select User Type:</strong>
                    <ul>
                      <li>Choose <code>External</code> (if you don't have Google Workspace)</li>
                      <li>Click <code>CREATE</code></li>
                    </ul>
                    <div className="guide-note">
                      💡 External type allows you to use the app with any Google account.
                    </div>
                  </li>
                  <li>
                    <strong>Fill in OAuth consent screen (page 1/4):</strong>
                    <div className="guide-form">
                      <label>App name:</label>
                      <code>Wellbeing Tracker</code>
                      <label>User support email:</label>
                      <code>[your email]</code>
                      <label>Developer contact information:</label>
                      <code>[your email]</code>
                    </div>
                    <ul>
                      <li>Other fields can be left empty</li>
                      <li>Click <code>SAVE AND CONTINUE</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Add Scopes (page 2/4):</strong>
                    <ul>
                      <li>Click <code>ADD OR REMOVE SCOPES</code></li>
                      <li>In the filter, enter: <code>/auth/drive.file</code></li>
                      <li>Check the scope: <code>.../auth/drive.file</code></li>
                      <li>Click <code>UPDATE</code></li>
                      <li>Click <code>SAVE AND CONTINUE</code></li>
                    </ul>
                    <div className="guide-note">
                      🔒 This scope gives the app access only to files it creates itself.
                      The app won't see your other files on Google Drive.
                    </div>
                  </li>
                  <li>
                    <strong>Add Test Users (page 3/4):</strong>
                    <ul>
                      <li>Click <code>+ ADD USERS</code></li>
                      <li>Enter your Google email that you'll use for sync</li>
                      <li>Click <code>ADD</code></li>
                      <li>Click <code>SAVE AND CONTINUE</code></li>
                    </ul>
                    <div className="guide-warning-box">
                      ⚠️ <strong>Important:</strong> Without adding a test user, you won't be able to authorize the app!
                    </div>
                  </li>
                  <li>
                    <strong>Summary (page 4/4):</strong>
                    <ul>
                      <li>Review the entered information</li>
                      <li>Click <code>BACK TO DASHBOARD</code></li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>🔑 Step 4: Create OAuth2 Credentials</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Open Credentials:</strong>
                    <ul>
                      <li>In the left menu, go to <code>APIs & Services</code> → <code>Credentials</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Create new credentials:</strong>
                    <ul>
                      <li>Click <code>+ CREATE CREDENTIALS</code> at the top</li>
                      <li>Select <code>OAuth client ID</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Select Application Type:</strong>
                    <ul>
                      <li>Application type: <code>Desktop app</code></li>
                      <li>Name: <code>Wellbeing Tracker Desktop</code> (or any other name)</li>
                      <li>Click <code>CREATE</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Copy credentials:</strong>
                    <ul>
                      <li>A dialog "OAuth client created" will appear</li>
                      <li>Copy the <strong>Client ID</strong> (long string ending with <code>.apps.googleusercontent.com</code>)</li>
                      <li>Copy the <strong>Client Secret</strong></li>
                    </ul>
                    <div className="guide-note">
                      💡 You can always view these credentials again in the Credentials section.
                    </div>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>💻 Step 5: Configure in Wellbeing Tracker App</h3>
                <ol className="guide-steps">
                  <li>
                    <strong>Open Settings:</strong>
                    <ul>
                      <li>In the Wellbeing Tracker app, go to the <code>Settings</code> section</li>
                      <li>Find the <strong>☁️ Google Drive Sync</strong> section</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Enter credentials:</strong>
                    <ul>
                      <li>In the <strong>Client ID</strong> field, paste the copied Client ID</li>
                      <li>In the <strong>Client Secret</strong> field, paste the copied Client Secret</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Start authorization:</strong>
                    <ul>
                      <li>Click the <code>Connect Google Drive</code> button</li>
                      <li>A browser window will open with Google sign-in</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Sign in and grant access:</strong>
                    <ul>
                      <li>Sign in with your Google account (the one you added as a test user)</li>
                      <li>You'll see a warning "Google hasn't verified this app" - this is normal</li>
                      <li>Click <code>Continue</code> (may be under "Advanced")</li>
                      <li>Grant access by clicking <code>Allow</code></li>
                    </ul>
                    <div className="guide-note">
                      🔒 The "unverified app" warning is normal - it's your own project.
                    </div>
                  </li>
                  <li>
                    <strong>Copy authorization code:</strong>
                    <ul>
                      <li>After granting access, you'll be redirected to: <code>http://localhost/?code=...</code></li>
                      <li>Copy the <strong>entire code</strong> after <code>code=</code> (everything up to <code>&</code> or end of URL)</li>
                    </ul>
                    <div className="guide-example">
                      <strong>Example URL:</strong><br/>
                      <code style={{fontSize: '11px'}}>http://localhost/?code=<span style={{background: '#fef3c7'}}>4/0AeanS0...</span>&scope=...</code><br/>
                      <strong>Copy only:</strong> <code>4/0AeanS0...</code>
                    </div>
                  </li>
                  <li>
                    <strong>Complete authentication:</strong>
                    <ul>
                      <li>Return to the Wellbeing Tracker app</li>
                      <li>Paste the code into the <strong>Enter authorization code</strong> field</li>
                      <li>Click <code>Authenticate</code></li>
                      <li>After successful authentication, you'll see ✓ <strong>Google Drive connected</strong></li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="guide-section">
                <h3>✅ Step 6: Using Sync</h3>
                <p>After successful connection, you have the following options:</p>
                <div className="guide-features">
                  <div className="guide-feature">
                    <strong>🔄 Enable automatic sync</strong>
                    <p>
                      Check this option and data will automatically upload to Google Drive
                      with every change (adding daily records, habits, etc.).
                    </p>
                  </div>
                  <div className="guide-feature">
                    <strong>📤 Upload to Google Drive</strong>
                    <p>
                      Manually upload current data to Google Drive. Useful if you don't want
                      automatic sync but want to create a backup occasionally.
                    </p>
                  </div>
                  <div className="guide-feature">
                    <strong>📥 Download from Google Drive</strong>
                    <p>
                      Download data from Google Drive. This will overwrite your local data with cloud data.
                      Useful when moving to a new device.
                    </p>
                  </div>
                </div>
              </section>

              <section className="guide-section">
                <h3>🔧 Common Issues and Solutions</h3>
                <div className="guide-troubleshooting">
                  <div className="guide-problem">
                    <strong>❌ Error: "redirect_uri_mismatch"</strong>
                    <p>
                      <strong>Cause:</strong> Incorrect redirect URI configuration.<br/>
                      <strong>Solution:</strong> Make sure you selected application type "Desktop app"
                      (not "Web application"). Desktop app automatically sets the correct redirect URIs.
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Error: "Access blocked: This app's request is invalid"</strong>
                    <p>
                      <strong>Cause:</strong> You didn't add yourself as a test user.<br/>
                      <strong>Solution:</strong> Go back to OAuth consent screen → Test users
                      and add your email.
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Authentication failed</strong>
                    <p>
                      <strong>Possible causes:</strong><br/>
                      • Incorrectly copied authorization code (copy the entire code)<br/>
                      • Code already used (codes are one-time - try authorization again)<br/>
                      • Wrong Client ID or Client Secret
                    </p>
                  </div>
                  <div className="guide-problem">
                    <strong>❌ Data doesn't sync automatically</strong>
                    <p>
                      <strong>Solution:</strong><br/>
                      • Check that "Enable automatic sync" is checked<br/>
                      • Check your internet connection<br/>
                      • Try manual upload to verify the connection works
                    </p>
                  </div>
                </div>
              </section>

              <section className="guide-section">
                <h3>🔒 Security and Privacy</h3>
                <ul className="guide-security">
                  <li>
                    ✅ <strong>Your credentials stay only with you</strong> - Client ID and Secret
                    are stored only locally in your app
                  </li>
                  <li>
                    ✅ <strong>Limited access</strong> - The app has access only to files
                    it creates itself (scope <code>drive.file</code>)
                  </li>
                  <li>
                    ✅ <strong>Encrypted communication</strong> - All communication with Google
                    happens over HTTPS
                  </li>
                  <li>
                    ✅ <strong>Control over data</strong> - You can disconnect Google Drive
                    or delete the file directly in your Google Drive at any time
                  </li>
                  <li>
                    ✅ <strong>Token storage</strong> - Access token is stored in
                    <code>~/.config/wellbeing-tracker/google-credentials/</code>
                  </li>
                </ul>
              </section>

              <section className="guide-section">
                <h3>❓ Additional Questions</h3>
                <p>
                  If you have problems with setup or additional questions, you can:
                </p>
                <ul>
                  <li>Check the official Google OAuth documentation: <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noopener noreferrer">developers.google.com/identity/protocols/oauth2</a></li>
                  <li>Go through this guide again and verify each step</li>
                  <li>Try creating a new Google Cloud project from scratch</li>
                </ul>
              </section>
            </>
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

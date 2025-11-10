# Nastavení Google Drive synchronizace / Google Drive Sync Setup

## Čeština

### Krok 1: Vytvoření Google Cloud projektu

1. Jděte na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvořte nový projekt nebo vyberte existující
3. V levém menu zvolte **APIs & Services** > **Library**
4. Vyhledejte "Google Drive API" a povolte ji

### Krok 2: Vytvoření OAuth 2.0 přihlašovacích údajů

1. V levém menu zvolte **APIs & Services** > **Credentials**
2. Klikněte na **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Pokud nemáte nakonfigurovanou OAuth consent screen:
   - Klikněte na **CONFIGURE CONSENT SCREEN**
   - Vyberte **External** (nebo Internal, pokud používáte Google Workspace)
   - Vyplňte požadované informace (App name, User support email, Developer contact)
   - Přidejte scope: `../auth/drive.file` (umožňuje přístup pouze k souborům vytvořeným aplikací)
   - Přidejte testovací uživatele (vaše emailová adresa)
4. Vraťte se k vytvoření credentials a vyberte typ aplikace **Desktop app**
5. Dejte jí název (např. "Wellbeing Tracker Desktop")
6. Po vytvoření se zobrazí **Client ID** a **Client Secret** - tyto hodnoty zkopírujte

### Krok 3: Konfigurace v aplikaci

1. Otevřete aplikaci Wellbeing Tracker
2. Jděte do **Nastavení** (Settings)
3. Najděte sekci **Synchronizace s Google Diskem**
4. Vložte zkopírovaný **Client ID** a **Client Secret**
5. Klikněte na **Připojit Google Drive**
6. Otevře se okno browseru s autorizační stránkou Google
7. Přihlaste se svým Google účtem a udělte aplikaci přístup
8. Po autorizaci budete přesměrováni na URL začínající `http://localhost/?code=...`
9. Zkopírujte celý **kód** za `code=` (bez parametrů za `&`)
10. Vložte kód do pole **Zadejte autorizační kód** v aplikaci
11. Klikněte na **Autentikovat**

### Krok 4: Použití synchronizace

Po úspěšné autentikaci můžete:

- **Povolit automatickou synchronizaci** - Data se automaticky nahrají na Google Drive při každé změně
- **Nahrát na Google Drive** - Manuální nahrání aktuálních dat
- **Stáhnout z Google Drive** - Stáhne data z cloudu (přepíše lokální data)

---

## English

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. In the left menu, select **APIs & Services** > **Library**
4. Search for "Google Drive API" and enable it

### Step 2: Create OAuth 2.0 Credentials

1. In the left menu, select **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If you haven't configured the OAuth consent screen:
   - Click **CONFIGURE CONSENT SCREEN**
   - Select **External** (or Internal if using Google Workspace)
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scope: `../auth/drive.file` (allows access only to files created by the app)
   - Add test users (your email address)
4. Return to creating credentials and select application type **Desktop app**
5. Give it a name (e.g., "Wellbeing Tracker Desktop")
6. After creation, you'll see **Client ID** and **Client Secret** - copy these values

### Step 3: Configuration in the App

1. Open the Wellbeing Tracker application
2. Go to **Settings**
3. Find the **Google Drive Sync** section
4. Paste the copied **Client ID** and **Client Secret**
5. Click **Connect Google Drive**
6. A browser window will open with Google's authorization page
7. Sign in with your Google account and grant the app access
8. After authorization, you'll be redirected to a URL starting with `http://localhost/?code=...`
9. Copy the entire **code** after `code=` (without parameters after `&`)
10. Paste the code into the **Enter authorization code** field in the app
11. Click **Authenticate**

### Step 4: Using Sync

After successful authentication, you can:

- **Enable automatic sync** - Data is automatically uploaded to Google Drive with every change
- **Upload to Google Drive** - Manually upload current data
- **Download from Google Drive** - Download data from the cloud (overwrites local data)

---

## Bezpečnost / Security

- Credentials (Client ID a Secret) jsou uloženy pouze lokálně ve vaší aplikaci
- Aplikace má přístup pouze k souborům, které sama vytvoří (scope `drive.file`)
- Token je uložen v uživatelské složce aplikace (`~/.config/wellbeing-tracker/google-credentials/`)
- Data jsou přenášena přes zabezpečené HTTPS spojení

---

- Credentials (Client ID and Secret) are stored only locally in your application
- The app has access only to files it creates itself (scope `drive.file`)
- The token is stored in the app's user folder (`~/.config/wellbeing-tracker/google-credentials/`)
- Data is transferred over secure HTTPS connection

## Časté problémy / Troubleshooting

### Chyba: "redirect_uri_mismatch"
- Ujistěte se, že v Google Cloud Console máte jako redirect URI nastaven `http://localhost`

### Chyba při autentikaci
- Zkontrolujte, že jste správně zkopírovali celý autorizační kód
- Ujistěte se, že vaše emailová adresa je přidána jako testovací uživatel v OAuth consent screen

### Data se nesynchronizují automaticky
- Zkontrolujte, že máte zaškrtnutou volbu "Povolit automatickou synchronizaci"
- Zkontrolujte připojení k internetu

---

### Error: "redirect_uri_mismatch"
- Make sure you have `http://localhost` set as the redirect URI in Google Cloud Console

### Authentication error
- Check that you copied the entire authorization code correctly
- Make sure your email address is added as a test user in the OAuth consent screen

### Data doesn't sync automatically
- Check that "Enable automatic sync" is checked
- Check your internet connection

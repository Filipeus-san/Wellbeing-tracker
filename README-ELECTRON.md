# Wellbeing Tracker - Electron Desktop Aplikace

Desktopová aplikace pro sledování duševní pohody pomocí frameworků Maslow, SDT a PERMA.

## 🚀 Změny v Electron verzi

Projekt byl přepsán z webové aplikace (React + Express server) na desktopovou Electron aplikaci:

### Co se změnilo:
- ❌ **Odstraněn**: Express server (`server/index.js`)
- ✅ **Přidán**: Electron main proces (`electron/main.js`)
- ✅ **Přidán**: Electron preload script (`electron/preload.js`)
- ✅ **Upraveno**: Komunikace frontendu přes Electron IPC místo HTTP API
- ✅ **Data**: Ukládána lokálně v uživatelské složce místo na serveru

### Kde se ukládají data:
- **Linux**: `~/.config/wellbeing-tracker/data/wellbeing-data.json`
- **macOS**: `~/Library/Application Support/wellbeing-tracker/data/wellbeing-data.json`
- **Windows**: `%APPDATA%\wellbeing-tracker\data\wellbeing-data.json`

## 📋 Požadavky

- Node.js 20.x nebo vyšší
- npm nebo yarn
- Claude CLI (pokud chcete používat AI shrnutí)

## 🛠️ Instalace

```bash
npm install
```

## 🏃 Spuštění

### Development režim
```bash
npm run dev
```
Tento příkaz:
1. Spustí Vite dev server na portu 5174
2. Počká, až se server spustí
3. Spustí Electron aplikaci, která se připojí k dev serveru

### Production build
```bash
# Build aplikace
npm run build

# Spustit z buildu
npm run electron
```

### Build distribučních balíčků
```bash
# Build pro aktuální platformu
npm run build

# Build pouze do složky (bez instalátoru)
npm run build:dir
```

Výstupní soubory budou v složce `release/`.

## 🏗️ Struktura projektu

```
.
├── electron/
│   ├── main.js       # Electron hlavní proces (backend)
│   └── preload.js    # Preload script pro IPC komunikaci
├── src/
│   ├── components/   # React komponenty
│   ├── utils/
│   │   ├── storage.ts    # API pro práci s daty (přes Electron IPC)
│   │   ├── claudeApi.ts  # API pro Claude CLI (přes Electron IPC)
│   │   └── ...
│   └── App.tsx
├── dist/             # Build výstup z Vite
├── release/          # Electron distribuce
└── package.json
```

## 🔧 Jak to funguje

### Architektura

```
┌─────────────────────────────────────────┐
│  React Frontend (renderer process)      │
│  - UI komponenty                         │
│  - src/utils/storage.ts                  │
│  - src/utils/claudeApi.ts                │
└──────────────┬──────────────────────────┘
               │
               │ window.electronAPI (IPC)
               │
┌──────────────▼──────────────────────────┐
│  electron/preload.js                     │
│  - Bezpečné IPC rozhraní                │
└──────────────┬──────────────────────────┘
               │
               │ ipcRenderer.invoke()
               │
┌──────────────▼──────────────────────────┐
│  electron/main.js (main process)         │
│  - IPC handlers (ipcMain.handle)         │
│  - File system operace                   │
│  - Claude CLI volání                     │
│  - Data storage                          │
└──────────────────────────────────────────┘
```

### IPC Komunikace

Frontend volá funkce přes `window.electronAPI`:

```typescript
// Příklad: Uložení denního skóre
const score = { date: '2024-01-15', scores: {...}, ... };
await window.electronAPI.saveDailyScore(score);
```

Electron main proces zpracuje požadavek:

```javascript
ipcMain.handle('save-daily-score', async (event, score) => {
  // Uložit data do JSON souboru
  dataStore.dailyScores.push(score);
  await saveData();
  return { success: true, data: score };
});
```

## 🔌 Claude CLI integrace

Claude CLI se volá přímo z Electron main procesu:

```javascript
const claude = spawn('claude', ['--print'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

claude.stdin.write(prompt);
claude.stdin.end();
```

### Testování Claude CLI:
1. V aplikaci přejděte do "Nastavení"
2. Klikněte na "Testovat Claude CLI"
3. Pokud je nainstalovaný, zobrazí se verze

## 📦 Build konfigurace

Electron Builder konfigurace v `package.json`:

- **macOS**: DMG balíček
- **Windows**: NSIS instalátor
- **Linux**: AppImage

## 🐛 Debugging

### Development Tools
V development režimu se automaticky otevře DevTools.

### Logy
- Main proces: Výstup v terminálu kde jste spustili `npm run dev`
- Renderer proces: DevTools Console

### Běžné problémy

**Electron okno se neotevře:**
- Zkontrolujte, že Vite dev server běží na portu 5174
- Podívejte se na logy v terminálu

**Data se neukládají:**
- Zkontrolujte oprávnění k zápisu do uživatelské složky
- Podívejte se na chybové logy v terminálu

**Claude CLI nefunguje:**
- Ověřte instalaci: `claude --version`
- Zkontrolujte PATH proměnnou prostředí

## 📝 Rozdíly oproti Express verzi

| Feature | Express | Electron |
|---------|---------|----------|
| Backend | Node.js HTTP server | Electron main process |
| Komunikace | REST API (fetch) | IPC (contextBridge) |
| Data storage | server/data/ | userData/data/ |
| Claude CLI | spawn v serveru | spawn v main procesu |
| Bezpečnost | CORS | contextIsolation |
| Distribuce | Web deploy | Desktop installer |

## 🚢 Deployment

Po buildu (`npm run build`) najdete v `release/` složce:

- **macOS**: `Wellbeing Tracker-1.0.0.dmg`
- **Windows**: `Wellbeing Tracker Setup 1.0.0.exe`
- **Linux**: `wellbeing-tracker-1.0.0.AppImage`

Tyto soubory můžete distribuovat uživatelům.

## 📚 Další zdroje

- [Electron dokumentace](https://www.electronjs.org/docs/latest)
- [Electron Builder dokumentace](https://www.electron.build/)
- [Vite dokumentace](https://vitejs.dev/)

## ⚠️ Migrace dat z Express verze

Pokud jste používali Express verzi a máte data v `server/data/wellbeing-data.json`:

1. Spusťte Electron aplikaci
2. V aplikaci přejděte do "Nastavení"
3. Použijte "Importovat data"
4. Vyberte soubor `server/data/wellbeing-data.json`

Data budou importována do Electron aplikace.

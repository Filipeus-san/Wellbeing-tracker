# Wellbeing Tracker - Electron Desktop Application

Desktop application for tracking mental wellbeing using Maslow, SDT, and PERMA frameworks.

## 🚀 Changes in Electron Version

The project has been rewritten from a web application (React + Express server) to a desktop Electron application:

### What changed:
- ❌ **Removed**: Express server (`server/index.js`)
- ✅ **Added**: Electron main process (`electron/main.js`)
- ✅ **Added**: Electron preload script (`electron/preload.js`)
- ✅ **Modified**: Frontend communication via Electron IPC instead of HTTP API
- ✅ **Data**: Stored locally in user folder instead of on server

### Where data is stored:
- **Linux**: `~/.config/wellbeing-tracker/data/wellbeing-data.json`
- **macOS**: `~/Library/Application Support/wellbeing-tracker/data/wellbeing-data.json`
- **Windows**: `%APPDATA%\wellbeing-tracker\data\wellbeing-data.json`

## 📋 Requirements

- Node.js 20.x or higher
- npm or yarn
- Claude CLI (if you want to use AI summaries)

## 🛠️ Installation

```bash
npm install
```

## 🏃 Running

### Development Mode
```bash
npm run dev
```
This command:
1. Starts Vite dev server on port 5174
2. Waits for the server to start
3. Launches Electron application that connects to the dev server

**Note**: The application uses `--no-sandbox` flag due to common issues with SUID sandbox in some Linux environments.

### Production Build
```bash
# Build the application
npm run build

# Run from build
npm run electron
```

### Build Distribution Packages
```bash
# Build for current platform
npm run build

# Build only to folder (without installer)
npm run build:dir
```

Output files will be in the `release/` folder.

## 🏗️ Project Structure

```
.
├── electron/
│   ├── main.js       # Electron main process (backend)
│   └── preload.js    # Preload script for IPC communication
├── src/
│   ├── components/   # React components
│   ├── utils/
│   │   ├── storage.ts    # API for working with data (via Electron IPC)
│   │   ├── claudeApi.ts  # API for Claude CLI (via Electron IPC)
│   │   └── ...
│   └── App.tsx
├── dist/             # Build output from Vite
├── release/          # Electron distribution
└── package.json
```

## 🔧 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│  React Frontend (renderer process)      │
│  - UI components                         │
│  - src/utils/storage.ts                  │
│  - src/utils/claudeApi.ts                │
└──────────────┬──────────────────────────┘
               │
               │ window.electronAPI (IPC)
               │
┌──────────────▼──────────────────────────┐
│  electron/preload.js                     │
│  - Secure IPC interface                  │
└──────────────┬──────────────────────────┘
               │
               │ ipcRenderer.invoke()
               │
┌──────────────▼──────────────────────────┐
│  electron/main.js (main process)         │
│  - IPC handlers (ipcMain.handle)         │
│  - File system operations                │
│  - Claude CLI calls                      │
│  - Data storage                          │
└──────────────────────────────────────────┘
```

### IPC Communication

Frontend calls functions via `window.electronAPI`:

```typescript
// Example: Save daily score
const score = { date: '2024-01-15', scores: {...}, ... };
await window.electronAPI.saveDailyScore(score);
```

Electron main process handles the request:

```javascript
ipcMain.handle('save-daily-score', async (event, score) => {
  // Save data to JSON file
  dataStore.dailyScores.push(score);
  await saveData();
  return { success: true, data: score };
});
```

## 🔌 Claude CLI Integration

Claude CLI is called directly from the Electron main process:

```javascript
const claude = spawn('claude', ['--print'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

claude.stdin.write(prompt);
claude.stdin.end();
```

### Testing Claude CLI:
1. In the application, go to "Settings"
2. Click "Test Claude CLI"
3. If installed, the version will be displayed

## 📦 Build Configuration

Electron Builder configuration in `package.json`:

- **macOS**: DMG package
- **Windows**: NSIS installer
- **Linux**: AppImage

## 🐛 Debugging

### Development Tools
DevTools opens automatically in development mode.

### Logs
- Main process: Output in terminal where you ran `npm run dev`
- Renderer process: DevTools Console

### Common Issues

**Electron window doesn't open:**
- Check that Vite dev server is running on port 5174
- Look at logs in the terminal

**Data not saving:**
- Check write permissions to user folder
- Look at error logs in the terminal

**Claude CLI not working:**
- Verify installation: `claude --version`
- Check PATH environment variable

## 📝 Differences from Express Version

| Feature | Express | Electron |
|---------|---------|----------|
| Backend | Node.js HTTP server | Electron main process |
| Communication | REST API (fetch) | IPC (contextBridge) |
| Data storage | server/data/ | userData/data/ |
| Claude CLI | spawn in server | spawn in main process |
| Security | CORS | contextIsolation |
| Distribution | Web deploy | Desktop installer |

## 🚢 Deployment

After building (`npm run build`) you'll find in the `release/` folder:

- **macOS**: `Wellbeing Tracker-1.0.0.dmg`
- **Windows**: `Wellbeing Tracker Setup 1.0.0.exe`
- **Linux**: `wellbeing-tracker-1.0.0.AppImage`

These files can be distributed to users.

## 📚 Additional Resources

- [Electron documentation](https://www.electronjs.org/docs/latest)
- [Electron Builder documentation](https://www.electron.build/)
- [Vite documentation](https://vitejs.dev/)

## ⚠️ Data Migration from Express Version

If you were using the Express version and have data in `server/data/wellbeing-data.json`:

1. Run the Electron application
2. In the application, go to "Settings"
3. Use "Import data"
4. Select the `server/data/wellbeing-data.json` file

Data will be imported into the Electron application.

import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cesta k datům v uživatelské složce
const DATA_DIR = join(app.getPath('userData'), 'data');
const DATA_FILE = join(DATA_DIR, 'wellbeing-data.json');

// Data storage
let dataStore = {
  dailyScores: [],
  weeklySummaries: [],
  settings: {
    enableClaudeIntegration: false,
  },
};

// Load data from file
async function loadData() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    if (existsSync(DATA_FILE)) {
      const data = await readFile(DATA_FILE, 'utf-8');
      dataStore = JSON.parse(data);
      console.log('✅ Data loaded from file');
    } else {
      await saveData();
      console.log('✅ Initialized new data file');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

// Save data to file
async function saveData() {
  try {
    await writeFile(DATA_FILE, JSON.stringify(dataStore, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error saving data:', error);
    throw error;
  }
}

let mainWindow;

function createWindow() {
  const preloadPath = join(__dirname, 'preload.js');
  console.log('📂 Preload path:', preloadPath);
  console.log('📂 __dirname:', __dirname);
  console.log('📂 NODE_ENV:', process.env.NODE_ENV);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // V development režimu načíst z Vite dev serveru
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5174');
    mainWindow.webContents.openDevTools();
  } else {
    // V production načíst z buildu
    const indexPath = join(__dirname, '../dist/index.html');
    console.log('📂 Loading index from:', indexPath);
    mainWindow.loadFile(indexPath);
    mainWindow.webContents.openDevTools(); // Otevřít DevTools i v production pro debugging
  }
}

app.whenReady().then(async () => {
  await loadData();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ==================== IPC HANDLERS ====================

// Daily Scores
ipcMain.handle('get-daily-scores', async () => {
  try {
    return { success: true, data: dataStore.dailyScores };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-daily-score', async (event, date) => {
  try {
    const score = dataStore.dailyScores.find((s) => s.date === date);
    return { success: true, data: score || null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-daily-score', async (event, score) => {
  try {
    const existingIndex = dataStore.dailyScores.findIndex((s) => s.date === score.date);

    if (existingIndex >= 0) {
      dataStore.dailyScores[existingIndex] = score;
    } else {
      dataStore.dailyScores.push(score);
    }

    // Seřadit podle data
    dataStore.dailyScores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await saveData();
    return { success: true, data: score };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Weekly Summaries
ipcMain.handle('get-weekly-summaries', async () => {
  try {
    return { success: true, data: dataStore.weeklySummaries };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-weekly-summary', async (event, weekStart) => {
  try {
    const summary = dataStore.weeklySummaries.find((s) => s.weekStart === weekStart);
    return { success: true, data: summary || null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-weekly-summary', async (event, summary) => {
  try {
    const existingIndex = dataStore.weeklySummaries.findIndex(
      (s) => s.weekStart === summary.weekStart && s.weekEnd === summary.weekEnd
    );

    if (existingIndex >= 0) {
      dataStore.weeklySummaries[existingIndex] = summary;
    } else {
      dataStore.weeklySummaries.push(summary);
    }

    // Seřadit podle data
    dataStore.weeklySummaries.sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime());

    await saveData();
    return { success: true, data: summary };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Settings
ipcMain.handle('get-settings', async () => {
  try {
    return { success: true, data: dataStore.settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    dataStore.settings = { ...dataStore.settings, ...settings };
    await saveData();
    return { success: true, data: dataStore.settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Export/Import
ipcMain.handle('export-data', async () => {
  try {
    const exportData = {
      ...dataStore,
      exportDate: new Date().toISOString(),
    };
    return { success: true, data: exportData };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('import-data', async (event, importData) => {
  try {
    const { dailyScores, weeklySummaries, settings } = importData;

    if (dailyScores) {
      dataStore.dailyScores = dailyScores;
    }
    if (weeklySummaries) {
      dataStore.weeklySummaries = weeklySummaries;
    }
    if (settings) {
      dataStore.settings = { ...dataStore.settings, ...settings };
    }

    await saveData();
    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clear-data', async () => {
  try {
    dataStore.dailyScores = [];
    dataStore.weeklySummaries = [];
    // Nemazat settings, aby uživatel neztratil nastavení
    await saveData();
    return { success: true, message: 'Data cleared successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ==================== AI CLI (CLAUDE & CODEX) ====================

ipcMain.handle('claude-summary', async (event, prompt) => {
  try {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('📝 Generating summary with Claude CLI, prompt length:', prompt.length);

    const claude = spawn('claude', ['--print'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Poslat prompt přes stdin
    claude.stdin.write(prompt);
    claude.stdin.end();

    // Počkat na dokončení
    await new Promise((resolve, reject) => {
      claude.on('close', (code) => {
        if (code !== 0 && !stdout) {
          console.error('Claude CLI error:', stderr);
          reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      claude.on('error', (error) => {
        console.error('Claude CLI spawn error:', error);
        reject(error);
      });
    });

    console.log('✅ Summary generated successfully with Claude');

    return {
      success: true,
      content: stdout.trim(),
    };
  } catch (error) {
    console.error('❌ Error calling Claude CLI:', error);
    return {
      success: false,
      error: 'Failed to generate summary',
      details: error.message,
    };
  }
});

ipcMain.handle('claude-test', async () => {
  try {
    const claude = spawn('claude', ['--version'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve, reject) => {
      claude.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      claude.on('error', (error) => {
        reject(error);
      });
    });

    return {
      success: true,
      version: stdout.trim(),
      message: 'Claude CLI is available',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Claude CLI is not available',
      details: error.message,
    };
  }
});

// ==================== CODEX CLI ====================

ipcMain.handle('codex-summary', async (event, prompt) => {
  try {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('📝 Generating summary with Codex CLI, prompt length:', prompt.length);

    const codex = spawn('codex', ['-'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });

    let stdout = '';
    let stderr = '';

    codex.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    codex.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Poslat prompt přes stdin
    codex.stdin.write(prompt);
    codex.stdin.end();

    // Počkat na dokončení
    await new Promise((resolve, reject) => {
      codex.on('close', (code) => {
        if (code !== 0 && !stdout) {
          console.error('Codex CLI error:', stderr);
          reject(new Error(`Codex CLI exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      codex.on('error', (error) => {
        console.error('Codex CLI spawn error:', error);
        reject(error);
      });
    });

    console.log('✅ Summary generated successfully with Codex');

    return {
      success: true,
      content: stdout.trim(),
    };
  } catch (error) {
    console.error('❌ Error calling Codex CLI:', error);
    return {
      success: false,
      error: 'Failed to generate summary with Codex',
      details: error.message,
    };
  }
});

ipcMain.handle('codex-test', async () => {
  try {
    const codex = spawn('codex', ['--version'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    });

    let stdout = '';
    let stderr = '';

    codex.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    codex.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve, reject) => {
      codex.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Codex CLI exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      codex.on('error', (error) => {
        reject(error);
      });
    });

    return {
      success: true,
      version: stdout.trim(),
      message: 'Codex CLI is available',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Codex CLI is not available',
      details: error.message,
    };
  }
});

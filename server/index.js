import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;

// Data storage setup
const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'wellbeing-data.json');

// Initialize data structure
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Zvětšit limit pro větší prompty

// ==================== DATA API ENDPOINTS ====================

/**
 * GET /api/data/daily-scores - Získat všechny denní skóre
 */
app.get('/api/data/daily-scores', (req, res) => {
  try {
    res.json({ success: true, data: dataStore.dailyScores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/data/daily-scores/:date - Získat skóre pro konkrétní datum
 */
app.get('/api/data/daily-scores/:date', (req, res) => {
  try {
    const { date } = req.params;
    const score = dataStore.dailyScores.find((s) => s.date === date);
    res.json({ success: true, data: score || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/data/daily-scores - Uložit nebo aktualizovat denní skóre
 */
app.post('/api/data/daily-scores', async (req, res) => {
  try {
    const score = req.body;
    const existingIndex = dataStore.dailyScores.findIndex((s) => s.date === score.date);

    if (existingIndex >= 0) {
      dataStore.dailyScores[existingIndex] = score;
    } else {
      dataStore.dailyScores.push(score);
    }

    // Seřadit podle data
    dataStore.dailyScores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await saveData();
    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/data/weekly-summaries - Získat všechny týdenní shrnutí
 */
app.get('/api/data/weekly-summaries', (req, res) => {
  try {
    res.json({ success: true, data: dataStore.weeklySummaries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/data/weekly-summaries/:weekStart - Získat shrnutí pro konkrétní týden
 */
app.get('/api/data/weekly-summaries/:weekStart', (req, res) => {
  try {
    const { weekStart } = req.params;
    const summary = dataStore.weeklySummaries.find((s) => s.weekStart === weekStart);
    res.json({ success: true, data: summary || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/data/weekly-summaries - Uložit nebo aktualizovat týdenní shrnutí
 */
app.post('/api/data/weekly-summaries', async (req, res) => {
  try {
    const summary = req.body;
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
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/data/settings - Získat nastavení
 */
app.get('/api/data/settings', (req, res) => {
  try {
    res.json({ success: true, data: dataStore.settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/data/settings - Uložit nastavení
 */
app.post('/api/data/settings', async (req, res) => {
  try {
    dataStore.settings = { ...dataStore.settings, ...req.body };
    await saveData();
    res.json({ success: true, data: dataStore.settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/data/import - Importovat data
 */
app.post('/api/data/import', async (req, res) => {
  try {
    const { dailyScores, weeklySummaries, settings } = req.body;

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
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/data/export - Exportovat všechna data
 */
app.get('/api/data/export', (req, res) => {
  try {
    const exportData = {
      ...dataStore,
      exportDate: new Date().toISOString(),
    };
    res.json({ success: true, data: exportData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/data/clear - Smazat všechna data (kromě nastavení)
 */
app.delete('/api/data/clear', async (req, res) => {
  try {
    dataStore.dailyScores = [];
    dataStore.weeklySummaries = [];
    // Nemazat settings, aby uživatel neztratil nastavení
    await saveData();
    res.json({ success: true, message: 'Data cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CLAUDE API ENDPOINTS ====================

/**
 * Endpoint pro generování shrnutí pomocí Claude CLI
 */
app.post('/api/claude/summary', async (req, res) => {
  let tempFile = null;

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('📝 Generating summary, prompt length:', prompt.length);

    // Použít stdin místo parametru - bezpečnější a spolehlivější
    // --print = print response and exit (non-interactive)
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

    console.log('✅ Summary generated successfully');

    // Vrátit odpověď
    res.json({
      success: true,
      content: stdout.trim(),
    });
  } catch (error) {
    console.error('❌ Error calling Claude CLI:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      details: error.message,
    });
  } finally {
    // Vyčistit temporary soubor, pokud byl vytvořen
    if (tempFile) {
      try {
        await unlink(tempFile);
      } catch (err) {
        // Ignorovat chyby při mazání temp souboru
      }
    }
  }
});

/**
 * Test endpoint pro kontrolu, zda Claude CLI funguje
 */
app.get('/api/claude/test', async (req, res) => {
  try {
    const { stdout } = await execAsync('claude --version', {
      timeout: 5000,
    });

    res.json({
      success: true,
      version: stdout.trim(),
      message: 'Claude CLI is available',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Claude CLI is not available',
      details: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Spuštění serveru
app.listen(PORT, async () => {
  console.log(`🚀 Wellbeing Tracker API server running on http://localhost:${PORT}`);
  console.log(`📡 Claude CLI proxy ready`);
  console.log(`💾 Data API ready`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);

  // Načíst data při startu
  await loadData();
});

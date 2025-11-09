import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Zvětšit limit pro větší prompty

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
app.listen(PORT, () => {
  console.log(`🚀 Wellbeing Tracker API server running on http://localhost:${PORT}`);
  console.log(`📡 Claude CLI proxy ready`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

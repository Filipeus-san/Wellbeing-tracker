import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Endpoint pro generování shrnutí pomocí Claude CLI
 */
app.post('/api/claude/summary', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Escapovat prompt pro shell
    const escapedPrompt = prompt.replace(/'/g, "'\\''");

    // Volání Claude CLI
    const command = `claude --no-stream "${escapedPrompt}"`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 1024 * 1024 * 5, // 5MB buffer
      timeout: 60000, // 60s timeout
    });

    if (stderr && !stdout) {
      console.error('Claude CLI error:', stderr);
      return res.status(500).json({ error: 'Claude CLI error', details: stderr });
    }

    // Vrátit odpověď
    res.json({
      success: true,
      content: stdout.trim(),
    });
  } catch (error) {
    console.error('Error calling Claude CLI:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      details: error.message,
    });
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

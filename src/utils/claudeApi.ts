import type { WeeklySummary, DailyScore } from '../types';
import { questions } from '../data/questions';
import { getSettings } from './storage';

// URL lokálního proxy serveru pro Claude CLI
const CLAUDE_PROXY_URL = 'http://localhost:3001/api/claude';

/**
 * Volání Claude CLI přes lokální proxy server
 */
export const generateClaudeSummary = async (
  weeklySummary: WeeklySummary,
  dailyScores: DailyScore[]
): Promise<string> => {
  const settings = await getSettings();

  if (!settings.enableClaudeIntegration) {
    throw new Error('Claude integrace není zapnutá');
  }

  // Připravit kontext pro Claude
  const prompt = buildWeeklySummaryPrompt(weeklySummary, dailyScores);

  try {
    const response = await fetch(`${CLAUDE_PROXY_URL}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude proxy error:', error);
      throw new Error(error.error || 'Chyba při volání Claude CLI');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling Claude proxy:', error);
    throw error;
  }
};

/**
 * Vygeneruje denní shrnutí pomocí Claude
 */
export const generateDailySummary = async (dailyScore: DailyScore): Promise<string> => {
  const settings = await getSettings();

  if (!settings.enableClaudeIntegration) {
    throw new Error('Claude integrace není zapnutá');
  }

  const prompt = buildDailySummaryPrompt(dailyScore);

  try {
    const response = await fetch(`${CLAUDE_PROXY_URL}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Chyba při volání Claude CLI');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling Claude proxy:', error);
    throw error;
  }
};

/**
 * Sestaví prompt pro týdenní shrnutí
 */
const buildWeeklySummaryPrompt = (
  weeklySummary: WeeklySummary,
  dailyScores: DailyScore[]
): string => {
  const { averages, criticalAreas, microActions } = weeklySummary;

  // Přidat detaily o otázkách a skóre
  const scoreDetails = Object.entries(averages)
    .map(([questionId, score]) => {
      const question = questions.find((q) => q.id === questionId);
      return `- ${question?.text}: ${score.toFixed(1)}/5`;
    })
    .join('\n');

  const criticalDetails = criticalAreas
    .map(({ questionId, score }) => {
      const question = questions.find((q) => q.id === questionId);
      return `- ${question?.text}: ${score.toFixed(1)}/5`;
    })
    .join('\n');

  const actionsDetails = microActions
    .map((action) => `- ${action.title}: ${action.description}`)
    .join('\n');

  const notesDetails = dailyScores
    .filter((ds) => ds.notes && ds.notes.trim() !== '')
    .map((ds) => `Den ${ds.date}: ${ds.notes}`)
    .join('\n');

  return `Jsi wellbeing kouč. Na základě týdenních dat uživatele vytvoř stručné, motivující a personalizované shrnutí (max 300 slov).

TÝDENNÍ PRŮMĚRNÁ SKÓRE (1-5):
${scoreDetails}

KRITICKÉ OBLASTI (nízké skóre):
${criticalDetails || 'Žádné kritické oblasti'}

DOPORUČENÉ MIKRO-AKCE:
${actionsDetails}

POZNÁMKY UŽIVATELE:
${notesDetails || 'Žádné poznámky'}

Vytvoř shrnutí, které:
1. Oceň pozitivní oblasti a pokrok
2. Delikatně upozorni na kritické oblasti
3. Dej konkrétní, motivující doporučení
4. Měj empatický a povzbuzující tón
5. Buď stručný a čtivý`;
};

/**
 * Sestaví prompt pro denní shrnutí
 */
const buildDailySummaryPrompt = (dailyScore: DailyScore): string => {
  const scoreDetails = Object.entries(dailyScore.scores)
    .map(([questionId, score]) => {
      const question = questions.find((q) => q.id === questionId);
      return `- ${question?.text}: ${score}/5`;
    })
    .join('\n');

  // Přidat mikro-akce, pokud existují
  const microActionsDetails = dailyScore.microActions
    ? dailyScore.microActions
        .map((action) => `- ${action.title}: ${action.description}`)
        .join('\n')
    : '';

  return `Jsi wellbeing kouč. Na základě denních dat uživatele vytvoř krátký, motivující komentář (max 200 slov).

DENNÍ SKÓRE (1-5):
${scoreDetails}

POZNÁMKY:
${dailyScore.notes || 'Žádné poznámky'}

${microActionsDetails ? `DOPORUČENÉ MIKRO-AKCE NA ZÍTŘEK:\n${microActionsDetails}\n` : ''}
Vytvoř stručný komentář, který:
1. Oceň to, co šlo dobře (konkrétní oblasti s vysokým skóre)
2. Jemně upozorni na oblasti pro zlepšení (nízké skóre)
3. Vyber 2-3 nejdůležitější mikro-akce a zdůrazni je jako konkrétní kroky na zítřek
4. Měj empatický, povzbuzující a motivační tón
5. Buď stručný ale inspirující`;
};

/**
 * Testuje, jestli Claude CLI je dostupné
 */
export const testClaudeCLI = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${CLAUDE_PROXY_URL}/test`);
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error testing Claude CLI:', error);
    return false;
  }
};

// Zachovat kompatibilitu se starým názvem (pro Settings komponentu)
export const testClaudeApiKey = async (): Promise<boolean> => {
  return testClaudeCLI();
};

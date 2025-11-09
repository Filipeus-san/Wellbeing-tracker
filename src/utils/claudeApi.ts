import type { WeeklySummary, DailyScore } from '../types';
import { questions } from '../data/questions';
import { getSettings } from './storage';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Volání Claude API pro generování shrnutí
 */
export const generateClaudeSummary = async (
  weeklySummary: WeeklySummary,
  dailyScores: DailyScore[]
): Promise<string> => {
  const settings = getSettings();

  if (!settings.claudeApiKey || !settings.enableClaudeIntegration) {
    throw new Error('Claude API není nakonfigurované nebo je vypnuté');
  }

  // Připravit kontext pro Claude
  const prompt = buildWeeklySummaryPrompt(weeklySummary, dailyScores);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API chyba: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
};

/**
 * Vygeneruje denní shrnutí pomocí Claude
 */
export const generateDailySummary = async (dailyScore: DailyScore): Promise<string> => {
  const settings = getSettings();

  if (!settings.claudeApiKey || !settings.enableClaudeIntegration) {
    throw new Error('Claude API není nakonfigurované nebo je vypnuté');
  }

  const prompt = buildDailySummaryPrompt(dailyScore);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API chyba: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
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

  return `Jsi wellbeing kouč. Na základě denních dat uživatele vytvoř krátký, motivující komentář (max 150 slov).

DENNÍ SKÓRE (1-5):
${scoreDetails}

POZNÁMKY:
${dailyScore.notes || 'Žádné poznámky'}

Vytvoř stručný komentář, který:
1. Oceň to, co šlo dobře
2. Jemně upozorni na oblasti pro zlepšení
3. Dej jedno konkrétní doporučení na zítřek
4. Buď povzbuzující a empatický`;
};

/**
 * Testuje, jestli API klíč funguje
 */
export const testClaudeApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Test',
          },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
};

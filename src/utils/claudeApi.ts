import type { WeeklySummary, DailyScore } from '../types';
import { questions } from '../data/questions';
import { getSettings, getHabits } from './storage';
import { MOODS, getAnxietyLabel, getDepressionLabel, getJoyLabel, getAngerLabel, getGratitudeLabel } from '../types';

/**
 * Volání AI CLI (Claude, Codex nebo Copilot) přes Electron IPC
 */
export const generateClaudeSummary = async (
  weeklySummary: WeeklySummary,
  dailyScores: DailyScore[]
): Promise<string> => {
  const settings = await getSettings();

  if (!settings.enableClaudeIntegration) {
    throw new Error('AI integrace není zapnutá');
  }

  // Připravit kontext pro AI
  const userLanguage = settings.language || 'cs';
  const prompt = await buildWeeklySummaryPrompt(weeklySummary, dailyScores, userLanguage);

  try {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available');
    }

    // Vybrat správný CLI podle nastavení
    const aiProvider = settings.aiProvider || 'claude';
    let result;

    if (aiProvider === 'codex') {
      result = await window.electronAPI.codexSummary(prompt);
    } else if (aiProvider === 'copilot') {
      result = await window.electronAPI.copilotSummary(prompt);
    } else {
      result = await window.electronAPI.claudeSummary(prompt);
    }

    if (!result.success) {
      const providerName = aiProvider === 'codex' ? 'Codex' : aiProvider === 'copilot' ? 'Copilot' : 'Claude';
      throw new Error(result.error || `Chyba při volání ${providerName} CLI`);
    }

    return result.content || '';
  } catch (error) {
    console.error('Error calling AI CLI:', error);
    throw error;
  }
};

/**
 * Vygeneruje denní shrnutí pomocí AI (Claude, Codex nebo Copilot)
 */
export const generateDailySummary = async (dailyScore: DailyScore): Promise<string> => {
  const settings = await getSettings();

  if (!settings.enableClaudeIntegration) {
    throw new Error('AI integrace není zapnutá');
  }

  const userLanguage = settings.language || 'cs';
  const habits = await getHabits();
  const activeHabits = habits.filter(h => !h.archived);
  const prompt = buildDailySummaryPrompt(dailyScore, userLanguage, activeHabits);

  try {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available');
    }

    // Vybrat správný CLI podle nastavení
    const aiProvider = settings.aiProvider || 'claude';
    let result;

    if (aiProvider === 'codex') {
      result = await window.electronAPI.codexSummary(prompt);
    } else if (aiProvider === 'copilot') {
      result = await window.electronAPI.copilotSummary(prompt);
    } else {
      result = await window.electronAPI.claudeSummary(prompt);
    }

    if (!result.success) {
      const providerName = aiProvider === 'codex' ? 'Codex' : aiProvider === 'copilot' ? 'Copilot' : 'Claude';
      throw new Error(result.error || `Chyba při volání ${providerName} CLI`);
    }

    return result.content || '';
  } catch (error) {
    console.error('Error calling AI CLI:', error);
    throw error;
  }
};

/**
 * Sestaví prompt pro týdenní shrnutí
 */
const buildWeeklySummaryPrompt = async (
  weeklySummary: WeeklySummary,
  dailyScores: DailyScore[],
  language: string = 'cs'
): Promise<string> => {
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

  // Přidat informace o náladě a emocích
  const mentalHealthDetails = dailyScores
    .map((ds) => {
      const date = new Date(ds.date).toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' });
      const parts = [];

      if (ds.mood) {
        const moodData = MOODS[ds.mood];
        parts.push(`Nálada: ${moodData.label} ${moodData.emoji}`);
      }

      if (ds.anxiety !== undefined) {
        parts.push(`Úzkost: ${ds.anxiety}/10 (${getAnxietyLabel(ds.anxiety)})`);
      }

      if (ds.depression !== undefined) {
        parts.push(`Deprese: ${ds.depression}/10 (${getDepressionLabel(ds.depression)})`);
      }

      if (ds.joy !== undefined) {
        parts.push(`Radost: ${ds.joy}/10 (${getJoyLabel(ds.joy)})`);
      }

      if (ds.anger !== undefined) {
        parts.push(`Vztek: ${ds.anger}/10 (${getAngerLabel(ds.anger)})`);
      }

      if (ds.gratitude !== undefined) {
        parts.push(`Vděčnost: ${ds.gratitude}/10 (${getGratitudeLabel(ds.gratitude)})`);
      }

      return parts.length > 0 ? `${date}: ${parts.join(', ')}` : null;
    })
    .filter(Boolean)
    .join('\n');

  // Přidat statistiky návyků
  let habitsDetails = '';
  const allHabits = await getHabits();
  const activeHabits = allHabits.filter(h => !h.archived);

  if (activeHabits.length > 0 && dailyScores.length > 0) {
    const habitStats = activeHabits.map(habit => {
      const completed = dailyScores.filter(score =>
        score.completedHabits?.includes(habit.id)
      ).length;
      const total = dailyScores.length;
      const percentage = total > 0 ? ((completed / total) * 100).toFixed(0) : '0';

      return `${habit.icon || '✨'} ${habit.name}: ${completed}/${total} dnů (${percentage}%)`;
    });

    habitsDetails = language === 'en'
      ? `\nWEEKLY HABITS COMPLETION:\n${habitStats.join('\n')}\n`
      : `\nTÝDENNÍ PLNĚNÍ NÁVYKŮ:\n${habitStats.join('\n')}\n`;
  }

  const languageInstruction = language === 'en'
    ? 'IMPORTANT: Respond in ENGLISH.'
    : 'DŮLEŽITÉ: Odpověz v ČEŠTINĚ.';

  return `${languageInstruction}

You are a wellbeing coach. Based on the user's weekly data, create a brief, motivating, and personalized summary (max 300 words).

WEEKLY AVERAGE SCORES (1-5):
${scoreDetails}

CRITICAL AREAS (low scores):
${criticalDetails || 'No critical areas'}

MENTAL STATE THROUGHOUT THE WEEK:
${mentalHealthDetails || 'No mental state data'}
${habitsDetails}
RECOMMENDED MICRO-ACTIONS:
${actionsDetails}

USER NOTES:
${notesDetails || 'No notes'}

Create a summary that:
1. Acknowledges positive areas and progress
2. Gently points out critical areas
3. Pays special attention to mental state and emotions (mood, anxiety, depression, joy, anger, gratitude) - if you see high values of anxiety/depression/anger, address it kindly; if you see high values of joy/gratitude, acknowledge it
4. If weekly habit statistics are provided, acknowledge consistent habits and gently encourage improvement on less completed ones
5. Provides specific, motivating recommendations
6. Has an empathetic and encouraging tone
7. Is concise and readable`;
};

/**
 * Sestaví prompt pro denní shrnutí
 */
const buildDailySummaryPrompt = (dailyScore: DailyScore, language: string = 'cs', habits: any[] = []): string => {
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

  // Přidat informace o náladě a emocích
  const mentalHealthParts = [];

  if (dailyScore.mood) {
    const moodData = MOODS[dailyScore.mood];
    mentalHealthParts.push(`Nálada: ${moodData.label} ${moodData.emoji}`);
  }

  if (dailyScore.anxiety !== undefined) {
    mentalHealthParts.push(`Úzkost: ${dailyScore.anxiety}/10 (${getAnxietyLabel(dailyScore.anxiety)})`);
  }

  if (dailyScore.depression !== undefined) {
    mentalHealthParts.push(`Deprese: ${dailyScore.depression}/10 (${getDepressionLabel(dailyScore.depression)})`);
  }

  if (dailyScore.joy !== undefined) {
    mentalHealthParts.push(`Radost: ${dailyScore.joy}/10 (${getJoyLabel(dailyScore.joy)})`);
  }

  if (dailyScore.anger !== undefined) {
    mentalHealthParts.push(`Vztek: ${dailyScore.anger}/10 (${getAngerLabel(dailyScore.anger)})`);
  }

  if (dailyScore.gratitude !== undefined) {
    mentalHealthParts.push(`Vděčnost: ${dailyScore.gratitude}/10 (${getGratitudeLabel(dailyScore.gratitude)})`);
  }

  const mentalHealthDetails = mentalHealthParts.length > 0
    ? mentalHealthParts.join('\n')
    : 'Žádná data o duševním stavu a emocích';

  // Sestavit informace o denních návycích
  let habitsDetails = '';
  if (habits.length > 0) {
    const completedHabits = habits.filter(h => dailyScore.completedHabits?.includes(h.id));
    const missedHabits = habits.filter(h => !dailyScore.completedHabits?.includes(h.id));

    const completedList = completedHabits.length > 0
      ? completedHabits.map(h => `✅ ${h.icon || '✨'} ${h.name}`).join('\n')
      : (language === 'en' ? 'None completed' : 'Žádné nesplněné');

    const missedList = missedHabits.length > 0
      ? missedHabits.map(h => `❌ ${h.icon || '✨'} ${h.name}`).join('\n')
      : (language === 'en' ? 'All habits completed!' : 'Všechny návyky splněny!');

    habitsDetails = language === 'en'
      ? `\nDAILY HABITS:\nCompleted:\n${completedList}\n\nMissed:\n${missedList}\n`
      : `\nDENNÍ NÁVYKY:\nSplněné:\n${completedList}\n\nNesplněné:\n${missedList}\n`;
  }

  const languageInstruction = language === 'en'
    ? 'IMPORTANT: Respond in ENGLISH.'
    : 'DŮLEŽITÉ: Odpověz v ČEŠTINĚ.';

  return `${languageInstruction}

You are a wellbeing coach. Based on the user's daily data, create a short, motivating comment (max 200 words).

DAILY SCORES (1-5):
${scoreDetails}

MENTAL STATE:
${mentalHealthDetails}
${habitsDetails}
NOTES:
${dailyScore.notes || 'No notes'}

${microActionsDetails ? `RECOMMENDED MICRO-ACTIONS FOR TOMORROW:\n${microActionsDetails}\n` : ''}
Create a concise comment that:
1. Acknowledges what went well (specific areas with high scores)
2. Gently points out areas for improvement (low scores)
3. Pays special attention to mental state and emotions (mood, anxiety, depression, joy, anger, gratitude) - if you see high values of anxiety/depression/anger, address it kindly; if you see high values of joy/gratitude, acknowledge it
4. If daily habits are tracked, acknowledge completed habits positively and gently encourage missed ones
5. Highlights 2-3 most important micro-actions as concrete steps for tomorrow
6. Has an empathetic, encouraging, and motivational tone
7. Is concise but inspiring`;
};

/**
 * Testuje, jestli AI CLI (Claude, Codex nebo Copilot) je dostupné
 */
export const testAiCLI = async (provider?: 'claude' | 'codex' | 'copilot'): Promise<boolean> => {
  try {
    if (!window.electronAPI) {
      return false;
    }

    // Pokud není poskytovatel specifikován, načíst z nastavení
    if (!provider) {
      const settings = await getSettings();
      provider = settings.aiProvider || 'claude';
    }

    let result;
    if (provider === 'codex') {
      result = await window.electronAPI.codexTest();
    } else if (provider === 'copilot') {
      result = await window.electronAPI.copilotTest();
    } else {
      result = await window.electronAPI.claudeTest();
    }

    return result.success === true;
  } catch (error) {
    console.error('Error testing AI CLI:', error);
    return false;
  }
};

// Zachovat kompatibilitu se starým názvem
export const testClaudeCLI = async (): Promise<boolean> => {
  return testAiCLI('claude');
};

// Zachovat kompatibilitu se starým názvem (pro Settings komponentu)
export const testClaudeApiKey = async (): Promise<boolean> => {
  return testAiCLI();
};

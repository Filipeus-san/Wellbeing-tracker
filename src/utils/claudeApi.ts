import type { WeeklySummary, DailyScore } from '../types';
import { questions } from '../data/questions';
import { getSettings } from './storage';
import { MOODS, getAnxietyLabel, getDepressionLabel } from '../types';

/**
 * Volání AI CLI (Claude nebo Codex) přes Electron IPC
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
  const prompt = buildWeeklySummaryPrompt(weeklySummary, dailyScores);

  try {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available');
    }

    // Vybrat správný CLI podle nastavení
    const aiProvider = settings.aiProvider || 'claude';
    const result = aiProvider === 'codex'
      ? await window.electronAPI.codexSummary(prompt)
      : await window.electronAPI.claudeSummary(prompt);

    if (!result.success) {
      throw new Error(result.error || `Chyba při volání ${aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI`);
    }

    return result.content || '';
  } catch (error) {
    console.error('Error calling AI CLI:', error);
    throw error;
  }
};

/**
 * Vygeneruje denní shrnutí pomocí AI (Claude nebo Codex)
 */
export const generateDailySummary = async (dailyScore: DailyScore): Promise<string> => {
  const settings = await getSettings();

  if (!settings.enableClaudeIntegration) {
    throw new Error('AI integrace není zapnutá');
  }

  const prompt = buildDailySummaryPrompt(dailyScore);

  try {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available');
    }

    // Vybrat správný CLI podle nastavení
    const aiProvider = settings.aiProvider || 'claude';
    const result = aiProvider === 'codex'
      ? await window.electronAPI.codexSummary(prompt)
      : await window.electronAPI.claudeSummary(prompt);

    if (!result.success) {
      throw new Error(result.error || `Chyba při volání ${aiProvider === 'codex' ? 'Codex' : 'Claude'} CLI`);
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

  // Přidat informace o náladě, úzkosti a depresi
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

      return parts.length > 0 ? `${date}: ${parts.join(', ')}` : null;
    })
    .filter(Boolean)
    .join('\n');

  return `Jsi wellbeing kouč. Na základě týdenních dat uživatele vytvoř stručné, motivující a personalizované shrnutí (max 300 slov).

TÝDENNÍ PRŮMĚRNÁ SKÓRE (1-5):
${scoreDetails}

KRITICKÉ OBLASTI (nízké skóre):
${criticalDetails || 'Žádné kritické oblasti'}

DUŠEVNÍ STAV V PRŮBĚHU TÝDNE:
${mentalHealthDetails || 'Žádná data o duševním stavu'}

DOPORUČENÉ MIKRO-AKCE:
${actionsDetails}

POZNÁMKY UŽIVATELE:
${notesDetails || 'Žádné poznámky'}

Vytvoř shrnutí, které:
1. Oceň pozitivní oblasti a pokrok
2. Delikatně upozorni na kritické oblasti
3. Věnuj zvláštní pozornost duševnímu stavu (nálada, úzkost, deprese) - pokud vidíš vysoké hodnoty úzkosti/deprese, laskavě to zohledni
4. Dej konkrétní, motivující doporučení
5. Měj empatický a povzbuzující tón
6. Buď stručný a čtivý`;
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

  // Přidat informace o náladě, úzkosti a depresi
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

  const mentalHealthDetails = mentalHealthParts.length > 0
    ? mentalHealthParts.join('\n')
    : 'Žádná data o duševním stavu';

  return `Jsi wellbeing kouč. Na základě denních dat uživatele vytvoř krátký, motivující komentář (max 200 slov).

DENNÍ SKÓRE (1-5):
${scoreDetails}

DUŠEVNÍ STAV:
${mentalHealthDetails}

POZNÁMKY:
${dailyScore.notes || 'Žádné poznámky'}

${microActionsDetails ? `DOPORUČENÉ MIKRO-AKCE NA ZÍTŘEK:\n${microActionsDetails}\n` : ''}
Vytvoř stručný komentář, který:
1. Oceň to, co šlo dobře (konkrétní oblasti s vysokým skóre)
2. Jemně upozorni na oblasti pro zlepšení (nízké skóre)
3. Věnuj zvláštní pozornost duševnímu stavu (nálada, úzkost, deprese) - pokud vidíš vysoké hodnoty úzkosti/deprese, laskavě to zohledni
4. Vyber 2-3 nejdůležitější mikro-akce a zdůrazni je jako konkrétní kroky na zítřek
5. Měj empatický, povzbuzující a motivační tón
6. Buď stručný ale inspirující`;
};

/**
 * Testuje, jestli AI CLI (Claude nebo Codex) je dostupné
 */
export const testAiCLI = async (provider?: 'claude' | 'codex'): Promise<boolean> => {
  try {
    if (!window.electronAPI) {
      return false;
    }

    // Pokud není poskytovatel specifikován, načíst z nastavení
    if (!provider) {
      const settings = await getSettings();
      provider = settings.aiProvider || 'claude';
    }

    const result = provider === 'codex'
      ? await window.electronAPI.codexTest()
      : await window.electronAPI.claudeTest();

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

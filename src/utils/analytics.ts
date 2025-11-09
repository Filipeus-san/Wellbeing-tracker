import type { DailyScore, WeeklySummary, CategoryAverage } from '../types';
import { WellbeingCategory } from '../types';
import { questions } from '../data/questions';
import { startOfWeek, endOfWeek } from 'date-fns';
import { getDailyScoresInRange } from './storage';
import { generateMicroActions } from './microActions';

const CRITICAL_THRESHOLD = 2.5; // Skóre pod 2.5 je považováno za kritické

/**
 * Vypočítá týdenní průměry pro všechny otázky
 */
export const calculateWeeklyAverages = (scores: DailyScore[]): Record<string, number> => {
  if (scores.length === 0) return {};

  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};

  scores.forEach((dailyScore) => {
    Object.entries(dailyScore.scores).forEach(([questionId, score]) => {
      totals[questionId] = (totals[questionId] || 0) + score;
      counts[questionId] = (counts[questionId] || 0) + 1;
    });
  });

  const averages: Record<string, number> = {};
  Object.keys(totals).forEach((questionId) => {
    averages[questionId] = totals[questionId] / counts[questionId];
  });

  return averages;
};

/**
 * Vypočítá průměry podle kategorií (Maslow, SDT, PERMA)
 */
export const calculateCategoryAverages = (
  averages: Record<string, number>
): CategoryAverage[] => {
  const categoryTotals: Record<WellbeingCategory, { sum: number; count: number }> = {} as any;

  questions.forEach((question) => {
    const avg = averages[question.id];
    if (avg !== undefined) {
      if (!categoryTotals[question.category]) {
        categoryTotals[question.category] = { sum: 0, count: 0 };
      }
      categoryTotals[question.category].sum += avg;
      categoryTotals[question.category].count += 1;
    }
  });

  return Object.entries(categoryTotals).map(([category, data]) => ({
    category: category as WellbeingCategory,
    average: data.sum / data.count,
    questionsCount: data.count,
  }));
};

/**
 * Identifikuje kritické oblasti (nízké skóre)
 */
export const identifyCriticalAreas = (
  averages: Record<string, number>
): Array<{ questionId: string; score: number }> => {
  const critical: Array<{ questionId: string; score: number }> = [];

  Object.entries(averages).forEach(([questionId, score]) => {
    if (score < CRITICAL_THRESHOLD) {
      critical.push({ questionId, score });
    }
  });

  // Seřadit podle skóre (nejnižší první)
  critical.sort((a, b) => a.score - b.score);

  return critical;
};

/**
 * Vygeneruje týdenní shrnutí pro daný týden
 */
export const generateWeeklySummary = async (date: Date): Promise<WeeklySummary> => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Pondělí
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Neděle

  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const scores = await getDailyScoresInRange(weekStartStr, weekEndStr);
  const averages = calculateWeeklyAverages(scores);
  const criticalAreas = identifyCriticalAreas(averages);
  const microActions = generateMicroActions(averages, criticalAreas);

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    averages,
    criticalAreas,
    microActions,
  };
};

/**
 * Získá barevné označení podle skóre
 */
export const getScoreColor = (score: number): string => {
  if (score < 2.5) return '#ef4444'; // červená - kritické
  if (score < 3.5) return '#f59e0b'; // oranžová - střední
  return '#10b981'; // zelená - dobré
};

/**
 * Získá textový popisek pro skóre
 */
export const getScoreLabel = (score: number): string => {
  if (score < 2) return 'Kritické';
  if (score < 2.5) return 'Nízké';
  if (score < 3.5) return 'Střední';
  if (score < 4.5) return 'Dobré';
  return 'Výborné';
};

/**
 * Vypočítá trend pro danou otázku (poslední 3 týdny)
 */
export const calculateTrend = (
  questionId: string,
  weeklySummaries: WeeklySummary[]
): 'up' | 'down' | 'stable' => {
  if (weeklySummaries.length < 2) return 'stable';

  const recent = weeklySummaries.slice(-3); // Poslední 3 týdny
  const scores = recent
    .map((summary) => summary.averages[questionId])
    .filter((score) => score !== undefined);

  if (scores.length < 2) return 'stable';

  const first = scores[0];
  const last = scores[scores.length - 1];
  const diff = last - first;

  if (diff > 0.3) return 'up';
  if (diff < -0.3) return 'down';
  return 'stable';
};

/**
 * Vygeneruje mikro-akce pro denní skóre
 * Používá stejný algoritmus jako týdenní, ale s denními daty
 */
export const generateDailyMicroActions = (dailyScore: DailyScore) => {
  // Převést denní skóre na formát pro generateMicroActions
  const scores = dailyScore.scores;

  // Identifikovat kritické oblasti (nízké skóre)
  const criticalAreas = identifyCriticalAreas(scores);

  // Vygenerovat mikro-akce
  return generateMicroActions(scores, criticalAreas);
};

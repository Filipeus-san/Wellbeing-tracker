import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import type { WeeklySummary as WeeklySummaryType, DailyScore } from '../types';
import { questions, getCategoryLabel } from '../data/questions';
import { getScoreColor, getScoreLabel, calculateCategoryAverages, generateWeeklySummary } from '../utils/analytics';
import { generateClaudeSummary } from '../utils/claudeApi';
import { getDailyScoresInRange, getSettings, saveWeeklySummary, getWeeklySummary } from '../utils/storage';
import { startOfWeek } from 'date-fns';
import './WeeklySummary.css';

interface WeeklySummaryProps {
  onRefresh?: () => void;
}

export const WeeklySummary = ({ onRefresh }: WeeklySummaryProps) => {
  const [summary, setSummary] = useState<WeeklySummaryType | null>(null);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [claudeSummary, setClaudeSummary] = useState<string | null>(null);
  const [isLoadingClaude, setIsLoadingClaude] = useState(false);
  const [claudeError, setClaudeError] = useState<string | null>(null);
  const [canUseClaude, setCanUseClaude] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Načíst data při načtení komponenty
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Získat nastavení
      const settings = await getSettings();
      setCanUseClaude(settings.enableClaudeIntegration);

      // Získat aktuální týden
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Zkusit načíst existující, jinak vygenerovat nové
      let weeklySummary = await getWeeklySummary(weekStartStr);
      if (!weeklySummary) {
        weeklySummary = generateWeeklySummary(today);
        await saveWeeklySummary(weeklySummary);
      }

      setSummary(weeklySummary);
      setClaudeSummary(weeklySummary.claudeSummary || null);

      // Načíst denní skóre
      const scores = await getDailyScoresInRange(weeklySummary.weekStart, weeklySummary.weekEnd);
      setDailyScores(scores);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleGenerateClaude = async () => {
    if (!summary) return;

    setIsLoadingClaude(true);
    setClaudeError(null);

    try {
      const aiSummary = await generateClaudeSummary(summary, dailyScores);
      setClaudeSummary(aiSummary);

      // Uložit do summary
      const updatedSummary = {
        ...summary,
        claudeSummary: aiSummary,
      };
      await saveWeeklySummary(updatedSummary);
      setSummary(updatedSummary);

      if (onRefresh) onRefresh();
    } catch (error) {
      setClaudeError(
        error instanceof Error ? error.message : 'Chyba při generování shrnutí'
      );
    } finally {
      setIsLoadingClaude(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="weekly-summary">
        <div className="loading-message">Načítám týdenní data...</div>
      </div>
    );
  }

  // Připravit data pro grafy
  const categoryAverages = calculateCategoryAverages(summary.averages);

  const radarData = categoryAverages.map((cat) => ({
    category: getCategoryLabel(cat.category).substring(0, 15) + '...',
    score: parseFloat(cat.average.toFixed(2)),
  }));

  const barData = summary.criticalAreas.slice(0, 5).map((area) => {
    const question = questions.find((q) => q.id === area.questionId);
    return {
      name: question?.text.substring(0, 30) + '...' || area.questionId,
      score: parseFloat(area.score.toFixed(2)),
    };
  });

  const weekStartDate = new Date(summary.weekStart).toLocaleDateString('cs-CZ');
  const weekEndDate = new Date(summary.weekEnd).toLocaleDateString('cs-CZ');

  return (
    <div className="weekly-summary">
      <div className="summary-header">
        <h2>Týdenní shrnutí</h2>
        <div className="week-range">
          {weekStartDate} - {weekEndDate}
        </div>
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{dailyScores.length}</div>
            <div className="stat-label">Vyplněných dní</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.criticalAreas.length}</div>
            <div className="stat-label">Kritické oblasti</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.microActions.length}</div>
            <div className="stat-label">Mikro-akce</div>
          </div>
        </div>
      </div>

      {/* Claude AI Shrnutí */}
      {canUseClaude && (
        <div className="claude-section">
          <h3>🤖 AI Wellbeing Kouč</h3>
          {claudeSummary ? (
            <div className="claude-summary">
              <div className="claude-content">{claudeSummary}</div>
              <button className="regenerate-button" onClick={handleGenerateClaude}>
                Vygenerovat nové shrnutí
              </button>
            </div>
          ) : (
            <div className="claude-generate">
              <p>Nechej si vygenerovat personalizované shrnutí a doporučení od AI kouče.</p>
              <button
                className="generate-button"
                onClick={handleGenerateClaude}
                disabled={isLoadingClaude}
              >
                {isLoadingClaude ? 'Generuji...' : 'Vygenerovat AI shrnutí'}
              </button>
              {claudeError && <div className="claude-error">{claudeError}</div>}
            </div>
          )}
        </div>
      )}

      {/* Radar Graf - Celkový přehled */}
      <div className="chart-section">
        <h3>Celkový přehled kategorií</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              name="Průměrné skóre"
              dataKey="score"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Kritické oblasti */}
      {summary.criticalAreas.length > 0 && (
        <div className="chart-section">
          <h3>🔴 Kritické oblasti (vyžadují pozornost)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="score" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mikro-akce */}
      <div className="micro-actions-section">
        <h3>💡 Doporučené mikro-akce</h3>
        <div className="micro-actions-grid">
          {summary.microActions.map((action) => (
            <div key={action.id} className={`micro-action-card priority-${action.priority}`}>
              <div className="action-priority">{action.priority}</div>
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailní skóre všech otázek */}
      <div className="detailed-scores">
        <h3>Detailní přehled všech otázek</h3>
        <div className="scores-grid">
          {questions.map((question) => {
            const score = summary.averages[question.id];
            if (score === undefined) return null;

            return (
              <div key={question.id} className="score-item">
                <div className="score-question">{question.text}</div>
                <div className="score-display">
                  <div
                    className="score-bar"
                    style={{
                      width: `${(score / 5) * 100}%`,
                      backgroundColor: getScoreColor(score),
                    }}
                  />
                  <span className="score-value">{score.toFixed(1)}</span>
                  <span className="score-label-text" style={{ color: getScoreColor(score) }}>
                    {getScoreLabel(score)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

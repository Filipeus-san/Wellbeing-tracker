import { useState } from 'react';
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
import type { WeeklySummary as WeeklySummaryType } from '../types';
import { questions, getCategoryLabel } from '../data/questions';
import { getScoreColor, getScoreLabel, calculateCategoryAverages } from '../utils/analytics';
import { generateClaudeSummary } from '../utils/claudeApi';
import { getDailyScoresInRange, getSettings, saveWeeklySummary } from '../utils/storage';
import './WeeklySummary.css';

interface WeeklySummaryProps {
  summary: WeeklySummaryType;
  onRefresh?: () => void;
}

export const WeeklySummary = ({ summary, onRefresh }: WeeklySummaryProps) => {
  const [claudeSummary, setClaudeSummary] = useState<string | null>(
    summary.claudeSummary || null
  );
  const [isLoadingClaude, setIsLoadingClaude] = useState(false);
  const [claudeError, setClaudeError] = useState<string | null>(null);

  const settings = getSettings();
  const canUseClaude = settings.enableClaudeIntegration && settings.claudeApiKey;

  // Získat denní skóre pro detail
  const dailyScores = getDailyScoresInRange(summary.weekStart, summary.weekEnd);

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

  const handleGenerateClaude = async () => {
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
      saveWeeklySummary(updatedSummary);

      if (onRefresh) onRefresh();
    } catch (error) {
      setClaudeError(
        error instanceof Error ? error.message : 'Chyba při generování shrnutí'
      );
    } finally {
      setIsLoadingClaude(false);
    }
  };

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

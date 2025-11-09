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
import { MOODS, getAnxietyColor, getDepressionColor, getJoyColor, getAngerColor, getGratitudeColor } from '../types';
import { questions, getCategoryLabel } from '../data/questions';
import { getScoreColor, getScoreLabel, calculateCategoryAverages, generateWeeklySummary } from '../utils/analytics';
import { generateClaudeSummary } from '../utils/claudeApi';
import { getDailyScoresInRange, getSettings, saveWeeklySummary, getWeeklySummary } from '../utils/storage';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import './WeeklySummary.css';

interface WeeklySummaryProps {
  onRefresh?: () => void;
  onAiGeneratingChange?: (isGenerating: boolean) => void;
}

export const WeeklySummary = ({ onRefresh, onAiGeneratingChange }: WeeklySummaryProps) => {
  const [summary, setSummary] = useState<WeeklySummaryType | null>(null);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [claudeSummary, setClaudeSummary] = useState<string | null>(null);
  const [isLoadingClaude, setIsLoadingClaude] = useState(false);
  const [claudeError, setClaudeError] = useState<string | null>(null);
  const [canUseClaude, setCanUseClaude] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Propagovat loading stav nahoru
  useEffect(() => {
    if (onAiGeneratingChange) {
      onAiGeneratingChange(isLoadingClaude);
    }
  }, [isLoadingClaude, onAiGeneratingChange]);

  // Načíst data při načtení komponenty nebo když se změní týden/refresh
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Získat nastavení
      const settings = await getSettings();
      setCanUseClaude(settings.enableClaudeIntegration);

      // Použít aktuálně zvolený týden
      const weekStart = currentWeekStart;
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Načíst existující nebo vygenerovat nové
      let weeklySummary = await getWeeklySummary(weekStartStr);
      if (!weeklySummary) {
        weeklySummary = await generateWeeklySummary(weekStart);
        await saveWeeklySummary(weeklySummary);
      }

      setSummary(weeklySummary);
      setClaudeSummary(weeklySummary.claudeSummary || null);

      // Načíst denní skóre
      const scores = await getDailyScoresInRange(weeklySummary.weekStart, weeklySummary.weekEnd);
      setDailyScores(scores);

      setIsLoading(false);

      console.log('📊 WeeklySummary načteno:', {
        weekStart: weeklySummary.weekStart,
        weekEnd: weeklySummary.weekEnd,
        dailyScoresCount: scores.length,
        criticalAreas: weeklySummary.criticalAreas.length,
        microActions: weeklySummary.microActions.length,
      });
    };

    loadData();
  }, [currentWeekStart, refreshTrigger]);

  // Funkce pro manuální refresh
  const handleRefresh = () => {
    console.log('🔄 Manuální refresh týdenního shrnutí');
    setRefreshTrigger(prev => prev + 1);
  };

  // Navigace mezi týdny
  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const handleCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    return currentWeekStart.getTime() === thisWeekStart.getTime();
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
          <div>
            <h2>Týdenní shrnutí</h2>
            <div className="week-range">
              {weekStartDate} - {weekEndDate}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Navigace mezi týdny */}
            <button
              onClick={handlePreviousWeek}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
              }}
              title="Předchozí týden"
            >
              ◀
            </button>
            {!isCurrentWeek() && (
              <button
                onClick={handleCurrentWeek}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Aktuální týden
              </button>
            )}
            <button
              onClick={handleNextWeek}
              disabled={isCurrentWeek()}
              style={{
                padding: '8px 12px',
                backgroundColor: isCurrentWeek() ? '#d1d5db' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isCurrentWeek() ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                opacity: isCurrentWeek() ? 0.5 : 1,
              }}
              title="Následující týden"
            >
              ▶
            </button>
            <button
              onClick={handleRefresh}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginLeft: '8px',
              }}
            >
              🔄 Obnovit
            </button>
          </div>
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

      {/* Claude AI Shrnutí - zobrazit pouze pokud jsou data */}
      {canUseClaude && dailyScores.length > 0 && (
        <div className="claude-section">
          <h3>🤖 AI Wellbeing Kouč</h3>
          {claudeSummary ? (
            <div className="claude-summary">
              <div className="claude-content">{claudeSummary}</div>
              <button
                className="regenerate-button"
                onClick={handleGenerateClaude}
                disabled={isLoadingClaude}
              >
                {isLoadingClaude ? (
                  <>
                    <span className="spinner">⏳</span>
                    Generuji...
                  </>
                ) : (
                  'Vygenerovat nové shrnutí'
                )}
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
                {isLoadingClaude ? (
                  <>
                    <span className="spinner">⏳</span>
                    Generuji...
                  </>
                ) : (
                  'Vygenerovat AI shrnutí'
                )}
              </button>
              {claudeError && <div className="claude-error">{claudeError}</div>}
            </div>
          )}
        </div>
      )}

      {/* Týdenní nálady - zobrazit pouze pokud jsou data s náladou */}
      {dailyScores.some(score => score.mood) && (
        <div className="mood-overview-section">
          <h3>💭 Nálada v průběhu týdne</h3>
          <div className="daily-moods">
            {dailyScores.map((score) => {
              const moodData = score.mood ? MOODS[score.mood] : null;
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });

              return (
                <div key={score.date} className="day-mood-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {moodData ? (
                    <div
                      className="mood-display"
                      style={{ backgroundColor: moodData.color + '20', borderColor: moodData.color }}
                    >
                      <span className="mood-emoji">{moodData.emoji}</span>
                      <span className="mood-label" style={{ color: moodData.color }}>{moodData.label}</span>
                    </div>
                  ) : (
                    <div className="mood-display no-mood">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Týdenní úzkost */}
      {dailyScores.some(score => score.anxiety !== undefined) && (
        <div className="mental-health-overview-section">
          <h3>😰 Úzkost v průběhu týdne</h3>
          <div className="daily-mental-health">
            {dailyScores.map((score) => {
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
              const anxietyLevel = score.anxiety ?? null;

              return (
                <div key={score.date} className="day-mental-health-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {anxietyLevel !== null ? (
                    <div className="mental-health-display">
                      <div className="mental-health-bar-container">
                        <div
                          className="mental-health-bar"
                          style={{
                            width: `${(anxietyLevel / 10) * 100}%`,
                            backgroundColor: getAnxietyColor(anxietyLevel)
                          }}
                        />
                      </div>
                      <span className="mental-health-value" style={{ color: getAnxietyColor(anxietyLevel) }}>
                        {anxietyLevel}/10
                      </span>
                    </div>
                  ) : (
                    <div className="mental-health-display">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Týdenní deprese */}
      {dailyScores.some(score => score.depression !== undefined) && (
        <div className="mental-health-overview-section">
          <h3>😔 Deprese v průběhu týdne</h3>
          <div className="daily-mental-health">
            {dailyScores.map((score) => {
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
              const depressionLevel = score.depression ?? null;

              return (
                <div key={score.date} className="day-mental-health-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {depressionLevel !== null ? (
                    <div className="mental-health-display">
                      <div className="mental-health-bar-container">
                        <div
                          className="mental-health-bar"
                          style={{
                            width: `${(depressionLevel / 10) * 100}%`,
                            backgroundColor: getDepressionColor(depressionLevel)
                          }}
                        />
                      </div>
                      <span className="mental-health-value" style={{ color: getDepressionColor(depressionLevel) }}>
                        {depressionLevel}/10
                      </span>
                    </div>
                  ) : (
                    <div className="mental-health-display">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Týdenní radost */}
      {dailyScores.some(score => score.joy !== undefined) && (
        <div className="mental-health-overview-section">
          <h3>😊 Radost v průběhu týdne</h3>
          <div className="daily-mental-health">
            {dailyScores.map((score) => {
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
              const joyLevel = score.joy ?? null;

              return (
                <div key={score.date} className="day-mental-health-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {joyLevel !== null ? (
                    <div className="mental-health-display">
                      <div className="mental-health-bar-container">
                        <div
                          className="mental-health-bar"
                          style={{
                            width: `${(joyLevel / 10) * 100}%`,
                            backgroundColor: getJoyColor(joyLevel)
                          }}
                        />
                      </div>
                      <span className="mental-health-value" style={{ color: getJoyColor(joyLevel) }}>
                        {joyLevel}/10
                      </span>
                    </div>
                  ) : (
                    <div className="mental-health-display">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Týdenní vztek */}
      {dailyScores.some(score => score.anger !== undefined) && (
        <div className="mental-health-overview-section">
          <h3>😠 Vztek v průběhu týdne</h3>
          <div className="daily-mental-health">
            {dailyScores.map((score) => {
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
              const angerLevel = score.anger ?? null;

              return (
                <div key={score.date} className="day-mental-health-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {angerLevel !== null ? (
                    <div className="mental-health-display">
                      <div className="mental-health-bar-container">
                        <div
                          className="mental-health-bar"
                          style={{
                            width: `${(angerLevel / 10) * 100}%`,
                            backgroundColor: getAngerColor(angerLevel)
                          }}
                        />
                      </div>
                      <span className="mental-health-value" style={{ color: getAngerColor(angerLevel) }}>
                        {angerLevel}/10
                      </span>
                    </div>
                  ) : (
                    <div className="mental-health-display">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Týdenní vděčnost */}
      {dailyScores.some(score => score.gratitude !== undefined) && (
        <div className="mental-health-overview-section">
          <h3>🙏 Vděčnost v průběhu týdne</h3>
          <div className="daily-mental-health">
            {dailyScores.map((score) => {
              const date = new Date(score.date);
              const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
              const dayDate = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
              const gratitudeLevel = score.gratitude ?? null;

              return (
                <div key={score.date} className="day-mental-health-item">
                  <div className="day-info">
                    <div className="day-name">{dayName}</div>
                    <div className="day-date">{dayDate}</div>
                  </div>
                  {gratitudeLevel !== null ? (
                    <div className="mental-health-display">
                      <div className="mental-health-bar-container">
                        <div
                          className="mental-health-bar"
                          style={{
                            width: `${(gratitudeLevel / 10) * 100}%`,
                            backgroundColor: getGratitudeColor(gratitudeLevel)
                          }}
                        />
                      </div>
                      <span className="mental-health-value" style={{ color: getGratitudeColor(gratitudeLevel) }}>
                        {gratitudeLevel}/10
                      </span>
                    </div>
                  ) : (
                    <div className="mental-health-display">
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Nezadáno</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Radar Graf - Celkový přehled - zobrazit pouze pokud jsou data */}
      {dailyScores.length > 0 && (
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
      )}

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

      {/* Mikro-akce - zobrazit pouze pokud jsou nějaká data */}
      {dailyScores.length > 0 && summary.microActions.length > 0 && (
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
      )}

      {/* Detailní skóre všech otázek - zobrazit pouze pokud jsou data */}
      {dailyScores.length > 0 && (
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
      )}

      {/* Zpráva když nejsou žádná data */}
      {dailyScores.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
          <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '500' }}>
            Žádná data pro tento týden
          </p>
          <p>
            Vyplňte denní dotazník pro alespoň jeden den tohoto týdne, abyste viděli týdenní statistiky.
          </p>
        </div>
      )}
    </div>
  );
};

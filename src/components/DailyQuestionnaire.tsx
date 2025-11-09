import { useState, useEffect } from 'react';
import type { DailyScore, ScoreValue, MoodValue } from '../types';
import { MOODS } from '../types';
import { questions, getModelLabel } from '../data/questions';
import { saveDailyScore, getDailyScore, getSettings, saveWeeklySummary, getWeeklySummary } from '../utils/storage';
import { getScoreColor, generateDailyMicroActions, generateWeeklySummary } from '../utils/analytics';
import { generateDailySummary } from '../utils/claudeApi';
import { startOfWeek } from 'date-fns';
import './DailyQuestionnaire.css';

interface DailyQuestionnaireProps {
  date: string;
  onComplete?: () => void;
}

export const DailyQuestionnaire = ({ date, onComplete }: DailyQuestionnaireProps) => {
  const [scores, setScores] = useState<Record<string, ScoreValue>>({});
  const [mood, setMood] = useState<MoodValue | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canUseAI, setCanUseAI] = useState(false);
  const [currentDailyScore, setCurrentDailyScore] = useState<DailyScore | undefined>(undefined);

  // Načíst nastavení
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setCanUseAI(settings.enableClaudeIntegration);
    };
    loadSettings();
  }, []);

  // Načíst existující data
  useEffect(() => {
    const loadDailyScore = async () => {
      setIsLoading(true);
      const existingScore = await getDailyScore(date);
      setCurrentDailyScore(existingScore);
      if (existingScore) {
        // Vyfiltrovat pouze platné question IDs
        const validQuestionIds = new Set(questions.map(q => q.id));
        const cleanedScores: Record<string, ScoreValue> = {};
        Object.entries(existingScore.scores).forEach(([id, score]) => {
          if (validQuestionIds.has(id)) {
            cleanedScores[id] = score;
          }
        });
        setScores(cleanedScores);
        setMood(existingScore.mood);
        setNotes(existingScore.notes || '');
        setAiSummary(existingScore.aiSummary || null);
      } else {
        // Reset state při změně data
        setScores({});
        setMood(undefined);
        setNotes('');
        setAiSummary(null);
      }
      setIsLoading(false);
    };
    loadDailyScore();
  }, [date]);

  const handleScoreChange = (questionId: string, score: ScoreValue) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleSave = async () => {
    try {
      const dailyScore: DailyScore = {
        date,
        scores,
        mood,
        notes: notes.trim() || undefined,
      };

      await saveDailyScore(dailyScore);
      setCurrentDailyScore(dailyScore);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);

      // Přegenerovat týdenní shrnutí
      await regenerateWeeklySummary(date);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving daily score:', error);
      alert('Chyba při ukládání dat.');
    }
  };

  const regenerateWeeklySummary = async (currentDate: string) => {
    try {
      // Zjistit začátek týdne pro aktuální datum
      const dateObj = new Date(currentDate);
      const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 });
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Načíst stávající týdenní shrnutí (pokud existuje)
      const existingWeeklySummary = await getWeeklySummary(weekStartStr);

      // Vygenerovat nové týdenní shrnutí
      const newWeeklySummary = await generateWeeklySummary(dateObj);

      // Pokud existovalo AI shrnutí, zachovat ho
      if (existingWeeklySummary?.claudeSummary) {
        newWeeklySummary.claudeSummary = existingWeeklySummary.claudeSummary;
      }

      // Uložit nové týdenní shrnutí
      await saveWeeklySummary(newWeeklySummary);
      console.log('✅ Týdenní shrnutí bylo přegenerováno');
    } catch (error) {
      console.error('❌ Chyba při přegenerování týdenního shrnutí:', error);
      // Nepřerušovat uložení denního záznamu kvůli chybě v týdenním shrnutí
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      // Vytvořit DailyScore objekt
      const dailyScore: DailyScore = {
        date,
        scores,
        mood,
        notes: notes.trim() || undefined,
      };

      // Vygenerovat mikro-akce
      const microActions = generateDailyMicroActions(dailyScore);

      // Přidat mikro-akce do DailyScore pro prompt
      const dailyScoreWithActions: DailyScore = {
        ...dailyScore,
        microActions,
      };

      // Vygenerovat shrnutí (prompt bude obsahovat mikro-akce)
      const summary = await generateDailySummary(dailyScoreWithActions);

      // Uložit kompletní záznam s AI shrnutím a mikro-akcemi
      const completeDailyScore: DailyScore = {
        ...dailyScoreWithActions,
        aiSummary: summary,
      };

      await saveDailyScore(completeDailyScore);
      setCurrentDailyScore(completeDailyScore);
      setAiSummary(summary);

      // Přegenerovat týdenní shrnutí
      await regenerateWeeklySummary(date);
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : 'Chyba při generování shrnutí'
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Počítat pouze skóre pro existující otázky
  const validQuestionIds = new Set(questions.map(q => q.id));
  const validScores = Object.keys(scores).filter(id => validQuestionIds.has(id));
  const validScoresCount = validScores.length;

  const isComplete = validScoresCount === questions.length;
  const completionPercentage = Math.round(
    (validScoresCount / questions.length) * 100
  );

  // Seskupit otázky podle modelu
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.model]) {
      acc[question.model] = [];
    }
    acc[question.model].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  if (isLoading) {
    return (
      <div className="daily-questionnaire">
        <div className="loading-message">Načítám data...</div>
      </div>
    );
  }

  return (
    <div className="daily-questionnaire">
      <div className="questionnaire-header">
        <h2>Denní dotazník</h2>
        <div className="date-display">{new Date(date).toLocaleDateString('cs-CZ')}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="progress-text">
          Vyplněno: {validScoresCount} / {questions.length} ({completionPercentage}%)
        </div>
      </div>

      <div className="questionnaire-content">
        {/* Měření nálady */}
        <div className="mood-section">
          <h3 className="mood-title">Jak se dnes cítíš? 💭</h3>
          <div className="mood-selector">
            {Object.entries(MOODS).map(([value, moodData]) => {
              const isSelected = mood === value;
              return (
                <button
                  key={value}
                  className={`mood-button ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? moodData.color : '#f3f4f6',
                    color: isSelected ? 'white' : '#4b5563',
                    border: isSelected ? `2px solid ${moodData.color}` : '2px solid #e5e7eb',
                  }}
                  onClick={() => setMood(value as MoodValue)}
                  title={moodData.label}
                >
                  <span style={{ fontSize: '32px' }}>{moodData.emoji}</span>
                  <span style={{ fontSize: '14px', marginTop: '4px' }}>{moodData.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {Object.entries(groupedQuestions).map(([model, modelQuestions]) => (
          <div key={model} className="model-section">
            <h3 className="model-title">{getModelLabel(model as any)}</h3>

            {modelQuestions.map((question) => (
              <div key={question.id} className="question-item">
                <div className="question-text">{question.text}</div>
                <div className="score-buttons">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isSelected = scores[question.id] === value;
                    const color = isSelected ? getScoreColor(value) : '#e5e7eb';
                    return (
                      <button
                        key={value}
                        className={`score-button ${isSelected ? 'selected' : ''}`}
                        style={{
                          backgroundColor: color,
                          color: isSelected ? 'white' : '#4b5563',
                        }}
                        onClick={() => handleScoreChange(question.id, value as ScoreValue)}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="notes-section">
          <label htmlFor="notes" className="notes-label">
            Poznámky k dnešnímu dni (volitelné)
          </label>
          <textarea
            id="notes"
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jak ses dnes cítil/a? Co ovlivnilo tvoje skóre? Nějaké důležité události?"
            rows={4}
          />
        </div>
      </div>

      <div className="questionnaire-footer">
        <div className="footer-buttons">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={validScoresCount === 0}
          >
            {isComplete ? 'Uložit denní záznam' : 'Uložit rozpracované'}
          </button>

          {canUseAI && isComplete && (
            <button
              className="ai-summary-button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary
                ? '🤖 Generuji...'
                : aiSummary
                ? '🔄 Vygenerovat znovu'
                : '🤖 Vygenerovat AI shrnutí'}
            </button>
          )}
        </div>

        {savedMessage && (
          <div className="saved-message">✓ Denní záznam byl úspěšně uložen</div>
        )}

        {!isComplete && validScoresCount > 0 && (
          <div className="incomplete-warning">
            Ještě zbývá vyplnit {questions.length - validScoresCount} otázek
          </div>
        )}

        {summaryError && <div className="summary-error">❌ {summaryError}</div>}
      </div>

      {/* AI Shrnutí */}
      {aiSummary && (
        <div className="ai-summary-section">
          <div className="ai-summary-header">
            <h3>🤖 AI Wellbeing Kouč - Denní shrnutí</h3>
            {currentDailyScore?.aiSummary && (
              <span className="saved-indicator">💾 Uloženo</span>
            )}
          </div>
          <div className="ai-summary-content">{aiSummary}</div>

          {/* Mikro-akce na zítřek */}
          {currentDailyScore?.microActions && (
            <div className="daily-micro-actions">
              <h4>💡 Doporučené akce na zítřek</h4>
              <div className="micro-actions-list">
                {currentDailyScore.microActions.map((action) => (
                  <div key={action.id} className={`micro-action-item priority-${action.priority}`}>
                    <div className="action-icon">
                      {action.priority === 'high' && '🔥'}
                      {action.priority === 'medium' && '⭐'}
                      {action.priority === 'low' && '💫'}
                    </div>
                    <div className="action-content">
                      <div className="action-title">{action.title}</div>
                      <div className="action-description">{action.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

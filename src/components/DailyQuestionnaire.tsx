import { useState, useEffect } from 'react';
import type { DailyScore, ScoreValue } from '../types';
import { questions, getModelLabel } from '../data/questions';
import { saveDailyScore, getDailyScore, getSettings } from '../utils/storage';
import { getScoreColor, generateDailyMicroActions } from '../utils/analytics';
import { generateDailySummary } from '../utils/claudeApi';
import './DailyQuestionnaire.css';

interface DailyQuestionnaireProps {
  date: string;
  onComplete?: () => void;
}

export const DailyQuestionnaire = ({ date, onComplete }: DailyQuestionnaireProps) => {
  const [scores, setScores] = useState<Record<string, ScoreValue>>({});
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
        setNotes(existingScore.notes || '');
        setAiSummary(existingScore.aiSummary || null);
      } else {
        // Reset state při změně data
        setScores({});
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
        notes: notes.trim() || undefined,
      };

      await saveDailyScore(dailyScore);
      setCurrentDailyScore(dailyScore);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving daily score:', error);
      alert('Chyba při ukládání dat. Zkontrolujte připojení k serveru.');
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

          <button className="close-summary-button" onClick={() => setAiSummary(null)}>
            Zavřít
          </button>
        </div>
      )}
    </div>
  );
};

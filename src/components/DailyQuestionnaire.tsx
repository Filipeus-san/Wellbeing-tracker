import { useState, useEffect } from 'react';
import type { DailyScore, ScoreValue } from '../types';
import { questions, getModelLabel } from '../data/questions';
import { saveDailyScore, getDailyScore, getSettings } from '../utils/storage';
import { getScoreColor } from '../utils/analytics';
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

  const settings = getSettings();
  const canUseAI = settings.enableClaudeIntegration;

  // Načíst existující data
  useEffect(() => {
    const existingScore = getDailyScore(date);
    if (existingScore) {
      setScores(existingScore.scores);
      setNotes(existingScore.notes || '');
      setAiSummary(existingScore.aiSummary || null);
    } else {
      // Reset state při změně data
      setScores({});
      setNotes('');
      setAiSummary(null);
    }
  }, [date]);

  const handleScoreChange = (questionId: string, score: ScoreValue) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleSave = () => {
    const dailyScore: DailyScore = {
      date,
      scores,
      notes: notes.trim() || undefined,
    };

    saveDailyScore(dailyScore);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);

    if (onComplete) {
      onComplete();
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

      // Vygenerovat shrnutí
      const summary = await generateDailySummary(dailyScore);

      // Uložit s AI shrnutím
      const dailyScoreWithAI: DailyScore = {
        ...dailyScore,
        aiSummary: summary,
      };

      saveDailyScore(dailyScoreWithAI);
      setAiSummary(summary);
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : 'Chyba při generování shrnutí'
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const isComplete = Object.keys(scores).length === questions.length;
  const completionPercentage = Math.round(
    (Object.keys(scores).length / questions.length) * 100
  );

  // Seskupit otázky podle modelu
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.model]) {
      acc[question.model] = [];
    }
    acc[question.model].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  return (
    <div className="daily-questionnaire">
      <div className="questionnaire-header">
        <h2>Denní dotazník</h2>
        <div className="date-display">{new Date(date).toLocaleDateString('cs-CZ')}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="progress-text">
          Vyplněno: {Object.keys(scores).length} / {questions.length} ({completionPercentage}%)
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
            disabled={Object.keys(scores).length === 0}
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

        {!isComplete && Object.keys(scores).length > 0 && (
          <div className="incomplete-warning">
            Ještě zbývá vyplnit {questions.length - Object.keys(scores).length} otázek
          </div>
        )}

        {summaryError && <div className="summary-error">❌ {summaryError}</div>}
      </div>

      {/* AI Shrnutí */}
      {aiSummary && (
        <div className="ai-summary-section">
          <div className="ai-summary-header">
            <h3>🤖 AI Wellbeing Kouč - Denní shrnutí</h3>
            {getDailyScore(date)?.aiSummary && (
              <span className="saved-indicator">💾 Uloženo</span>
            )}
          </div>
          <div className="ai-summary-content">{aiSummary}</div>
          <button className="close-summary-button" onClick={() => setAiSummary(null)}>
            Zavřít
          </button>
        </div>
      )}
    </div>
  );
};

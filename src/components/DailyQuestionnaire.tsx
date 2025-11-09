import { useState, useEffect } from 'react';
import type { DailyScore, ScoreValue, MoodValue, AnxietyLevel, DepressionLevel, JoyLevel, AngerLevel, GratitudeLevel } from '../types';
import { MOODS, getMoodLabel, getAnxietyLabel, getDepressionLabel, getAnxietyColor, getDepressionColor, getJoyLabel, getJoyColor, getAngerLabel, getAngerColor, getGratitudeLabel, getGratitudeColor } from '../types';
import { questions, getModelLabel, getQuestionText } from '../data/questions';
import { saveDailyScore, getDailyScore, getSettings, saveWeeklySummary, getWeeklySummary } from '../utils/storage';
import { getScoreColor, generateDailyMicroActions, generateWeeklySummary } from '../utils/analytics';
import { generateDailySummary } from '../utils/claudeApi';
import { getMicroActionText } from '../utils/microActions';
import { startOfWeek } from 'date-fns';
import { useLanguage } from '../i18n/LanguageContext';
import './DailyQuestionnaire.css';

interface DailyQuestionnaireProps {
  date: string;
  onComplete?: () => void;
  onAiGeneratingChange?: (isGenerating: boolean) => void;
}

export const DailyQuestionnaire = ({ date, onComplete, onAiGeneratingChange }: DailyQuestionnaireProps) => {
  const { language, t } = useLanguage();
  const [scores, setScores] = useState<Record<string, ScoreValue>>({});
  const [mood, setMood] = useState<MoodValue | undefined>(undefined);
  const [anxiety, setAnxiety] = useState<AnxietyLevel>(0);
  const [depression, setDepression] = useState<DepressionLevel>(0);
  const [joy, setJoy] = useState<JoyLevel>(0);
  const [anger, setAnger] = useState<AngerLevel>(0);
  const [gratitude, setGratitude] = useState<GratitudeLevel>(0);
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

  // Propagovat loading stav nahoru
  useEffect(() => {
    if (onAiGeneratingChange) {
      onAiGeneratingChange(isGeneratingSummary);
    }
  }, [isGeneratingSummary, onAiGeneratingChange]);

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
        setAnxiety(existingScore.anxiety ?? 0);
        setDepression(existingScore.depression ?? 0);
        setJoy(existingScore.joy ?? 0);
        setAnger(existingScore.anger ?? 0);
        setGratitude(existingScore.gratitude ?? 0);
        setNotes(existingScore.notes || '');
        setAiSummary(existingScore.aiSummary || null);
      } else {
        // Reset state při změně data
        setScores({});
        setMood(undefined);
        setAnxiety(0);
        setDepression(0);
        setJoy(0);
        setAnger(0);
        setGratitude(0);
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
        anxiety,
        depression,
        joy,
        anger,
        gratitude,
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
      alert(t.common.error);
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
        anxiety,
        depression,
        joy,
        anger,
        gratitude,
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
        error instanceof Error ? error.message : t.common.error
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
        <div className="loading-message">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="daily-questionnaire">
      <div className="questionnaire-header">
        <h2>{t.daily.title}</h2>
        <div className="date-display">{new Date(date).toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="progress-text">
          {language === 'cs' ? `Vyplněno: ${validScoresCount} / ${questions.length} (${completionPercentage}%)` : `Filled: ${validScoresCount} / ${questions.length} (${completionPercentage}%)`}
        </div>
      </div>

      <div className="questionnaire-content">
        {/* Měření nálady */}
        <div className="mood-section">
          <h3 className="mood-title">{t.daily.selectMood} 💭</h3>
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
                  title={getMoodLabel(value as MoodValue, language)}
                >
                  <span style={{ fontSize: '32px' }}>{moodData.emoji}</span>
                  <span style={{ fontSize: '14px', marginTop: '4px' }}>{getMoodLabel(value as MoodValue, language)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Měření úzkosti */}
        <div className="mental-health-section">
          <div className="slider-container">
            <div className="slider-header">
              <h3 className="slider-title">😰 {t.daily.anxietyLevel}</h3>
              <div
                className="slider-value"
                style={{ color: getAnxietyColor(anxiety) }}
              >
                {anxiety}/10 - {getAnxietyLabel(anxiety, language)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(parseInt(e.target.value) as AnxietyLevel)}
              className="mental-health-slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, ${getAnxietyColor(anxiety)} ${anxiety * 10}%, #e5e7eb ${anxiety * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="slider-labels">
              <span>0 - {t.daily.none}</span>
              <span>10 - {t.daily.extreme}</span>
            </div>
          </div>
        </div>

        {/* Měření deprese */}
        <div className="mental-health-section">
          <div className="slider-container">
            <div className="slider-header">
              <h3 className="slider-title">😔 {t.daily.depressionLevel}</h3>
              <div
                className="slider-value"
                style={{ color: getDepressionColor(depression) }}
              >
                {depression}/10 - {getDepressionLabel(depression, language)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={depression}
              onChange={(e) => setDepression(parseInt(e.target.value) as DepressionLevel)}
              className="mental-health-slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, ${getDepressionColor(depression)} ${depression * 10}%, #e5e7eb ${depression * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="slider-labels">
              <span>0 - {t.daily.none}</span>
              <span>10 - {t.daily.extreme}</span>
            </div>
          </div>
        </div>

        {/* Měření radosti */}
        <div className="mental-health-section">
          <div className="slider-container">
            <div className="slider-header">
              <h3 className="slider-title">😊 {t.daily.joyLevel}</h3>
              <div
                className="slider-value"
                style={{ color: getJoyColor(joy) }}
              >
                {joy}/10 - {getJoyLabel(joy, language)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={joy}
              onChange={(e) => setJoy(parseInt(e.target.value) as JoyLevel)}
              className="mental-health-slider"
              style={{
                background: `linear-gradient(to right, #9ca3af 0%, ${getJoyColor(joy)} ${joy * 10}%, #e5e7eb ${joy * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="slider-labels">
              <span>0 - {t.daily.none}</span>
              <span>10 - {t.daily.extreme}</span>
            </div>
          </div>
        </div>

        {/* Měření vzteku */}
        <div className="mental-health-section">
          <div className="slider-container">
            <div className="slider-header">
              <h3 className="slider-title">😠 {t.daily.angerLevel}</h3>
              <div
                className="slider-value"
                style={{ color: getAngerColor(anger) }}
              >
                {anger}/10 - {getAngerLabel(anger, language)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={anger}
              onChange={(e) => setAnger(parseInt(e.target.value) as AngerLevel)}
              className="mental-health-slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, ${getAngerColor(anger)} ${anger * 10}%, #e5e7eb ${anger * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="slider-labels">
              <span>0 - {t.daily.none}</span>
              <span>10 - {t.daily.extreme}</span>
            </div>
          </div>
        </div>

        {/* Měření vděčnosti */}
        <div className="mental-health-section">
          <div className="slider-container">
            <div className="slider-header">
              <h3 className="slider-title">🙏 {t.daily.gratitudeLevel}</h3>
              <div
                className="slider-value"
                style={{ color: getGratitudeColor(gratitude) }}
              >
                {gratitude}/10 - {getGratitudeLabel(gratitude, language)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={gratitude}
              onChange={(e) => setGratitude(parseInt(e.target.value) as GratitudeLevel)}
              className="mental-health-slider"
              style={{
                background: `linear-gradient(to right, #9ca3af 0%, ${getGratitudeColor(gratitude)} ${gratitude * 10}%, #e5e7eb ${gratitude * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="slider-labels">
              <span>0 - {t.daily.none}</span>
              <span>10 - {t.daily.extreme}</span>
            </div>
          </div>
        </div>

        {Object.entries(groupedQuestions).map(([model, modelQuestions]) => (
          <div key={model} className="model-section">
            <h3 className="model-title">{getModelLabel(model as any, language)}</h3>

            {modelQuestions.map((question) => (
              <div key={question.id} className="question-item">
                <div className="question-text">{getQuestionText(question.id, language)}</div>
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
            {t.daily.notes}
          </label>
          <textarea
            id="notes"
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.daily.notesPlaceholder}
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
            {t.daily.saveButton}
          </button>

          {canUseAI && isComplete && (
            <button
              className="ai-summary-button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? (
                <>
                  <span className="spinner">⏳</span>
                  {t.daily.generating}
                </>
              ) : aiSummary ? (
                `🔄 ${t.daily.generateAiSummary}`
              ) : (
                `🤖 ${t.daily.generateAiSummary}`
              )}
            </button>
          )}
        </div>

        {savedMessage && (
          <div className="saved-message">✓ {t.common.success}</div>
        )}

        {!isComplete && validScoresCount > 0 && (
          <div className="incomplete-warning">
            {language === 'cs' ? `Ještě zbývá vyplnit ${questions.length - validScoresCount} otázek` : `${questions.length - validScoresCount} questions remaining`}
          </div>
        )}

        {summaryError && <div className="summary-error">❌ {summaryError}</div>}
      </div>

      {/* AI Shrnutí */}
      {aiSummary && (
        <div className="ai-summary-section">
          <div className="ai-summary-header">
            <h3>🤖 {t.daily.aiCoach}</h3>
            {currentDailyScore?.aiSummary && (
              <span className="saved-indicator">💾 {language === 'cs' ? 'Uloženo' : 'Saved'}</span>
            )}
          </div>
          <div className="ai-summary-content">{aiSummary}</div>

          {/* Mikro-akce na zítřek */}
          {currentDailyScore?.microActions && (
            <div className="daily-micro-actions">
              <h4>💡 {t.daily.recommendedActions}</h4>
              <div className="micro-actions-list">
                {currentDailyScore.microActions.map((action) => (
                  <div key={action.id} className={`micro-action-item priority-${action.priority}`}>
                    <div className="action-icon">
                      {action.priority === 'high' && '🔥'}
                      {action.priority === 'medium' && '⭐'}
                      {action.priority === 'low' && '💫'}
                    </div>
                    <div className="action-content">
                      <div className="action-title">{getMicroActionText(action.id, 'title', language) || action.title}</div>
                      <div className="action-description">{getMicroActionText(action.id, 'description', language) || action.description}</div>
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

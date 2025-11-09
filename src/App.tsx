import { useState } from 'react';
import { DailyQuestionnaire } from './components/DailyQuestionnaire';
import { WeeklySummary } from './components/WeeklySummary';
import { Settings } from './components/Settings';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import './App.css';

type View = 'daily' | 'weekly' | 'settings';

function AppContent() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleViewWeeklySummary = async () => {
    if (isAiGenerating) return; // Blokovat změnu při generování
    setCurrentView('weekly');
  };

  const handleViewChange = (view: View) => {
    if (isAiGenerating) return; // Blokovat změnu při generování
    setCurrentView(view);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🌟 Wellbeing Tracker</h1>
          <p className="app-subtitle">Track your mental wellbeing with Maslow, SDT and PERMA</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-button ${currentView === 'daily' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={() => handleViewChange('daily')}
          disabled={isAiGenerating}
        >
          📝 {t.nav.dailyQuestionnaire}
        </button>
        <button
          className={`nav-button ${currentView === 'weekly' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={handleViewWeeklySummary}
          disabled={isAiGenerating}
        >
          📊 {t.nav.weeklySummary}
        </button>
        <button
          className={`nav-button ${currentView === 'settings' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={() => handleViewChange('settings')}
          disabled={isAiGenerating}
        >
          ⚙️ {t.nav.settings}
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'daily' && (
          <div className="view-container">
            <div className="date-selector">
              <label htmlFor="date-input">{t.daily.selectDate}:</label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>
            <DailyQuestionnaire
              key={selectedDate}
              date={selectedDate}
              onComplete={handleRefresh}
              onAiGeneratingChange={setIsAiGenerating}
            />
          </div>
        )}

        {currentView === 'weekly' && (
          <div className="view-container">
            <WeeklySummary
              key={refreshKey}
              onRefresh={handleRefresh}
              onAiGeneratingChange={setIsAiGenerating}
            />
          </div>
        )}

        {currentView === 'settings' && (
          <div className="view-container">
            <Settings onUpdate={handleRefresh} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Created with ❤️ for mental wellbeing support | Data stored locally
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

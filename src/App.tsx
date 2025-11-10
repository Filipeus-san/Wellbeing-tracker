import { useState } from 'react';
import { DailyQuestionnaire } from './components/DailyQuestionnaire';
import { WeeklySummary } from './components/WeeklySummary';
import { Habits } from './components/Habits';
import { Settings } from './components/Settings';
import { About } from './components/About';
import UpdateNotification from './components/UpdateNotification';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import './App.css';

type View = 'daily' | 'weekly' | 'habits' | 'settings' | 'about';

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
      {/* Update Notification */}
      <UpdateNotification />

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🌟 Wellbeing Tracker</h1>
          <p className="app-subtitle">{t.app.subtitle}</p>
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
          className={`nav-button ${currentView === 'habits' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={() => handleViewChange('habits')}
          disabled={isAiGenerating}
        >
          📋 {t.nav.habits}
        </button>
        <button
          className={`nav-button ${currentView === 'settings' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={() => handleViewChange('settings')}
          disabled={isAiGenerating}
        >
          ⚙️ {t.nav.settings}
        </button>
        <button
          className={`nav-button ${currentView === 'about' ? 'active' : ''} ${isAiGenerating ? 'disabled' : ''}`}
          onClick={() => handleViewChange('about')}
          disabled={isAiGenerating}
        >
          ℹ️ {t.nav.about}
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

        {currentView === 'habits' && (
          <div className="view-container">
            <Habits />
          </div>
        )}

        {currentView === 'settings' && (
          <div className="view-container">
            <Settings onUpdate={handleRefresh} />
          </div>
        )}

        {currentView === 'about' && (
          <div className="view-container">
            <About />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          {t.app.footer}
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

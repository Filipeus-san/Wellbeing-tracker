import { useState } from 'react';
import { DailyQuestionnaire } from './components/DailyQuestionnaire';
import { WeeklySummary } from './components/WeeklySummary';
import { Settings } from './components/Settings';
import './App.css';

type View = 'daily' | 'weekly' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleViewWeeklySummary = async () => {
    setCurrentView('weekly');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🌟 Wellbeing Tracker</h1>
          <p className="app-subtitle">Sleduj svoji duševní pohodu pomocí Maslow, SDT a PERMA</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-button ${currentView === 'daily' ? 'active' : ''}`}
          onClick={() => setCurrentView('daily')}
        >
          📝 Denní dotazník
        </button>
        <button
          className={`nav-button ${currentView === 'weekly' ? 'active' : ''}`}
          onClick={handleViewWeeklySummary}
        >
          📊 Týdenní shrnutí
        </button>
        <button
          className={`nav-button ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentView('settings')}
        >
          ⚙️ Nastavení
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'daily' && (
          <div className="view-container">
            <div className="date-selector">
              <label htmlFor="date-input">Vyberte datum:</label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>
            <DailyQuestionnaire key={selectedDate} date={selectedDate} onComplete={handleRefresh} />
          </div>
        )}

        {currentView === 'weekly' && (
          <div className="view-container">
            <WeeklySummary key={refreshKey} onRefresh={handleRefresh} />
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
          Vytvořeno s ❤️ pro podporu duševní pohody | Data ukládána lokálně
        </p>
      </footer>
    </div>
  );
}

export default App;

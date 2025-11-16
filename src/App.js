import React, { useEffect, useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeDemoDataIfNeeded } from './utils/demoData';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('budget');

  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoDataIfNeeded();
  }, []);

  return (
    <FinanceProvider>
      <ErrorBoundary>
        <div className="App">
          {/* Simple Navigation */}
          <nav className="app-nav">
            <div className="nav-container">
              <h2 className="app-title">💰 Finance Tracker</h2>
              <div className="nav-buttons">
                <button
                  className={`nav-btn ${currentPage === 'budget' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('budget')}
                >
                  💵 Budgets
                </button>
                <button
                  className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('analytics')}
                >
                  📊 Analytics
                </button>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          {currentPage === 'budget' ? <BudgetPage /> : <AnalyticsPage />}
        </div>
      </ErrorBoundary>
    </FinanceProvider>
  );
}

export default App;

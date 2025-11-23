import React, { useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';

import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';

import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
// import { initializeDemoDataIfNeeded } from './utils/demoData';
import './App.css';

function App() {

  useEffect(() => {
    // Initialize demo data on first load
    
  }, []);

  return (
    <FinanceProvider>
      <ErrorBoundary>
        <Router>
          <div className="App">
            {/* Simple Navigation */}
            <nav className="app-nav">
              <div className="nav-container">
                <h2 className="app-title">💰 Finance Tracker</h2>
                <div className="nav-buttons">
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/"
                  >
                    📈 Dashboard
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/budget"
                  >
                    💵 Budgets
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/analytics"
                  >
                    📊 Analytics
                  </NavLink>
                </div>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<ErrorBoundary />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </FinanceProvider>
  );
}

export default App;

import React from 'react';
// import { useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { FaWallet, FaChartLine, FaDollarSign, FaChartPie, FaCoins} from 'react-icons/fa';

import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';

import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
// import { initializeDemoDataIfNeeded } from './utils/demoData';
import './App.css';

function App() {

  // might not work (uncommment in index.js instead if it doesn't work)
  // useEffect(() => {
  //   // Initialize demo data on first load
  //   initializeDemoDataIfNeeded()
  // }, []);

  return (
    <FinanceProvider>
      <ErrorBoundary>
        <Router>
          <div className="App">
            {/* Simple Navigation */}
          <nav className="app-nav">
            <div className="nav-container">
              <h2 className="app-title"><FaWallet className="FaIcon" /> Finance Tracker</h2>
              <div className="nav-buttons">
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/"
                  >
                    <FaChartLine className="FaIcon" /> <span className='navText'>Dashboard</span>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/transaction"
                  >
                    <FaCoins className="FaIcon" /> <span className='navText'>Transactions </span>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/wallet"
                  >
                    <FaWallet className="FaIcon" /> <span className='navText'>Wallet</span>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/budget"
                  >
                    <FaDollarSign className="FaIcon" /> <span className='navText'>Budgets</span>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                    to="/analytics"
                  >
                    <FaChartPie className="FaIcon" /> <span className='navText'>Analytics</span>
                  </NavLink>
                </div>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transaction" element={<Transactions />} />
              <Route path="/wallet" element={<Wallet />} />
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

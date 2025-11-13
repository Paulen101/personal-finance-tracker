import React, { useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import BudgetPage from './pages/BudgetPage';
import { initializeDemoDataIfNeeded } from './utils/demoData';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoDataIfNeeded();
  }, []);

  return (
    <FinanceProvider>
      <div className="App">
        <BudgetPage />
      </div>
    </FinanceProvider>
  );
}

export default App;

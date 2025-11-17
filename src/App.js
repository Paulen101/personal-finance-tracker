import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { FinanceProvider} from './context/FinanceContext'

import Expenses from './pages/Expenses'
import Wallet from './pages/Wallet'

function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App
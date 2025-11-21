import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { FinanceProvider} from './context/FinanceContext'

import Transactions from './pages/Transactions'
import Wallet from './pages/Wallet'

function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App
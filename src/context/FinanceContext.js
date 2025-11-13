import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Initialize state from localStorage
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('finance_wallets');
    return saved ? JSON.parse(saved) : [
      {
        id: 0,
        name: 'Main Wallet',
        balance: 1000,
        transactions: []
      }
    ];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finance_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedWalletId, setSelectedWalletId] = useState(0);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('finance_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Get current wallet
  const getCurrentWallet = () => {
    return wallets.find(w => w.id === selectedWalletId) || wallets[0];
  };

  // Calculate spent amount for a budget
  const calculateBudgetSpent = (budget) => {
    const wallet = wallets.find(w => w.id === (budget.walletID ?? selectedWalletId));
    if (!wallet || !wallet.transactions) return 0;

    // Sum transactions that match the budget category
    const spent = wallet.transactions
      .filter(t => t.category === budget.category && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return spent;
  };

  // Get applicable budgets for current wallet
  const getApplicableBudgets = (walletId = selectedWalletId) => {
    // Get wallet-specific budgets first (they override global)
    const walletBudgets = budgets.filter(b => b.walletID === walletId);
    const globalBudgets = budgets.filter(b => b.walletID === null);

    // Categories that already have wallet-specific budgets
    const walletCategories = new Set(walletBudgets.map(b => b.category));

    // Only include global budgets for categories without wallet-specific budgets
    const applicableGlobalBudgets = globalBudgets.filter(
      b => !walletCategories.has(b.category)
    );

    return [...walletBudgets, ...applicableGlobalBudgets];
  };

  // Budget CRUD operations
  const addBudget = (budgetData) => {
    const newBudget = {
      id: Date.now(),
      walletID: budgetData.walletID === 'global' ? null : parseInt(budgetData.walletID),
      category: budgetData.category,
      limit: parseFloat(budgetData.limit),
      spent: 0,
      dateSet: new Date().toISOString()
    };
    setBudgets([...budgets, newBudget]);
    return newBudget;
  };

  const updateBudget = (budgetId, updates) => {
    setBudgets(budgets.map(b => 
      b.id === budgetId 
        ? { 
            ...b, 
            ...updates,
            walletID: updates.walletID === 'global' ? null : 
                      updates.walletID !== undefined ? parseInt(updates.walletID) : b.walletID
          }
        : b
    ));
  };

  const deleteBudget = (budgetId) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
  };

  // Transaction operations (for demo purposes)
  const addTransaction = (walletId, transaction) => {
    setWallets(wallets.map(w => 
      w.id === walletId 
        ? {
            ...w,
            transactions: [...(w.transactions || []), {
              id: Date.now(),
              ...transaction,
              date: new Date().toISOString()
            }]
          }
        : w
    ));
  };

  const value = {
    wallets,
    setWallets,
    budgets,
    setBudgets,
    selectedWalletId,
    setSelectedWalletId,
    getCurrentWallet,
    calculateBudgetSpent,
    getApplicableBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    addTransaction
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

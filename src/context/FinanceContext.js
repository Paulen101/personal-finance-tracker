import React, { createContext, useState, useEffect, useContext } from "react";

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Error state for storage issues
  const [storageError, setStorageError] = useState(null);

  // Safe localStorage helpers
  const safeGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("localStorage.getItem error", key, e);
      setStorageError(e);
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("localStorage.setItem error", key, e);
      setStorageError(e);
    }
  };

  const safeRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("localStorage.removeItem error", key, e);
      setStorageError(e);
    }
  };

  // Initialize state from localStorage (safe)
  const [wallets, setWallets] = useState(() =>
    safeGet("finance_wallets", [
      {
        id: 0,
        name: "Main Wallet",
        balance: 1000,
        transactions: [
          {
            id: 0,
            date: "2024-01-01",
            category: "Food",
            type: "expense",
            amount: 50,
          },
          {
            id: 1,
            date: "2024-01-02",
            category: "Salary",
            type: "income",
            amount: 2000,
          },
        ],
      },
    ])
  );

  const deleteTransaction = (walletId, transactionId) => {
    setWallets(
      wallets.map((w) =>
        w.id === walletId
          ? {
              ...w,
              transactions: w.transactions.filter(
                (tx) => tx.id !== transactionId
              ),
            }
          : w
      )
    );
  };

  const [budgets, setBudgets] = useState(() => safeGet("finance_budgets", []));

  const [selectedWalletId, setSelectedWalletId] = useState(() => {
    const defaultWallet =
      (Array.isArray(wallets) && wallets[0] && wallets[0].id) || 0;
    return defaultWallet;
  });

  const currentWallet = wallets.find((w) => w.id === selectedWalletId);

  const balance =
    currentWallet?.transactions?.reduce((acc, t) => {
      return t.type === "income" ? acc + t.amount : acc - t.amount;
    }, 0) || 0;

  const income =
    currentWallet?.transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0) || 0;

  const expense =
    currentWallet?.transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0) || 0;

  // Persist to localStorage whenever state changes
  useEffect(() => {
    safeSet("finance_wallets", wallets);
  }, [wallets]);

  useEffect(() => {
    safeSet("finance_budgets", budgets);
  }, [budgets]);

  // Get current wallet
  const getCurrentWallet = () => {
    return wallets.find((w) => w.id === selectedWalletId) || wallets[0];
  };

  // Calculate spent amount for a budget safely
  const calculateBudgetSpent = (budget) => {
    try {
      // For wallet-specific budgets, use that wallet's transactions
      // For global budgets (walletID === null), calculate against the selected wallet
      const targetWalletId =
        budget.walletID === null ? selectedWalletId : budget.walletID;
      const wallet = Array.isArray(wallets)
        ? wallets.find((w) => w.id === targetWalletId)
        : null;
      if (!wallet || !Array.isArray(wallet.transactions)) return 0;

      // Sum transactions that match the budget category and are expenses
      const spent = wallet.transactions
        .filter(
          (t) => t && t.category === budget.category && t.type === "expense"
        )
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

      return spent;
    } catch (e) {
      console.error("Error calculating budget spent", e);
      setStorageError(e);
      return 0;
    }
  };

  // Get applicable budgets for current wallet
  const getApplicableBudgets = (walletId = selectedWalletId) => {
    // Get wallet-specific budgets first (they override global)
    const walletBudgets = budgets.filter((b) => b.walletID === walletId);
    const globalBudgets = budgets.filter((b) => b.walletID === null);

    // Categories that already have wallet-specific budgets
    const walletCategories = new Set(walletBudgets.map((b) => b.category));

    // Only include global budgets for categories without wallet-specific budgets
    const applicableGlobalBudgets = globalBudgets.filter(
      (b) => !walletCategories.has(b.category)
    );

    return [...walletBudgets, ...applicableGlobalBudgets];
  };

  // Budget CRUD operations
  const addBudget = (budgetData) => {
    const newBudget = {
      id: Date.now(),
      walletID:
        budgetData.walletID === "global" ? null : parseInt(budgetData.walletID),
      category: budgetData.category,
      limit: parseFloat(budgetData.limit),
      spent: 0,
      dateSet: new Date().toISOString(),
    };
    setBudgets([...budgets, newBudget]);
    return newBudget;
  };

  const updateBudget = (budgetId, updates) => {
    setBudgets(
      budgets.map((b) =>
        b.id === budgetId
          ? {
              ...b,
              ...updates,
              walletID:
                updates.walletID === "global"
                  ? null
                  : updates.walletID !== undefined
                  ? parseInt(updates.walletID)
                  : b.walletID,
            }
          : b
      )
    );
  };

  const deleteBudget = (budgetId) => {
    setBudgets(budgets.filter((b) => b.id !== budgetId));
  };

  // Transaction operations (for demo purposes)
  const addTransaction = (walletId, transaction) => {
    setWallets(
      wallets.map((w) =>
        w.id === walletId
          ? {
              ...w,
              transactions: [
                ...(w.transactions || []),
                {
                  id: `T${Date.now()}`,
                  ...transaction,
                  date: new Date().toISOString(),
                },
              ],
            }
          : w
      )
    );
  };

  const clearStorage = () => {
    safeRemove("finance_wallets");
    safeRemove("finance_budgets");
    setWallets([]);
    setBudgets([]);
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
    addTransaction,
    deleteTransaction,
    balance,
    expense,
    income,
    storageError,
    clearStorage,
    clearStorageError: () => setStorageError(null),
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

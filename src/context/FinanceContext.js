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
        balance: 0,
        cardNumber: "**** **** **** 0001",
        expiryDate: "12/27",
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
                (transaction) => transaction.id !== transactionId
              ),
            }
          : w
      )
    );
  };

  const [budgets, setBudgets] = useState(() => safeGet("finance_budgets", []));

  const [selectedWalletId, setSelectedWalletId] = useState(() => {
    const savedWallets = safeGet("finance_wallets", [
      {
        id: 0,
        name: "Main Wallet",
        balance: 0,
        transactions: [],
      },
    ]);
    return (Array.isArray(savedWallets) && savedWallets[0]?.id) || 0;
  });

  const currentWallet =
    wallets.find((w) => w.id === selectedWalletId) || wallets[0];

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

  const getWalletBalance = (walletId) => {
    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet) return 0;
    return (wallet.transactions || []).reduce(
      (total, t) => (t.type === "income" ? total + t.amount : total - t.amount),
      0
    );
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
      id: Date.now() % 1000000,
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
    console.log(
      "addTransaction called with walletId:",
      walletId,
      typeof walletId
    );
    setWallets(
      wallets.map((w) =>
        w.id === walletId
          ? {
              ...w,
              transactions: [
                ...(w.transactions || []),
                {
                  id: Date.now() % 1000000,
                  ...transaction,
                  date: transaction.date,
                },
              ],
            }
          : w
      )
    );
  };

  // Add this NEW function
  const addWallet = (walletData) => {
    const last4Digit = String(Date.now()).slice(-4);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const expiryYear = String(expiryDate.getFullYear()).slice(-2);

    const newWallet = {
      id: Date.now(),
      name: walletData.name,
      cardNumber: `**** **** **** ${last4Digit}`,
      expiryDate: `${expiryMonth}/${expiryYear}`,
      transactions: [],
    };

    setWallets([...wallets, newWallet]);
    setSelectedWalletId(newWallet.id);

    return newWallet;
  };

  const deleteWallet = (walletId) => {
    if (wallets.length === 1) {
      alert("You cannot delete your only wallet!");
      return false;
    }

    const walletToDelete = wallets.find((w) => w.id === walletId);

    const transactionCount = walletToDelete?.transactions?.length || 0;
    const confirmMsg =
      transactionCount > 0
        ? `The wallet "${walletToDelete.name}" has ${transactionCount} transaction(s). Deleting it will also remove all its transactions. Are you sure you want to proceed?`
        : `Are you sure you want to delete the wallet "${walletToDelete.name}"?`;

    if (!window.confirm(confirmMsg)) {
      return false;
    }

    if (selectedWalletId === walletId) {
      const nextWallet = wallets.find((w) => w.id !== walletId);
      setSelectedWalletId(nextWallet.id);
    }

    setWallets(wallets.filter((w) => w.id !== walletId));

    return true;
  };

  const transferBetweenWallets = (
    fromWalletId,
    toWalletId,
    amount,
    description = ""
  ) => {
    if (fromWalletId === toWalletId) {
      alert("Cannot transfer to the same wallet!");
      return false;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert("Please enter a valid transfer amount!");
      return false;
    }

    const fromWallet = wallets.find((w) => w.id === fromWalletId);
    const toWallet = wallets.find((w) => w.id === toWalletId);

    if (!fromWallet || !toWallet) {
      alert("Wallet not found!");
      return false;
    }

    const fromWalletBalance = fromWallet.transactions.reduce((total, t) => {
      return t.type === "income" ? total + t.amount : total - t.amount;
    }, 0);

    if (fromWalletBalance < transferAmount) {
      alert(
        `Insufficient balance! Available: $${fromWalletBalance.toFixed(2)}`
      );
      return false;
    }

    const timestamp = Date.now();
    const date = new Date().toISOString().split("T")[0];

    const transferOutTransaction = {
      id: timestamp,
      type: "expense",
      category: "Transfer Out",
      amount: transferAmount,
      description: description || `Transfer to ${toWallet.name}`,
      date: date,
    };

    const transferInTransaction = {
      id: timestamp + 1,
      type: "income",
      category: "Transfer In",
      amount: transferAmount,
      description: description || `Transfer from ${fromWallet.name}`,
      date: date,
    };

    setWallets(
      wallets.map((wallet) => {
        if (wallet.id === fromWalletId) {
          return {
            ...wallet,
            transactions: [...wallet.transactions, transferOutTransaction],
          };
        }
        if (wallet.id === toWalletId) {
          return {
            ...wallet,
            transactions: [...wallet.transactions, transferInTransaction],
          };
        }
        return wallet;
      })
    );

    return true;
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
    getWalletBalance,
    addBudget,
    updateBudget,
    deleteBudget,
    addTransaction,
    deleteTransaction,
    balance,
    expense,
    income,
    addWallet,
    deleteWallet,
    transferBetweenWallets,
    storageError,
    clearStorage,
    clearStorageError: () => setStorageError(null),
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

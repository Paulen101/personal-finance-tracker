import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [wallets, setWallets] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // // initialize wallets and budgets (runs once)
  // useEffect(() => {
  //   setWallets(JSON.parse(localStorage.getItem("wallets")) || []);
  //   setBudgets(JSON.parse(localStorage.getItem("budgets")) || []);
  // }, []);

  // persist wallets and budgets to localStorage on change <- this set the wallet to local storage
  useEffect(() => {
    if (isLoaded) {   // only save after loading finishes
      localStorage.setItem("wallets", JSON.stringify(wallets));
    }
  }, [wallets, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("budgets", JSON.stringify(budgets));
    }
  }, [budgets, isLoaded]);

  useEffect(() => {
    const savedWallets = loadFromLocalStorage("wallets");
    const savedBudgets = loadFromLocalStorage("budgets");

    setWallets(savedWallets);
    setBudgets(savedBudgets);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    setBudgets(prevBudgets => updateBudgetsSpent(wallets, prevBudgets));
  }, [wallets, isLoaded]);


  // helper load function 
  const loadFromLocalStorage = (key, fallback = []) => {
    // load "key" (wallets or budgets) from browser 
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : fallback;
    }
    // key (wallet or budget) doesn't exist, then just return []
    catch (err) {
      console.warn(`Error loading ${key} from localStorage:`, err);
      return fallback;
    }
  }

  // Add wallets & budgets
  const addWallets = (walletInput) => {
    if (Array.isArray(walletInput)) {
      // Batch add multiple wallets
      setWallets(prev => [
        ...prev,
        ...walletInput.map((w, i) => ({
          accountID: w.accountID ?? (prev.length + i),
          accountName: w.accountName,
          balance: parseFloat(w.balance) || 0,
          transactions: w.transactions || [],
        }))
      ]);
      return;
    }

    // Single wallet
    const newWallet = {
      accountID: walletInput.accountID ?? (wallets.length > 0 ? wallets[wallets.length - 1].accountID + 1 : 0),
      accountName: walletInput.accountName,
      balance: parseFloat(walletInput.balance) || 0,
      transactions: walletInput.transactions || [],
    };

    setWallets(prev => [...prev, newWallet]);
  };

  const addBudgets = (budgetInput) => {
    if (Array.isArray(budgetInput)) {
      setBudgets(prev => [
        ...prev,
        ...budgetInput.map((b, i) => ({
          id: b.id ?? (prev.length + i + 1),
          walletID: b.walletID ?? null,
          category: b.category,
          limit: parseFloat(b.limit) || 0,
          spent: b.spent || 0,
        }))
      ]);
      return;
    }

    const newBudget = {
      id: budgetInput.id ?? (budgets.length > 0 ? budgets[budgets.length - 1].id + 1 : 1),
      walletID: budgetInput.walletID ?? null,
      category: budgetInput.category,
      limit: parseFloat(budgetInput.limit) || 0,
      spent: budgetInput.spent || 0,
    };

    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudgetsSpent = (walletsData, budgetsData) => {
    const localBudgetKeys = new Set(
      budgetsData
        .filter(b => b.walletID !== null)
        .map(b => `${b.walletID}-${b.category}`)
    );

    return budgetsData.map(budget => {
      let relevantTransactions = [];

      if (budget.walletID !== null) {
        const wallet = walletsData.find(w => w.accountID === budget.walletID);
        if (wallet) relevantTransactions = wallet.transactions;
      } else {
        relevantTransactions = walletsData
          .filter(w => !localBudgetKeys.has(`${w.accountID}-${budget.category}`))
          .flatMap(w => w.transactions);
      }

      // Only include transactions (on or after dateSet)
      const budgetStartDate = budget.dateSet ? new Date(budget.dateSet) : null;

      const totalSpent = relevantTransactions
        .filter(t => 
          t.type === "expense" &&
          t.category === budget.category &&
          (!budgetStartDate || new Date(t.date) >= budgetStartDate)
        )
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      return { ...budget, spent: totalSpent };
    });
  };


  return (
    <AppContext.Provider
      value={{
        wallets,
        addWallets,
        budgets,
        addBudgets,
        isLoaded 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

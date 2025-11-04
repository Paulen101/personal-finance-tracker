import React, { createContext, useState, useEffect, useId} from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [wallets, setWallets] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // initialize wallets and budgets (runs once)
  useEffect(() => {
    setWallets(JSON.parse(localStorage.getItem("wallets")) || []);
    setBudgets(JSON.parse(localStorage.getItem("budgets")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addWallets = ({ accountName, balance }) => {
    const newWallet = {
        accountID: wallets.length > 0 ? wallets[wallets.length - 1].accountID + 1 : 0,
        accountName,
        balance: parseFloat(balance),
        transactions: [],
    };

    setWallets([
        ...wallets, 
        newWallet
    ]);
  }

  const addBudgets = ({ walletID = null, category, limit }) => {
    const newBudget = {
        id: budgets.length > 0 ? budgets[budgets.length - 1].id + 1 : 1,
        walletID,      // null for global budgets
        category,
        limit: parseFloat(limit),
        spent: 0,
    };

    setBudgets([
        ...budgets, 
        newBudget]);
    };

  return (
    <AppContext.Provider
      value={{
        wallets,
        addWallets,
        budgets,
        addBudgets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

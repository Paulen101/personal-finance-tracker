import React, { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { BiLineChart, BiLineChartDown } from "react-icons/bi";
import { FaCreditCard } from 'react-icons/fa';
import "./Balance.css";

function Balance() {
  const { wallets, selectedWalletId } = useFinance();
  // useState for total to calculate income, expense, & balance for a specific wallet & all wallet
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });
    
  // when wallets / walletID recalculates balance, income & expense 
  useEffect(() => {
    let balance = 0;
    let income = 0;
    let expense = 0;

    const selectedWallets =
      selectedWalletId === "all"
        ? wallets
        : wallets.filter((w) => w.id === selectedWalletId);

    selectedWallets.forEach((wallet) => {
      (wallet.transactions || []).forEach((t) => {
        if (t.type === "income") {
          income += t.amount;
          balance += t.amount;
        } else {
          expense += t.amount;
          balance -= t.amount;
        }
      });
    });

    setTotals({ balance, income, expense });
  }, [wallets, selectedWalletId]);

  return (
    <div className="balance-summary">
      {/* total/current balance card */}
      <div className="balance-card balance-total">
        <div className="balance-icon"><FaCreditCard /></div>
        <div className="balance-content">
          <p className="balance-label">{selectedWalletId === "all" ? "Total Balance (All Wallets)" : "Current Balance"}</p>
          <h2 className={`balance-value ${totals.balance < 0 ? 'negative' : 'positive'}`}>
            {totals.balance < 0 ? '-': '+'}${Math.abs(totals.balance).toFixed(2)}
          </h2>
        </div>
      </div>

      {/* income card */}
      <div className="balance-card balance-income">
        <div className="balance-icon"><BiLineChart /></div>
        <div className="balance-content">
          <p className="balance-label">Total Income</p>
          <h2 className="balance-value positive">
            +${totals.income.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* expenses card */}
      <div className="balance-card balance-expense">
        <div className="balance-icon"><BiLineChartDown /></div>
        <div className="balance-content">
          <p className="balance-label">Total Expenses</p>
          <h2 className="balance-value negative">
            -${totals.expense.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Balance;
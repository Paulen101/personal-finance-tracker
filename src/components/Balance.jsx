import React from "react";
import { useFinance } from "../context/FinanceContext";
import { BiLineChart, BiLineChartDown } from "react-icons/bi";
import { FaCreditCard } from 'react-icons/fa';
import "./Balance.css";

function Balance() {
  const { wallets, selectedWalletId } = useFinance();

  // temp fix
  let balance = 0;
  let income = 0;
  let expense = 0;

  if (selectedWalletId === "all") {
    wallets.forEach((wallet) => {
      wallet.transactions.forEach((t) => {
        if (t.type === "income") {
          income += t.amount;
          balance += t.amount;
        } else {
          expense += t.amount;
          balance -= t.amount;
        }
      });
    });
  } else {
    const currentWallet = wallets.find((w) => w.id === selectedWalletId);
    currentWallet?.transactions?.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
        balance += t.amount;
      } else {
        expense += t.amount;
        balance -= t.amount;
      }
    });
  }

  return (
    <div className="balance-summary">
      <div className="balance-card balance-total">
        <div className="balance-icon"><FaCreditCard /></div>
        <div className="balance-content">
          <p className="balance-label">{selectedWalletId === "all" ? "Total Balance (All Wallets)" : "Current Balance"}</p>
          <h2 className={`balance-value ${balance < 0 ? 'negative' : 'positive'}`}>
            ${balance.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="balance-card balance-income">
        <div className="balance-icon"><BiLineChart /></div>
        <div className="balance-content">
          <p className="balance-label">Total Income</p>
          <h2 className="balance-value positive">
            +${income.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="balance-card balance-expense">
        <div className="balance-icon"><BiLineChartDown /></div>
        <div className="balance-content">
          <p className="balance-label">Total Expenses</p>
          <h2 className="balance-value negative">
            -${Math.abs(expense).toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Balance;
import React, { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { BiLineChart, BiLineChartDown } from "react-icons/bi";
import { FaCreditCard } from 'react-icons/fa';
import "./Balance.css";

function Balance() {
  const { income, expense, wallets, selectedWalletId } = useFinance();
  // balance for all is more annoying to implement in finance context so this will do
  const [balance, setBalance] = useState(0); 

  useEffect(() => {
    let totalBalance= 0;

    if (selectedWalletId === "all") {
      wallets.forEach(wallet => {
        totalBalance += wallet.balance || 0;
      });
    } else {
      const currentWallet = wallets.find(w => w.id === selectedWalletId);
      if (currentWallet) {
        totalBalance = currentWallet.balance || 0;
      }
    }

    setBalance(totalBalance);
  }, [wallets, selectedWalletId]);

  return (
    <div className="balance-summary">
      <div className="balance-card balance-total">
        <div className="balance-icon"><FaCreditCard /></div>
        <div className="balance-content">
          <p className="balance-label">{selectedWalletId === "all" ? "Total Balance (All Wallets)" : "Current Balance"}</p>
          <h2 className={`balance-value ${balance < 0 ? 'negative' : 'positive'}`}>
            {balance < 0 ? '-': '+'}${Math.abs(balance).toFixed(2)}
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
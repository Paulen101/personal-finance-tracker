import React from "react";
import { useFinance } from "../context/FinanceContext";
import "./WalletDetails.css";

function WalletDetails() {
  const { wallets, selectedWalletId } = useFinance();

  const currentWallet = wallets.find(w => w.id === selectedWalletId);

  if (!currentWallet) {
    return (
      <div className="wallet-details-empty">
        <p>No wallet selected</p>
      </div>
    );
  }

  const balance = currentWallet.transactions.reduce((total, transaction) => {
    return transaction.type === "income"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

  // Calculate spending by category for pie chart
  const categorySpending = {};
  currentWallet.transactions
    .filter(tx => tx.type === "expense")
    .forEach(tx => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

  const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);

  return (
    <div className="wallet-details">
      <h2>Wallet Details</h2>
      
      <div className="wallet-details-card">
        <div className="wallet-card-visual">
          <div className="wallet-card-chip"></div>
          <p className="wallet-card-name">{currentWallet.name}</p>
          <p className="wallet-card-number">{currentWallet.cardNumber}</p>
          <div className="wallet-card-bottom">
            <div>
              <small>EXPIRES</small>
              <p>{currentWallet.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="wallet-balance-section">
          <h3>Current Balance</h3>
          <p className={`wallet-balance-amount ${balance < 0 ? 'negative' : ''}`}>
            ${balance.toFixed(2)}
          </p>
        </div>

        {/* Spending breakdown */}
        {totalSpending > 0 && (
          <div className="wallet-spending-breakdown">
            <h3>Spending by Category</h3>
            <div className="category-bars">
              {Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = ((amount / totalSpending) * 100).toFixed(1);
                  return (
                    <div key={category} className="category-bar-item">
                      <div className="category-bar-label">
                        <span>{category}</span>
                        <span>${amount.toFixed(2)} ({percentage}%)</span>
                      </div>
                      <div className="category-bar-bg">
                        <div 
                          className="category-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletDetails;
import React from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash } from "react-icons/fa";
import "./WalletTransactions.css";

function WalletTransactions() {
  const { wallets, selectedWalletId, deleteTransaction } = useFinance();

  const currentWallet = wallets.find(w => w.id === selectedWalletId);

  if (!currentWallet) {
    return null;
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const sortedTransactions = [...currentWallet.transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="wallet-transactions">
      <h2>Transactions</h2>
      
      {sortedTransactions.length === 0 ? (
        <p className="no-transactions">No transactions yet for this wallet.</p>
      ) : (
        <div className="transaction-list">
          {sortedTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-left">
                <span className="transaction-category">{transaction.category}</span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
                {transaction.description && (
                  <span className="transaction-description">{transaction.description}</span>
                )}
              </div>
              
              <div className="transaction-right">
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                  {/* {transaction.amount >= 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}       alternative method */}
                </span>
                <button
                  onClick={() => deleteTransaction(currentWallet.id, transaction.id)}
                  className="transaction-delete-btn"
                  title="Delete transaction"
                >
                  <FaTrash/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WalletTransactions;
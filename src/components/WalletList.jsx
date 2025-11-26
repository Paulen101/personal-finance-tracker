import React from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash } from "react-icons/fa";
import "./WalletList.css";

function WalletList() {
  const { wallets, selectedWalletId, setSelectedWalletId, deleteWallet } =
    useFinance();

  const calculateWalletBalance = (wallet) => {
    return wallet.transactions.reduce((total, transaction) => {
      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  };

  const handleDelete = (e, walletId) => {
    e.stopPropagation();
    deleteWallet(walletId);
  };

  return (
    <div className="wallet-list-container">
      <h2>My Wallets</h2>

      {wallets.length === 0 ? (
        <p className="wallet-list-empty">
          No wallets yet. Create your first wallet!
        </p>
      ) : (
        <div className="wallet-list">
          {wallets.map((wallet) => {
            const balance = calculateWalletBalance(wallet);
            const isActive = wallet.id === selectedWalletId;

            return (
              <div
                key={wallet.id}
                onClick={() => setSelectedWalletId(wallet.id)}
                className={`wallet-card ${isActive ? "active" : ""}`}
              >
                <div className="wallet-card-header">
                  <h3>{wallet.name}</h3>
                  <button
                    onClick={(e) => handleDelete(e, wallet.id)}
                    className="wallet-delete-btn"
                    title="Delete Wallet"
                  >
                    <FaTrash/>
                  </button>
                </div>
                <p
                  className={`wallet-balance ${balance < 0 ? "negative" : ""}`}
                >
                  ${balance.toFixed(2)}
                </p>
                <p className="wallet-transaction-count">
                  {wallet.transactions.length} transaction
                  {wallet.transactions.length !== 1 ? "s" : ""}
                </p>
                {isActive && (
                  <span className="wallet-active-badge">✓ Active Wallet</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WalletList;

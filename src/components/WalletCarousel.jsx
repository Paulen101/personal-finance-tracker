import React from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash } from "react-icons/fa";
import "./WalletCarousel.css";

function WalletCarousel() {
  const { wallets, selectedWalletId, setSelectedWalletId, deleteWallet } = useFinance();

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

  if (wallets.length === 0) {
    return (
      <div className="wallet-carousel-empty">
        <p>No wallets yet. Create your first wallet!</p>
      </div>
    );
  }

  return (
    <div className="wallet-carousel">
      <div className="wallet-carousel-scroll">
        {wallets.map((wallet) => {
          const balance = calculateWalletBalance(wallet);
          const isActive = wallet.id === selectedWalletId;

          const displayCardNumber = wallet.cardNumber 
            ? wallet.cardNumber
            : `**** **** **** ${String(wallet.id).padStart(4, '0')}`;

          return (
            <div
              key={wallet.id}
              onClick={() => setSelectedWalletId(wallet.id)}
              className={`wallet-mini-card ${isActive ? 'active' : ''}`}
            >
              <button
                onClick={(e) => handleDelete(e, wallet.id)}
                className="wallet-mini-card-delete"
                title="Delete wallet"
              >
                <FaTrash/>
              </button>
              
              <div className="wallet-mini-card-content">
                <p className="wallet-mini-name">{wallet.name}</p>
                <p className="wallet-mini-balance">
                  {balance < 0 ? "-" : "+"}${Math.abs(balance).toFixed(2)}
                </p>
                <p className="wallet-mini-cardnumber">
                  {displayCardNumber}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WalletCarousel;
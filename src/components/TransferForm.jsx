import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { FcMoneyTransfer } from "react-icons/fc";
import "./TransferForm.css";

function TransferForm() {
  const { wallets, transferBetweenWallets } = useFinance();
  
  // state initialization 
  const [fromWalletId, setFromWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromWalletId || !toWalletId) {
      alert("Please select both wallets!");
      return;
    }

    const success = transferBetweenWallets(
      Number(fromWalletId),
      Number(toWalletId),
      amount,
      description
    );

    if (success) {
      setFromWalletId("");
      setToWalletId("");
      setAmount("");
      setDescription("");
      setShowForm(false);
      alert("Transfer completed successfully!");
    }
  };

  const getAvailableBalance = () => {
    if (!fromWalletId) return 0;
    const wallet = wallets.find(w => w.id === Number(fromWalletId));
    if (!wallet) return 0;
    return wallet.transactions.reduce((total, transaction) => {
      return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
    }, 0);
  };

  const availableBalance = getAvailableBalance();

  return (
    <div className="transfer-form-container">
      {/* show button when not clicked */}
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="transfer-form-open-btn"
          disabled={wallets.length < 2}
        >
          <FcMoneyTransfer className="FaIcon"/> Transfer Between Wallets
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="transfer-form">
          <h3>Transfer Money</h3>
          
          {/* source wallet */}
          <div className="form-group">
            <label htmlFor="fromWalletId">From Wallet:</label>
            <select
              id="fromWalletId"
              value={fromWalletId}
              onChange={(e) => setFromWalletId(e.target.value)}
              required
              className="transfer-form-select"
            >
              <option value="">Select Source Wallet</option>
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </option>
              ))}
            </select>
            {fromWalletId && (
              <small className="balance-info">
                Available: ${availableBalance.toFixed(2)}
              </small>
            )}
          </div>

          {/* destination wallet */}
          <div className="form-group">
            <label htmlFor="toWalletId">To Wallet:</label>
            <select
              id="toWalletId"
              value={toWalletId}
              onChange={(e) => setToWalletId(e.target.value)}
              required
              className="transfer-form-select"
            >
              <option value="">Select Destination Wallet</option>
              {wallets
                .filter(wallet => wallet.id !== Number(fromWalletId))
                .map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
            </select>
          </div>

          {/* amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="transfer-form-input"
            />
          </div>

          {/* description */}
          <div className="form-group">
            <label htmlFor="description">Description (Optional):</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g., Monthly savings"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transfer-form-input"
            />
          </div>

          <div className="transfer-form-buttons">
            <button type="submit" className="transfer-form-submit-btn">
              Transfer
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowForm(false);
                setFromWalletId("");
                setToWalletId("");
                setAmount("");
                setDescription("");
              }}
              className="transfer-form-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {wallets.length < 2 && !showForm && (
        <p className="transfer-form-warning">
          You need at least 2 wallets to make a transfer
        </p>
      )}
    </div>
  );
}

export default TransferForm;
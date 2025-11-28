import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import "./WalletForm.css";

function WalletForm() {
  const { addWallet } = useFinance();
  
  // state initialize 
  const [walletName, setWalletName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!walletName.trim()) {
      alert("Please enter a wallet name!");
      return;
    }

    addWallet({ name: walletName.trim()});

    setWalletName("");
    setShowForm(false);

    alert(`Wallet "${walletName}" created successfully!`);
  };

  return (
    <div className="wallet-form-container">
      {/* show btn when not clicked */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="wallet-form-create-btn"
        >
          + Create New Wallet
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="wallet-form">
          {/* wallet form */}
          <h3>Create New Wallet</h3>
          <input
            type="text"
            placeholder="Wallet Name (e.g., Savings, Cash)"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="wallet-form-input"
            id="walletName"
            name="walletName"
          />
          <div className="wallet-form-buttons">
            <button type="submit" className="wallet-form-submit-btn">
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setWalletName("");
              }}
              className="wallet-form-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default WalletForm;

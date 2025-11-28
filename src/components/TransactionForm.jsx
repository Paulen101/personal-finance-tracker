import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import "./TransactionForm.css";

function TransactionForm() {
  const { addTransaction, selectedWalletId } = useFinance();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [showForm, setShowForm] = useState(false);

  const categories = [
    "Food",
    "Transportation",
    "Salary",
    "Entertainment",
    "Rent",
    "Bills",
    "Gift",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedWalletId===null || selectedWalletId === "all") {
      alert("Please select a specific wallet!");
      return;
    }

    if (amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const newTransaction = {
      type,
      category,
      amount: parseFloat(amount),
    };

    addTransaction(Number(selectedWalletId), newTransaction);

    setAmount("");
    setCategory("");
    setShowForm(false);
    alert("Transaction added successfully!");
  };

  return (
    <div className="transaction-form-container">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="transaction-form-open-btn"
          disabled={selectedWalletId == null || selectedWalletId === "all"}
        >
          + Add Transaction
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="transaction-form">
          <h3>Add New Transaction</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="transaction-form-select"
                id="type"
                name="type"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="transaction-form-select"
                id="category"
                name="category"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Amount:</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="transaction-form-input"
              />
            </div>
          </div>

          <div className="transaction-form-buttons">
            <button type="submit" className="transaction-form-submit-btn">
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setAmount("");
                setCategory("");
              }}
              className="transaction-form-cancel-btn"
            >
              Cancel
            </button>
          </div>

          {selectedWalletId === "all" && (
            <p className="transaction-form-warning">
              Please select a specific wallet to add a transaction.
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default TransactionForm;

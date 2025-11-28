import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import "./TransactionForm.css";

function TransactionForm() {
  const { addTransaction, selectedWalletId } = useFinance();

  // state initialization
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");         // custom category so it can work with budget's custom category
  const [type, setType] = useState("expense");
  const [showForm, setShowForm] = useState(false);

  // category list 
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

    // if custom category empty then use other else use the custom category
    const finalCategory = 
      category === "Other" && customCategory.trim() !== ""
        ? customCategory.trim()
        : category;
  
    const newTransaction = {
      type,
      category:finalCategory,
      amount:parseFloat(amount),
    };  

    addTransaction(Number(selectedWalletId), newTransaction);

    // reset state 
    setCustomCategory("") 
    setAmount("");
    setCategory("");
    setShowForm(false);
    alert("Transaction added successfully!");
  };

  return (
    <div className="transaction-form-container">
      {/* show button when not pressed */}
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
          {/* form component */}
          <h3>Add New Transaction</h3>

          <div className="form-row">
            {/* type */}
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

            {/* category */}
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

            {/* custom category appear when other is selected */}
            {category === "Other" && (
              <div className="form-group">
                <label htmlFor="customCategory">Custom Category Name (optional):</label>
                <input
                  type="text"
                  id="customCategory"
                  name="customCategory"
                  placeholder="Enter custom name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="transaction-form-input"
                />
              </div>
            )}

            {/* amount */}
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="transaction-form-input"
                id="amount"
                name="amount"
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

import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function TransactionForm() {
  const { addTransaction, selectedWalletId } = useFinance();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const categories = [
    "Food",
    "Transport",
    "Salary",
    "Entertainment",
    "Rent",
    "Bills",
    "Gift",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const newTransaction = {
      type,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
    };

    addTransaction(selectedWalletId, newTransaction);

    setAmount("");
    setCategory("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default TransactionForm;

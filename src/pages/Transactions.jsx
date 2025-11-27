import React from "react";
import Balance from "../components/Balance";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import "./Transactions.css";

function Transaction() {
  return (
    <div className="transaction">
      <div className="transaction">
        <h1>Transactions</h1>
        <p className="transaction-subtitle">Track and manage your expenses and income</p>
      </div>

      <Balance />
      <TransactionForm />
      <TransactionList />
    </div>
  );
}

export default Transaction;
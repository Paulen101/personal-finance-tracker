import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash, FaSearch } from "react-icons/fa";
import "./TransactionList.css";

function TransactionList() {
  const { wallets, selectedWalletId, setSelectedWalletId, deleteTransaction } =
    useFinance();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredType, setFilteredType] = useState("all");
  const [sortOrder, setSortOrder] = useState("dateDesc");

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  const generateTransactionId = (walletId, transactionId) => {
    return `TXN-${walletId}${String(transactionId).padStart(4, '0')}`;
  };

  let displayedTransactions = [];

  if (selectedWalletId === "all") {
    wallets.forEach((wallet) => {
      wallet.transactions.forEach((transaction) => {
        displayedTransactions.push({
          ...transaction,
          walletName: wallet.name,
          walletId: wallet.id,
        });
      });
    });
  } else {
    const currentWallet = wallets.find(
      (wallet) => wallet.id === Number(selectedWalletId)
    );

    displayedTransactions =
      currentWallet?.transactions.map((transaction) => ({
        ...transaction,
        walletName: currentWallet.name,
        walletId: currentWallet.id,
      })) || [];
  }

  if (searchQuery.trim() !== "") {
    displayedTransactions = displayedTransactions.filter((transaction) =>
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filteredType !== "all") {
    displayedTransactions = displayedTransactions.filter(
      (transaction) => transaction.type === filteredType
    );
  }

  displayedTransactions.sort((a, b) => {
    if (sortOrder === "dateAsc") return new Date(a.date) - new Date(b.date);
    if (sortOrder === "dateDesc") return new Date(b.date) - new Date(a.date);
    if (sortOrder === "amountAsc") return a.amount - b.amount;
    if (sortOrder === "amountDesc") return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="transaction-list-container">
      <div className="transaction-top-row">
        <h2>Transaction History</h2>

        <div className="transaction-top-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
            className="transaction-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="transaction-select"
          >
            <option value="dateDesc">Date: Newest</option>
            <option value="dateAsc">Date: Oldest</option>
            <option value="amountDesc">Amount: High → Low</option>
            <option value="amountAsc">Amount: Low → High</option>
          </select>

          <select
            value={selectedWalletId}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            className="transaction-select"
          >
            <option value="all">All Wallets</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="transaction-table-header">
        <span>Transaction ID</span>
        <span>Category</span>
        <span>Amount</span>
        <span>Type</span>
        <span>Date</span>
        {selectedWalletId === "all" && <span>Wallet</span>}
        <span>Action</span>
      </div>

      <div className="transaction-table-body">
        {displayedTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          displayedTransactions.map((transaction) => (
            <div className="transaction-row" key={transaction.id}>
              <span>{generateTransactionId(transaction.walletId, transaction.id)}</span>
              <span>{transaction.category}</span>
              <span className={transaction.type}>
                {transaction.type === "income" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </span>
              <span className={`type-badge ${transaction.type}`}>
                {transaction.type}
              </span>
              <span>{formatDate(transaction.date)}</span>

              {selectedWalletId === "all" && (
                <span className="wallet-name">{transaction.walletName}</span>
              )}

              <button
                onClick={() =>
                  deleteTransaction(transaction.walletId, transaction.id)
                }
                className="transaction-delete-btn"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;

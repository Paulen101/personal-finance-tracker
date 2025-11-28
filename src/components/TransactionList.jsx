import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash, FaSearch, FaRegStickyNote } from "react-icons/fa";
import "./TransactionList.css";

function TransactionList() {
  const { wallets, selectedWalletId, setSelectedWalletId, deleteTransaction } =
    useFinance();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredType, setFilteredType] = useState("all");
  const [sortOrder, setSortOrder] = useState("dateDesc");

  const formatDate = (date) => {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} ${timeStr}`;
  };

  // Select wallet
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
      (wallet) => wallet.id === selectedWalletId
    );
    displayedTransactions = currentWallet?.transactions || [];
    displayedTransactions = displayedTransactions.map((tx) => ({
      ...tx,
      walletName: currentWallet.name,
      walletId: currentWallet.id,
    }));
  }

  // Search
  if (searchQuery.trim() !== "") {
    displayedTransactions = displayedTransactions.filter((transaction) =>
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter
  if (filteredType !== "all") {
    displayedTransactions = displayedTransactions.filter(
      (transaction) => transaction.type === filteredType
    );
  }

  // Sort
  displayedTransactions.sort((a, b) => {
    if (sortOrder === "dateAsc") return new Date(a.date) - new Date(b.date);
    if (sortOrder === "dateDesc") return new Date(b.date) - new Date(a.date);
    if (sortOrder === "amountAsc") return a.amount - b.amount;
    if (sortOrder === "amountDesc") return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="transaction-list-container">
      {/* Top Row: Title and Filters */}
      <div className="transaction-top-row">
        <h2>Transaction History</h2>

        <div className="transaction-top-filters">
          {/* Search Box */}
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="searchQuery"
              name="searchQuery"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
            className="transaction-select"
            id="filteredType"
            name="filteredType"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="transaction-select"
            id="sortOrder"
            name="sortOrder"
          >
            <option value="dateDesc">Date: Newest</option>
            <option value="dateAsc">Date: Oldest</option>
            <option value="amountDesc">Amount: High to Low</option>
            <option value="amountAsc">Amount: Low to High</option>
          </select>

          {/* Wallet Selector */}
          <select
            value={selectedWalletId}
            onChange={(e) =>
              e.target.value === "all"
                ? setSelectedWalletId("all")                  // keep "all" as string
                : setSelectedWalletId(Number(e.target.value)) // convert to number
            }
            className="transaction-select"
            id="selectedWalletId"
            name="selectedWalletId"
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

      {/* Table Header */}
      <div
        className={`transaction-table-header ${
          selectedWalletId === "all" ? "with-wallet" : ""
        }`}
      >
        <span>Transaction ID</span>
        {selectedWalletId === "all" && <span>Wallet</span>}
        <span>Category</span>
        <span className="amount-header">Amount</span>
        <span className="type-header">Type</span>
        <span className="date-header">Date</span>
        <span className="action-header">Action</span>
      </div>

      {/* Table Body */}
      <div className="transaction-table-body">
        {displayedTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FaRegStickyNote className="FaIcon"/></div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`transaction-row ${
                selectedWalletId === "all" ? "with-wallet" : ""
              }`}
            >
              <span className="transaction-id" title={`TXN-${transaction.id}`}>
                TXN-{transaction.id}
              </span>

              {selectedWalletId === "all" && (
                <span className="wallet-name">{transaction.walletName}</span>
              )}

              <span className="category-cell">{transaction.category}</span>

              <span className={`amount-cell ${transaction.type}`}>
                {transaction.type === "income" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </span>

              <span className="type-cell">
                <span className={`type-badge ${transaction.type}`}>
                  {transaction.type}
                </span>
              </span>

              <span className="date-cell">{formatDate(transaction.date)}</span>

              <span>
                <button
                  onClick={() =>
                    deleteTransaction(transaction.walletId, transaction.id)
                  }
                  className="transaction-delete-btn"
                  title="Delete transaction"
                >
                  <FaTrash />
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;

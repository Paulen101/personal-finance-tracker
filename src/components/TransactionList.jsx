import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash } from "react-icons/fa";

function TransactionList() {
  const { wallets, selectedWalletId, setSelectedWalletId, deleteTransaction } =
    useFinance();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredType, setFilteredType] = useState("all");
  const [sortOrder, setSortOrder] = useState("dateDesc");

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  //select wallet
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

  //Filter
  if (filteredType !== "all") {
    displayedTransactions = displayedTransactions.filter(
      (transaction) => transaction.type === filteredType
    );
  }

  //Display sorted output
  displayedTransactions.sort((a, b) => {
    if (sortOrder === "dateAsc") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortOrder === "dateDesc") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortOrder === "amountAsc") {
      return a.amount - b.amount;
    }
    if (sortOrder === "amountDesc") {
      return b.amount - a.amount;
    }
    return 0;
  });

  return (
    <div>
      <h2>Transactions</h2>

      {/* wallet switch */}
      <select
        value={selectedWalletId}
        onChange={(e) => setSelectedWalletId(e.target.value)}
      >
        <option value="all">All Wallets</option>
        {wallets.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>

      <form>
        {/* search by category */}
        <input
          type="search"
          placeholder="Search by category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* filter by type */}
        <select
          value={filteredType}
          onChange={(e) => setFilteredType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {/* sort by date or amount */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="dateDesc">Date: Newest</option>
          <option value="dateAsc">Date: Oldest</option>
          <option value="amountDesc">Amount: High to Low</option>
          <option value="amountAsc">Amount: Low to High</option>
        </select>
      </form>

      {/* transaction list display */}
      {displayedTransactions.map((transaction) => (
        <div key={transaction.id}>
          {transaction.id} - {transaction.category} - ${transaction.amount} -{" "}
          {formatDate(transaction.date)}
          <button
            onClick={() =>
              deleteTransaction(transaction.walletId, transaction.id)
            }
          >
            <FaTrash color="red" />
          </button>
        </div>
      ))}
      {displayedTransactions.length === 0 && <p>No transactions yet.</p>}
    </div>
  );
}

export default TransactionList;

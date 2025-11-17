import React from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash } from "react-icons/fa";

function TransactionList() {
  const { wallets, selectedWalletId, deleteTransaction } = useFinance();

  const currentWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId
  );

  return (
    <div>
      <h2>Transactions</h2>
      {currentWallet?.transactions?.map((transaction) => (
        <div key={transaction.id}>
          {transaction.date} - {transaction.category} - ${transaction.type} - {transaction.amount}
          <button onClick={() => deleteTransaction(currentWallet.id, transaction.id)}>
            <FaTrash color='red'/>
          </button>
        </div>
      ))}
      {!currentWallet?.transactions?.length && <p>No transactions yet.</p>}
    </div>
  );
}

export default TransactionList;

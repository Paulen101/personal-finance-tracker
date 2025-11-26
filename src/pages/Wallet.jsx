import React from "react";
import WalletForm from "../components/WalletForm";
import WalletCarousel from "../components/WalletCarousel";
import WalletDetails from "../components/WalletDetails";
import WalletTransactions from "../components/WalletTransactions";
import TransferForm from "../components/TransferForm";
import "./Wallet.css";

function Wallet() {
  return (
    <div className="wallet">
      <div className="wallet-header">
        <h1>Wallet Management</h1>
        <WalletForm />
      </div>
      
      <WalletCarousel />
      <TransferForm />
      <WalletDetails />
      <WalletTransactions />
    </div>
  );
}

export default Wallet;

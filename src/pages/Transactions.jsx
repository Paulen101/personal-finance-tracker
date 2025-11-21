import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Balance from "../components/Balance";
import { useFinance } from "../context/FinanceContext";

function Transactions() {

  return (
    <>
      <Balance />
      <TransactionForm />
      <TransactionList />
    </>
  );
}

export default Transactions;

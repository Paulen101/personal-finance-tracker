import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

function Expenses() {
  return (
    <>
      <h1>Expenses Page</h1>
      <TransactionForm />
      <TransactionList />
    </>
  );
}

export default Expenses;

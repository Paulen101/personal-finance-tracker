import { useFinance } from "../context/FinanceContext";

function Balance() {
  const { balance, income, expense } = useFinance();

  return (
    <div>
      <h1>Balance Summary</h1>
      <div>
        <h2>Balance: ${balance.toFixed(2)}</h2>
        <h2>Income: ${income}</h2>
        <h2>Expense: ${expense}</h2>
      </div>
    </div>
  );
}

export default Balance;

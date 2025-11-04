import React, {useContext} from "react";
import { AppContext } from "../../AppContext";
import './dashboard.css'

const ExpensesSummary = ({Tempwallets}) => { 
{/* NOTE: insert expenses function from analytics, if possible */}
{/* otherwise define later */}
  return (
    <div className="expensesSummary">
      
    </div>
  )
}

const HistorySummary = ({Tempwallets}) => { 
{/* NOTE: insert expenses function from analytics, if possible */}
{/* otherwise define later */}
  return (
    <div className="historySummary">
      {/* just show the last 5 transactions for now */}
      <progress value={0} />
    </div>
  )
}

function Dashboard() {
  // temp dummy 
  // maybe move to component or delete later
  const { addWallets, addBudgets } = useContext(AppContext);
  const Tempwallets = [
  {
    accountID: 0,
    accountName: "Cash",
    balance: 120.00,
    transactions: [
      { id: 1, type: "expense", amount: 20, category: "Food" },
      { id: 2, type: "income", amount: 50, category: "Gift" }
    ]
  },
  {
    accountID: 1,
    accountName: "Bank",
    balance: 900.00,
    transactions: [
      { id: 3, type: "expense", amount: 200, category: "Rent" }
    ]
  }
  ];

  const Tempbudgets = [
    {
      id: 1,
      walletID: 0,
      category: "Food",
      limit: 200,
      spent: 0,
    },
    {
      id: 2,
      walletID: null,       // -1 or null = global category budget   note: overlapping local category budget and global category budget, should prioritize using local category budget for that wallet
      category: "Entertainment",
      limit: 150,
      spent: 0,
    },
  ];

  // Add wallets
  Tempwallets.forEach(w => addWallets(w));

  // Add budgets
  Tempbudgets.forEach(b => addBudgets(b));

  return (
    <div className="dashboardWrapper">
      {/* NOTE: insert expenses function from analytics, if possible */}
      <ExpensesSummary Tempwallets = {Tempwallets}/>

      <HistorySummary Tempwallets = {Tempwallets}/>

      <div className="budgetSummary">
        {/* takes values inserted into budget */}
        <progress value={0} />
      </div>
      
      <div className="budgetReminder">
        {/* don't know what to fully do for this maybe a quick budget set up or just a line that changes dynically on the budget status */}
        <progress value={0} />
      </div>
    </div>
  );
}

export default Dashboard;

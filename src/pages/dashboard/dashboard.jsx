import React, {useState, useContext, useLayoutEffect} from "react";
import { AppContext } from "../../AppContext";
import { HistorySummary } from "../../components/HistorySummary"
import { TotalSummary } from "../../components/TotalSummary"
import { ExpensesSummary } from "../../components/ExpensesSummary"
import { BudgetReminder } from "../../components/BudgetSummary"
import './dashboard.css'

// just temp files to test data
const Tempwallets = [
    {
      accountID: 0,
      accountName: "Cash",
      balance: 120.0,
      transactions: [
        { id: 11, type: "expense", amount: 20, category: "Food", date: "2025-11-01T10:30:00Z" },
        { id: 12, type: "expense", amount: 50, category: "Food", date: "2025-11-01T14:00:00Z" },
        { id: 13, type: "expense", amount: 20, category: "Food", date: "2025-11-01T10:30:00Z" },
        { id: 14, type: "expense", amount: 50, category: "Food", date: "2025-11-01T14:00:00Z" },
        { id: 15, type: "expense", amount: 20, category: "Food", date: "2025-11-01T10:30:00Z" },
        { id: 16, type: "expense", amount: 50, category: "Food", date: "2025-11-01T14:00:00Z" },
        { id: 1, type: "expense", amount: 20, category: "Food", date: "2025-11-01T10:30:00Z" },
        { id: 2, type: "expense", amount: 50, category: "Food", date: "2025-11-01T14:00:00Z" },
        { id: 3, type: "expense", amount: 30, category: "Food", date: "2025-11-02T09:00:00Z" },
        { id: 4, type: "expense", amount: 10, category: "Rent", date: "2025-11-03T12:00:00Z" },
        { id: 5, type: "expense", amount: 40, category: "Food", date: "2025-11-04T08:00:00Z" },
        { id: 6, type: "income", amount: 15, category: "Work", date: "2025-11-05T11:00:00Z" },
        { id: 7, type: "income", amount: 20, category: "Work", date: "2025-11-01T10:30:00Z" },
        { id: 8, type: "expense", amount: 10, category: "Rent", date: "2025-11-06T12:00:00Z" },
        { id: 9, type: "expense", amount: 40, category: "Food", date: "2025-11-07T08:00:00Z" },
        { id: 17, type: "expense", amount: 40, category: "Transport", date: "2025-11-07T08:00:00Z" },
        { id: 18, type: "expense", amount: 40, category: "Health", date: "2025-11-07T08:00:00Z" },
        { id: 19, type: "expense", amount: 100, category: "Gambling", date: "2025-11-07T08:00:00Z" },
        { id: 20, type: "expense", amount: 40, category: "Rent", date: "2025-11-07T08:00:00Z" },
        { id: 21, type: "expense", amount: 10, category: "Utilities", date: "2025-11-07T08:00:00Z" },
        { id: 10, type: "income", amount: 15, category: "Work", date: "2025-11-08T11:00:00Z" },
      ]
    },
    {
      accountID: 1,
      accountName: "Bank",
      balance: 900.0,
      transactions: [
        { id: 1, type: "expense", amount: 200, category: "Rent", date: "2025-11-02T08:00:00Z" }
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
    dateSet: "2025-11-02T08:00:00Z"
  },
  {
    id: 3,
    walletID: 0,
    category: "Pet",
    limit: 200,
    spent: 0,
    dateSet: "2025-11-02T08:00:00Z"
  },
  {
    id: 2,
    walletID: null,       // -1 or null = global category budget   note: overlapping local category budget and global category budget, should prioritize using local category budget for that wallet
    category: "Entertainment",
    limit: 150,
    spent: 0,
    dateSet: "2025-11-02T08:00:00Z"
  },
];

function Dashboard() {
  // temp dummy 
  // maybe move to component or delete later
  const {  wallets, budgets, addWallets, addBudgets, isLoaded } = useContext(AppContext);
  const [selectedWalletID, setSelectedWalletID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const selectedWallet = wallets.find(w => w.accountID === selectedWalletID);
  const selectedBudgets = budgets.filter(b => b.walletID === selectedWalletID || b.walletID === null);

  // Use useEffect to block render until wallets/budgets are loaded
  useLayoutEffect(() => {
    if (!isLoaded) return;

    // Initialize temp data if nothing in localStorage <- remove this part later 
    // if (wallets.length === 0) {
    //   addWallets(Tempwallets);
    // }

    // Set initial selected wallet
    if (wallets.length > 0) {
      setSelectedWalletID(wallets[0].accountID);
    }

    // if (budgets.length === 0)    // <- remove this part later 
    //   addBudgets(Tempbudgets);
  }, [isLoaded, wallets, wallets.length, budgets.length, addWallets, addBudgets]);

  return (
    <div className="dashboardWrapper">
      {!isLoaded ? (
        <div className="loadingOverlay">Loading wallets...</div>    // <- will design / redesign loading later 
      ) : (
        <>
          {/* NOTE: insert expenses function from analytics, if possible */}
          <ExpensesSummary wallets = {selectedWallet} onSelectDate={setSelectedDate}/>

          <TotalSummary wallets  = {selectedWallet} />

          <HistorySummary wallets = {selectedWallet}  selectedDate={selectedDate}/>
          
          <BudgetReminder budgets = {selectedBudgets}/>
        </>
      )}
    </div>
  );
}

export default Dashboard;

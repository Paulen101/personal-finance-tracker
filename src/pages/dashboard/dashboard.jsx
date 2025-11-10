import React, {useState, useContext, useLayoutEffect} from "react";
import { AppContext } from "../../AppContext";
import { HistorySummary } from "../../components/HistorySummary"
import { TotalSummary } from "../../components/TotalSummary"
import './dashboard.css'

const ExpensesSummary = ({wallets}) => { 
// NOTE: insert expenses function from analytics, if possible
// otherwise define later
  return (
    <div className="expensesSummary">
      (INSERT CHART FUNCTION HERE LATER)
    </div>
  )
}

const BudgetReminder = ({budgets}) => { 
// don't know what to fully do for this maybe a quick budget set up or just a line that changes dynically on the budget status 
  return (
    <div className="budgetReminder">
      <progress value={0} />
    </div>
  )
}

// just temp files to test data
const Tempwallets = [
    {
      accountID: 0,
      accountName: "Cash",
      balance: 120.0,
      transactions: [
        { id: 1, type: "expense", amount: 20, category: "Food", date: "2025-11-01T10:30:00Z" },
        { id: 2, type: "expense", amount: 50, category: "Food", date: "2025-11-01T14:00:00Z" },
        { id: 3, type: "expense", amount: 30, category: "Food", date: "2025-11-02T09:00:00Z" },
        { id: 4, type: "expense", amount: 10, category: "Rent", date: "2025-11-03T12:00:00Z" },
        { id: 5, type: "expense", amount: 40, category: "Food", date: "2025-11-04T08:00:00Z" },
        { id: 6, type: "expense", amount: 15, category: "Food", date: "2025-11-05T11:00:00Z" }
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
  const { addWallets, addBudgets, isLoaded } = useContext(AppContext);
  const { wallets, budgets } = useContext(AppContext);
  const [selectedWalletID, setSelectedWalletID] = useState(null);
  
  // const selectedWallet = useMemo(() => {
  //   return wallets.find(w => w.accountID === selectedWalletID);
  // }, [wallets, selectedWalletID]);

  // const selectedBudgets = useMemo(() => {
  // return budgets.filter(
  //     b => b.walletID === selectedWalletID || b.walletID === null
  //   );
  // }, [budgets, selectedWalletID]);

  const selectedWallet = wallets.find(w => w.accountID === selectedWalletID);
  const selectedBudgets = budgets.filter(b => b.walletID === selectedWalletID || b.walletID === null);

  // Use useEffect to block render until wallets/budgets are loaded
  useLayoutEffect(() => {
    if (!isLoaded) return;

    // Initialize temp data if nothing in localStorage
    if (wallets.length === 0) {
      addWallets(Tempwallets);
      setSelectedWalletID(Tempwallets[0].accountID);
    }
    // Set initial selected wallet
    else setSelectedWalletID(wallets[0].accountID);


    if (budgets.length === 0) addBudgets(Tempbudgets);
  }, [isLoaded, wallets.length, budgets.length, addWallets, addBudgets]);

  return (
    <div className="dashboardWrapper">
      {!isLoaded ? (
        <div className="loadingOverlay">Loading wallets...</div>
      ) : (
        <>
          {/* NOTE: insert expenses function from analytics, if possible */}
          <ExpensesSummary wallets = {selectedWallet}/>

          <TotalSummary wallets  = {selectedWallet} />

          <HistorySummary wallets = {selectedWallet}/>
          
          <BudgetReminder budgets = {selectedBudgets}/>
        </>
      )}
    </div>
  );
}

export default Dashboard;

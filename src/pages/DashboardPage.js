import React, {useState} from "react";
import { useFinance } from "../context/FinanceContext";
import { FaChartLine, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';
import { HistorySummary } from '../components/dbcomponents/HistorySummary'
import { TotalSummary } from '../components/dbcomponents/TotalSummary'
import { ExpensesSummary } from '../components/dbcomponents/ExpensesSummary'
import { BudgetReminder } from '../components/dbcomponents/BudgetSummary'
import './DashboardPage.css'

function Dashboard() {
  const {
    getCurrentWallet, 
    getApplicableBudgets,
    selectedWalletId,
    setSelectedWalletId,
    getWalletBalance,
    wallets
  } = useFinance();

  // important state for expenses and total summary component to work together 
  const [selectedDate, setSelectedDate] = useState(null);

  const selectedWallet = getCurrentWallet();
  const selectedBudgets = getApplicableBudgets();

  const [loadingState, setLoadingState] = useState(false)
  const [error, setError] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Check if next month is valid for showing expenses 
  const isNextMonthValid = () => {
    const today = new Date();
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return next > today;   // true = disable arrow
  };

  // Go to previous month
  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(prev);
  };

  // Go to next month
  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(next);
  };

  // for changing wallet
  const handleWalletChange = (walletId) => {
    setLoadingState(true);            
    try {
      setSelectedWalletId(walletId);    // change wallet
    } catch (e) {
      console.error(e);
      setError(e);                     // store the error in state
    }
    finally {
      setLoadingState(false);          // end loading
    }
  };
  
  return (
    <div className="dashboardWrapper">
      {error ? (
        <div className="analytics-error">
          <div className="error-icon"><FaExclamationTriangle className="FaIcon"/></div>
          <h3>Error status: {error.message || error.toString()}</h3>
          <p>An error occurred while processing your data. Please try again.</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Reload Page
          </button>
        </div>
      ) : (
      <>
        {loadingState && (
          <div className="loadingElement">
            <span>Loading...</span>
          </div>
        )}

        <div className="dashboardHeader">
          <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><FaChartLine className="FaIcon"/> Dashboard</h1>
          <p className="dashboardSubtitle">Financial overview</p>
        </div>

        <div className="budget-header">
          <div className="budget-header-top">
            <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><FaCreditCard className="FaIcon"/> Quick Wallet Management</h1>
          </div>
          {/* Wallet Selector */}
          <div className="wallet-selector">
            <label htmlFor="selectedWalletId">Current Wallet:</label>
            <select 
              id="selectedWalletId"
              value={selectedWalletId} 
              onChange={(e) => handleWalletChange(parseInt(e.target.value))}
            >
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} ({getWalletBalance(wallet.id) < 0 ? '-' : ''}${Math.abs(getWalletBalance(wallet.id)).toFixed(2)})
                </option>
              ))} 
            </select>
          </div>
        </div>

        <div className="dashboardBody">
          {/* Expenses summary component card */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Daily Net Balance</h3> {/* can add ({selectedWallet?.name ?? " "}) to show current wallet */}
                <span
                  style={{ cursor: "pointer", userSelect: "none", color:"grey", paddingRight:"5px"}}
                  onClick={() => handlePrevMonth()}
                >
                  ◀
                </span>
                <p className="dashboardSubtitle" >
                  {(() => {
                    let cm = currentMonth;

                    if (!cm || isNaN(new Date(cm).getTime())) {
                      cm = new Date(); // fallback to today
                    } else {
                      cm = new Date(cm); // ensure it’s a real Date object
                    }

                    const now = new Date();
                    const year = cm.getFullYear();
                    const month = cm.getMonth();

                    const start = new Date(year, month, 1);

                    // End date logic
                    const end =
                      year === now.getFullYear() && month === now.getMonth()
                        ? now // current month -> end at today
                        : new Date(year, month + 1, 0); // other months -> end of month

                    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
                  })()}
                </p>
                <span
                  style={{ cursor: isNextMonthValid() ? "not-allowed" : "pointer", userSelect: "none", color:"grey", paddingLeft:"5px", opacity: isNextMonthValid() ? 0.3 : 1}}
                  onClick={() => {
                    if (!isNextMonthValid()) {
                      handleNextMonth();
                    }
                  }}
                >
                  ▶
                </span>
            </div>
            <div className="chart-container">
              <ExpensesSummary wallet = {selectedWallet} onSelectDate={setSelectedDate} currentMonth={currentMonth} onError={setError}/>
            </div>
          </div>
          
          {/* Total summary component card */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Where did your money go?</h3> {/* can add ({selectedWallet?.name ?? " "}) to show current wallet */}
              <p className="dashboardSubtitle">Expenses distribution over the years</p>
            </div>
            <div className="chart-container">
              <TotalSummary wallet  = {selectedWallet} />
            </div>
          </div>

          {/* History summary component card */}
          <div className="chart-card" style={{paddingBottom:"14px"}}>
            <div className="chart-header" style={{marginBottom:"0px"}}>
              <h3>
                {selectedDate
                  ? `Transactions on ${selectedDate}`
                  : "Recent Transactions"}
              </h3>

              <p className="dashboardSubtitle">
                {`Showing ${selectedWallet?.name ? selectedWallet.name : "wallet"}'s past transactions`}
              </p>
            </div>

            <div className="chart-container">
              <HistorySummary wallet={selectedWallet} selectedDate={selectedDate} />
            </div>
          </div>

          {/* Budget reminder component card */}
          <div className="chart-card" style={{paddingLeft:"40px", paddingRight:"40px"}}>
            <div className="chart-container">
              <BudgetReminder budgets = {selectedBudgets}/>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
}

export default Dashboard;

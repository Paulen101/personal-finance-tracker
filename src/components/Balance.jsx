import React from "react";
import { useFinance } from "../context/FinanceContext";
import { BiLineChart, BiLineChartDown } from "react-icons/bi";
import { FaCreditCard } from 'react-icons/fa';
import "./Balance.css";

function Balance() {
  const { balance, income, expense } = useFinance();

  return (
    <div className="balance-summary">
      <div className="balance-card balance-total">
        <div className="balance-icon"><FaCreditCard /></div>
        <div className="balance-content">
          <p className="balance-label">Current Balance</p>
          <h2 className={`balance-value ${balance < 0 ? 'negative' : 'positive'}`}>
            ${balance.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="balance-card balance-income">
        <div className="balance-icon"><BiLineChart /></div>
        <div className="balance-content">
          <p className="balance-label">Total Income</p>
          <h2 className="balance-value positive">
            +${income.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="balance-card balance-expense">
        <div className="balance-icon"><BiLineChartDown /></div>
        <div className="balance-content">
          <p className="balance-label">Total Expenses</p>
          <h2 className="balance-value negative">
            -${expense.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Balance;
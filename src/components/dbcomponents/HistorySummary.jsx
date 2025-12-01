import React, {useMemo, useEffect, useState} from "react";
import { FaUtensils, FaFilm, FaMoneyBillWave, FaBus, FaHome, FaFileInvoice, FaArrowDown, FaArrowUp, FaGift, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import './HistorySummary.css'

// function for displaying the icon
const SpecialIcon = ({ icon: Icon, bgColor = '#f0f0f0', size = 40 }) => {
  return (
    <div
      className="specialIcon"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
      }}
    >
      <Icon />
    </div>
  );
}

// mappings for the icons
const categoryMap = {
  Food:           { icon: FaUtensils,       color: "#FF6347" },
  Transportation: { icon: FaBus,            color: "#87CEEB" },
  Salary:         { icon: FaMoneyBillWave,  color: "#32CD32" },
  Entertainment:  { icon: FaFilm,           color: "#FF69B4" },
  Rent:           { icon: FaHome,           color: "#1E90FF" },
  Bills:          { icon: FaFileInvoice,    color: "#FFB347" },
  Gift:           { icon: FaGift,           color: "#FFB6C1" },
  Other:          { icon: FaBox,            color: "#A9A9A9" },
  "Transfer In":  { icon: FaArrowDown,      color: "#10b981" },
  "Transfer Out": { icon: FaArrowUp,        color: "#ef4444" },
};

export const HistorySummary = ({ wallet, selectedDate }) => {
  const [page, setPage] = useState(0);
  const perPage = 5;

  // memoise transactions 
  const transactions = useMemo(() => {
    return (wallet?.transactions || []).sort(
      (a, b) => new Date(b.date) - new Date(a.date) // newest first
    );
  }, [wallet]);

  // useMemo is save transaction into group
  const grouped = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const date = t.date.split("T")[0];

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(t);

      return acc;
    }, {});
  }, [transactions]);

  const dates = useMemo(() => Object.keys(grouped).sort((a, b) => b.localeCompare(a)), [grouped]);
  
  // whenever selectedDate changes, reset page
  useEffect(() => {
    setPage(0);
  }, [selectedDate]);

  // flatten transactions
  const flatTransactions = useMemo(() => {
    if (!selectedDate) {
      // flatten transactions into a single array if no date is selected
      return dates.flatMap(date => grouped[date]);
    }

    // normalize date to YYYY-MM-DD
    const normDate = selectedDate.slice(0, 10);

    return (grouped[normDate] || []).map(t => ({ ...t }));
  }, [grouped, dates, selectedDate]);

  // max page size 
  const maxPage = Math.ceil(flatTransactions.length / perPage);

  // cut transactions to display based on page size and per page set 
  const displayTransactions = flatTransactions.slice(page * perPage, (page + 1) * perPage);

  if (!transactions || transactions.length===0) {
    return <div style={{display: 'flex', alignItems: 'center', gap: '8px'}} className="historySummary chart-empty-state"><FaExclamationTriangle className="FaIcon" /> No transactions found.</div>;
  }

  return (
    <div className="historySummary">
      {displayTransactions.map(t => {
        const { icon, color } = categoryMap[t.category] || { icon: FaBox, color: "#f0f0f0" };     // fallback to "other" (not as other but same) for unknown category

        return (
          <div 
            key={t.id} 
            className="transactionRow"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 0',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {/* icon on the left */}
            <SpecialIcon icon={icon} size={40} bgColor={color} />

            {/* text in the middle */}
            <div style={{ marginLeft: '12px', flex: 1 }}>
              <div className="transactionName" style={{ fontSize: '18px', fontWeight: '500' }}>
                {t.category}
              </div>
              <div className="transactionDate" style={{ fontSize: '14px', color: '#585859ff' }}>
                {new Date(t.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
              </div>
            </div>

            {/* amount on the right */}
            <div style={{ fontSize: '16px', fontWeight: '500', color: t.type === "expense" ? "#EF4444" : "#10B981" }}>
              {t.type === "expense" ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
            </div>
          </div>
        );
      })}

      {/* show page controls (when max page > 1 or transaction > 5) */}
      {maxPage > 1 && (
        <div className="pageControls">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>←</button>
          <span>{page + 1} / {maxPage}</span>
          <button disabled={page >= maxPage - 1} onClick={() => setPage(page + 1)}>→</button>
        </div>
      )}
    </div>
  );
};

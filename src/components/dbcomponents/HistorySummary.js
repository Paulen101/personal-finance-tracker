import React, {useMemo, useEffect, useState} from "react";
import { FaUtensils, FaFilm, FaBus, FaShoppingBag, FaFileInvoice, FaPills, FaBook, FaPlane, FaShoppingCart, FaLightbulb, FaBox, FaExclamationTriangle } from 'react-icons/fa';
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
  Food:           { icon: FaUtensils, color: "#FF6347" },   // red-orange
  Entertainment:  { icon: FaFilm, color: "#FF69B4" },   // pink
  Transportation: { icon: FaBus, color: "#87CEEB" },   // sky blue
  Shopping:       { icon: FaShoppingBag, color: "#BA55D3" },   // purple
  Bills:          { icon: FaFileInvoice, color: "#FFB347" },   // light orange
  Healthcare:     { icon: FaPills, color: "#FFEB51" },   // yellow
  Education:      { icon: FaBook, color: "#6A5ACD" },   // slate blue
  Travel:         { icon: FaPlane, color: "#1E90FF" },   // dodger blue
  Groceries:      { icon: FaShoppingCart, color: "#32CD32" },   // green
  Utilities:      { icon: FaLightbulb, color: "#FFA500" },   // orange
  Other:          { icon: FaBox, color: "#A9A9A9" },   // grey
};

export const HistorySummary = ({ wallet, selectedDate }) => {
  const [page, setPage] = useState(0);
  const perPage = 5;

  const transactions = useMemo(() => wallet?.transactions || [], [wallet]);

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


  const maxPage = Math.ceil(flatTransactions.length / perPage);

  const displayTransactions = flatTransactions.slice(page * perPage, (page + 1) * perPage);

  if (!transactions || transactions.length===0) {
    return <div style={{display: 'flex', alignItems: 'center', gap: '8px'}} className="historySummary chart-empty-state"><FaExclamationTriangle className="FaIcon" /> No transactions found.</div>;
  }

  return (
    <div className="historySummary">
      {/* <h2 style={{marginTop: "18px"}}>{selectedDate ? `Transactions on ${selectedDate}` : "Recent Transactions"}</h2> */}

      {displayTransactions.map(t => {
        const { icon, color } = categoryMap[t.category] || { icon: FaBox, color: "#f0f0f0" };

        return (
          <div 
            key={t.id} 
            className="transactionRow"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              // marginBottom: '15px',
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
                {t.date.split("T")[0]}
              </div>
            </div>

            {/* amount on the right */}
            <div style={{ fontSize: '16px', fontWeight: '500', color: t.type === "expense" ? "#EF4444" : "#10B981" }}>
              {t.type === "expense" ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
            </div>
          </div>
        );
      })}

      {/* show page controls (when max page > 1 or transaction > 5) <- can just comment out the max page part to remove it */}
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

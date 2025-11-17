import React, {useMemo, useEffect, useState} from "react";

// function for displaying the icon
const SpecialIcon = ({ emoji, bgColor = '#f0f0f0', size = 40 }) => {
  return (
    <div
      className="specialIcon"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        lineHeight: `${size}px`,
        fontSize: size * 0.5,
      }}
    >
      {emoji}
    </div>
  );
}

// mappings for the icons <- can replace with svg or react-icons later 
const categoryMap = {
  Work:          { emoji: "👜", color: "#428dffff" },    
  Transport:     { emoji: "🚌", color: "#87CEEB" },   
  Entertainment: { emoji: "🎬", color: "#FF69B4" },
  // Salary:        { emoji: "💰", color: "#32CD32" },      
  Utilities:     { emoji: "💡", color: "#FFA500" },     
  Health:        { emoji: "💊", color: "#ffeb51ff" },   
  Shopping:      { emoji: "🛍️", color: "#BA55D3" }, 
  Food:          { emoji: "🍔", color: "#FF6347" }, 
  Rent:          { emoji: "🏠", color: "#8B4513" },
  Other:         { emoji: "📦", color: "#A9A9A9" }, 
};

// newer function
export const HistorySummary = ({ wallets, selectedDate }) => {
  const [page, setPage] = useState(0);
  const perPage = 5;

  const transactions = useMemo(() => wallets?.transactions || [], [wallets]);

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
      // all transactions for normal pagination
      return dates.flatMap(date => grouped[date]);
    }

    // normalize date to YYYY-MM-DD
    const normDate = selectedDate.slice(0, 10);

    return (grouped[normDate] || []).map(t => ({ ...t }));
  }, [grouped, dates, selectedDate]);


  const maxPage = Math.ceil(flatTransactions.length / perPage);

  const displayTransactions = flatTransactions.slice(page * perPage, (page + 1) * perPage);

  if (!transactions.length) {
    return <div className="historySummary">No transactions found.</div>;
  }

  return (
    <div className="historySummary">
      <h2 style={{marginTop: "18px"}}>{selectedDate ? `Transactions on ${selectedDate}` : "Recent Transactions"}</h2>

      {displayTransactions.map(t => {
        // map each category to icons
        const { emoji, color } = categoryMap[t.category] || { emoji: "❓", color: "#f0f0f0" };

        return (
          <div 
            key={t.id} 
            style={{ display: 'flex', alignItems: 'center', color: t.type === "expense" ? "red" : "green", marginBottom: '15px' }}
          >
            <SpecialIcon emoji={emoji} size={30} bgColor={color} />
            <span style={{ marginLeft: '10px', fontSize:"18px"}}>
              {t.date.split("T")[0]} - {t.category}: ${t.amount} ({t.type})
            </span>
          </div>
        );
      })}

      {/* always show page controls if more than 1 page */}
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

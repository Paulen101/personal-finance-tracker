import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";

export const ExpensesSummary = ({ wallets, onSelectDate }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [loadingDate, setLoadingDate] = useState(false);

  const data = useMemo(() => {
    if (!wallets || !wallets.transactions) 
      return [{ date: "No data", amount: 0 }];

    const dailyTotals = {};

    wallets.transactions.forEach(tx => {
      const date = tx.date.split("T")[0];
      const amount = tx.type === "expense" ? -tx.amount : tx.amount;
      dailyTotals[date] = (dailyTotals[date] || 0) + amount;
    });

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [wallets]);

  const dateRange = useMemo(() => {
    if (!wallets?.transactions?.length) return null;
    const dates = wallets.transactions.map(tx => new Date(tx.date));
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));

    const options = { month: 'short', day: 'numeric' };
    return `${min.toLocaleDateString(undefined, options)} - ${max.toLocaleDateString(undefined, options)}`;
  }, [wallets]);

  const handleClick = (data, index) => {
    setLoadingDate(true); // start loading

    setTimeout(() => {
      if (activeIndex === index) {
        setActiveIndex(null);
        onSelectDate?.(null); // unselect
      } else {
        setActiveIndex(index);
        onSelectDate?.(data.date); // select date
      }
      setLoadingDate(false); // end loading
    }, 200); // small delay for smooth effect
  };

  return (
    <div className="expensesSummary" style={{ position: "relative" }}>
      <h2 style={{marginBottom:"0px"}}>Daily Net Changes ({wallets?.accountName ?? "Wallet"})</h2>
      <p style={{marginTop:"0px"}}>{dateRange && `${dateRange}`}</p>

      {loadingDate && (
        <div 
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10
          }}
        >
          <span>Loading...</span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 10, bottom: 10, left: 0 }} >
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <ReferenceLine y={0} stroke="#9797979e" strokeWidth={1}/>
          <Bar dataKey="amount" cursor="pointer" onClick={handleClick} tabIndex={-1} style={{ outline: "none" }}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#8884d8"          // clicked/active
                    : entry.amount < 0 ? "#f76c6c"        // negative
                      : "#82ca9d"        // positive
                }
                stroke={index === activeIndex ? "#000" : "none"}
                strokeWidth={index === activeIndex ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* {activeIndex !== null && !loadingDate && (
        // <button 
        //   onClick={() => handleClick(data[activeIndex], activeIndex)}
        //   style={{ marginTop: 8 }}
        // >
        //   Clear Selection
        // </button>
      )} */}
    </div>
  );
};

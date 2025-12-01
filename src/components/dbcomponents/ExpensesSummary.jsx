import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell, CartesianGrid, Legend } from "recharts";
import { FaChartBar } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../utils/analyticsHelpers';
import './ExpensesSummary.css';

// custom tool tip for hover on the the bar charts 
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: "#3B82F6" }}>
            Net Change: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ExpensesSummary = ({ wallet, onSelectDate, currentMonth, onError }) => {
  // State initialization 
  const [activeIndex, setActiveIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loadingDate, setLoadingDate] = useState(false);

  // Filter transactions for the selected month
  const data = useMemo(() => {
    if (!wallet?.transactions?.length) return [];

    const monthStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const dailyTotals = {};

    // group by day 
    wallet.transactions
      .forEach(tx => {
        const localDate = new Date(tx.date);

        // compute the month of the transaction in local time
        const txMonth = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}`;
        const currentMonthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      
        // skip transactions not in the current month
        if (txMonth !== currentMonthStr) return;
      
        // compute the day for dailyTotals
        const date = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2,'0')}-${String(localDate.getDate()).padStart(2,'0')}`;

        // initialize new date into obj
        if (!dailyTotals[date]) {
          dailyTotals[date] = { net: 0, type: "income" };
        }

      // income = positive, expense = negative
      dailyTotals[date].net += tx.type === "income" ? tx.amount : -tx.amount;

      // Set type for coloring
      dailyTotals[date].type = dailyTotals[date].net < 0 ? "expense" : "income";
    });

    // map and sort results by the dates from oldest to newest
    return Object.entries(dailyTotals)
      .map(([date, {net, type}]) => ({ date, net, type }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [wallet, currentMonth]);

  const handleClick = (data, index) => {
    setLoadingDate(true);
    try {
      // unselect
      if (activeIndex === index) {
        setActiveIndex(null);
        onSelectDate?.(null);
      // select
      } else {
        setActiveIndex(index);
        onSelectDate?.(data.date);        // <- set selected date (for the history component)
      }
    }
    catch (e) {
      console.error(e);
      onError?.(e); 
    } 
    finally {
      setLoadingDate(false);
    }
  };

  return (
    <div className="expensesSummary" style={{ position: "relative" }}>
      {/* this line is pretty much useless with local storage */}
      {loadingDate && (
        <div className="loadingElement">
          <span>Loading...</span>
        </div>
      )}

      {(!data || data.length === 0) ? (
        <div className="chart-empty-state">
          <p style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}><FaChartBar className="FaIcon"/> No spending data available for this month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#6B7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} allowDataOverflow={false} tickFormatter={(val) => `$${val}`} domain={[Math.min(0, Math.min(...data.map(d => d.net))), Math.max(0, Math.max(...data.map(d => d.net)))]}/>
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9797979e" strokeWidth={1} />
            <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />

            {/* bar set up */}
            <Bar
              dataKey="net"
              name="Net Change"
              cursor="pointer"
              radius={[20, 20, 0, 0]} 
              fill="#3B82F6" 
              style={{ outline: "none" }}
              onClick={handleClick}
            >

              {data.map((entry, index) => {
                const isSelected = index === activeIndex;
                const isFocused = index === focusedIndex;

                // colors for charts
                const positive = "#10B981";
                const negative = "#EF4444";
                const selected = "#3B82F6";

                return (
                  // individial 
                  <Cell
                    key={`cell-${index}`}
                    fill={isSelected ? selected : entry.type === "expense" ? negative : positive}
                    stroke={isFocused || isSelected ? "#000000ff" : "none"}
                    strokeWidth={isFocused || isSelected ? 2 : 0}
                    tabIndex={0}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    // for tab accessibility 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick(entry, index);
                      }
                    }}
                    onClick={() => handleClick(entry, index)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

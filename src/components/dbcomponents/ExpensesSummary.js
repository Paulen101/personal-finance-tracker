import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell, CartesianGrid, Legend } from "recharts";
import { formatDate, formatCurrency } from '../../utils/analyticsHelpers';
import './ExpensesSummary.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: "#00aeffff" }}>
            Net Change: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ExpensesSummary = ({ wallet, onSelectDate, currentMonth, onError }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loadingDate, setLoadingDate] = useState(false);

  // Filter transactions for the selected month
  const data = useMemo(() => {
    if (!wallet?.transactions?.length) return [{ date: "No data", net: 0 }];

    const monthStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const dailyTotals = {};
    wallet.transactions
      .filter(tx => tx.date.startsWith(monthStr))
      .forEach(tx => {
        const date = tx.date.split("T")[0];
        const amount = tx.amount;
        dailyTotals[date] = (dailyTotals[date] || 0) + amount;
      });

    return Object.entries(dailyTotals)
      .map(([date, net]) => ({ date, net }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [wallet, currentMonth]);

  const handleClick = (data, index) => {
    setLoadingDate(true);
    try {
      if (activeIndex === index) {
        setActiveIndex(null);
        onSelectDate?.(null);
      } else {
        setActiveIndex(index);
        onSelectDate?.(data.date);
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
          <p>📊 No spending data available for this month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#6B7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} tickFormatter={(val) => `$${val}`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9797979e" strokeWidth={1} />

            {/* Legend keeps your style + shows a color box */}
            <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />

            <Bar
              dataKey="net"
              name="Net Change"
              cursor="pointer"
              radius={[20, 20, 0, 0]}     // rounded edges  
              fill="#27a8e4ff" 
              style={{ outline: "none" }}
              onClick={handleClick}
            >
              {data.map((entry, index) => {
                const isSelected = index === activeIndex;
                const isFocused = index === focusedIndex;

                // colors for charts
                const positive = "#10B981";
                const negative = "#ff4848ff";
                const selected = "#8B5CF6";

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isSelected ? selected : entry.net < 0 ? negative : positive}
                    stroke={isFocused || isSelected ? "#000000ff" : "none"}
                    strokeWidth={isFocused || isSelected ? 2 : 0}
                    tabIndex={0}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
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

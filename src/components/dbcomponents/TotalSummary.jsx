import React, { useMemo } from "react";
import './TotalSummary.css';

const CategorySummary = ({ spending }) => { 
  const maxCategories = 5;

  const { result, maxTotal } = useMemo(() => {
    if (!spending || spending.length === 0) {
      return { result: [], maxTotal: 1 };
    }

    // Break expenses down by category
    const totals = spending.reduce((acc, tx) => {
      if (tx.type !== "expense") {
        return acc;
      }
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    // Sort categories by amount
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, maxCategories - 1);
    const others = sorted.slice(maxCategories - 1);

    const otherTotal = others.reduce((sum, [, val]) => sum + val, 0);
    const combined = [...top];

    // Fill missing slots with dummy categories
    const dummyCategories = [
      ["Food", 0],
      ["Rent", 0],
      ["Entertainment", 0],
      ["Transportation", 0]
    ];

    // push dummy categories for the amount of max categories that is not filled 
    let i = 0;
    while (combined.length < maxCategories && i < dummyCategories.length) {
      const [cat, val] = dummyCategories[i];
      if (!combined.find(([c]) => c === cat)) {
        combined.push([cat, val]);
      }
      i++;
    }
    
    // push other as always the last categories 
    if (otherTotal > 0 || combined.length < maxCategories) {
      combined.push(["Other", otherTotal]);
    }

    const maxTotal = combined.reduce((sum, [, val]) => sum + val, 0) || 1;

    return { result: combined, maxTotal };
  }, [spending]);

  return (
    <div className="progressBarContainer">
      {/* progress bars */}
      {result.map(([category, total]) => (
        <div className="progressBar" key={category}>
          <div className="totalCategory">
            {category}: <span style={{fontWeight:"700"}}> ${total} </span>spent 
          </div>
          
          <div className="totalProgressBar">
            <div 
              className="totalProgressFill" 
              style={{ 
                width: `${Math.min((total/maxTotal)*100, 100)}%`,
                backgroundColor: "#8B5CF6"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// for cases where there is exactly no category filled in yet 
const EmptyCategorySummary = () => {
  const dummyCategories = [
    ["Food", 0],
    ["Rent", 0],
    ["Entertainment", 0],
    ["Transportation", 0],
    ["Other", 0]
  ];

  const maxTotal = 1;

  return (
    <div className="progressBarContainer">
      {dummyCategories.map(([category, total]) => (
        <div className="progressBar" key={category}>
          <div className="totalCategory">
            {category}: <span style={{fontWeight:"700"}}> ${total} </span>spent 
          </div>
          <div className="totalProgressBar">
            <div 
              className="totalProgressFill" 
              style={{ 
                width: `${Math.min((total/maxTotal)*100, 100)}%`,
                backgroundColor: "#8B5CF6"      // <- maybe change to "green" or " red"　
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TotalSummary = ({ wallet }) => {
  if (!wallet || !wallet.transactions || wallet.transactions.length === 0) {
    return <EmptyCategorySummary />;
  }

  return <CategorySummary spending={wallet.transactions} />;
};

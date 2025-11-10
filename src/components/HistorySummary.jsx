import React, {useMemo} from "react";

// helper function for calculation 
const HistoryGroup = ({transaction}) => {
  const max = 5;
  
  // reduce only happens when the transactions array changes
  const TrGroup = useMemo(() => {
    return transaction.reduce((acc, curr) => {
      const key = curr.date.split("T")[0];

      if (!acc[key] && Object.keys(acc).length >= max) {
        return acc;
      }

      if (!acc[key]) {
        acc[key] = 0;
      }

      if (curr.type === "expense") { 
        acc[key] += curr.amount; 
      } else { 
        acc[key] -= curr.amount; 
      }

      return acc;
    }, {});
  }, [transaction]);

  return (
    <>
      {Object.entries(TrGroup).map(([date, amount]) => (
        <div key={date}>
          <strong>{date}:</strong> ${amount}
        </div>
      ))}
    </>
  );
}

// moved this to their own component (this component css is combined with dashboard.css :) )
export const HistorySummary = ({wallets}) => { 
// NOTE: insert expenses function from analytics, if possible 
// otherwise define later
  if (!wallets || wallets.length === 0) {
    return (
    <div className="historySummary">
      <h2>Recent Transactions:</h2>
      <h1><span style={{display: 'inline-block', fontWeight: 'normal', paddingLeft:'100px', position:'relative', top:'100px'}}>No wallets available!</span></h1>
    </div>);
  }

  return (
    <div className="historySummary">
      {/* just show the last 5 transactions for now */}
      <h2>Recent Transactions for {wallets.accountName}</h2>
        <HistoryGroup transaction={wallets.transactions} />
    </div>
  )
}
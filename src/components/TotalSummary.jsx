import React, {useMemo} from "react";

// helper function for spendingSummary
const CategorySummary = ({spending}) => { 
  // print the 4 category that have the most spending 
  // plus 1 "other" category that is the combination all remaining category spending 
  // same functionality as HistoryGroup helper function 
  const max = 5;

  // reduce only happens when the transactions array changes
  const CategoryGroup = useMemo(() => {
    // total per category
    const totals = spending.reduce((acc, curr) => {
      const key = curr.category;

      if (!acc[key]) {
        acc[key] = 0;
      }

      if (curr.type === "expense") { 
        acc[key] += curr.amount; 
      // } else {       // total spending check so don't need to worry about income yet, uncomment if otherwise
      //   acc[key] -= curr.amount; 
      }

      return acc;
    }, {});

    // sort categories by spending
    // convert obj to array 
    const sortedCategory = Object.entries(totals).sort(   // sort the numericals at [1] intead of the category [0]
      (a, b) => b[1] - a[1] // b - a to place the arr in descending order
    );

    const top = sortedCategory.slice(0, max - 1);    // category from 0 to 3
    const other = sortedCategory.slice(max - 1);     // at index 4

    const otherTotal = other.reduce((sum, [, value]) => sum + value, 0);
    const topTotal = top.reduce((sum, [, value]) => sum + value, 0);
    const maxTotal = otherTotal + topTotal;

    const result = [...top];
    if (otherTotal > 0) result.push(["Other", otherTotal]);

    return {result, maxTotal}; // [["Food", 165], ["Rent", 200], ["Other", 50]], maxtotal
  }, [spending]);

  // destructure for use
  const {result, maxTotal} = CategoryGroup;

  return (
    <>
      {result.map(([category, total]) => (
        <div key={category}>
          {category}: ${total} <br></br>
          <progress value={total} max={maxTotal}/>  {/* using react's progress component (for now, may or may not change styles later later) */}
        </div>
      ))}
    </>
  )
}

const EmptyCategorySummary = () => {
  // dummy category names with zero amounts
  const dummyCategories = [
    ["Food", 0],
    ["Rent", 0],
    ["Entertainment", 0],
    ["Transit", 0],
    ["Other", 0]
  ];

  const maxTotal = 1; // avoid max=0 which can break <progress>

  return (
    <div>
      {dummyCategories.map(([category, value]) => (
        <div key={category}>
          {category}: ${value} <br></br>
          <progress value={value} max={maxTotal}/>
        </div>
      ))}
    </div>
  );
};

export const TotalSummary = ({wallets}) => { 
  // returns the total spendings distribution 
  if (!wallets || wallets.length === 0) {
    return (
    <div className="totalSummary">
      <h2>Where did your money go?</h2>
      <EmptyCategorySummary />
    </div>);
  }

  return ( 
    <div className="totalSummary">
      <h2>Where did your money go?</h2>
      <CategorySummary spending={wallets.transactions}/>
    </div>
  )
}
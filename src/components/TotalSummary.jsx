import React, {useMemo} from "react";

// helper function for spendingSummary
const CategorySummary = ({spending}) => { 
  // print the 4 category that have the most spending 
  // plus 1 "other" category that is the combination all remaining category spending 
  // same functionality as HistoryGroup helper function 
  const max = 5;

  // reduce only happens when the transactions array changes
  const categoryGroup = useMemo(() => {
    // total per category
    const totals = spending.reduce((acc, curr) => {
      
      if (curr.type !== "expense") return acc; // skip income

      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;

      return acc;
    }, {});

    // sort categories by spending
    // convert obj to array 
    const sortedCategory = Object.entries(totals).sort(   // sort the numbers at [1] intead of the category [0]
      (a, b) => b[1] - a[1] // b - a to place the arr in descending order
    );

    const top = sortedCategory.slice(0, max - 1);    // category from 0 to 3
    const other = sortedCategory.slice(max - 1);     // at index 4

    const otherTotal = other.reduce((sum, [, value]) => sum + value, 0);
    
    const result = [...top];
    
    // If there is any leftover, always make it "Other"
    if (otherTotal > 0 || result.length < max) {
      result.push(["Other", otherTotal]);
    }

    // Fill with dummy categories if fewer than 5
    const dummyCategories = [
      ["Food", 0],
      ["Rent", 0],
      ["Entertainment", 0],
      ["Transit", 0]
    ];

    // Add dummy entries for missing slots
    let i = 0;
    while (result.length < max && i < dummyCategories.length) {
      const [cat, val] = dummyCategories[i];
      if (!result.find(([rCat]) => rCat === cat)) {
        result.push([cat, val]);
      }
      i++;
    }

    const maxTotal = result.reduce((sum, [, value]) => sum + value, 0) || 1;

    return {result, maxTotal}; // [["Food", 165], ["Rent", 200], ["Other", 50]], maxtotal
  }, [spending]);

  // destructure for use
  const {result, maxTotal} = categoryGroup;

  return (
    <div className="progressBarContainer">
      {result.map(([category, total]) => (
        <div className="progressBar" key={category}>
          {category}: ${total} spent<br></br>
          <progress value={total} max={maxTotal}/>  {/* using react's progress component (for now, may or may not change styles later later) */}
        </div>
      ))}
    </div>
  )

  // {result.map(([category, total]) => {
  //   const percent = Math.min((total / maxTotal) * 100, 100);

  //   return (
  //     <div key={category} style={{ marginBottom: '8px' }}>
  //       {category}: ${total}
  //       <div
  //         style={{
  //           width: '100%',
  //           height: '12px',
  //           backgroundColor: '#ecececff',
  //           borderRadius: '6px',
  //         }}
  //       >
  //         <div
  //           style={{
  //             width: `${percent}%`,
  //             height: '100%',
  //             backgroundColor: '#4caf50',
  //           }}
  //         />
  //       </div>
  //     </div>
  //   );
  // })}
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
    <div className="progressBarContainer">
      {dummyCategories.map(([category, value]) => (
        <div className="progressBar" key={category}>
          {category}: ${value} spent<br></br>
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
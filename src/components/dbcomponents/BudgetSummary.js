import React, {useMemo} from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaTimesCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './BudgetSummary.css'

const BudgetOutput = ({groups, counts}) => {
  if (counts.overbudget === 1) {
    const overbudgetCategory = Object.entries(groups)
      .filter(([_, info]) => info.status === "overbudget")
      .map(([category]) => category);
    return (
      <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginBottom: '15px',
          padding: '15px 0'
        }}
      >

      {/* Icon on the left */}
      <div style={{fontSize:"50px", paddingLeft:"10px", color:"#EF4444"}}><FaExclamationCircle /></div>

      {/* Text in the right */}
        <div style={{ paddingRight: '40px', flex: 1, color:"#EF4444", fontSize:"40px", textAlign: "right", fontWeight:700 }}>
          Oh no!
        </div>
      </div>
      <h3 style={{marginTop:"15px", paddingBottom:"10px", fontSize:"18px", lineHeight:"1.6", fontWeight:600}}>
      You've exceeded the budget in your <span style={{color:"#EF4444"}}>{overbudgetCategory}</span> category!
      </h3>
      </>
    )
  }
  else if (counts.overbudget > 1) {
    return (
      <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginBottom: '15px',
          padding: '15px 0'
        }}
      >

      {/* Icon on the left */}
      <div style={{fontSize:"50px", paddingLeft:"10px", color:"#EF4444"}}><FaTimesCircle /></div>

      {/* Text in the right */}
        <div style={{ paddingRight: '40px', flex: 1, color:"#EF4444", fontSize:"40px", textAlign: "right", fontWeight:700 }}>
          Oh no!
        </div>
      </div>
      <h3 style={{marginTop:"15px", paddingBottom:"10px", fontSize:"18px", lineHeight:"1.6", fontWeight:600}}>
        You've exceeded the budget in <span style={{color:"#EF4444"}}>{counts.overbudget}</span> categories!
      </h3>
      </>
    )
  }
  else if (counts.warning === 1) {
    const WarningCategory = Object.entries(groups)
      .filter(([_, info]) => info.status === "warning")
      .map(([category]) => category);
    return (
      <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginBottom: '15px',
          padding: '15px 0'
        }}
      >

      {/* Icon on the left */}
      <div style={{fontSize:"50px", paddingLeft:"10px", color:"#F59E0B"}}><FaExclamationTriangle /></div>

      {/* Text in the right */}
        <div style={{ paddingRight: '40px', flex: 1, color:"#F59E0B", fontSize:"40px", textAlign: "right", fontWeight:700 }}>
          Be careful!
        </div>
      </div>
      <h3 style={{marginTop:"15px", paddingBottom:"10px", fontSize:"18px", lineHeight:"1.6", fontWeight:600}}>
        You're close to going over budget in your <span style={{color:"#F59E0B"}}>{WarningCategory}</span> category!
      </h3>
      </>
    )
  }
  else if (counts.warning > 1) {
    return (
      <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginBottom: '15px',
          padding: '15px 0'
        }}
      >

      {/* Icon on the left */}
      <div style={{fontSize:"50px", paddingLeft:"10px", color:"#F59E0B"}}><FaExclamationTriangle /></div>

      {/* Text in the right */}
        <div style={{ paddingRight: '40px', flex: 1, color:"#F59E0B", fontSize:"40px", textAlign: "right", fontWeight:700 }}>
          Be careful!
        </div>
      </div>

      <h3 style={{marginTop:"15px", paddingBottom:"10px", fontSize:"18px", lineHeight:"1.6", fontWeight:600}}>
        You're close to going over budget in <span style={{color:"#F59E0B"}}>{counts.warning}</span> categories!
      </h3>
    </>
    )
  }
  else {
    const [longestCategory, longestInfo] = Object.entries(groups).reduce(
      ([maxCat, maxInfo], [category, info]) => {
        return info.dateLength > maxInfo.dateLength
          ? [category, info]
          : [maxCat, maxInfo];
      }, ["", {dateLength: 0}] 
    )

    // color either #8B5CF6 or #10B981
    return (
    <>
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: '15px',
        padding: '15px 0'
      }}
    >
      {/* Icon on the left */}
      <div style={{fontSize:"50px", paddingLeft:"10px", color:"#10B981"}}><FaCheckCircle /></div>

      {/* Text in the right */}
      <div style={{ paddingRight: '40px', flex: 1, color:"#10B981", fontSize:"40px", textAlign: "right", fontWeight:700 }}>
        Well done!
      </div>
    </div>

    <h3 style={{marginTop:"15px", paddingBottom:"10px", fontSize:"18px", lineHeight:"1.6", fontWeight:600}}>
      You've kept all your budgets under control. Your <span style={{color:"#10B981"}}>{longestCategory}</span> budget has been well managed for <span style={{color:"#10B981"}}>{longestInfo.dateLength}</span> days!
    </h3>
    </>
    )
  }
}


export const BudgetReminder = ({budgets}) => { 
  /*
    - 1st state: nothing is close to budget limit -> gives congrats + how long since you've kept it under budget
    - 2nd state: >= 80% -> warning message 
    - 3rd state: >= 100% -> emergency message -> point to transaction/budget page to reset/review
  */ 
  // breakdown each of the category into an object of their own 
  const categoryGroup = useMemo(() => {
    const now = new Date(); 
    const counts = { overbudget: 0, warning: 0, ok: 0 };
    
    // total per category
    const groups = budgets.reduce((acc, curr) => {
      const key = curr.category;
      const spentPercentage = curr.limit > 0 ? (curr.spent / curr.limit) * 100 : 0;
      const date = new Date(curr.dateSet);
      // calculate difference in milliseconds
      const dateDiffInMs = now - date;
      // convert milliseconds to days
      const dateDiffInDays = Math.floor(dateDiffInMs / (1000 * 60 * 60 * 24));
      let status = "ok"; 
      if (spentPercentage >= 100) {
        status = "overbudget";
        counts.overbudget += 1;
      }
      else if (spentPercentage >= 80) {
        status = "warning";
        counts.warning += 1;
      }
      else {
        counts.ok += 1;
      }

      acc[key] = {
        dateSet: curr.dateSet,      // save dateSet just in case it is needed again 
        dateLength: dateDiffInDays,
        spentPercentage,
        status: status,
      };

      return acc;
    }, {});

    return {groups, counts};
  }, [budgets])

  if (!budgets || budgets.length === 0) { 
    return (
      <div className="budgetReminder">
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}} className="chart-empty-state"><FaExclamationTriangle /> No transactions found.</div>;
        <div className="buttonWrapper">
          <Link to="/budget">
            <button className="btnGoBudget">Go to Budget</button>
          </Link>
        </div>
      </div>
    )
  }

  const { groups, counts } = categoryGroup;
  
  return (
    <div className="budgetReminder">
      <BudgetOutput groups={groups} counts={counts} />
      <div className="budgetBox">
        <p>Exceeded categories: <span style={{color:"#EF4444"}}>{counts.overbudget}</span></p>
        <p>Warning categories: <span style={{color:"#F59E0B"}}>{counts.warning}</span></p>
        <p>All good categories: <span style={{color:"#10B981"}}>{counts.ok}</span></p>
      </div>
      {counts.overbudget > 0 && (
        <div className="buttonWrapper">
          <Link to="/budget">
            <button className="btnGoBudget">Find out why</button>
          </Link>
        </div>
      )}
      {/* dumb way of doing this but it works */}
      {!(counts.overbudget > 0) && (
        <div className="buttonWrapper">
          <Link to="/budget">
            <button className="btnGoBudget">Find out more</button>
          </Link>
        </div>
      )}
    </div>
  )
}
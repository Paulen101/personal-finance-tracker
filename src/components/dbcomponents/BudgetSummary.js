import React, {useMemo} from "react";
import { NavLink } from "react-router-dom";
import './BudgetSummary.css'

const BudgetOutput = ({groups, counts}) => {
  if (counts.overbudget === 1) {
    const overbudgetCategory = Object.entries(groups)
      .filter(([_, info]) => info.status === "overbudget")
      .map(([category]) => category);
    return (<h3>
      You've went in overbudget in your {overbudgetCategory} category!
    </h3>
    )
  }
  else if (counts.overbudget > 1) {
    return (<h3>
      You've went in overbudget in {counts.overbudget} categories!
    </h3>
    )
  }
  else if (counts.warning === 1) {
    const WarningCategory = Object.entries(groups)
      .filter(([_, info]) => info.status === "overbudget")
      .map(([category]) => category);
    return (<h3>
      You're close to going over budget in your {WarningCategory} category!
    </h3>
    )
  }
  else if (counts.warning > 1) {
    return (<h3>
      You're close to going over budget in your {counts.warning} categories!
    </h3>
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
    return (<h3>
      You're kept all your budgets under control. Your {longestCategory} budget has been well managed for {longestInfo.dateLength} days!
    </h3>)
  }
}


export const BudgetReminder = ({budgets}) => { 
  /*  plan: looks at the budget then decide on the 3(? <- could be more) states by on budgets
    (can reuse progress bar to show spent/budget)
    - 1st state: nothing is close to budget limit -> gives congrats + how long since you've kept it under budget
    - 2nd state: >= 85% -> warning message 
    - 3rc state: >= 100% -> emergency message -> point to transaction/budget page to reset/review
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
      else if (spentPercentage >= 85) {
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
        You have not set any budgets yet. <br></br>
        <div className="buttonWrapper">
          <NavLink to="/budget">
            <button className="btnGoBudget">Go to Budgets</button>
          </NavLink>
        </div>
      </div>
    )
  }

  const { groups, counts } = categoryGroup;
  
  return (
    <div className="budgetReminder">
      <BudgetOutput groups={groups} counts={counts} />
      <p>Overbudget categories: {counts.overbudget}</p>
      <p>Warning categories: {counts.warning}</p>
      <p>All good categories: {counts.ok}</p>
      {counts.overbudget > 0 && (
        <div className="buttonWrapper">
          <NavLink to="/budget">
            <button className="btnGoBudget">Go to Budgets</button>
          </NavLink>
        </div>
      )}
    </div>
  )
}
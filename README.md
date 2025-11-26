<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
=======
# Personal Finance Tracker

A comprehensive React-based personal finance tracker with budget management, multiple wallet support, and transaction tracking.

## Features

### 💰 Budget Management
- **Create, edit, and delete budgets** with ease
- **Wallet-specific and global budgets** - Set budgets for individual wallets or apply them globally
- **Smart budget prioritization** - Wallet-specific budgets override global budgets for the same category
- **Real-time spending calculation** - Automatically tracks expenses against budget limits
- **Visual progress indicators** - Color-coded progress bars (green, yellow, red)
- **Budget alerts** - Visual warnings when approaching or exceeding limits

### 👛 Multi-Wallet Support
- Manage multiple wallets/accounts simultaneously
- Each wallet maintains its own transaction history
- Switch between wallets to view applicable budgets
- Track balances across all accounts

### 📊 Filtering & Sorting
- **Filter by wallet**: View all budgets, current wallet only, global only, or specific wallet
- **Filter by category**: Focus on specific spending categories
- **Sort options**: Sort by category, limit, spent amount, usage percentage, or date set
- **Smart filtering**: "Current Wallet" view shows both wallet-specific and applicable global budgets

### 🎨 User Interface
- Clean, modern design with gradient accents
- Responsive layout for mobile, tablet, and desktop
- Intuitive forms with validation
- Real-time summary statistics
- Visual status indicators and warnings

### 💾 Data Persistence
- All data stored in localStorage
- Automatic save on every change
- Demo data auto-loads on first use

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Available Scripts
>>>>>>> for-pull-req-testing

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

<<<<<<< HEAD
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
=======
Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Usage

### Creating a Budget

1. Click the **"+ Add Budget"** button
2. Choose budget scope:
   - **Global**: Applies to all wallets (unless overridden)
   - **Wallet-specific**: Applies only to selected wallet
3. Select or enter a category
4. Set your budget limit
5. Click **"Create Budget"**

### Budget Priority Rules

- **Wallet-specific budgets** always take priority over global budgets
- If a wallet has a specific budget for "Food", the global "Food" budget won't apply to that wallet
- Other wallets without a specific "Food" budget will still use the global one

### Editing/Deleting Budgets

- Click the **✏️ edit icon** to modify a budget
- Click the **🗑️ delete icon** to remove a budget
- All changes are saved automatically to localStorage

### Understanding Budget Status

- 🟢 **Green (0-79%)**: Safe - spending is under control
- 🟡 **Yellow (80-99%)**: Warning - approaching limit
- 🔴 **Red (100%+)**: Exceeded - over budget

### Demo Data

The app automatically loads demo data on first use, including:
- 3 sample wallets with transactions
- 6 sample budgets (mix of global and wallet-specific)

To reset to demo data, clear your browser's localStorage and refresh.

## Project Structure

```
src/
├── components/
│   ├── charts/
│       ├── CategoryPieChart.js
│       ├── IncomeVsExpensesChart.js
│       ├── MonthlyComparisonChart.js
│       └── SpendingTrendsChart.js
│   ├── dbcomponents/
│       ├── BudgetSummary.js    # Budget reminder/summary component
│       ├── BudgetSummary.css
│       ├── ExpensesSummary.js  # Expenses summary component
│       ├── ExpensesSummary.css
│       ├── HistorySummary.js   # History summary component 
│       ├── HistorySummary.css
│       ├── TotalSummary.js     # Total summary component
│       └── TotalSummary.css
│   ├── BudgetForm.js       # Form for creating/editing budgets
│   ├── BudgetForm.css
│   ├── BudgetItem.js       # Individual budget display
│   ├── BudgetItem.css
│   ├── ErrorBoundary.js    # Error page for when encountering problems
│   └── ErrorBoundary.css
├── context/
│   └── FinanceContext.js   # Global state management
├── pages/
│   ├── DashboardPage.js    # Dashboard page 
│   ├── DashboardPage.css   
│   ├── AnalyticsPage.js    # Analytics page
│   ├── AnalyticsPage.css
│   ├── BudgetPage.js       # Main budget management page
│   └── BudgetPage.css
├── utils/
│   └── demoData.js         # Demo data utilities
├── App.js                  # Main app component
└── index.js               # App entry point
```

## Data Structure

### Budget Object
```javascript
{
  id: Number,              // Unique identifier
  walletID: Number | null, // null = global, Number = specific wallet
  category: String,        // Spending category
  limit: Number,           // Budget limit in dollars
  spent: Number,           // Calculated spent amount
  dateSet: String         // ISO date string
}
```

### Wallet Object
```javascript
{
  id: Number,              // Unique identifier
  name: String,            // Wallet name
  balance: Number,         // Current balance
  transactions: Array      // Transaction history
}
```

### Transaction Object
```javascript
{
  id: Number,              // Unique identifier
  category: String,        // Spending category
  amount: Number,          // Amount (negative for expenses)
  type: String,            // 'expense' or 'income'
  date: String,            // ISO date string
  description: String      // Transaction description
}
```

## Technologies Used

- **React 19.2** - UI framework
- **React Hooks** - useState, useEffect, useContext, useMemo
- **Context API** - State management
- **localStorage** - Data persistence
- **CSS3** - Styling with gradients and animations
>>>>>>> for-pull-req-testing

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
<<<<<<< HEAD

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
>>>>>>> for-pull-req-testing

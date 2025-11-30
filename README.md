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
- **Date filters** - Ensures only transactions made after budget is set are counted

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

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Usage
### Creating a Wallet

1. Click the **"+ Create New Wallet"** button
2. Enter a wallet name
3. Click **"Create"**

### Creating a Transaction

1. Click the **"+ Add Transaction"** button
2. Select a type: **Expense** / **Income**
3. Select or enter a category:
   - **Standard category**: shared stardard category between wallet, transactions and budgets
   - **Custom category**: accessed by selecting other - allow for connecting with budget's custom category
4. Enter an amount
5. Click **"Create Budget"**

### Transferring between Wallets

1. Click the **"Transfer Between Wallets"** button
2. Select a source wallet
3. Select a destination wallet
4. Set amount to transfer
5. Provide a description 
6. Click **"Transfer"**

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

### Editing/Deleting Budgets/Wallets/Transactions

- Click the **✏️ edit icon** to modify a budget
- Click the **🗑️ delete icon** to remove a budget/transaction/wallet
- All changes are saved automatically to localStorage

### Switching Wallets

- Selecting **wallet** lined up on wallet page 
- Using the quick **dropdown menu** on dashboard/transaction/budget page

### Understanding Budget Status

- 🟢 **Green (0-79%)**: Safe - spending is under control
- 🟡 **Yellow (80-99%)**: Warning - approaching limit
- 🔴 **Red (100%+)**: Exceeded - over budget

### Filtering & Sorting
- Click on the **bars** on the dashboard page to filter through transaction for selected date
- Use the **dropdown menus & search bar** on the transaction page to filter/sort through selected wallet's transaction category/type/orderings
- Use the **dropdown menus & search bar** on the budget page to filter/sort through budget set 
- Select the **Time ranges & wallet** on analytics page to filter through selected time ranges or wallet for a more detailed analysis

### Demo Data

The app does contain demo data as reference, including:
- 3 sample wallets with transactions
- 6 sample budgets (mix of global and wallet-specific)

Though it will not automatically load.

## Project Structure

```
src/
├── components/
│   ├── charts/
│       ├── CategoryPieChart.jsx
│       ├── IncomeVsExpensesChart.jsx
│       ├── MonthlyComparisonChart.jsx
│       └── SpendingTrendsChart.jsx
│   ├── dbcomponents/
│       ├── BudgetSummary.jsx    # Budget reminder display
│       ├── BudgetSummary.css
│       ├── ExpensesSummary.jsx  # Monthly expenses with selectable filters
│       ├── ExpensesSummary.css
│       ├── HistorySummary.jsx   # Transaction history display 
│       ├── HistorySummary.css
│       ├── TotalSummary.jsx     # Total expenses display
│       └── TotalSummary.css
│   ├── BudgetForm.jsx       # Form for creating/editing budgets
│   ├── BudgetForm.css
│   ├── BudgetItem.jsx       # Individual budget display
│   ├── BudgetItem.css
│   ├── Balance.jsx         # Balance display
│   ├── Balance.css
│   ├── TransactionsForm.jsx    # Transactions form for adding transactions
│   ├── TransactionsForm.css   
│   ├── TransactionsList.jsx    # Transactions list display
│   ├── TransactionsList.css
│   ├── TransferForm.jsx        # Transfer form for transferring cash
│   ├── TransferForm.css
│   ├── WalletCarousel.jsx      # Wallet carousel for selecting wallet
│   ├── WalletCarousel.css
│   ├── WalletDetails.jsx       # Wallet details display
│   ├── WalletDetails.css
│   ├── WalletForm.jsx          # Wallet Form for adding wallet
│   ├── WalletForm.css
│   ├── WalletList.jsx          # Wallet list display
│   ├── WalletList.css
│   ├── WalletTransactions.jsx  # Wallet transactions display
│   ├── WalletTransactions.css
│   ├── ErrorBoundary.jsx    # Error page for when encountering problems
│   └── ErrorBoundary.css
├── context/
│   └── FinanceContext.jsx   # Global state management
├── pages/
│   ├── DashboardPage.jsx    # Dashboard page 
│   ├── DashboardPage.css   
│   ├── AnalyticsPage.jsx    # Analytics page
│   ├── AnalyticsPage.css
│   ├── Transactions.jsx    # Tranaction page
│   ├── Transactions.css
│   ├── Wallet.jsx          # Wallet page
│   ├── Wallet.css
│   ├── BudgetPage.jsx       # Main budget management page
│   └── BudgetPage.css
├── utils/
│   ├── analyticsHelpers.jsx # Helper functions for analytics 
│   └── demoData.jsx         # Demo data utilities
├── App.jsx                  # Main app component
└── index.jsx               # App entry point
```

## Data Structure

### Budget Object
```javascript
{
  id: Number,              // Unique identifier
  walletID: Number | null, // null = global, Number = specific wallet
  category: String,        // Spending category
  limit: Number,           // Budget limit in dollars
  dateSet: String         // ISO date string
}
```

### Wallet Object
```javascript
{
  id: Number,              // Unique identifier
  cardNumber: Number,      // Credit card number
  expiryDate: String,      // Stringified expiry date
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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

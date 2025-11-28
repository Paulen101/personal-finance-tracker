/**
 * Analytics Helper Functions
 * Utilities for processing wallet transaction data for charts and statistics
 */

/**
 * Get date range based on filter selection
 */
export const getDateRange = (filter) => {
  const now = new Date();
  const start = new Date();

  switch (filter) {
    case '1D':
      start.setDate(now.getDate() - 1);
      break;
    case '1W':
      start.setDate(now.getDate() - 7);
      break;
    case '1M':
      start.setMonth(now.getMonth() - 1);
      break;
    case '6M':
      start.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setMonth(now.getMonth() - 1);
  }

  return { start, end: now };
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByDate = (transactions, startDate, endDate) => {
  if (!Array.isArray(transactions)) return [];
  
  return transactions.filter(t => {
    if (!t || !t.date) return false;
    const txDate = new Date(t.date);
    return txDate >= startDate && txDate <= endDate;
  });
};

/**
 * Get all transactions from selected wallets
 */
export const getAllTransactions = (wallets, selectedWalletIds = null) => {
  if (!Array.isArray(wallets)) return [];
  
  const walletsToProcess = selectedWalletIds && selectedWalletIds.length > 0
    ? wallets.filter(w => selectedWalletIds.includes(w.id || w.accountID))
    : wallets;

  return walletsToProcess.flatMap(w => 
    (w.transactions || []).map(t => ({
      ...t,
      walletId: w.id || w.accountID,
      walletName: w.name || w.accountName
    }))
  );
};

/**
 * Calculate total income and expenses
 */
export const calculateTotals = (transactions) => {
  if (!Array.isArray(transactions)) return { income: 0, expenses: 0, net: 0 };
  
  const income = transactions
    .filter(t => t && t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

  const expenses = transactions
    .filter(t => t && t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

  return {
    income,
    expenses,
    net: income - expenses
  };
};

/**
 * Group transactions by date for trend charts
 */
export const groupByDate = (transactions, groupBy = 'day') => {
  if (!Array.isArray(transactions)) return [];
  
  const grouped = {};

  transactions.forEach(t => {
    if (!t || !t.date) return;
    
    const date = new Date(t.date);
    let key;

    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = { date: key, income: 0, expenses: 0, net: 0 };
    }

    const amount = Math.abs(Number(t.amount) || 0);
    if (t.type === 'income') {
      grouped[key].income += amount;
    } else if (t.type === 'expense') {
      grouped[key].expenses += amount;
    }
    grouped[key].net = grouped[key].income - grouped[key].expenses;
  });

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Group transactions by category
 */
export const groupByCategory = (transactions, type = 'expense') => {
  if (!Array.isArray(transactions)) return [];
  
  const filtered = transactions.filter(t => t && t.type === type);
  const grouped = {};

  filtered.forEach(t => {
    const category = t.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = { category, value: 0, count: 0 };
    }
    grouped[category].value += Math.abs(Number(t.amount) || 0);
    grouped[category].count += 1;
  });

  return Object.values(grouped).sort((a, b) => b.value - a.value);
};

/**
 * Get top categories by spending
 */
export const getTopCategories = (transactions, limit = 5) => {
  const categories = groupByCategory(transactions, 'expense');
  return categories.slice(0, limit);
};

/**
 * Calculate average spending per period
 */
export const calculateAverages = (transactions, periodDays = 30) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { daily: 0, weekly: 0, monthly: 0 };
  }

  const expenses = transactions
    .filter(t => t && t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

  const daily = expenses / periodDays;
  const weekly = daily * 7;
  const monthly = daily * 30;

  return { daily, weekly, monthly };
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format month for display
 */
export const formatMonth = (dateString) => {
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get chart colors for categories
 */
export const CHART_COLORS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple (repeat)
];

export const getCategoryColor = (index) => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

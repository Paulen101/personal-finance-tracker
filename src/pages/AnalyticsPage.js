import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import SpendingTrendsChart from '../components/charts/SpendingTrendsChart';
import IncomeVsExpensesChart from '../components/charts/IncomeVsExpensesChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart';
import {
  getDateRange,
  filterTransactionsByDate,
  getAllTransactions,
  calculateTotals,
  groupByDate,
  groupByCategory,
  getTopCategories,
  calculateAverages,
  formatCurrency
} from '../utils/analyticsHelpers';
import './AnalyticsPage.css';

const TIME_FILTERS = ['1D', '1W', '1M', '6M', '1Y'];

const AnalyticsPage = () => {
  const { wallets } = useFinance();
  const [timeFilter, setTimeFilter] = useState('1M');
  const [selectedWalletIds, setSelectedWalletIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate analytics data with error handling
  const analyticsData = useMemo(() => {
    try {
      setLoading(true);
      setError(null);

      // Get date range
      const { start, end } = getDateRange(timeFilter);

      // Get all transactions from selected wallets
      const allTransactions = getAllTransactions(
        wallets,
        selectedWalletIds.length > 0 ? selectedWalletIds : null
      );

      // Filter by date range
      const filteredTransactions = filterTransactionsByDate(allTransactions, start, end);

      // Calculate totals
      const totals = calculateTotals(filteredTransactions);

      // Group data for charts
      const trendData = groupByDate(filteredTransactions, timeFilter === '1Y' ? 'month' : 'day');
      const categoryData = groupByCategory(filteredTransactions, 'expense');
      const monthlyData = groupByDate(filteredTransactions, 'month');
      const topCategories = getTopCategories(filteredTransactions, 5);

      // Calculate averages
      const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const averages = calculateAverages(filteredTransactions, periodDays);

      setLoading(false);

      return {
        totals,
        trendData,
        categoryData,
        monthlyData,
        topCategories,
        averages,
        transactionCount: filteredTransactions.length
      };
    } catch (err) {
      console.error('Analytics calculation error:', err);
      setError(err);
      setLoading(false);
      return null;
    }
  }, [wallets, timeFilter, selectedWalletIds]);

  const handleWalletToggle = (walletId) => {
    setSelectedWalletIds(prev => {
      if (prev.includes(walletId)) {
        return prev.filter(id => id !== walletId);
      } else {
        return [...prev, walletId];
      }
    });
  };

  const handleSelectAllWallets = () => {
    if (selectedWalletIds.length === wallets.length) {
      setSelectedWalletIds([]);
    } else {
      setSelectedWalletIds(wallets.map(w => w.id || w.accountID));
    }
  };

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <div className="error-icon">⚠️</div>
          <h3>Failed to load analytics</h3>
          <p>An error occurred while processing your data. Please try again.</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <p className="analytics-subtitle">Track your financial insights and trends</p>
      </div>

      {/* Filters */}
      <div className="analytics-filters">
        {/* Time Range Filter */}
        <div className="filter-section">
          <label>Time Range</label>
          <div className="time-filter-buttons">
            {TIME_FILTERS.map(filter => (
              <button
                key={filter}
                className={`time-filter-btn ${timeFilter === filter ? 'active' : ''}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Filter */}
        <div className="filter-section">
          <label>Wallets/Accounts</label>
          <div className="wallet-filter">
            <button 
              className="wallet-filter-all"
              onClick={handleSelectAllWallets}
            >
              {selectedWalletIds.length === wallets.length ? '✓ All Selected' : 'Select All'}
            </button>
            <div className="wallet-chips">
              {wallets.map(wallet => (
                <button
                  key={wallet.id || wallet.accountID}
                  className={`wallet-chip ${
                    selectedWalletIds.includes(wallet.id || wallet.accountID) || 
                    selectedWalletIds.length === 0 ? 'active' : ''
                  }`}
                  onClick={() => handleWalletToggle(wallet.id || wallet.accountID)}
                >
                  {wallet.name || wallet.accountName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Calculating analytics...</p>
        </div>
      ) : analyticsData ? (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon income">💰</div>
              <div className="stat-content">
                <p className="stat-label">Total Income</p>
                <h3 className="stat-value">{formatCurrency(analyticsData.totals.income)}</h3>
                <p className="stat-change positive">
                  <span className="arrow">↑</span> vs previous period
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon expense">💸</div>
              <div className="stat-content">
                <p className="stat-label">Total Expenses</p>
                <h3 className="stat-value">{formatCurrency(analyticsData.totals.expenses)}</h3>
                <p className="stat-change negative">
                  <span className="arrow">↓</span> vs previous period
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon net">
                {analyticsData.totals.net >= 0 ? '📈' : '📉'}
              </div>
              <div className="stat-content">
                <p className="stat-label">Net Savings</p>
                <h3 className={`stat-value ${analyticsData.totals.net >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(analyticsData.totals.net)}
                </h3>
                <p className="stat-info">
                  {analyticsData.totals.net >= 0 ? 'Great job!' : 'Spending exceeds income'}
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon average">📅</div>
              <div className="stat-content">
                <p className="stat-label">Avg Daily Spending</p>
                <h3 className="stat-value">{formatCurrency(analyticsData.averages.daily)}</h3>
                <p className="stat-info">
                  Weekly: {formatCurrency(analyticsData.averages.weekly)}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Spending Trends */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Spending Trends</h3>
                <p className="chart-subtitle">Income and expenses over time</p>
              </div>
              <div className="chart-container">
                <SpendingTrendsChart data={analyticsData.trendData} />
              </div>
            </div>

            {/* Income vs Expenses */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Income vs Expenses</h3>
                <p className="chart-subtitle">Daily comparison</p>
              </div>
              <div className="chart-container">
                <IncomeVsExpensesChart data={analyticsData.trendData} />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Spending by Category</h3>
                <p className="chart-subtitle">Distribution of expenses</p>
              </div>
              <div className="chart-container">
                <CategoryPieChart data={analyticsData.categoryData} />
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Monthly Comparison</h3>
                <p className="chart-subtitle">Spending patterns across months</p>
              </div>
              <div className="chart-container">
                <MonthlyComparisonChart data={analyticsData.monthlyData} />
              </div>
            </div>

            {/* Top Categories */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Top Spending Categories</h3>
                <p className="chart-subtitle">Your biggest expenses</p>
              </div>
              <div className="top-categories">
                {analyticsData.topCategories.length > 0 ? (
                  analyticsData.topCategories.map((cat, index) => (
                    <div key={cat.category} className="category-item">
                      <div className="category-info">
                        <span className="category-rank">#{index + 1}</span>
                        <span className="category-name">{cat.category}</span>
                      </div>
                      <div className="category-stats">
                        <span className="category-amount">{formatCurrency(cat.value)}</span>
                        <span className="category-count">{cat.count} transactions</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No category data available</p>
                )}
              </div>
            </div>

            {/* Summary Info */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Summary</h3>
                <p className="chart-subtitle">Quick overview</p>
              </div>
              <div className="summary-info">
                <div className="summary-item">
                  <span className="summary-label">Total Transactions</span>
                  <span className="summary-value">{analyticsData.transactionCount}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Active Wallets</span>
                  <span className="summary-value">
                    {selectedWalletIds.length === 0 ? wallets.length : selectedWalletIds.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Categories Tracked</span>
                  <span className="summary-value">{analyticsData.categoryData.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Period</span>
                  <span className="summary-value">{timeFilter}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="analytics-empty">
          <div className="empty-icon">📊</div>
          <h3>No data available</h3>
          <p>Start adding transactions to see your financial analytics</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;

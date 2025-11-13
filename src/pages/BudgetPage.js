import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import BudgetForm from '../components/BudgetForm';
import BudgetItem from '../components/BudgetItem';
import './BudgetPage.css';

const BudgetPage = () => {
  const { 
    wallets, 
    budgets, 
    selectedWalletId,
    setSelectedWalletId,
    calculateBudgetSpent,
    getApplicableBudgets,
    addBudget,
    updateBudget,
    deleteBudget
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [filterWallet, setFilterWallet] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('category');

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = new Set(budgets.map(b => b.category));
    return Array.from(cats).sort();
  }, [budgets]);

  // Get budgets with calculated spent amounts
  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => ({
      ...budget,
      spent: calculateBudgetSpent(budget)
    }));
  }, [budgets, calculateBudgetSpent]);

  // Filter and sort budgets
  const filteredBudgets = useMemo(() => {
    let filtered = budgetsWithSpent;

    // Filter by wallet
    if (filterWallet !== 'all') {
      if (filterWallet === 'global') {
        filtered = filtered.filter(b => b.walletID === null);
      } else if (filterWallet === 'current') {
        const applicable = getApplicableBudgets(selectedWalletId);
        filtered = filtered.filter(b => applicable.some(ab => ab.id === b.id));
      } else {
        filtered = filtered.filter(b => b.walletID === parseInt(filterWallet));
      }
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(b => b.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category);
        case 'limit':
          return b.limit - a.limit;
        case 'spent':
          return b.spent - a.spent;
        case 'percentage':
          const percA = a.limit > 0 ? (a.spent / a.limit) * 100 : 0;
          const percB = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
          return percB - percA;
        case 'date':
          return new Date(b.dateSet) - new Date(a.dateSet);
        default:
          return 0;
      }
    });

    return filtered;
  }, [budgetsWithSpent, filterWallet, filterCategory, sortBy, selectedWalletId, getApplicableBudgets]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const relevantBudgets = filterWallet === 'current' 
      ? getApplicableBudgets(selectedWalletId)
      : budgetsWithSpent;

    const totalLimit = relevantBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = relevantBudgets.reduce((sum, b) => sum + b.spent, 0);
    const exceededCount = relevantBudgets.filter(b => b.spent > b.limit).length;
    const warningCount = relevantBudgets.filter(b => {
      const perc = (b.spent / b.limit) * 100;
      return perc >= 80 && perc < 100;
    }).length;

    return { totalLimit, totalSpent, exceededCount, warningCount };
  }, [budgetsWithSpent, filterWallet, selectedWalletId, getApplicableBudgets]);

  const handleSubmit = (formData) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, formData);
    } else {
      addBudget(formData);
    }
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(budgetId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <div className="budget-page">
      <div className="budget-header">
        <div className="budget-header-top">
          <h1>💰 Budget Management</h1>
          <button onClick={() => setShowForm(true)} className="btn-add-budget">
            + Add Budget
          </button>
        </div>

        {/* Wallet Selector */}
        <div className="wallet-selector">
          <label>Current Wallet:</label>
          <select 
            value={selectedWalletId} 
            onChange={(e) => setSelectedWalletId(parseInt(e.target.value))}
          >
            {wallets.map(wallet => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} (${wallet.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="budget-summary">
          <div className="summary-card">
            <div className="summary-label">Total Budget</div>
            <div className="summary-value">${summary.totalLimit.toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Spent</div>
            <div className="summary-value">${summary.totalSpent.toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Exceeded</div>
            <div className="summary-value exceeded">{summary.exceededCount}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Warning</div>
            <div className="summary-value warning">{summary.warningCount}</div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="budget-controls">
        <div className="filter-group">
          <label>Filter by Wallet:</label>
          <select value={filterWallet} onChange={(e) => setFilterWallet(e.target.value)}>
            <option value="all">All Budgets</option>
            <option value="current">Current Wallet (Applicable)</option>
            <option value="global">Global Only</option>
            {wallets.map(wallet => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} Only
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="category">Category</option>
            <option value="limit">Limit (High to Low)</option>
            <option value="spent">Spent (High to Low)</option>
            <option value="percentage">Usage % (High to Low)</option>
            <option value="date">Date Set (Newest)</option>
          </select>
        </div>
      </div>

      {/* Budget List */}
      <div className="budget-list">
        {filteredBudgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No budgets found</h3>
            <p>
              {budgets.length === 0 
                ? 'Create your first budget to start tracking your spending!'
                : 'Try adjusting your filters to see more budgets.'
              }
            </p>
            {budgets.length === 0 && (
              <button onClick={() => setShowForm(true)} className="btn-add-budget">
                Create Budget
              </button>
            )}
          </div>
        ) : (
          filteredBudgets.map(budget => (
            <BudgetItem
              key={budget.id}
              budget={budget}
              spent={budget.spent}
              onEdit={handleEdit}
              onDelete={handleDelete}
              wallets={wallets}
            />
          ))
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          wallets={wallets}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editingBudget={editingBudget}
        />
      )}
    </div>
  );
};

export default BudgetPage;

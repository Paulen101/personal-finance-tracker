import React from 'react';
import './BudgetItem.css';

const BudgetItem = ({ budget, spent, onEdit, onDelete, wallets }) => {
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
  
  // Determine status color
  const getStatusColor = () => {
    if (percentage >= 100) return '#EF4444'; // Red - exceeded
    if (percentage >= 80) return '#F59E0B'; // Yellow - warning
    return '#8B5CF6'; // Primary Purple - default under threshold
  };

  const getWalletName = () => {
    if (budget.walletID === null) return 'Global';
    const wallet = wallets.find(w => w.id === budget.walletID);
    return wallet ? wallet.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="budget-item">
      <div className="budget-item-header">
        <div className="budget-item-title">
          <h3>{budget.category}</h3>
          <span className={`budget-badge ${budget.walletID === null ? 'global' : 'wallet'}`}>
            {getWalletName()}
          </span>
        </div>
        <div className="budget-item-actions">
          <button onClick={() => onEdit(budget)} className="btn-edit" title="Edit">
            ✏️
          </button>
          <button onClick={() => onDelete(budget.id)} className="btn-delete" title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="budget-item-details">
        <div className="budget-amount">
          <span className="spent" style={{ color: getStatusColor() }}>
            ${Number(spent || 0).toFixed(2)}
          </span>
          <span className="separator">/</span>
          <span className="limit">${Number(budget.limit || 0).toFixed(2)}</span>
        </div>
        <div className="budget-percentage" style={{ color: getStatusColor() }}>
          {percentage.toFixed(1)}%
        </div>
      </div>

      <div className="budget-progress-bar">
        <div 
          className="budget-progress-fill" 
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: getStatusColor()
          }}
        />
      </div>

      <div className="budget-item-footer">
        <span className="budget-date">Set on {formatDate(budget.dateSet)}</span>
        {percentage >= 100 && (
          <span className="budget-warning">⚠️ Budget exceeded!</span>
        )}
        {percentage >= 80 && percentage < 100 && (
          <span className="budget-warning-soft">⚡ Approaching limit</span>
        )}
      </div>
    </div>
  );
};

export default BudgetItem;

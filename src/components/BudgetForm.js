import React, { useState, useEffect } from 'react';
import './BudgetForm.css';

const COMMON_CATEGORIES = [
  'Food',
  'Entertainment',
  'Transportation',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Utilities',
  'Other'
];

const BudgetForm = ({ wallets, onSubmit, onCancel, editingBudget }) => {
  const [formData, setFormData] = useState({
    walletID: 'global',
    category: '',
    limit: ''
  });

  const [useCustomCategory, setUseCustomCategory] = useState(false);

  useEffect(() => {
    if (editingBudget) {
      const walletId = editingBudget.walletID === null ? 'global' : editingBudget.walletID.toString();
      setFormData({
        walletID: walletId,
        category: editingBudget.category,
        limit: editingBudget.limit.toString()
      });
      
      // Check if category is custom
      if (!COMMON_CATEGORIES.includes(editingBudget.category)) {
        setUseCustomCategory(true);
      }
    }
  }, [editingBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit || parseFloat(formData.limit) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      walletID: 'global',
      category: '',
      limit: ''
    });
    setUseCustomCategory(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="budget-form-overlay">
      <div className="budget-form-container">
        <div className="budget-form-header">
          <h2>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label htmlFor="walletID">Budget Scope</label>
            <select
              id="walletID"
              name="walletID"
              value={formData.walletID}
              onChange={handleChange}
              required
            >
              <option value="global">🌐 Global (All Wallets)</option>
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  💰 {wallet.name}
                </option>
              ))}
            </select>
            <small className="form-hint">
              {formData.walletID === 'global' 
                ? 'This budget will apply to all wallets (unless a wallet-specific budget exists for the same category)'
                : 'This budget will only apply to the selected wallet'
              }
            </small>
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-toggle">
              <button
                type="button"
                className={!useCustomCategory ? 'active' : ''}
                onClick={() => {
                  setUseCustomCategory(false);
                  setFormData(prev => ({ ...prev, category: '' }));
                }}
              >
                Select from List
              </button>
              <button
                type="button"
                className={useCustomCategory ? 'active' : ''}
                onClick={() => {
                  setUseCustomCategory(true);
                  setFormData(prev => ({ ...prev, category: '' }));
                }}
              >
                Custom Category
              </button>
            </div>

            {useCustomCategory ? (
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter custom category"
                required
              />
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {COMMON_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="limit">Budget Limit ($)</label>
            <input
              type="number"
              id="limit"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingBudget ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;

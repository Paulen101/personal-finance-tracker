// Demo data setup utility for testing the budget tracker

export const setupDemoData = () => {
  // Sample wallets with transactions
  const demoWallets = [
    {
      id: 0,
      cardNumber: "**** **** **** 0000",
      expiryDate:"11/27",
      name: 'Main Wallet',
      balance: 5000,
      transactions: [
        { id: 1, category: 'Food', amount: 45.50, type: 'expense', date: '2025-11-01T10:00:00Z', description: 'Grocery shopping' },
        { id: 2, category: 'Food', amount: 32.00, type: 'expense', date: '2025-11-03T12:30:00Z', description: 'Restaurant' },
        { id: 3, category: 'Entertainment', amount: 50.00, type: 'expense', date: '2025-11-05T19:00:00Z', description: 'Movie tickets' },
        { id: 4, category: 'Transportation', amount: 60.00, type: 'expense', date: '2025-11-06T08:00:00Z', description: 'Gas' },
        { id: 5, category: 'Food', amount: 28.75, type: 'expense', date: '2025-11-08T13:00:00Z', description: 'Lunch' },
        { id: 6, category: 'Shopping', amount: 150.00, type: 'income', date: '2025-11-10T16:00:00Z', description: 'Clothing' },
        { id: 7, category: 'Entertainment', amount: 25.00, type: 'expense', date: '2025-11-12T20:00:00Z', description: 'Concert' },
      ]
    },
    {
      id: 1,
      cardNumber: "**** **** **** 0001",
      expiryDate:"11/27",
      name: 'Savings Account',
      balance: 10000,
      transactions: [
        { id: 8, category: 'Bills', amount: 120.00, type: 'expense', date: '2025-11-01T09:00:00Z', description: 'Internet' },
        { id: 9, category: 'Bills', amount: 85.00, type: 'expense', date: '2025-11-05T09:00:00Z', description: 'Phone bill' },
      ]
    },
    {
      id: 2,
      cardNumber: "**** **** **** 0002",
      expiryDate:"11/27",
      name: 'Business Account',
      balance: 15000,
      transactions: [
        { id: 10, category: 'Education', amount: 200.00, type: 'expense', date: '2025-11-02T10:00:00Z', description: 'Online course' },
        { id: 11, category: 'Transportation', amount: 45.00, type: 'expense', date: '2025-11-04T07:30:00Z', description: 'Uber' },
      ]
    }
  ];

  // Sample budgets
  const demoBudgets = [
    {
      id: 1,
      walletID: 0,
      category: 'Food',
      limit: 200,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    },
    {
      id: 2,
      walletID: null, // Global budget
      category: 'Entertainment',
      limit: 150,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    },
    {
      id: 3,
      walletID: 0,
      category: 'Transportation',
      limit: 100,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    },
    {
      id: 4,
      walletID: null, // Global budget
      category: 'Shopping',
      limit: 300,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    },
    {
      id: 5,
      walletID: 1,
      category: 'Bills',
      limit: 250,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    },
    {
      id: 6,
      walletID: 2,
      category: 'Education',
      limit: 500,
      spent: 0,
      dateSet: '2025-11-01T10:00:00Z'
    }
  ];

  // Save to localStorage
  localStorage.setItem('finance_wallets', JSON.stringify(demoWallets));
  localStorage.setItem('finance_budgets', JSON.stringify(demoBudgets));

  console.log('[SUCCESS] Demo data loaded successfully!');
  console.log('[DATA] Wallets:', demoWallets.length);
  console.log('[DATA] Budgets:', demoBudgets.length);
  
  return { demoWallets, demoBudgets };
};

export const clearDemoData = () => {
  localStorage.removeItem('finance_wallets');
  localStorage.removeItem('finance_budgets');
  console.log('[CLEARED] Demo data cleared!');
};

// Auto-load demo data if localStorage is empty (for first-time users)
export const initializeDemoDataIfNeeded = () => {
  const hasWallets = localStorage.getItem('finance_wallets');
  const hasBudgets = localStorage.getItem('finance_budgets');
  
  if (!hasWallets || !hasBudgets) {
    console.log('[INIT] Initializing with demo data...');
    setupDemoData();
  }
};

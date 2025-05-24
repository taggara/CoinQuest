import { Transaction, TransactionCreate, TransactionFilter } from '@/types';
import { Database } from '@/services/database';

// Mock transactions for demo
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2023-05-01T08:30:00Z',
    type: 'expense',
    amount: 45.99,
    category: 'Groceries',
    categoryId: 1,
    merchant: 'Whole Foods',
    merchantId: 1,
    notes: 'Weekly groceries'
  },
  {
    id: 2,
    date: '2023-05-03T12:15:00Z',
    type: 'expense',
    amount: 12.50,
    category: 'Food & Dining',
    categoryId: 2,
    merchant: 'Starbucks',
    merchantId: 2,
    notes: 'Coffee with colleagues'
  },
  {
    id: 3,
    date: '2023-05-05T14:20:00Z',
    type: 'income',
    amount: 2000.00,
    category: 'Salary',
    categoryId: 3,
    merchant: 'ABC Company',
    merchantId: 3,
    notes: 'Monthly salary'
  },
  {
    id: 4,
    date: '2023-05-10T09:45:00Z',
    type: 'expense',
    amount: 89.99,
    category: 'Entertainment',
    categoryId: 4,
    merchant: 'Netflix',
    merchantId: 4,
    notes: 'Annual subscription'
  },
  {
    id: 5,
    date: '2023-05-15T17:30:00Z',
    type: 'expense',
    amount: 42.75,
    category: 'Transportation',
    categoryId: 5,
    merchant: 'Gas Station',
    merchantId: 5,
    notes: 'Fuel refill'
  }
];

let transactions = [...mockTransactions];
let nextId = transactions.length + 1;

export const fetchTransactions = async (filters?: TransactionFilter): Promise<Transaction[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let result = [...transactions];
  
  if (filters) {
    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(t => 
        t.merchant.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }
    
    if (filters.startDate) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.startDate as string));
    }
    
    if (filters.endDate) {
      result = result.filter(t => new Date(t.date) <= new Date(filters.endDate as string));
    }
    
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(t => filters.categories.includes(t.categoryId));
    }
    
    if (filters.merchants && filters.merchants.length > 0) {
      result = result.filter(t => filters.merchants.includes(t.merchantId));
    }
    
    if (filters.transactionType) {
      result = result.filter(t => t.type === filters.transactionType);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  } else {
    // Default sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  return result;
};

export const fetchRecentTransactions = async (limit: number): Promise<Transaction[]> => {
  const result = await fetchTransactions();
  return result.slice(0, limit);
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

export const addTransaction = async (data: TransactionCreate): Promise<Transaction> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTransaction: Transaction = {
    id: nextId++,
    ...data
  };
  
  transactions.unshift(newTransaction);
  
  return newTransaction;
};

export const updateTransaction = async (data: Transaction): Promise<Transaction> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = transactions.findIndex(t => t.id === data.id);
  
  if (index === -1) {
    throw new Error('Transaction not found');
  }
  
  transactions[index] = { ...data };
  
  return transactions[index];
};

export const deleteTransaction = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    throw new Error('Transaction not found');
  }
  
  transactions.splice(index, 1);
};

export const fetchMonthlyData = async (): Promise<{
  income: number;
  expenses: number;
  balance: number;
  budgetUsed: number;
  budgetTotal: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Get current month's transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const income = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    budgetUsed: expenses,
    budgetTotal: 2500 // Mock budget total
  };
};
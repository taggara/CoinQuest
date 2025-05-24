// Transaction types
export interface Transaction {
  id: number;
  date: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  categoryId: number;
  merchant: string;
  merchantId: number;
  notes?: string;
}

export type TransactionCreate = Omit<Transaction, 'id'>;

export interface TransactionFilter {
  startDate?: string | null;
  endDate?: string | null;
  categories?: number[];
  merchants?: number[];
  transactionType?: 'expense' | 'income' | null;
  searchQuery?: string;
  sortOrder?: 'asc' | 'desc';
}

// Category types
export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
}

export type CategoryCreate = Omit<Category, 'id'>;

// Merchant types
export interface Merchant {
  id: number;
  name: string;
  category?: string;
}

export type MerchantCreate = Omit<Merchant, 'id'>;

// Budget types
export interface Budget {
  id: number;
  categoryId: number;
  category: string;
  amount: number;
  month: number;
  year: number;
}

export interface CategorySpending {
  categoryId: number;
  category: string;
  amount: number;
  previousMonthAmount: number;
}

// Prediction types
export interface PredictedExpense {
  id: number;
  merchantId: number;
  merchant: string;
  categoryId: number;
  category: string;
  predictedAmount: number;
  predictedDate: string;
  confidence: number;
}
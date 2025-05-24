import { Budget, CategorySpending } from '@/types';

// Mock budgets for demo
const mockBudgets: Budget[] = [
  { id: 1, categoryId: 1, category: 'Groceries', amount: 500, month: 4, year: 2023 },
  { id: 2, categoryId: 2, category: 'Food & Dining', amount: 300, month: 4, year: 2023 },
  { id: 3, categoryId: 4, category: 'Entertainment', amount: 150, month: 4, year: 2023 },
  { id: 4, categoryId: 5, category: 'Transportation', amount: 200, month: 4, year: 2023 },
  { id: 5, categoryId: 6, category: 'Shopping', amount: 200, month: 4, year: 2023 },
  { id: 6, categoryId: 7, category: 'Health', amount: 100, month: 4, year: 2023 },
  { id: 7, categoryId: 8, category: 'Utilities', amount: 150, month: 4, year: 2023 }
];

// Mock category spending for demo
const mockCategorySpending: CategorySpending[] = [
  { categoryId: 1, category: 'Groceries', amount: 350, previousMonthAmount: 420 },
  { categoryId: 2, category: 'Food & Dining', amount: 275, previousMonthAmount: 260 },
  { categoryId: 4, category: 'Entertainment', amount: 120, previousMonthAmount: 150 },
  { categoryId: 5, category: 'Transportation', amount: 180, previousMonthAmount: 210 },
  { categoryId: 6, category: 'Shopping', amount: 220, previousMonthAmount: 180 },
  { categoryId: 7, category: 'Health', amount: 50, previousMonthAmount: 70 },
  { categoryId: 8, category: 'Utilities', amount: 130, previousMonthAmount: 140 }
];

export const fetchBudgets = async (month?: number, year?: number): Promise<Budget[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // If month/year not provided, use current month
  if (month === undefined || year === undefined) {
    const now = new Date();
    month = now.getMonth();
    year = now.getFullYear();
  }
  
  // In a real app, this would filter by month/year from the database
  // Here we're just returning the mock data
  return mockBudgets;
};

export const fetchCategorySpending = async (month?: number, year?: number): Promise<CategorySpending[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would calculate actual spending by category for the given month
  // Here we're just returning the mock data
  return mockCategorySpending;
};

export const updateBudget = async (budget: Budget): Promise<Budget> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would update the budget in the database
  // Here we're just returning the input
  return budget;
};

export const createBudget = async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would create a new budget in the database
  // Here we're just returning a new budget with a mock ID
  return {
    ...budget,
    id: Math.floor(Math.random() * 1000) + 10
  };
};
import { PredictedExpense } from '@/types';

// Mock upcoming expenses for demo
const mockUpcomingExpenses: PredictedExpense[] = [
  {
    id: 1,
    merchantId: 4,
    merchant: 'Netflix',
    categoryId: 4,
    category: 'Entertainment',
    predictedAmount: 14.99,
    predictedDate: '2023-06-15T00:00:00Z',
    confidence: 0.95
  },
  {
    id: 2,
    merchantId: 10,
    merchant: 'Spotify',
    categoryId: 4,
    category: 'Entertainment',
    predictedAmount: 9.99,
    predictedDate: '2023-06-20T00:00:00Z',
    confidence: 0.92
  },
  {
    id: 3,
    merchantId: 9,
    merchant: 'Rent',
    categoryId: 9,
    category: 'Housing',
    predictedAmount: 1200.00,
    predictedDate: '2023-06-01T00:00:00Z',
    confidence: 0.99
  },
  {
    id: 4,
    merchantId: 8,
    merchant: 'Electric Company',
    categoryId: 8,
    category: 'Utilities',
    predictedAmount: 85.50,
    predictedDate: '2023-06-05T00:00:00Z',
    confidence: 0.85
  }
];

export const fetchUpcomingExpenses = async (): Promise<PredictedExpense[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockUpcomingExpenses;
};
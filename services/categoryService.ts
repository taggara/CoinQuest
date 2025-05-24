import { Category, CategoryCreate } from '@/types';

// Mock categories for demo
const mockCategories: Category[] = [
  { id: 1, name: 'Groceries', type: 'expense' },
  { id: 2, name: 'Food & Dining', type: 'expense' },
  { id: 3, name: 'Salary', type: 'income' },
  { id: 4, name: 'Entertainment', type: 'expense' },
  { id: 5, name: 'Transportation', type: 'expense' },
  { id: 6, name: 'Shopping', type: 'expense' },
  { id: 7, name: 'Health', type: 'expense' },
  { id: 8, name: 'Utilities', type: 'expense' },
  { id: 9, name: 'Rent', type: 'expense' },
  { id: 10, name: 'Gifts', type: 'expense' },
  { id: 11, name: 'Freelance', type: 'income' },
  { id: 12, name: 'Investments', type: 'income' }
];

let categories = [...mockCategories];
let nextId = categories.length + 1;

export const fetchCategories = async (type?: 'expense' | 'income'): Promise<Category[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (type) {
    return categories.filter(c => c.type === type);
  }
  
  return categories;
};

export const getCategory = async (id: number): Promise<Category> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  return category;
};

export const addCategory = async (data: CategoryCreate): Promise<Category> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCategory: Category = {
    id: nextId++,
    ...data
  };
  
  categories.push(newCategory);
  
  return newCategory;
};

export const updateCategory = async (data: Category): Promise<Category> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = categories.findIndex(c => c.id === data.id);
  
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  categories[index] = { ...data };
  
  return categories[index];
};

export const deleteCategory = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  categories.splice(index, 1);
};
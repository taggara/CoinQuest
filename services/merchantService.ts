import { Merchant, MerchantCreate } from '@/types';

// Mock merchants for demo
const mockMerchants: Merchant[] = [
  { id: 1, name: 'Whole Foods', category: 'Grocery Store' },
  { id: 2, name: 'Starbucks', category: 'Coffee Shop' },
  { id: 3, name: 'ABC Company', category: 'Employer' },
  { id: 4, name: 'Netflix', category: 'Entertainment' },
  { id: 5, name: 'Gas Station', category: 'Fuel' },
  { id: 6, name: 'Amazon', category: 'Online Shopping' },
  { id: 7, name: 'Target', category: 'Retail' },
  { id: 8, name: 'Walmart', category: 'Retail' },
  { id: 9, name: 'Uber', category: 'Transportation' },
  { id: 10, name: 'Spotify', category: 'Entertainment' }
];

let merchants = [...mockMerchants];
let nextId = merchants.length + 1;

export const fetchMerchants = async (): Promise<Merchant[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return merchants;
};

export const getMerchant = async (id: number): Promise<Merchant> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const merchant = merchants.find(m => m.id === id);
  
  if (!merchant) {
    throw new Error('Merchant not found');
  }
  
  return merchant;
};

export const addMerchant = async (data: MerchantCreate): Promise<Merchant> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMerchant: Merchant = {
    id: nextId++,
    ...data
  };
  
  merchants.push(newMerchant);
  
  return newMerchant;
};

export const updateMerchant = async (data: Merchant): Promise<Merchant> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = merchants.findIndex(m => m.id === data.id);
  
  if (index === -1) {
    throw new Error('Merchant not found');
  }
  
  merchants[index] = { ...data };
  
  return merchants[index];
};

export const deleteMerchant = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = merchants.findIndex(m => m.id === id);
  
  if (index === -1) {
    throw new Error('Merchant not found');
  }
  
  merchants.splice(index, 1);
};
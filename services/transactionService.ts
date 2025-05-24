import { Transaction, TransactionCreate, TransactionFilter } from '@/types';
import { Database } from '@/services/database';

const db = Database.getInstance();

export const fetchTransactions = async (filters?: TransactionFilter): Promise<Transaction[]> => {
  let query = `
    SELECT 
      t.id,
      t.date,
      t.type,
      t.amount,
      c.name as category,
      t.category_id as categoryId,
      m.name as merchant,
      t.merchant_id as merchantId,
      t.notes
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN merchants m ON t.merchant_id = m.id
    WHERE 1=1
  `;
  
  const params: any[] = [];

  if (filters) {
    if (filters.searchQuery) {
      query += ` AND (m.name LIKE ? OR c.name LIKE ? OR t.notes LIKE ?)`;
      const searchTerm = `%${filters.searchQuery}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.startDate) {
      query += ` AND t.date >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND t.date <= ?`;
      params.push(filters.endDate);
    }

    if (filters.categories && filters.categories.length > 0) {
      query += ` AND t.category_id IN (${filters.categories.join(',')})`;
    }

    if (filters.merchants && filters.merchants.length > 0) {
      query += ` AND t.merchant_id IN (${filters.merchants.join(',')})`;
    }

    if (filters.transactionType) {
      query += ` AND t.type = ?`;
      params.push(filters.transactionType);
    }

    query += ` ORDER BY t.date ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
  } else {
    query += ` ORDER BY t.date DESC`;
  }

  const result = await db.executeQuery(query, params);
  return result.rows.map((row: any) => ({
    id: row.id,
    date: row.date,
    type: row.type,
    amount: row.amount,
    category: row.category,
    categoryId: row.categoryId,
    merchant: row.merchant,
    merchantId: row.merchantId,
    notes: row.notes
  }));
};

export const fetchRecentTransactions = async (limit: number): Promise<Transaction[]> => {
  const query = `
    SELECT 
      t.id,
      t.date,
      t.type,
      t.amount,
      c.name as category,
      t.category_id as categoryId,
      m.name as merchant,
      t.merchant_id as merchantId,
      t.notes
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN merchants m ON t.merchant_id = m.id
    ORDER BY t.date DESC
    LIMIT ?
  `;

  const result = await db.executeQuery(query, [limit]);
  return result.rows.map((row: any) => ({
    id: row.id,
    date: row.date,
    type: row.type,
    amount: row.amount,
    category: row.category,
    categoryId: row.categoryId,
    merchant: row.merchant,
    merchantId: row.merchantId,
    notes: row.notes
  }));
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const query = `
    SELECT 
      t.id,
      t.date,
      t.type,
      t.amount,
      c.name as category,
      t.category_id as categoryId,
      m.name as merchant,
      t.merchant_id as merchantId,
      t.notes
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN merchants m ON t.merchant_id = m.id
    WHERE t.id = ?
  `;

  const result = await db.executeQuery(query, [id]);
  if (result.rows.length === 0) {
    throw new Error('Transaction not found');
  }

  const row = result.rows[0];
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    amount: row.amount,
    category: row.category,
    categoryId: row.categoryId,
    merchant: row.merchant,
    merchantId: row.merchantId,
    notes: row.notes
  };
};

export const addTransaction = async (data: TransactionCreate): Promise<Transaction> => {
  const query = `
    INSERT INTO transactions (
      date,
      type,
      amount,
      category_id,
      merchant_id,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const result = await db.executeQuery(query, [
    data.date,
    data.type,
    data.amount,
    data.categoryId,
    data.merchantId,
    data.notes
  ]);

  return getTransaction(result.lastInsertId);
};

export const updateTransaction = async (data: Transaction): Promise<Transaction> => {
  const query = `
    UPDATE transactions
    SET 
      date = ?,
      type = ?,
      amount = ?,
      category_id = ?,
      merchant_id = ?,
      notes = ?
    WHERE id = ?
  `;

  await db.executeQuery(query, [
    data.date,
    data.type,
    data.amount,
    data.categoryId,
    data.merchantId,
    data.notes,
    data.id
  ]);

  return getTransaction(data.id);
};

export const deleteTransaction = async (id: number): Promise<void> => {
  const query = `DELETE FROM transactions WHERE id = ?`;
  await db.executeQuery(query, [id]);
};

export const fetchMonthlyData = async (): Promise<{
  income: number;
  expenses: number;
  balance: number;
  budgetUsed: number;
  budgetTotal: number;
}> => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  // Get income and expenses
  const query = `
    SELECT 
      type,
      SUM(amount) as total
    FROM transactions
    WHERE date >= ? AND date <= ?
    GROUP BY type
  `;

  const result = await db.executeQuery(query, [firstDayOfMonth, lastDayOfMonth]);
  
  let income = 0;
  let expenses = 0;

  result.rows.forEach((row: any) => {
    if (row.type === 'income') {
      income = row.total;
    } else {
      expenses = row.total;
    }
  });

  // Get budget data
  const budgetQuery = `
    SELECT SUM(amount) as total
    FROM budgets
    WHERE month = ? AND year = ?
  `;

  const budgetResult = await db.executeQuery(budgetQuery, [now.getMonth() + 1, now.getFullYear()]);
  const budgetTotal = budgetResult.rows[0]?.total || 0;

  return {
    income,
    expenses,
    balance: income - expenses,
    budgetUsed: expenses,
    budgetTotal
  };
};
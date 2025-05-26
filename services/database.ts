import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db',
});

export class Database {
  static instance: Database;
  private db: typeof client;

  private constructor() {
    this.db = client;
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.db.execute(query, params);
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async initializeTables(): Promise<void> {
    // Create transactions table
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        amount REAL NOT NULL,
        category_id INTEGER NOT NULL,
        merchant_id INTEGER NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (merchant_id) REFERENCES merchants (id)
      )
    `);

    // Create categories table
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create merchants table
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS merchants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create budgets table
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        UNIQUE(category_id, month, year)
      )
    `);

    // Create logs table
    await this.executeQuery(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        details TEXT,
        component TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}

// Initialize database and tables
export const initDatabase = async (): Promise<void> => {
  const db = Database.getInstance();
  await db.initializeTables();
  console.log('Database initialized');
};
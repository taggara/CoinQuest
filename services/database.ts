import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: 'admin',
  host: '192.168.4.52',
  database: 'coinquest',
  password: 'x7f2*WdV=M^=Fs&',
  port: 5432, 
});

export class Database {
  static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async initializeTables(): Promise<void> {
    try {
      // Create transactions table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          date TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
          amount REAL NOT NULL,
          category_id INTEGER NOT NULL,
          merchant_id INTEGER NOT NULL,
          notes TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create categories table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create merchants table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS merchants (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          category TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create budgets table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS budgets (
          id SERIAL PRIMARY KEY,
          category_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          month INTEGER NOT NULL,
          year INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create logs table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS logs (
          id SERIAL PRIMARY KEY,
          timestamp TEXT NOT NULL,
          level TEXT NOT NULL,
          message TEXT NOT NULL,
          details TEXT,
          component TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert initial categories
      await this.executeQuery(`
        INSERT INTO categories (name, type)
        VALUES
        ('Bills', 'expense'),
        ('Body', 'expense'),
        ('Car', 'income'),
        ('Cats', 'expense'),
        ('Food', 'expense'),
        ('Gifts', 'expense'),
        ('House', 'expense'),
        ('Leisure', 'expense'),
        ('Rent', 'expense'),
        ('Subscription', 'expense'),
        ('Transfer', 'expense'),
        ('Income', 'income')
        ON CONFLICT (name) DO NOTHING
      `);

      // Insert initial merchants
      await this.executeQuery(`
        INSERT INTO merchants (name, category)
        VALUES
        ('7-Eleven', 'Food'),
        ('A24', 'Subscription'),
        ('AAA Discount Liquor', 'Leisure'),
        ('Acapulco Tropical', 'Food'),
        ('Accurate Backflow Testing', 'House'),
        ('Ace Hardware', 'House'),
        ('Advanced Auto Parts', 'Car'),
        ('Airbnb', 'Leisure'),
        ('Aldi', 'Food'),
        ('Amazon', 'Cats'),
        ('AMC', 'Leisure'),
        ('Amoco', 'Car'),
        ('AppleTV+', 'Subscription'),
        ('At Home', 'Leisure'),
        ('AT&T', 'Bills'),
        ('Atlanta Botanical Garden', 'Leisure'),
        ('ATM Withdrawal', 'Gifts'),
        ('Autozone', 'Car'),
        ('AVG', 'Subscription'),
        ('Bambu Lab', 'Leisure'),
        ('Bath and Body Works', 'Leisure'),
        ('Best Buy', 'Gifts'),
        ('Big Boy Vapors', 'Leisure'),
        ('Billabong', 'Body'),
        ('Blink Camera', 'Subscription'),
        ('Blizzard', 'Subscription'),
        ('Bolt.new AI', 'Subscription'),
        ('Busch Gardens', 'Leisure'),
        ('Capital One', 'Transfer'),
        ('CCB Sarasota', 'Leisure'),
        ('Chevron', 'Car'),
        ('Chipotle', 'Food'),
        ('Circle K', 'Car'),
        ('Citi', 'Transfer'),
        ('Cloudflare', 'Subscription'),
        ('Columbia Outlet Store', 'Body'),
        ('Connecticut & Gulf Coast ADHD Associates', 'Body'),
        ('Costco', 'Food'),
        ('Cracker Barrel', 'Food'),
        ('Crocs', 'Gifts'),
        ('Culvers', 'Leisure'),
        ('Das Kaffee Haus', 'Leisure'),
        ('Detwilers', 'Food'),
        ('Discord', 'Subscription'),
        ('DLZ Services', 'Leisure'),
        ('Dollar General', 'Food'),
        ('Dollar Tree', 'House'),
        ('Ebay - Seller', 'Income'),
        ('Ellenton Animal Hospital', 'Cats'),
        ('Embers to Ashes', 'Leisure'),
        ('Etsy - Buyer', 'Leisure'),
        ('Etsy - Seller', 'Income'),
        ('Expedia', 'Leisure'),
        ('Expedition: Big Foot Museum', 'Leisure'),
        ('Fairgrounds St. Pete', 'Gifts'),
        ('FEMA', 'Income'),
        ('First Watch', 'Leisure'),
        ('Fit2Run', 'Leisure'),
        ('Five Below', 'House'),
        ('Five-O Donut Co', 'Leisure'),
        ('FPL', 'Bills'),
        ('Frontier', 'Bills'),
        ('GameBreaker', 'Gifts'),
        ('Geico', 'Car'),
        ('Google', 'Subscription'),
        ('Google Drive', 'Subscription'),
        ('Helara.com', 'Gifts'),
        ('Hendrick Honda of Bradenton', 'Car'),
        ('HOA Assessment', 'Bills'),
        ('Home Goods', 'House'),
        ('Hot Wax Glass', 'Leisure'),
        ('Huck''s General Store', 'Leisure'),
        ('Jangle''s Jungle', 'Leisure'),
        ('Jersey Mike''s', 'Food'),
        ('Kickstarter', 'Gifts'),
        ('KittenFy', 'Gifts'),
        ('LabCorp', 'Body'),
        ('Life and Food Super Store', 'Leisure'),
        ('L''Oreal Company Store', 'Body'),
        ('L''Oreal USA', 'Income'),
        ('Lowes', 'House'),
        ('Mad Vapor', 'Leisure'),
        ('Manatee County', 'Bills'),
        ('Marshalls', 'House'),
        ('Microsoft', 'Subscription'),
        ('Mistrial AI', 'Subscription'),
        ('Mitchel Katz', 'Body'),
        ('MMTC', 'Body'),
        ('Mobil', 'Car'),
        ('Mother Kombucha', 'Leisure'),
        ('Muv', 'Leisure'),
        ('Naked Farmer', 'Leisure'),
        ('National Parks Service', 'Leisure'),
        ('Netflix', 'Subscription'),
        ('Newark Airport', 'Leisure'),
        ('Newegg', 'Leisure'),
        ('NOC Vending Machine', 'Leisure'),
        ('Nordstrom', 'Body'),
        ('Ono Roller', 'Gifts'),
        ('OpenAI', 'Subscription'),
        ('OpenSubtitles.org', 'Subscription'),
        ('Osaka Sushi', 'Leisure'),
        ('Paragon Pest', 'Bills'),
        ('ParkMobile', 'Leisure'),
        ('Penzu', 'Subscription'),
        ('Pets Supplies Plus', 'Cats'),
        ('Pezrok', 'Leisure'),
        ('Pinellas County', 'Leisure'),
        ('Pizza Hut', 'Leisure'),
        ('Pretty Litter', 'Subscription'),
        ('Private Internet Access', 'Subscription'),
        ('Publix', 'Food'),
        ('RaceTrak', 'Leisure'),
        ('Rayvolution', 'Leisure'),
        ('Regal Cinemas', 'Gifts'),
        ('Ring', 'Subscription'),
        ('River Street Tavern', 'Food'),
        ('Riverchase Dermatology', 'Body'),
        ('Sacred Smokes', 'Leisure'),
        ('Safelite', 'Car'),
        ('Saint Pete Parking', 'Leisure'),
        ('SalonCentric', 'Body'),
        ('Sarasota County', 'Leisure'),
        ('Sixty East Restaurant', 'Leisure'),
        ('Slack', 'Subscription'),
        ('SoulPath Counseling and Therapeutic Services, LLC', 'Body'),
        ('Soylent', 'Subscription'),
        ('Spotify', 'Subscription'),
        ('Squarespace', 'Subscription'),
        ('St. Pete Plant Fest', 'House'),
        ('Starbucks', 'Leisure'),
        ('State of Florida', 'Body'),
        ('State of Georgia', 'Car'),
        ('Stillwater''s Tavern', 'Leisure'),
        ('Sunpass', 'Car'),
        ('Take 5 Oil Change', 'Car'),
        ('Target', 'Body'),
        ('Teara Cincotta', 'Body'),
        ('TechSmith', 'Subscription'),
        ('The Clothes Mentor', 'Leisure'),
        ('The Green Room', 'Body'),
        ('Tiktok', 'Leisure'),
        ('Time To Pet', 'Cats'),
        ('TJ Maxx', 'Leisure'),
        ('TPG Products', 'Income'),
        ('Trader Joe''s', 'Body'),
        ('Tropical Smoothie', 'Food'),
        ('Truro Vineyards', 'Gifts'),
        ('Tsukino Sushi Bar', 'Food'),
        ('UltraCaviat', 'Body'),
        ('United States Postal Service', 'Leisure'),
        ('UnraidOS', 'Leisure'),
        ('UPS', 'Leisure'),
        ('Urban Outfitters', 'Leisure'),
        ('Venmo', 'Income'),
        ('Volcom', 'Body'),
        ('Walgreens', 'Body'),
        ('Walmart', 'Food'),
        ('Walkscape', 'Leisure'),
        ('Wealthfront', 'Income'),
        ('Wells Fargo', 'Bills'),
        ('Youtube Premium', 'Subscription'),
        ('Zelle', 'Income')
        ON CONFLICT (name) DO NOTHING
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
}

// Initialize database and tables
export const initDatabase = async (): Promise<void> => {
  try {
    const db = Database.getInstance();
    await db.initializeTables();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

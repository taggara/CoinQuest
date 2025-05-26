import { Database } from './database';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  id?: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: string;
  component?: string;
}

class LoggingService {
  private static instance: LoggingService;
  private db: Database;

  private constructor() {
    this.db = Database.getInstance();
    this.initializeLoggingTable();
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private async initializeLoggingTable(): Promise<void> {
    try {
      await this.db.executeQuery(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          level TEXT NOT NULL,
          message TEXT NOT NULL,
          details TEXT,
          component TEXT
        )
      `);
    } catch (error) {
      console.error('Failed to initialize logging table:', error);
    }
  }

  async log(level: LogLevel, message: string, details?: string, component?: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await this.db.executeQuery(
        `INSERT INTO logs (timestamp, level, message, details, component)
         VALUES (?, ?, ?, ?, ?)`,
        [timestamp, level, message, details, component]
      );
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  async getLogs(limit: number = 100, level?: LogLevel): Promise<LogEntry[]> {
    try {
      let query = 'SELECT * FROM logs';
      const params: any[] = [];

      if (level) {
        query += ' WHERE level = ?';
        params.push(level);
      }

      query += ' ORDER BY timestamp DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.executeQuery(query, params);
      return result.rows as LogEntry[];
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await this.db.executeQuery('DELETE FROM logs');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  // Convenience methods for different log levels
  async info(message: string, details?: string, component?: string): Promise<void> {
    await this.log(LogLevel.INFO, message, details, component);
  }

  async warning(message: string, details?: string, component?: string): Promise<void> {
    await this.log(LogLevel.WARNING, message, details, component);
  }

  async error(message: string, details?: string, component?: string): Promise<void> {
    await this.log(LogLevel.ERROR, message, details, component);
  }

  async debug(message: string, details?: string, component?: string): Promise<void> {
    await this.log(LogLevel.DEBUG, message, details, component);
  }
}

export const logger = LoggingService.getInstance();
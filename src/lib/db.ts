import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';

class Database {
  private static instance: Database | null = null;
  private client: any = null;
  private orm: any = null;
  private initializing: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async initialize() {
    if (this.initializing) {
      await this.initializing;
      return;
    }

    this.initializing = (async () => {
      try {
        // For development, use a local SQLite database
        this.client = createClient({
          url: 'file:smartcents.db',
        });

        this.orm = drizzle(this.client, { schema });

        // Test the connection
        await this.client.execute('SELECT 1');
        console.log('Database connection successful');
        
      } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
      }
    })();

    await this.initializing;
    this.initializing = null;
  }

  async getOrm() {
    if (!this.orm) {
      await this.initialize();
    }
    return this.orm;
  }
}

const database = Database.getInstance();

export const db = {
  query: schema,
  insert: async (...args: any[]) => (await database.getOrm()).insert(...args),
  select: async (...args: any[]) => (await database.getOrm()).select(...args),
  update: async (...args: any[]) => (await database.getOrm()).update(...args),
  delete: async (...args: any[]) => (await database.getOrm()).delete(...args),
};
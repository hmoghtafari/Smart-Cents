import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';

const client = createClient({
  url: 'file:smartcents.db',
});

const db = drizzle(client, { schema });

// Run migrations
migrate(db, { migrationsFolder: './drizzle' });

console.log('Migrations completed successfully');
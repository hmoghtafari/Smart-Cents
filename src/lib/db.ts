import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';

const client = createClient({
  url: 'file:smartcents.db',
});

export const db = drizzle(client, { schema });
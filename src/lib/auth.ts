import { db } from './db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

export interface User {
  id: string;
  email: string;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function signUp(email: string, password: string): Promise<User> {
  const hashedPassword = hashPassword(password);
  const userId = crypto.randomUUID();

  try {
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
    });

    return { id: userId, email };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  const hashedPassword = hashPassword(password);

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || user.password !== hashedPassword) {
    throw new Error('Invalid email or password');
  }

  return { id: user.id, email: user.email };
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user ? { id: user.id, email: user.email } : null;
}

export function signOut() {
  localStorage.removeItem('userId');
}
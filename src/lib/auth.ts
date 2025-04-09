import { db } from './db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sha256 } from 'js-sha256';

export interface User {
  id: string;
  email: string;
}

function hashPassword(password: string): string {
  return sha256(password);
}

export async function signUp(email: string, password: string): Promise<User> {
  const hashedPassword = hashPassword(password);
  const userId = crypto.randomUUID();

  try {
    // Check if email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email already exists');
    }

    const result = await db.insert(users)
      .values({
        id: userId,
        email,
        password: hashedPassword,
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error('Failed to create account');
    }

    return { id: userId, email };
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw new Error('Failed to create account. Please try again.');
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  const hashedPassword = hashPassword(password);

  try {
    const result = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user || user.password !== hashedPassword) {
      throw new Error('Invalid email or password');
    }

    return { id: user.id, email: user.email };
  } catch (error: any) {
    console.error('Signin error:', error);
    throw new Error('Invalid email or password');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  try {
    const result = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = result[0];
    return user ? { id: user.id, email: user.email } : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export function signOut() {
  localStorage.removeItem('userId');
}
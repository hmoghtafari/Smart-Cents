import { db } from "./db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { SHA256 } from "crypto-js"; // Changed import

export interface User {
  id: string;
  email: string;
}

function hashPassword(password: string): string {
  return SHA256(password).toString(); // Fixed hashing
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
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      throw new Error("Email already exists");
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
    throw new Error("Invalid email or password");
  }

  return { id: user.id, email: user.email };
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null; // Server-side guard

  const userId = localStorage.getItem("userId");
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user ? { id: user.id, email: user.email } : null;
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userId");
  }
}

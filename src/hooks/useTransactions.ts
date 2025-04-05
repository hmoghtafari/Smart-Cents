import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/db';
import { transactions, categories } from '../db/schema';
import { Transaction } from '../types';
import toast from 'react-hot-toast';
import { eq, and, gte, lte, like } from 'drizzle-orm';

export function useTransactions(filters?: {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense';
  categoryId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');

      let query = db.select().from(transactions).where(eq(transactions.userId, userId));

      if (filters?.startDate) {
        query = query.where(gte(transactions.date, filters.startDate.toISOString()));
      }
      if (filters?.endDate) {
        query = query.where(lte(transactions.date, filters.endDate.toISOString()));
      }
      if (filters?.type) {
        query = query.where(eq(transactions.type, filters.type));
      }
      if (filters?.categoryId) {
        query = query.where(eq(transactions.categoryId, filters.categoryId));
      }
      if (filters?.search) {
        query = query.where(like(transactions.description || '', `%${filters.search}%`));
      }

      const result = await query.orderBy(transactions.date);
      return result as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');

      const result = await db
        .insert(transactions)
        .values({
          ...transaction,
          userId,
          id: crypto.randomUUID(),
        })
        .returning();

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating transaction: ${error.message}`);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(transactions).where(eq(transactions.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting transaction: ${error.message}`);
    },
  });
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');

      const result = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .orderBy(transactions.date);

      const csv = [
        ['Date', 'Type', 'Amount', 'Category', 'Description'].join(','),
        ...result.map(t => [
          t.date,
          t.type,
          t.amount,
          t.categoryId,
          `"${t.description || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error(`Error exporting transactions: ${error.message}`);
    },
  });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/db';
import { categories } from '../db/schema';
import { Category } from '../types';
import toast from 'react-hot-toast';
import { eq } from 'drizzle-orm';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');

      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.userId, userId))
        .orderBy(categories.name);

      return result as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'user_id'>) => {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Not authenticated');

      const result = await db
        .insert(categories)
        .values({
          ...category,
          userId,
          id: crypto.randomUUID(),
        })
        .returning();

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating category: ${error.message}`);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<Category> & { id: string }) => {
      await db
        .update(categories)
        .set(category)
        .where(eq(categories.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating category: ${error.message}`);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, update any transactions using this category to null
      await db
        .update(transactions)
        .set({ categoryId: null })
        .where(eq(transactions.categoryId, id));

      // Then delete the category
      await db
        .delete(categories)
        .where(eq(categories.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting category: ${error.message}`);
    },
  });
}
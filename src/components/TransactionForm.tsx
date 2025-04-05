import React, { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { Category } from '../types';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { useCreateTransaction } from '../hooks/useTransactions';

interface TransactionFormProps {
  onClose: () => void;
  initialTab?: 'transaction' | 'category';
}

export function TransactionForm({ onClose, initialTab = 'transaction' }: TransactionFormProps) {
  const [activeTab, setActiveTab] = useState<'transaction' | 'category'>(initialTab);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#3B82F6',
    parent_id: null as string | null
  });

  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const createTransaction = useCreateTransaction();

  async function handleCreateTransaction(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await createTransaction.mutateAsync({
        amount: Number(amount),
        description,
        type,
        category_id: categoryId,
        date,
      });
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const category = await createCategory.mutateAsync(newCategory);
      if (category) {
        setCategoryId(category.id);
        setActiveTab('transaction');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('transaction')}
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'transaction'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Transaction
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'category'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Category
          </button>
        </div>

        {activeTab === 'transaction' ? (
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('category')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Category
                </button>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter(cat => cat.type === type)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                disabled={createTransaction.isPending}
              >
                {createTransaction.isPending ? 'Creating...' : 'Create Transaction'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({...newCategory, type: e.target.value as 'income' | 'expense'})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                className="w-full h-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category (Optional)
              </label>
              <select
                value={newCategory.parent_id || ''}
                onChange={(e) => setNewCategory({...newCategory, parent_id: e.target.value || null})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">None (Top Level Category)</option>
                {categories
                  .filter(cat => cat.type === newCategory.type && !cat.parent_id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('transaction')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                disabled={createCategory.isPending}
              >
                {createCategory.isPending ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
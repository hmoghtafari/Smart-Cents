import React, { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/format';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { Calendar, Tag, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { transactions, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export function Transactions() {
  const [transactionData, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategories] = useState<Record<string, Category>>({});
  const { settings } = useSettings();
  const { t } = useTranslation();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  async function fetchTransactions() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.date);

    if (result) {
      setTransactions(result);
    }
  }

  async function fetchCategories() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId));

    if (result) {
      const categoryMap = result.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, Category>);
      setCategories(categoryMap);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{t('nav.transactions')}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.category')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.amount')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactionData.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" style={{ color: categoryData[transaction.categoryId]?.color }} />
                      {categoryData[transaction.categoryId]?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end">
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 mr-2 text-red-500" />
                      )}
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(transaction.amount, settings.currency)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
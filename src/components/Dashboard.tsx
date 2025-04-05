import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../hooks/useSettings';
import { transactions } from '../db/schema';
import { eq, and, gte } from 'drizzle-orm';

export function Dashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { t } = useTranslation();
  const { settings } = useSettings();

  useEffect(() => {
    fetchTransactionTotals();
  }, []);

  async function fetchTransactionTotals() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Fetch income
    const incomeData = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.type, 'income'),
          eq(transactions.userId, userId),
          gte(transactions.date, startOfMonth.toISOString())
        )
      );

    // Fetch expenses
    const expenseData = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.type, 'expense'),
          eq(transactions.userId, userId),
          gte(transactions.date, startOfMonth.toISOString())
        )
      );

    const income = incomeData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expenses = expenseData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    setTotalIncome(income);
    setTotalExpenses(expenses);
  }

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{t('nav.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{t('common.balance')}</h3>
            <Wallet className="text-blue-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(balance, settings.currency)}
          </p>
          <div className="mt-2 text-sm text-gray-500">{t('common.currentBalance')}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{t('common.income')}</h3>
            <ArrowUpCircle className="text-green-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(totalIncome, settings.currency)}
          </p>
          <div className="mt-2 text-sm text-gray-500">{t('common.totalIncome')}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{t('common.expense')}</h3>
            <ArrowDownCircle className="text-red-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(totalExpenses, settings.currency)}
          </p>
          <div className="mt-2 text-sm text-gray-500">{t('common.totalExpenses')}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{t('common.savings')}</h3>
            <TrendingUp className="text-purple-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-gray-800">{savingsRate}%</p>
          <div className="mt-2 text-sm text-gray-500">{t('common.monthlySavings')}</div>
        </div>
      </div>
    </div>
  );
}
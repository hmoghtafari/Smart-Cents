import React, { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/format';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { transactions, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export function Analytics() {
  const [transactionData, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategories] = useState<Record<string, Category>>({});
  const { settings } = useSettings();
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Fetch transactions
    const transactionsResult = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));

    // Fetch categories
    const categoriesResult = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId));

    if (transactionsResult) {
      setTransactions(transactionsResult);
    }
    if (categoriesResult) {
      const categoryMap = categoriesResult.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, Category>);
      setCategories(categoryMap);
    }
  }

  // Calculate totals
  const totalIncome = transactionData
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactionData
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Prepare data for charts
  const expensesByCategory = transactionData
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = categoryData[t.categoryId]?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = transactionData.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
    if (t.type === 'income') acc[month].income += Number(t.amount);
    else acc[month].expenses += Number(t.amount);
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const barChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{t('nav.analytics')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.balance')}</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(balance, settings.currency)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.income')}</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome, settings.currency)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.expense')}</h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalExpenses, settings.currency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <BarChartIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Monthly Overview</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value), settings.currency)} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <PieChartIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Expenses by Category</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), settings.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
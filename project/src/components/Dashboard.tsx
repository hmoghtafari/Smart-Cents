import React from 'react';
import { BarChart, PieChart, Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface DashboardProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function Dashboard({ totalIncome, totalExpenses, balance }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">Balance</h3>
          <Wallet className="text-blue-500 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-800">{formatCurrency(balance)}</p>
        <div className="mt-2 text-sm text-gray-500">Current balance</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">Income</h3>
          <ArrowUpCircle className="text-green-500 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalIncome)}</p>
        <div className="mt-2 text-sm text-gray-500">Total income this month</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">Expenses</h3>
          <ArrowDownCircle className="text-red-500 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalExpenses)}</p>
        <div className="mt-2 text-sm text-gray-500">Total expenses this month</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">Savings Rate</h3>
          <TrendingUp className="text-purple-500 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-800">
          {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
        </p>
        <div className="mt-2 text-sm text-gray-500">Monthly savings rate</div>
      </div>
    </div>
  );
}
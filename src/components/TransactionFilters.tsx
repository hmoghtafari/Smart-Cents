import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useExportTransactions } from '../hooks/useTransactions';
import { debounce } from '../utils/debounce';

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
    categoryId?: string;
  }) => void;
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const exportTransactions = useExportTransactions();

  const debouncedSearch = debounce((value: string) => {
    onFilterChange({ search: value });
  }, 300);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
        >
          <Filter className="w-5 h-5" />
        </button>
        <button
          onClick={() => exportTransactions.mutate()}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          disabled={exportTransactions.isPending}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => onFilterChange({ startDate: new Date(e.target.value) })}
              />
              <input
                type="date"
                className="flex-1 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => onFilterChange({ endDate: new Date(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => onFilterChange({ type: e.target.value as 'income' | 'expense' })}
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => onFilterChange({ categoryId: e.target.value })}
            >
              <option value="">All Categories</option>
              {/* Categories will be populated from props */}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
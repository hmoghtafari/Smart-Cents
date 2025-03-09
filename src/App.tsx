import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { LayoutDashboard, PieChart, ListPlus, Settings, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">SmartCents</h1>
          <p className="text-sm text-gray-500">Intelligent Budgeting</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-6 py-3 text-sm ${
              activeTab === 'dashboard'
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center w-full px-6 py-3 text-sm ${
              activeTab === 'transactions'
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListPlus className="w-5 h-5 mr-3" />
            Transactions
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-6 py-3 text-sm ${
              activeTab === 'analytics'
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PieChart className="w-5 h-5 mr-3" />
            Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-6 py-3 text-sm ${
              activeTab === 'settings'
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Transaction
          </button>
        </div>

        <Dashboard totalIncome={5000} totalExpenses={3200} balance={1800} />
        
        {/* Placeholder for other content based on activeTab */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <p className="text-gray-500">Transaction list will appear here</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            <p className="text-gray-500">Category chart will appear here</p>
          </div>
        </div>
      </div>

      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} />
      )}
    </div>
  );
}

export default App;
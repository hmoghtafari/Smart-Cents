import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { TransactionForm } from './components/TransactionForm';
import { Auth } from './components/Auth';
import { getCurrentUser } from './lib/auth';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function App() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
  }

  if (!isAuthenticated) {
    return <Auth onSignIn={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Sidebar onNewTransaction={() => setShowTransactionForm(true)} />
        
        <div className="ml-64 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        {showTransactionForm && (
          <TransactionForm onClose={() => setShowTransactionForm(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
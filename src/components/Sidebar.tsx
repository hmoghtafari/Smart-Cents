import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, ListPlus, Settings, Plus, LogOut } from 'lucide-react';
import { signOut } from '../lib/auth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../hooks/useSettings';

interface SidebarProps {
  onNewTransaction: () => void;
}

export function Sidebar({ onNewTransaction }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { settings } = useSettings();

  async function handleSignOut() {
    signOut();
    toast.success('Signed out successfully');
    navigate('/');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">SmartCents</h1>
        <p className="text-sm text-gray-500">
          {settings.name ? `Welcome, ${settings.name}` : t('common.tagline')}
        </p>
      </div>
      
      <nav className="mt-6 flex flex-col h-[calc(100%-160px)]">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center w-full px-6 py-3 text-sm ${
            isActive('/dashboard')
              ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          {t('nav.dashboard')}
        </button>
        
        <button
          onClick={() => navigate('/transactions')}
          className={`flex items-center w-full px-6 py-3 text-sm ${
            isActive('/transactions')
              ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ListPlus className="w-5 h-5 mr-3" />
          {t('nav.transactions')}
        </button>
        
        <button
          onClick={() => navigate('/analytics')}
          className={`flex items-center w-full px-6 py-3 text-sm ${
            isActive('/analytics')
              ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <PieChart className="w-5 h-5 mr-3" />
          {t('nav.analytics')}
        </button>
        
        <button
          onClick={() => navigate('/settings')}
          className={`flex items-center w-full px-6 py-3 text-sm ${
            isActive('/settings')
              ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          {t('nav.settings')}
        </button>

        <div className="mt-auto">
          <button
            onClick={onNewTransaction}
            className="flex items-center w-full px-6 py-3 text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-3" />
            {t('common.newTransaction')}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('common.signOut')}
          </button>
        </div>
      </nav>
    </div>
  );
}
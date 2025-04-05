import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { getCurrencies } from '../utils/format';
import { Globe, Coins, Palette, User } from 'lucide-react';
import { CategoryManager } from './CategoryManager';
import { TransactionForm } from './TransactionForm';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(settings.name || '');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  const currencies = getCurrencies();

  async function handleLanguageChange(language: string) {
    setIsLoading(true);
    try {
      await updateSettings({ language });
      i18n.changeLanguage(language);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCurrencyChange(currency: string) {
    setIsLoading(true);
    try {
      await updateSettings({ currency });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleThemeChange(theme: 'light' | 'dark') {
    setIsLoading(true);
    try {
      await updateSettings({ theme });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNameChange(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSettings({ name });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{t('nav.settings')}</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Profile</h3>
          </div>
          <form onSubmit={handleNameChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Save Name
            </button>
          </form>
        </div>

        <CategoryManager onNewCategory={() => setShowCategoryForm(true)} />

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{t('settings.language')}</h3>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Coins className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{t('settings.currency')}</h3>
          </div>
          <select
            value={settings.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{t('settings.theme')}</h3>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-4 py-2 rounded-md ${
                settings.theme === 'light'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded-md ${
                settings.theme === 'dark'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {showCategoryForm && (
        <TransactionForm onClose={() => setShowCategoryForm(false)} initialTab="category" />
      )}
    </div>
  );
}
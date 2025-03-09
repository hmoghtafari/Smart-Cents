export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  parent_id?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category_id: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  created_at: string;
}

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface UserSettings {
  language: string;
  currency: string;
  theme: 'light' | 'dark';
}
import { Currency } from '../types';

const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone' }
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = currencies[currencyCode] || currencies.USD;
  
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.code,
  }).format(amount);
};

export const getCurrencies = (): Currency[] => {
  return Object.values(currencies);
};

export const getCurrency = (code: string): Currency => {
  return currencies[code] || currencies.USD;
};
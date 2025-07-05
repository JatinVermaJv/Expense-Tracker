import { Category } from '@/types';

export const EXPENSE_CATEGORIES: Category[] = [
  { name: 'Food & Dining', icon: '🍽️', color: '#FF6384' },
  { name: 'Transportation', icon: '🚗', color: '#36A2EB' },
  { name: 'Shopping', icon: '🛍️', color: '#FFCE56' },
  { name: 'Entertainment', icon: '🎬', color: '#4BC0C0' },
  { name: 'Bills & Utilities', icon: '💡', color: '#9966FF' },
  { name: 'Healthcare', icon: '🏥', color: '#FF9F40' },
  { name: 'Education', icon: '📚', color: '#FF6384' },
  { name: 'Other', icon: '📌', color: '#C9CBCF' },
];

export const INCOME_CATEGORIES: Category[] = [
  { name: 'Salary', icon: '💰', color: '#4BC0C0' },
  { name: 'Freelance', icon: '💻', color: '#36A2EB' },
  { name: 'Investment', icon: '📈', color: '#FFCE56' },
  { name: 'Other', icon: '💵', color: '#9966FF' },
];
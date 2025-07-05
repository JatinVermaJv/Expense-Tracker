export interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: string;
  year: number;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  categoryBreakdown: { category: string; amount: number }[];
  recentTransactions: Transaction[];
  monthlyExpenses: { month: string; amount: number }[];
}
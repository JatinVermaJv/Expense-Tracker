'use client';

import { Transaction } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const getCategoryIcon = (category: string, type: 'income' | 'expense') => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const cat = categories.find(c => c.name === category);
    return cat?.icon || '📌';
  };

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <span className="text-2xl">
              {getCategoryIcon(transaction.category, transaction.type)}
            </span>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                                {transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </span>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(transaction._id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
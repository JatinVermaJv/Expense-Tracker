'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BudgetForm from '@/components/budget/budgetForm';
import BudgetComparison from '@/components/budget/budgetComparison';
import { Budget, Transaction } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../lib/constants/categories';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`),
        fetch(`/api/transactions?month=${currentDate.getMonth() + 1}&year=${currentYear}`),
      ]);

      const budgetsData = await budgetsRes.json();
      const transactionsData = await transactionsRes.json();

      setBudgets(budgetsData);
      setTransactions(transactionsData);
    } catch{
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Budget, '_id'>) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Budget saved successfully',
        });
        fetchData();
        setIsFormOpen(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save budget',
        variant: 'destructive',
      });
    }
  };

  const budgetComparison = EXPENSE_CATEGORIES.map(category => {
    const budget = budgets.find(b => b.category === category.name);
    const actual = transactions
      .filter(t => t.category === category.name && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: category.name,
      budget: budget?.amount || 0,
      actual,
    };
  }).filter(item => item.budget > 0 || item.actual > 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Budgets - {currentMonth} {currentYear}</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Set Budget
        </Button>
      </div>

      <BudgetComparison data={budgetComparison} />

      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetComparison.map(item => {
              const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
              const isOverBudget = percentage > 100;

              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.category}</span>
                    <div className="text-sm text-right">
                      <span className={isOverBudget ? 'text-red-600' : 'text-gray-600'}>
                        ${item.actual.toFixed(2)}
                      </span>
                      <span className="text-gray-400"> / ${item.budget.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {percentage.toFixed(1)}% of budget used
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
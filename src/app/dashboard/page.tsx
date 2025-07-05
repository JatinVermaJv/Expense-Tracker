'use client';

import { useState, useEffect } from 'react';
import SummaryCards from '@/components/dashboard/summaryCard';
import MonthlyExpensesChart from '@/components/dashboard/monthlyExpenseChart';
import CategoryPieChart from '@/components/dashboard/categoryPieChart';
import TransactionList from '@/components/transactions/transactionsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((acc: any, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += t.amount;
      return acc;
    }, {});

  const monthlyExpensesData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
    month,
    amount: amount as number,
  }));

  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((acc: any, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});

  const categoryData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    category,
    amount: amount as number,
  }));

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>
      
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        transactionCount={transactions.length}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <MonthlyExpensesChart data={monthlyExpensesData} />
            <CategoryPieChart data={categoryData} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <TransactionList
                  transactions={recentTransactions}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Top Spending Categories</h3>
                {categoryData
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((cat, index) => (
                    <div key={cat.category} className="flex justify-between items-center py-2">
                      <span>{index + 1}. {cat.category}</span>
                      <span className="font-medium">${cat.amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Monthly Average</h3>
                <p>Average monthly spending: ${(totalExpenses / (monthlyExpensesData.length || 1)).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
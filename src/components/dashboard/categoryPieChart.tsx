'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EXPENSE_CATEGORIES } from '@/lib/constants/categories';

interface CategoryPieChartProps {
  data: { category: string; amount: number }[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const getColor = (category: string) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.name === category);
    return cat?.color || '#8884d8';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              label={({ category, percent }) => `${category} ${(percent! * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
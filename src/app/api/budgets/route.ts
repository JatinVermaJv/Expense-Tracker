import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongodb'
import Budget from '../../../lib/db/model/budget';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    let query = {};
    if (month && year) {
      query = { month, year: parseInt(year) };
    }
    
    const budgets = await Budget.find(query);
    return NextResponse.json(budgets);
  } catch{
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const existing = await Budget.findOne({
      category: body.category,
      month: body.month,
      year: body.year,
    });
    
    if (existing) {
      const updated = await Budget.findByIdAndUpdate(existing._id, body, { new: true });
      return NextResponse.json(updated);
    } else {
      const budget = await Budget.create(body);
      return NextResponse.json(budget, { status: 201 });
    }
  } catch{
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
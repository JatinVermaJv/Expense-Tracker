import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongodb';
import Transaction from '../../../lib/db/model/transaction';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    let query = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch{
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch{
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const transaction = await Transaction.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(transaction);
  } catch{
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch{
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
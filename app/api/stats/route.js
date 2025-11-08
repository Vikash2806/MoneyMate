import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details
    const userDoc = await User.findById(user.userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get all transactions
    const allTransactions = await Transaction.find({ userId: user.userId });

    // Calculate total income and expenses
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get monthly transactions
    const monthlyTransactions = await Transaction.find({
      userId: user.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate net worth and balances
    const netWorth = totalIncome - totalExpenses;
    const remainingBalance = monthlyIncome - monthlyExpenses;

    // Calculate savings goal
    const savingsTarget = (monthlyIncome * userDoc.savingsGoalPercentage) / 100;
    const actualSavings = remainingBalance;
    const savingsProgress = monthlyIncome > 0 
      ? Math.min(100, (actualSavings / savingsTarget) * 100) 
      : 0;

    // Check if expenses exceed 80% of income
    const expensePercentage = monthlyIncome > 0 
      ? (monthlyExpenses / monthlyIncome) * 100 
      : 0;
    const isOverBudget = expensePercentage > 80;

    // Get category breakdown
    const expensesByCategory = {};
    const incomeByCategory = {};

    monthlyTransactions.forEach(t => {
      if (t.type === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      } else {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      }
    });

    return NextResponse.json({
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      remainingBalance,
      savingsTarget,
      actualSavings,
      savingsProgress,
      savingsGoalPercentage: userDoc.savingsGoalPercentage,
      isOverBudget,
      expensePercentage,
      expensesByCategory,
      incomeByCategory,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
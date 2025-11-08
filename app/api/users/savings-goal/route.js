import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    await connectDB();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { savingsGoalPercentage } = await request.json();

    // Validate input
    if (savingsGoalPercentage === undefined || savingsGoalPercentage < 0 || savingsGoalPercentage > 100) {
      return NextResponse.json(
        { error: 'Savings goal percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { savingsGoalPercentage },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      savingsGoalPercentage: updatedUser.savingsGoalPercentage,
    });
  } catch (error) {
    console.error('Update savings goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
'use client';

import { formatCurrency, formatPercentage } from '@/utils/format';
import { Target } from 'lucide-react';

export default function SavingsGoal({ 
  savingsTarget, 
  actualSavings, 
  savingsProgress, 
  savingsGoalPercentage 
}) {
  const isOnTrack = savingsProgress >= 100;
  const progressColor = isOnTrack ? 'bg-green-500' : savingsProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">Savings Goal</h3>
        </div>
        <span className="text-sm font-medium text-gray-600">
          Target: {savingsGoalPercentage}%
        </span>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className={`text-sm font-semibold ${
              isOnTrack ? 'text-green-600' : 'text-gray-900'
            }`}>
              {formatPercentage(savingsProgress)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Target Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(savingsTarget)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Actual Savings</p>
            <p className={`text-lg font-semibold ${
              actualSavings >= savingsTarget ? 'text-green-600' : 'text-gray-900'
            }`}>
              {formatCurrency(actualSavings)}
            </p>
          </div>
        </div>

        {/* Status message */}
        {isOnTrack ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            🎉 Great job! You've reached your savings goal!
          </div>
        ) : savingsProgress >= 50 ? (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
            💪 You're halfway there! Keep it up!
          </div>
        ) : (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            ⚠️ You need to save more to reach your goal.
          </div>
        )}
      </div>
    </div>
  );
}
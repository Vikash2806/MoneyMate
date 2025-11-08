'use client';

import { formatCurrency } from '@/utils/format';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, isAlert }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 transition-all hover:shadow-md ${
      isAlert ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${
            isAlert ? 'text-red-600' : 'text-gray-900'
          }`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          isAlert ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            isAlert ? 'text-red-600' : 'text-blue-600'
          }`} />
        </div>
      </div>
    </div>
  );
}
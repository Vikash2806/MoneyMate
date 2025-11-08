'use client';

import { formatCurrency, formatDate } from '@/utils/format';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecentTransactions({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-gray-500">
          No transactions yet. Add your first transaction to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link 
          href="/dashboard/transactions"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center flex-1">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">{transaction.category}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                {transaction.notes && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {transaction.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right ml-4">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
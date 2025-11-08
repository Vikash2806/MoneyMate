'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import SavingsGoal from '@/components/dashboard/SavingsGoal';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import TransactionForm from '@/components/dashboard/TransactionForm';
import { statsAPI, analyticsAPI, transactionAPI } from '@/utils/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, analyticsData, transactionsData] = await Promise.all([
        statsAPI.get(),
        analyticsAPI.getMonthly(new Date().getFullYear()),
        transactionAPI.getAll(),
      ]);

      setStats(statsData);
      setChartData(analyticsData.monthlyData);
      setTransactions(transactionsData.transactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionSuccess = () => {
    fetchData(); // Refresh all data after adding transaction
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here is your financial overview.</p>
        </div>
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Net Worth"
            value={stats.netWorth}
            icon={Wallet}
            trend={stats.netWorth >= 0 ? 'up' : 'down'}
          />
          <StatCard
            title="Monthly Income"
            value={stats.monthlyIncome}
            icon={TrendingUp}
          />
          <StatCard
            title="Monthly Expenses"
            value={stats.monthlyExpenses}
            icon={TrendingDown}
            isAlert={stats.isOverBudget}
          />
          <StatCard
            title="Remaining Balance"
            value={stats.remainingBalance}
            icon={PiggyBank}
            isAlert={stats.remainingBalance < 0}
          />
        </div>
      )}

      {/* Budget Alert */}
      {stats?.isOverBudget && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Budget Alert!</h3>
              <p className="mt-1 text-sm text-red-700">
                You ve spent {stats.expensePercentage.toFixed(1)}% of your monthly income. 
                Consider reducing expenses to stay within your budget.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Savings Goal & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyChart data={chartData} />
        </div>
        {stats && (
          <SavingsGoal
            savingsTarget={stats.savingsTarget}
            actualSavings={stats.actualSavings}
            savingsProgress={stats.savingsProgress}
            savingsGoalPercentage={stats.savingsGoalPercentage}
          />
        )}
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} />

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyticsAPI, statsAPI } from '@/utils/api';
import { formatCurrency } from '@/utils/format';
import { CATEGORY_COLORS } from '@/utils/constants';
import MonthlyChart from '@/components/dashboard/MonthlyChart';

export default function AnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, statsData] = await Promise.all([
        analyticsAPI.getMonthly(year),
        statsAPI.get(),
      ]);
      setMonthlyData(analyticsData.monthlyData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  // Prepare pie chart data
  const expensePieData = stats?.expensesByCategory
    ? Object.entries(stats.expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
    : [];

  const incomePieData = stats?.incomeByCategory
    ? Object.entries(stats.incomeByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
    : [];

  // Calculate yearly totals
  const yearlyIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const yearlyExpenses = monthlyData.reduce((sum, month) => sum + month.expense, 0);
  const yearlySavings = yearlyIncome - yearlyExpenses;

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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights into your finances</p>
        </div>
        
        {/* Year selector */}
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Yearly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-green-100 text-sm mb-1">Total Income ({year})</p>
          <h3 className="text-3xl font-bold">{formatCurrency(yearlyIncome)}</h3>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-red-100 text-sm mb-1">Total Expenses ({year})</p>
          <h3 className="text-3xl font-bold">{formatCurrency(yearlyExpenses)}</h3>
        </div>
        <div className={`bg-gradient-to-br ${yearlySavings >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl shadow-lg p-6 text-white`}>
          <p className="text-blue-100 text-sm mb-1">Net Savings ({year})</p>
          <h3 className="text-3xl font-bold">{formatCurrency(yearlySavings)}</h3>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <MonthlyChart data={monthlyData} />

      {/* Category Breakdown - Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          {expensePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No expense data available
            </div>
          )}
        </div>

        {/* Income by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
          {incomePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No income data available
            </div>
          )}
        </div>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category-wise breakdown table */}
      {(expensePieData.length > 0 || incomePieData.length > 0) && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Category Details</h3>
          </div>
          <div className="grid md:grid-cols-2 divide-x">
            {/* Expenses */}
            <div className="p-6">
              <h4 className="font-semibold text-red-600 mb-3">Expenses</h4>
              <div className="space-y-2">
                {expensePieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#94a3b8' }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income */}
            <div className="p-6">
              <h4 className="font-semibold text-green-600 mb-3">Income</h4>
              <div className="space-y-2">
                {incomePieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#94a3b8' }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
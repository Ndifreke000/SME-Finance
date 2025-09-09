import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useFinancialData } from '../../hooks/useFinancialData';
import { FileText, Download, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import EmptyState from '../Layout/EmptyState';

const Reports: React.FC = () => {
  const { transactions, getFinancialSummary, loading } = useFinancialData();
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const generateReportData = () => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(now, i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expenditure')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        profit: income - expenses,
      });
    }

    return months;
  };

  const reportData = generateReportData();
  const summary = getFinancialSummary();

  const exportReport = () => {
    // In a real application, this would generate and download a PDF/CSV
    alert('Report export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <EmptyState
            icon={BarChart3}
            title="No data for reports yet"
            description="Start adding transactions to generate comprehensive financial reports and analytics"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive financial analysis and reporting</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₦{summary.totalIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ₦{summary.totalExpenditure.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold mt-2 ${
                summary.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₦{summary.profit.toLocaleString()}
              </p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className={`text-2xl font-bold mt-2 ${
                summary.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summary.totalIncome > 0 ? ((summary.profit / summary.totalIncome) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Profit']}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Profit"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Financial Statement</h3>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full sm:min-w-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Margin %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((row, index) => {
                const margin = row.income > 0 ? ((row.profit / row.income) * 100) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.month}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      ₦{row.income.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      ₦{row.expenses.toLocaleString()}
                    </td>
                    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      row.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₦{row.profit.toLocaleString()}
                    </td>
                    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right font-medium hidden md:table-cell ${
                      margin >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {margin.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '../../hooks/useFinancialData';
import { mockCategories } from '../../data/mockData';
import MetricCard from './MetricCard';
import EmptyState from '../Layout/EmptyState';

const Dashboard: React.FC = () => {
  const { transactions, budgets, loading, getFinancialSummary } = useFinancialData();
  const summary = getFinancialSummary();

  // Generate realistic monthly data based on current transactions
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const baseIncome = summary.totalIncome * (0.8 + Math.random() * 0.4);
      const baseExpenses = summary.totalExpenditure * (0.7 + Math.random() * 0.6);
      
      return {
        month,
        income: Math.round(baseIncome * (0.5 + index * 0.1)),
        expenses: Math.round(baseExpenses * (0.6 + index * 0.08)),
      };
    });
  };

  const monthlyData = generateMonthlyData();

  const categoryData = mockCategories
    .filter(cat => cat.type === 'expenditure')
    .map(cat => {
      const categoryTransactions = transactions.filter(t => t.category === cat.name && t.type === 'expenditure');
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
        value: total,
        color: cat.color,
      };
    })
    .filter(item => item.value > 0)
    .slice(0, 6); // Limit to top 6 categories for better mobile display

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to NairaBooks</h1>
        <p className="text-blue-100 text-sm sm:text-base">
          Your Nigerian business financial management dashboard
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Income"
          value={`₦${summary.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-green-500"
          trend={{ value: '12.5%', isPositive: true }}
        />
        <MetricCard
          title="Total Expenses"
          value={`₦${summary.totalExpenditure.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-red-500"
          trend={{ value: '8.2%', isPositive: false }}
        />
        <MetricCard
          title="Net Profit"
          value={`₦${summary.profit.toLocaleString()}`}
          icon={DollarSign}
          color={summary.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}
          trend={{ value: '15.3%', isPositive: summary.profit >= 0 }}
        />
        <MetricCard
          title="Budget Usage"
          value={`${summary.budgetUtilization.toFixed(1)}%`}
          icon={Target}
          color="bg-blue-500"
          trend={{ value: '5.7%', isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses (₦)</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Income"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Expenses"
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          {categoryData.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No expense data yet"
              description="Start adding expenses to see your category breakdown"
            />
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      window.innerWidth > 640 ? `${name} ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={window.innerWidth > 640 ? 80 : 60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No transactions yet"
            description="Start by adding your first income or expense transaction to see your financial activity here"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Date</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Description</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm hidden sm:table-cell">Category</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Amount</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(-5).reverse().map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                        {transaction.item}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none sm:hidden">
                        {transaction.category}
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
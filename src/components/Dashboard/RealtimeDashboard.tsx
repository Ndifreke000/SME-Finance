import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useRealtimeAnalytics } from '../../hooks/useRealtimeAnalytics';
import { format } from 'date-fns';

const RealtimeDashboard: React.FC = () => {
  const { data, isConnected, connectionStatus } = useRealtime();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const { analytics, loading, refresh } = useRealtimeAnalytics(timeRange);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className={getConnectionStatusColor()} size={16} />;
      case 'connecting': return <RefreshCw className={`${getConnectionStatusColor()} animate-spin`} size={16} />;
      default: return <WifiOff className={getConnectionStatusColor()} size={16} />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="ml-1">{Math.abs(growth).toFixed(1)}%</span>
      </span>
    );
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Dashboard</h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600">Live financial analytics and monitoring</p>
            <div className="flex items-center space-x-2">
              {getConnectionStatusIcon()}
              <span className={`text-sm ${getConnectionStatusColor()}`}>
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 w-full sm:w-auto"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Last Update Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="text-blue-600" size={16} />
            <span className="text-sm text-blue-800">
              Last updated: {format(lastUpdate, 'HH:mm:ss')}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            <span>{analytics.transactionCount} transactions</span>
            <span>{data.users.filter(u => u.isActive).length} active users</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {analytics.alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {analytics.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  : alert.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {alert.type === 'warning' ? (
                  <AlertTriangle size={16} />
                ) : alert.type === 'success' ? (
                  <CheckCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
                <span className="font-medium">{alert.message}</span>
                {alert.value && (
                  <span className="ml-auto font-bold">
                    {alert.message.includes('margin') || alert.message.includes('growth') 
                      ? `${alert.value.toFixed(1)}%` 
                      : formatCurrency(alert.value)
                    }
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(analytics.totalRevenue)}
              </p>
              <div className="mt-2">
                {formatGrowth(analytics.revenueGrowth)}
              </div>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(analytics.totalExpenses)}
              </p>
              <div className="mt-2">
                {formatGrowth(analytics.expenseGrowth)}
              </div>
            </div>
            <TrendingDown className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold mt-2 ${
                analytics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(analytics.netProfit)}
              </p>
              <div className="mt-2">
                <span className={`text-sm ${
                  analytics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics.profitMargin.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {data.users.filter(u => u.isActive).length}
              </p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {formatCurrency(analytics.averageTransactionValue)} avg
                </span>
              </div>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trends</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.dailyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {analytics.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {analytics.topCategories.map((category, index) => (
              <div key={index} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                ></div>
                <span className="text-gray-600">
                  {category.name} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Profit"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.category}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.date), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
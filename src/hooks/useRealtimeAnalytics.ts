import { useState, useEffect, useMemo } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { format, subDays, startOfDay, endOfDay, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
  averageTransactionValue: number;
  revenueGrowth: number;
  expenseGrowth: number;
  topCategories: { name: string; amount: number; percentage: number }[];
  dailyTrends: { date: string; revenue: number; expenses: number; profit: number }[];
  monthlyTrends: { month: string; revenue: number; expenses: number; profit: number }[];
  recentTransactions: any[];
  alerts: { type: 'warning' | 'info' | 'success'; message: string; value?: number }[];
}

export const useRealtimeAnalytics = (timeRange: 'today' | 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { data, subscribe } = useRealtime();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'quarter':
        startDate = subMonths(now, 3);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 1);
    }

    return data.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [data.transactions, timeRange]);

  const calculateAnalytics = useMemo(() => {
    if (!filteredTransactions.length) {
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        transactionCount: 0,
        averageTransactionValue: 0,
        revenueGrowth: 0,
        expenseGrowth: 0,
        topCategories: [],
        dailyTrends: [],
        monthlyTrends: [],
        recentTransactions: [],
        alerts: [],
      };
    }

    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expenditure');

    const totalRevenue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const transactionCount = filteredTransactions.length;
    const averageTransactionValue = transactionCount > 0 ? (totalRevenue + totalExpenses) / transactionCount : 0;

    // Calculate growth rates (comparing with previous period)
    const previousPeriodStart = timeRange === 'month' ? subMonths(new Date(), 2) : subDays(new Date(), 14);
    const previousPeriodEnd = timeRange === 'month' ? subMonths(new Date(), 1) : subDays(new Date(), 7);
    
    const previousTransactions = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date >= previousPeriodStart && date <= previousPeriodEnd;
    });

    const previousRevenue = previousTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const previousExpenses = previousTransactions.filter(t => t.type === 'expenditure').reduce((sum, t) => sum + t.amount, 0);

    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const expenseGrowth = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0;

    // Calculate top categories
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const topCategories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Calculate daily trends
    const dailyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= dayStart && transactionDate <= dayEnd;
      });

      const dayRevenue = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const dayExpenses = dayTransactions.filter(t => t.type === 'expenditure').reduce((sum, t) => sum + t.amount, 0);

      dailyTrends.push({
        date: format(date, 'MMM dd'),
        revenue: dayRevenue,
        expenses: dayExpenses,
        profit: dayRevenue - dayExpenses,
      });
    }

    // Calculate monthly trends
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransactions = data.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const monthRevenue = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = monthTransactions.filter(t => t.type === 'expenditure').reduce((sum, t) => sum + t.amount, 0);

      monthlyTrends.push({
        month: format(date, 'MMM yyyy'),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses,
      });
    }

    // Get recent transactions
    const recentTransactions = filteredTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Generate alerts
    const alerts = [];
    
    if (profitMargin < 10) {
      alerts.push({
        type: 'warning' as const,
        message: 'Low profit margin detected',
        value: profitMargin,
      });
    }

    if (revenueGrowth < -5) {
      alerts.push({
        type: 'warning' as const,
        message: 'Revenue declining',
        value: revenueGrowth,
      });
    }

    if (expenseGrowth > 20) {
      alerts.push({
        type: 'warning' as const,
        message: 'Expenses growing rapidly',
        value: expenseGrowth,
      });
    }

    if (netProfit > 0 && profitMargin > 20) {
      alerts.push({
        type: 'success' as const,
        message: 'Healthy profit margins',
        value: profitMargin,
      });
    }

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      transactionCount,
      averageTransactionValue,
      revenueGrowth,
      expenseGrowth,
      topCategories,
      dailyTrends,
      monthlyTrends,
      recentTransactions,
      alerts,
    };
  }, [filteredTransactions, data.transactions, timeRange]);

  useEffect(() => {
    setAnalytics(calculateAnalytics);
    setLoading(false);
  }, [calculateAnalytics]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribe('transactions', (newTransactions) => {
      // Analytics will be recalculated automatically due to dependency on filteredTransactions
      setLoading(false);
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    analytics,
    loading,
    refresh: () => {
      setLoading(true);
      // In a real app, this would trigger a data refresh
      setTimeout(() => setLoading(false), 500);
    },
  };
};
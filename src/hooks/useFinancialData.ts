import { useState, useEffect } from 'react';
import { Transaction, Budget, FinancialSummary } from '../types';
import { mockTransactions, mockBudgets } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export const useFinancialData = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate API call delay
      setTimeout(() => {
        setTransactions(mockTransactions.filter(t => t.userId === user.id || user.role === 'admin'));
        setBudgets(mockBudgets.filter(b => b.userId === user.id || user.role === 'admin'));
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  const getFinancialSummary = (): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenditure = transactions
      .filter(t => t.type === 'expenditure')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpenditure;

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
    const budgetUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return {
      totalIncome,
      totalExpenditure,
      profit,
      budgetUtilization,
    };
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user.id,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      userId: user.id,
    };
    
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  return {
    transactions,
    budgets,
    loading,
    getFinancialSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};
export interface Transaction {
  id: string;
  userId: string;
  item: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  place?: string;
  type: 'income' | 'expenditure';
}

export interface Budget {
  id: string;
  userId: string;
  item: string;
  budgetedAmount: number;
  spentAmount: number;
  category: string;
  description: string;
  type: 'income' | 'expenditure';
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expenditure';
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenditure: number;
  profit: number;
  budgetUtilization: number;
}
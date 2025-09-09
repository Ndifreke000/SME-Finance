import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target } from 'lucide-react';
import { useFinancialData } from '../../hooks/useFinancialData';
import { Budget } from '../../types';
import BudgetForm from './BudgetForm';
import EmptyState from '../Layout/EmptyState';

const BudgetManager: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, loading } = useFinancialData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleSubmit = (budgetData: Omit<Budget, 'id' | 'userId'>) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
      setEditingBudget(null);
    } else {
      addBudget(budgetData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spentAmount / budget.budgetedAmount) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-red-600 bg-red-100' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'good', color: 'text-green-600 bg-green-100' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-gray-600 mt-1">Track and manage your financial budgets</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Budget</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <EmptyState
            icon={Target}
            title="No budgets created yet"
            description="Start planning your finances by creating your first budget to track income and expenses"
            actionLabel="Create your first budget"
            onAction={() => setIsFormOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {budgets.map((budget) => {
            const { color } = getBudgetStatus(budget);
            const percentage = Math.min((budget.spentAmount / budget.budgetedAmount) * 100, 100);
            const remaining = budget.budgetedAmount - budget.spentAmount;

            return (
              <div key={budget.id} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {budget.item}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{budget.category}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${color}`}>
                      {budget.period}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      title="Edit budget"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      title="Delete budget"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-medium text-right">₦{budget.spentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium text-right">₦{budget.budgetedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className={`font-medium text-right ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{Math.abs(remaining).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 truncate">{budget.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(budget.startDate).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    })} - {new Date(budget.endDate).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BudgetForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editBudget={editingBudget}
      />
    </div>
  );
};

export default BudgetManager;
import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Receipt } from 'lucide-react';
import { useFinancialData } from '../../hooks/useFinancialData';
import { Transaction } from '../../types';
import TransactionForm from './TransactionForm';
import EmptyState from '../Layout/EmptyState';

interface TransactionListProps {
  type: 'income' | 'expenditure';
}

const TransactionList: React.FC<TransactionListProps> = ({ type }) => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useFinancialData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => t.type === type);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleSubmit = (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
    } else {
      addTransaction(transactionData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'income' ? 'Income' : 'Expenses'}
          </h2>
          <p className="text-gray-600 mt-1">
            Total: <span className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              ₦{totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 ${
            type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <Plus size={20} />
          <span>Add {type === 'income' ? 'Income' : 'Expense'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={`No ${type} transactions yet`}
            description={`Start tracking your business ${type} by adding your first transaction`}
            actionLabel={`Add ${type} transaction`}
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Place
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: window.innerWidth > 640 ? 'numeric' : '2-digit'
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {transaction.item}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-xs md:hidden">
                          {transaction.category}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-xs">
                          {transaction.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {transaction.place || '-'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        ₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Edit transaction"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        type={type}
        editTransaction={editingTransaction}
      />
    </div>
  );
};

export default TransactionList;
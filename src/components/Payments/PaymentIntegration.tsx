import React, { useState } from 'react';
import { CreditCard, DollarSign, Shield } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { useFinancialData } from '../../hooks/useFinancialData';
import toast from 'react-hot-toast';

const PaymentIntegration: React.FC = () => {
  const { addTransaction } = useFinancialData();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDescription, setPaymentDescription] = useState('');

  const handlePaymentSuccess = () => {
    // Add the payment as an expense transaction
    addTransaction({
      item: 'Payment Processing Fee',
      description: paymentDescription,
      amount: paymentAmount,
      category: 'Office Supplies',
      date: new Date().toISOString().split('T')[0],
      place: 'Online Payment',
      type: 'expenditure',
    });

    toast.success('Payment processed and recorded in your expenses!');
    setPaymentAmount(0);
    setPaymentDescription('');
  };

  const quickPaymentOptions = [
    { amount: 25000, description: 'Office Supplies Payment' },
    { amount: 75000, description: 'NEPA Bill Payment' },
    { amount: 150000, description: 'Vendor Payment' },
    { amount: 300000, description: 'Equipment Purchase' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="text-blue-600 mr-2" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">Naira Payment Processing</h2>
          </div>
          <p className="text-gray-600">Secure Nigerian payment processing with international standards</p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <Shield className="text-green-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
            <p className="text-sm text-gray-600">256-bit SSL encryption protects all transactions</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <CreditCard className="text-blue-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Payment Methods</h3>
            <p className="text-sm text-gray-600">Accept all major credit and debit cards</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <DollarSign className="text-purple-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">Instant Processing</h3>
            <p className="text-sm text-gray-600">Real-time payment processing and confirmation</p>
          </div>
        </div>

        {/* Custom Payment */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Make a Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (₦)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Description
              </label>
              <input
                type="text"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What is this payment for?"
              />
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={paymentAmount <= 0 || !paymentDescription.trim()}
            className="mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard size={16} />
            <span>Process Payment</span>
          </button>
        </div>

        {/* Quick Payment Options */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Payment Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickPaymentOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setPaymentAmount(option.amount);
                  setPaymentDescription(option.description);
                  setIsPaymentModalOpen(true);
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ₦{option.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Integration Benefits</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Automatic transaction recording in your expense tracker</li>
            <li>• Real-time balance updates and financial reporting</li>
            <li>• Secure payment processing with industry-standard encryption</li>
            <li>• Detailed payment history and receipt management</li>
            <li>• Integration with your budgeting and financial planning tools</li>
          </ul>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={paymentAmount}
        description={paymentDescription}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PaymentIntegration;
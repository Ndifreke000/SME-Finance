import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to SME Finance",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💼</span>
          </div>
          <p className="text-gray-600 mb-4">
            Nigeria's premier financial management solution designed specifically for small and medium enterprises.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What you can do:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Track income and expenses in Naira</li>
              <li>• Create and manage Nigerian business budgets</li>
              <li>• Generate comprehensive financial reports</li>
              <li>• Process secure Naira payments</li>
              <li>• Manage staff salaries and operational costs</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Overview",
      content: (
        <div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-600 mb-4">
            Your dashboard provides a real-time overview of your financial health.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm"><strong>Metric Cards:</strong> Quick view of income, expenses, and profit in Naira</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm"><strong>Charts:</strong> Visual trends for Nigerian business categories</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm"><strong>Recent Activity:</strong> Latest transactions at a glance</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Managing Transactions",
      content: (
        <div>
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-gray-600 mb-4">
            Easily track all your business income and expenses.
          </p>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800">Income Management</h4>
              <p className="text-sm text-green-700">Record sales, services, contracts, and consulting fees in Naira</p>
            </div>
            <div className="p-3 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800">Expense Tracking</h4>
              <p className="text-sm text-red-700">Monitor rent, NEPA bills, staff salaries, transportation, and more</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Use Nigerian business categories for accurate tax and regulatory reporting
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Budget Planning",
      content: (
        <div>
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-gray-600 mb-4">
            Set financial goals and track your progress with smart budgeting tools.
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Create Budget Items</h4>
                <p className="text-sm text-gray-600">Set budgets for different categories and time periods</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Track Progress</h4>
                <p className="text-sm text-gray-600">Visual progress bars show how much you've spent</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Get Alerts</h4>
                <p className="text-sm text-gray-600">Receive warnings when approaching budget limits</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Reports & Analytics",
      content: (
        <div>
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-gray-600 mb-4">
            Generate comprehensive reports to understand your business performance.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl mb-1">📊</div>
              <h4 className="font-semibold text-sm">Profit & Loss</h4>
              <p className="text-xs text-gray-600">Monthly summaries</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl mb-1">📋</div>
              <h4 className="font-semibold text-sm">Cash Flow</h4>
              <p className="text-xs text-gray-600">Track money movement</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🎯</div>
              <h4 className="font-semibold text-sm">Budget Analysis</h4>
              <p className="text-xs text-gray-600">Performance vs goals</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl mb-1">📤</div>
              <h4 className="font-semibold text-sm">Export Data</h4>
              <p className="text-xs text-gray-600">PDF & CSV formats</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <p className="text-gray-600 mb-4">
            You're ready to start managing your business finances like a pro!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Quick Start Tips:</h4>
            <ul className="text-sm text-gray-700 space-y-1 text-left">
              <li>• Start by adding your first Naira income or expense transaction</li>
              <li>• Set up monthly budgets for Nigerian business categories</li>
              <li>• Check your dashboard regularly for financial insights</li>
              <li>• Use the calculator for quick Naira computations</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Need help? Look for the help icon (?) throughout the app for contextual tips.
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {steps[currentStep].content}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check size={16} />
              <span>Get Started</span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
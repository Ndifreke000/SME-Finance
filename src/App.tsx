import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import RealtimeDashboard from './components/Dashboard/RealtimeDashboard';
import TransactionList from './components/Transactions/TransactionList';
import RealtimeTransactionList from './components/Transactions/RealtimeTransactionList';
import BudgetManager from './components/Budget/BudgetManager';
import Reports from './components/Reports/Reports';
import Calculator from './components/Calculator/Calculator';
import AdminDashboard from './components/Admin/AdminDashboard';
import PaymentIntegration from './components/Payments/PaymentIntegration';
import OnboardingModal from './components/Onboarding/OnboardingModal';
import LandingPage from './components/Landing/LandingPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboardingCompleted');
  });

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'income':
        return 'Income Management';
      case 'expenses':
        return 'Expense Management';
      case 'budget':
        return 'Budget Planning';
      case 'reports':
        return 'Financial Reports';
      case 'calculator':
        return 'Naira Calculator';
      case 'payments':
        return 'Payment Processing';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <RealtimeDashboard />;
      case 'income':
        return <RealtimeTransactionList type="income" />;
      case 'expenses':
        return <RealtimeTransactionList type="expenditure" />;
      case 'budget':
        return <BudgetManager />;
      case 'reports':
        return <Reports />;
      case 'calculator':
        return <Calculator />;
      case 'payments':
        return <PaymentIntegration />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <RealtimeDashboard />;
      default:
        return <RealtimeDashboard />;
    }
  };

  // Show landing page first
  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Show auth forms after landing page
  if (!isAuthenticated) {
    return isLoginMode ? (
      <Login onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <Register onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
      
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3B82F6',
              secondary: '#fff',
            },
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <StripeProvider>
      <AuthProvider>
        <RealtimeProvider>
          <AppContent />
        </RealtimeProvider>
      </AuthProvider>
    </StripeProvider>
  );
}

export default App;
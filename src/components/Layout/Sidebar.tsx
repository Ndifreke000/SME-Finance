import React from 'react';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  FileText, 
  Calculator, 
  CreditCard,
  Users,
  Settings,
  LogOut,
  X,
  Brain,
  Building,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileMenuOpen, 
  onCloseMobileMenu 
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, badge: 'NEW' },
    { id: 'banking', label: 'Banking', icon: Building },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Users });
  }

  const handleMenuClick = (itemId: string) => {
    setActiveTab(itemId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 
        bg-slate-900 text-white w-64 min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">NairaBooks</h1>
              <p className="text-slate-400 text-sm mt-1">Nigerian SME Finance</p>
            </div>
            <button
              onClick={onCloseMobileMenu}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors text-left ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {(item as any).badge && (
                  <span className="ml-auto px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                    {(item as any).badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{user?.username?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
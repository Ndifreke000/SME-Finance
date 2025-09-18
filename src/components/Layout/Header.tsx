import React from 'react';
import { Search, HelpCircle, Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64"
            />
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <HelpCircle size={20} />
          </button>
          
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
};

export default Header;
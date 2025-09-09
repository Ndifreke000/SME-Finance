import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 flex items-center ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
              {trend.value} from last month
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} flex-shrink-0 ml-4`}>
          <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
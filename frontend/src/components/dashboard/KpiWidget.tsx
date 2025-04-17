import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface KpiWidgetProps {
  title: string;
  value: number;
  change: string;
  color: string;
}

const KpiWidget: React.FC<KpiWidgetProps> = ({ title, value, change, color }) => {
  const isPositive = change.startsWith('+');
  const isNeutral = change === '0';
  
  const getChangeColor = () => {
    if (isNeutral) return 'text-gray-500';
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const getBackgroundColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'purple':
        return 'bg-purple-50 border-purple-200';
      case 'orange':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getValueColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'purple':
        return 'text-purple-600';
      case 'orange':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border p-4 ${getBackgroundColor()}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-end">
        <p className={`text-3xl font-bold ${getValueColor()}`}>{value}</p>
        <div className={`ml-2 flex items-center ${getChangeColor()}`}>
          {!isNeutral && (
            isPositive ? 
              <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
              <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
    </div>
  );
};

export default KpiWidget;

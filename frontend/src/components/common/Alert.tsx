// components/common/Alert.tsxの修正

import React, { ReactNode } from 'react';

// Alertコンポーネントのプロパティ型を定義
export interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  className?: string;
  children: ReactNode; // childrenプロパティを追加
}

// Alertコンポーネント
const Alert: React.FC<AlertProps> = ({ type, className = '', children }) => {
  // アラートタイプに基づいてスタイルクラスを決定
  let alertClass = '';
  let iconName = '';

  switch (type) {
    case 'success':
      alertClass = 'bg-green-100 text-green-800 border-green-200';
      iconName = 'check_circle';
      break;
    case 'info':
      alertClass = 'bg-blue-100 text-blue-800 border-blue-200';
      iconName = 'info';
      break;
    case 'warning':
      alertClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      iconName = 'warning';
      break;
    case 'error':
      alertClass = 'bg-red-100 text-red-800 border-red-200';
      iconName = 'error';
      break;
    default:
      alertClass = 'bg-gray-100 text-gray-800 border-gray-200';
      iconName = 'info';
  }

  return (
    <div className={`alert p-4 rounded border ${alertClass} ${className}`} role="alert">
      <div className="flex items-center">
        <i className="material-icons mr-2">{iconName}</i>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;

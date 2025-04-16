// components/common/Button.tsxの修正 - variantプロパティの型定義を追加

import React, { ButtonHTMLAttributes } from 'react';

// Buttonコンポーネントのプロパティ型を定義
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

// Buttonコンポーネント
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled = false,
  ...rest
}) => {
  // バリアントに基づいてスタイルクラスを決定
  let variantClass = '';

  switch (variant) {
    case 'primary':
      variantClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      break;
    case 'secondary':
      variantClass = 'bg-gray-600 hover:bg-gray-700 text-white';
      break;
    case 'success':
      variantClass = 'bg-green-600 hover:bg-green-700 text-white';
      break;
    case 'danger':
      variantClass = 'bg-red-600 hover:bg-red-700 text-white';
      break;
    case 'warning':
      variantClass = 'bg-yellow-500 hover:bg-yellow-600 text-white';
      break;
    case 'info':
      variantClass = 'bg-blue-400 hover:bg-blue-500 text-white';
      break;
    case 'light':
      variantClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
      break;
    case 'dark':
      variantClass = 'bg-gray-800 hover:bg-gray-900 text-white';
      break;
    case 'link':
      variantClass = 'text-blue-600 hover:text-blue-800 underline bg-transparent';
      break;
    case 'outline-primary':
      variantClass = 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';
      break;
    case 'outline-secondary':
      variantClass = 'border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white';
      break;
    case 'outline-success':
      variantClass = 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white';
      break;
    case 'outline-danger':
      variantClass = 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white';
      break;
    case 'outline-warning':
      variantClass =
        'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white';
      break;
    case 'outline-info':
      variantClass = 'border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white';
      break;
    case 'outline-light':
      variantClass = 'border border-gray-100 text-gray-100 hover:bg-gray-100 hover:text-gray-800';
      break;
    case 'outline-dark':
      variantClass = 'border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white';
      break;
    default:
      variantClass = 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  // サイズに基づいてスタイルクラスを決定
  let sizeClass = '';

  switch (size) {
    case 'sm':
      sizeClass = 'py-1 px-2 text-sm';
      break;
    case 'lg':
      sizeClass = 'py-3 px-6 text-lg';
      break;
    default:
      sizeClass = 'py-2 px-4 text-base';
  }

  // 幅のクラスを決定
  const widthClass = fullWidth ? 'w-full' : '';

  // 無効状態のクラスを決定
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`button rounded transition-colors ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="spinner-border animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2"></div>
          <span>読み込み中...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

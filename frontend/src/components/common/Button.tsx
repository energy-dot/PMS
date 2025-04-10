import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * 共通のボタンコンポーネント
 * 様々なスタイルバリエーションとサイズをサポート
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  // バリアントに基づくスタイル
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 border border-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 border border-transparent',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 border border-transparent',
    text: 'bg-transparent text-primary-600 hover:text-primary-800 hover:bg-primary-50 focus:ring-primary-500',
  };

  // サイズに基づくスタイル
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  // ローディング状態またはdisabled状態のスタイル
  const disabledClasses = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';

  // 幅のスタイル
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : 'false'}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className={`${children ? 'mr-2' : ''}`}>{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;